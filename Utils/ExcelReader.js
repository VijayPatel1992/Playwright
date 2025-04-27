const ExcelJS = require('exceljs');
const path = require('path');  


class ExcelReader {
    static async getTestData(sheetName) {
        const filePath = path.join(__dirname, '../TestData/TestData.xlsx');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found!`);

        const products = [];
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const rowData = {};
                sheet.getRow(1).eachCell((cell, colNumber) => {
                    rowData[cell.value] = row.getCell(colNumber).value;
                });
                products.push(rowData);
            }
        });

        return products;
    }

    static async getRowDataAsJson(Path, sheetName, columnName, fieldValue) {
        const filePath = path.join(__dirname,Path);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet ${sheetName} not found!`);

        const headerRow = sheet.getRow(1);
        let columnIndex = -1;

        headerRow.eachCell((cell, colNumber) => {
            if (cell.value === columnName) {
                columnIndex = colNumber;
    }
        });

        if (columnIndex === -1) {
            throw new Error(`Column ${columnName} not found!`);
        }

        let rowData = null;
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1 && row.getCell(columnIndex).value === fieldValue) {
                rowData = {};
                headerRow.eachCell((cell, colNumber) => {
                    let cellValue = row.getCell(colNumber).value;

                    // If the cell value is an object with 'text', extract only text
                    if (typeof cellValue === 'object' && cellValue !== null && cellValue.hasOwnProperty('text')) {
                        cellValue = cellValue.text;
                    }

                    rowData[cell.value] = cellValue;
                });
            }
        });

        if (!rowData) {
            throw new Error(`No row found with ${fieldValue} in column ${columnName}`);
        }

        return rowData;
    }
}

module.exports = ExcelReader;