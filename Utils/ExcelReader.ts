
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { TestData } from '../types';

export class ExcelReader {
    static async getTestData(sheetName: string): Promise<TestData[]> {
        try {
            console.log(`Reading test data from sheet "${sheetName}"`);
            const filePath = path.join(__dirname, '../TestData/TestData.xlsx');
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);

            const sheet = workbook.getWorksheet(sheetName);
            if (!sheet) {
                throw new Error(`Sheet "${sheetName}" not found!`);
            }

            console.log('Successfully loaded Excel worksheet');
            const products: TestData[] = [];

            sheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
                if (rowNumber > 1) {
                    const rowData: Record<string, string> = {};
                    sheet.getRow(1).eachCell((cell: ExcelJS.Cell, colNumber: number) => {
                        const key = cell.value?.toString() || '';
                        const value = row.getCell(colNumber).value?.toString() || '';
                        rowData[key] = value;
                    });
                    products.push(rowData as TestData);
                }
            });            console.log(`Successfully read ${products.length} rows of test data`);
            return products;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Failed to read test data:', error.message);
                throw new Error(`Failed to read test data: ${error.message}`);
            }
            throw error;
        }
    }

    static async getRowDataAsJson(filePath: string, sheetName: string, columnName: string, fieldValue: string): Promise<TestData> {
        try {
            console.log(`Reading data from sheet "${sheetName}" where ${columnName}="${fieldValue}"`);            const fullPath = path.join(__dirname, filePath);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`File not found: ${fullPath}`);
            }
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(fullPath);

        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found!`);

        const headerRow = sheet.getRow(1);
        let columnIndex = -1;        headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
            if (cell.value?.toString() === columnName) {
                columnIndex = colNumber;
            }
        });

        if (columnIndex === -1) {
            throw new Error(`Column "${columnName}" not found!`);
        }

        let rowData: TestData | null = null;
        sheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
            if (rowNumber > 1 && row.getCell(columnIndex).value?.toString() === fieldValue) {
                const data: Record<string, string> = {};
                headerRow.eachCell((cell: ExcelJS.Cell, colNumber: number) => {
                    const key = cell.value?.toString() || '';
                    let value = row.getCell(colNumber).value;

                    // If the cell value is an object with 'text', extract only text
                    if (typeof value === 'object' && value !== null && 'text' in value) {
                        value = value.text;
                    }

                    data[key] = value?.toString() || '';
                });
                rowData = data as TestData;
            }
        });

        if (!rowData) {
            throw new Error(`No row found with "${columnName}"="${fieldValue}"`);
        }

        console.log('Successfully found and read row data');
        return rowData;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to read row data:', error.message);
            throw new Error(`Failed to read row data: ${error.message}`);
        }
        throw error;
    }
    }
}