import Ajv, { JSONSchemaType } from 'ajv';
import fs from 'fs';
import path from 'path';
import { Config } from '../types';

/**
 * Validates the structure of a JSON file against a given schema.
 * @param filePath - The path to the JSON file.
 * @param schema - The JSON schema to validate against.
 * @returns Returns true if the JSON is valid, otherwise false.
 * $env:TEST_ENV="UAT"; npx playwright test HomePageTest.spec --headed
 */
function validateJsonFile(filePath: string, schema: JSONSchemaType<Config>): boolean {
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
 * @param env - The environment name (e.g., 'QA', 'UAT').
 * @returns The parsed JSON configuration object.
 */
export function loadEnvironmentConfig(env: string): Config {
    console.log(`Loading configuration for environment: ${env}`);
    const configFilePath = path.join(__dirname, '../EnvConfig', `${env}.json`);

    if (!fs.existsSync(configFilePath)) {
        throw new Error(`Configuration file for environment '${env}' not found at ${configFilePath}`);
    }

    try {
        const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8')) as Config;
        console.log('Successfully loaded environment configuration');
        return config;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error parsing configuration file for environment '${env}': ${error.message}`);
        }
        throw error;
    }
}

/**
 * Loads and validates the environment configuration from a JSON file.
 * @param env - The environment name (e.g., 'QA', 'UAT').
 * @param schema - The JSON schema to validate against.
 * @returns The parsed and validated JSON configuration object.
 */
export function loadAndValidateEnvConfig(env: string, schema: JSONSchemaType<Config>): Config {
    console.log(`Loading and validating configuration for environment: ${env}`);
    const config = loadEnvironmentConfig(env);

    if (!validateJsonFile(path.join(__dirname, '../EnvConfig', `${env}.json`), schema)) {
        throw new Error(`Validation failed for environment '${env}' configuration.`);
    }    console.log('Configuration validation successful');
    return config;
}