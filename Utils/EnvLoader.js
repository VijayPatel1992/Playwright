const fs = require('fs');
const path = require('path');

function loadEnvironmentConfig(env) {
  const envFilePath = path.resolve(__dirname, `../EnvConfig/${env}.json`);
  if (!fs.existsSync(envFilePath)) {
    throw new Error(`Environment configuration file not found: ${envFilePath}`);
  }
  return JSON.parse(fs.readFileSync(envFilePath, 'utf-8'));
}

module.exports = { loadEnvironmentConfig };