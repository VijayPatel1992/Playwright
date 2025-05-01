const http = require('http');
const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

async function startMCPServer() {
    try {
        // Load environment variables
        const githubOwner = process.env.GITHUB_OWNER;
        const githubRepo = process.env.GITHUB_REPO;
        const githubToken = process.env.GITHUB_TOKEN;

        if (!githubOwner || !githubRepo || !githubToken) {
            throw new Error('GitHub configuration is missing. Please set GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN environment variables.');
        }

        // Read configuration
        const configPath = path.join(__dirname, '..', 'mcp.config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        // Initialize HTTP server
        const server = http.createServer(async (req, res) => {
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', async () => {
                    try {
                        const data = JSON.parse(body);
                        const response = await handleMCPRequest(data, {
                            owner: githubOwner,
                            repo: githubRepo,
                            token: githubToken,
                            config
                        });

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(response));
                    } catch (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: error.message }));
                    }
                });
            } else {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
            }
        });

        // Start server
        const port = config.server.port || 3000;
        server.listen(port, () => {
            console.log(`MCP Server is running on port ${port}`);
        });

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('Shutting down MCP Server...');
            server.close(() => {
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start MCP Server:', error);
        process.exit(1);
    }
}

async function handleMCPRequest(data, context) {
    const { type, params } = data;
    
    // Initialize Octokit with the GitHub token
    const octokit = new Octokit({
        auth: context.token
    });
    
    switch (type) {
        case 'initialize':
            return {
                capabilities: {
                    workspace: true,
                    github: true,
                    fileSystem: true
                }
            };
            
        case 'workspace/files':
            return await getWorkspaceFiles(context);
            
        case 'github/pullRequest':
            return await handleGitHubPR(params, context);
            
        default:
            throw new Error(`Unknown request type: ${type}`);
    }
}

async function getWorkspaceFiles(context) {
    const workspacePath = path.join(__dirname, '..');
    const files = [];
    
    function scanDir(dirPath, relative = '') {
        const entries = fs.readdirSync(dirPath);
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry);
            const relativePath = path.join(relative, entry);
            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
                if (!entry.startsWith('.') && entry !== 'node_modules') {
                    scanDir(fullPath, relativePath);
                }
            } else {
                files.push({
                    path: relativePath,
                    size: stats.size,
                    modified: stats.mtime
                });
            }
        }
    }
    
    scanDir(workspacePath);
    return { files };
}

async function handleGitHubPR(params, context) {
    const octokit = new Octokit({
        auth: context.token
    });

    try {
        // Get the current branch name
        const branchName = params.branch || 'main';
        
        // Create a commit with the changes
        const currentCommit = await octokit.rest.git.getRef({
            owner: context.owner,
            repo: context.repo,
            ref: `heads/${branchName}`
        });

        const changes = await octokit.rest.git.createCommit({
            owner: context.owner,
            repo: context.repo,
            message: params.commitMessage || 'Update from MCP Server',
            tree: currentCommit.data.object.sha,
            parents: [currentCommit.data.object.sha]
        });

        // Update the reference
        await octokit.rest.git.updateRef({
            owner: context.owner,
            repo: context.repo,
            ref: `heads/${branchName}`,
            sha: changes.data.sha
        });

        // Create a pull request if requested
        if (params.createPR) {
            const pr = await octokit.rest.pulls.create({
                owner: context.owner,
                repo: context.repo,
                title: params.prTitle || 'Update from MCP Server',
                head: branchName,
                base: params.targetBranch || 'main',
                body: params.prDescription || 'Automated PR created by MCP Server'
            });

            return {
                success: true,
                message: 'Changes committed and PR created',
                prNumber: pr.data.number,
                prUrl: pr.data.html_url
            };
        }

        return {
            success: true,
            message: 'Changes committed successfully',
            commitSha: changes.data.sha
        };
    } catch (error) {
        console.error('GitHub operation failed:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

startMCPServer();
