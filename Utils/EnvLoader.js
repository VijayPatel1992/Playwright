const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

/**
 * Validates the structure of a JSON file against a given schema.
 * @param {string} filePath - The path to the JSON file.
 * @param {object} schema - The JSON schema to validate against.
 * @returns {boolean} - Returns true if the JSON is valid, otherwise false.
 */
function validateJsonFile(filePath, schema) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return false;
    }

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const valid = validate(data);

        if (!valid) {
            console.error(`Validation errors for file ${filePath}:`, validate.errors);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Error reading or parsing file ${filePath}:`, error);
        return false;
    }
}

/**
 * Loads the environment configuration from a JSON file.
 * @param {string} env - The environment name (e.g., 'QA', 'UAT').
 * @returns {object} - The parsed JSON configuration object.
 */
function loadEnvironmentConfig(env) {
    const configFilePath = path.join(__dirname, '../EnvConfig', `${env}.json`);

    if (!fs.existsSync(configFilePath)) {
        throw new Error(`Configuration file for environment '${env}' not found at ${configFilePath}`);
    }

    try {
        return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    } catch (error) {
        throw new Error(`Error parsing configuration file for environment '${env}': ${error.message}`);
    }
}

/**
 * Loads and validates the environment configuration from a JSON file.
 * @param {string} env - The environment name (e.g., 'QA', 'UAT').
 * @param {object} schema - The JSON schema to validate against.
 * @returns {object} - The parsed and validated JSON configuration object.
 */
function loadAndValidateEnvConfig(env, schema) {
    const config = loadEnvironmentConfig(env);

    if (!validateJsonFile(path.join(__dirname, '../EnvConfig', `${env}.json`), schema)) {
        throw new Error(`Validation failed for environment '${env}' configuration.`);
    }

    return config;
}

module.exports = { loadEnvironmentConfig, validateJsonFile, loadAndValidateEnvConfig };