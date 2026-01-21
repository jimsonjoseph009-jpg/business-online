/**
 * Export Utilities
 * Provides functions for exporting data to CSV and PDF formats
 */

/**
 * Export data to CSV
 * @param {Array} data - Data to export
 * @param {Array} headers - Column headers
 * @param {String} filename - Filename for download
 */
export const exportToCSV = (data, headers, filename = 'export.csv') => {
  try {
    // Create CSV content
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle special characters and newlines in CSV
          if (value === null || value === undefined) return '""';
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        }).join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export data to CSV');
  }
};

/**
 * Export data to JSON
 * @param {Array} data - Data to export
 * @param {String} filename - Filename for download
 */
export const exportToJSON = (data, filename = 'export.json') => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error('Failed to export data to JSON');
  }
};

/**
 * Prepare data for CSV export (flatten nested objects)
 * @param {Array} items - Items to prepare
 * @param {Array} fields - Fields to include
 * @returns {Array} Flattened data
 */
export const prepareDataForExport = (items, fields) => {
  return items.map(item => {
    const row = {};
    fields.forEach(field => {
      if (field.includes('.')) {
        // Handle nested fields like 'user.name'
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        row[field] = value || '';
      } else {
        row[field] = item[field] || '';
      }
    });
    return row;
  });
};

/**
 * Format date for CSV
 * @param {Date} date - Date to format
 * @returns {String} Formatted date
 */
export const formatDateForExport = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format currency for CSV
 * @param {Number} value - Currency value
 * @returns {String} Formatted currency
 */
export const formatCurrencyForExport = (value) => {
  if (!value) return '0.00';
  return parseFloat(value).toFixed(2);
};

/**
 * Create PDF from HTML (requires external library)
 * @param {HTMLElement} element - HTML element to convert
 * @param {String} filename - PDF filename
 */
export const exportToPDF = async (element, filename = 'export.pdf') => {
  try {
    // Note: This requires html2pdf library to be installed
    // npm install html2pdf.js
    if (!window.html2pdf) {
      throw new Error('html2pdf library not loaded');
    }

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    window.html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export data to PDF. Make sure html2pdf is installed.');
  }
};

/**
 * Generate PDF table report
 * @param {Array} data - Data for table
 * @param {Array} columns - Column definitions
 * @param {String} title - Report title
 * @returns {String} HTML string
 */
export const generatePDFTable = (data, columns, title) => {
  const tableRows = data
    .map(
      row =>
        `<tr>${columns.map(col => `<td>${row[col.field] || ''}</td>`).join('')}</tr>`
    )
    .join('');

  return `
    <div style="padding: 20px;">
      <h2>${title}</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #E50914; color: white;">
            ${columns.map(col => `<th style="padding: 10px; border: 1px solid #ddd;">${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Generated on: ${new Date().toLocaleDateString()}
      </p>
    </div>
  `;
};

/**
 * Export table to Excel (requires external library)
 * @param {Array} data - Data to export
 * @param {String} filename - Filename
 */
export const exportToExcel = (data, filename = 'export.xlsx') => {
  try {
    // Note: This requires xlsx library to be installed
    // npm install xlsx
    if (!window.XLSX) {
      throw new Error('XLSX library not loaded');
    }

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    window.XLSX.writeFile(workbook, filename);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export data to Excel. Make sure xlsx is installed.');
  }
};
