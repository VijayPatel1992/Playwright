# Playwright Automation Framework Requirements

## Overview
This document outlines the requirements and setup instructions for the Playwright Automation Framework. The framework is designed for end-to-end testing of web applications using Playwright.

## Prerequisites
1. **Node.js**: Ensure Node.js (version 16 or higher) is installed.
2. **Playwright**: Install Playwright using npm.
3. **TypeScript**: The framework uses TypeScript for type safety.
4. **ExcelJS**: Used for reading test data from Excel files.
5. **Environment Configuration**: JSON files for different environments (e.g., QA, UAT).

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Playwright Automation
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Project Structure
- **PageObject/**: Contains page object classes for different pages.
- **tests/**: Contains test files written in TypeScript.
- **Utils/**: Utility files for common functionalities (e.g., reading Excel files, environment configuration).
- **TestData/**: Contains test data in Excel format.
- **playwright.config.ts**: Configuration file for Playwright.
- **types/**: Contains TypeScript type definitions.

## Configuration
1. **Playwright Configuration**:
   - Located in `playwright.config.ts`.
   - Set the `testDir` to `./tests`.
   - Configure retries, timeouts, and browser settings.
2. **Environment Configuration**:
   - JSON files in `EnvConfig/` (e.g., `QA.json`, `UAT.json`).
   - Use `EnvLoader.ts` to load and validate configurations.

## Running Tests
1. Run all tests:
   ```bash
   npx playwright test
   ```
2. Run a specific test file:
   ```bash
   npx playwright test tests/HomePageTest.spec.ts
   ```
3. Generate an HTML report:
   ```bash
   npx playwright show-report
   ```

## Features
- **TypeScript Support**: Ensures type safety and better code maintainability.
- **Page Object Model**: Encapsulates page-specific actions and elements.
- **Data-Driven Testing**: Reads test data from Excel files using `ExcelReader.ts`.
- **Environment-Specific Configurations**: Supports multiple environments (e.g., QA, UAT).
- **Error Handling**: Captures screenshots and logs errors for debugging.
- **Reporting**: Generates HTML reports for test results.

## Dependencies
- `@playwright/test`: Playwright testing library.
- `typescript`: TypeScript for type safety.
- `exceljs`: For reading Excel files.
- `ajv`: JSON schema validation.

## Best Practices
1. Use the Page Object Model to organize page-specific actions.
2. Keep test data separate in the `TestData/` folder.
3. Use environment-specific configurations for flexibility.
4. Write reusable utility functions in the `Utils/` folder.
5. Regularly update dependencies to ensure compatibility.

## Troubleshooting
1. **File Not Found Errors**:
   - Ensure the `TestData.xlsx` file exists in the `TestData/` folder.
   - Verify the file paths in `ExcelReader.ts`.
2. **TypeScript Errors**:
   - Run `npx tsc --noEmit` to check for type errors.
3. **Playwright Errors**:
   - Check the Playwright HTML report for detailed error logs.

## Future Enhancements
1. Integrate with CI/CD pipelines for automated testing.
2. Add support for mobile browsers.
3. Implement API testing capabilities.
4. Enhance reporting with Allure or other tools.

---

For any issues or contributions, please contact the project maintainer or submit a pull request.
