import React from 'react';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { Button, useTheme } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import { tokens } from '../theme';

const FileExport = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleExportExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PlanTrack');

    // Exclude specified columns if they exist in the data
    const excludeColumns = ['id', 'users', 'date_created','programme'];
    const headers = Object.keys(data[0]).filter(
      key => !excludeColumns.includes(key)
    );
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    // Add data rows
    data.forEach(row => {
      const newRowData = Object.entries(row).reduce((acc, [key, value]) => {
        if (!excludeColumns.includes(key)) {
          acc.push(value);
        }
        return acc;
      }, []);
      const newRow = worksheet.addRow(newRowData); 
      newRow.eachCell(cell => {
        cell.value = cell.value ? cell.value.toString() : '';
        cell.alignment = {
          wrapText: true,
          horizontal: 'center',
          vertical: 'middle',
        };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Auto-fit the column widths
    worksheet.columns.forEach(column => {
      if (column && column.header && column.values) {
        const maxLength = Math.max(
          column.header.length,
          ...column.values.map(value =>
            value ? value.toString().length : 0
          )
        );
        column.width = maxLength < 12 ? 12 : maxLength;
      }
    });

    // Generate the Excel file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'PlanTrack.xlsx');
    });
  };

  return (
    <Button
      onClick={handleExportExcel}
      sx={{
        backgroundColor: colors.blueAccent[700],
        color: colors.grey[100],
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '10px 20px',
      }}
    >
      <GetAppIcon sx={{ mr: '10px' }} />
      Export Excel
    </Button>
  );
};

export default FileExport;
