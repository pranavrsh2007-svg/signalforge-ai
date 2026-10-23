import Papa from 'papaparse';
import { DataRow, RawCsvRow, ValidationResult, ColumnProfile } from '../../types';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_ALLOWED_ROWS = 10000;

const REQUIRED_COLUMNS = ['date', 'order_id', 'category', 'product', 'quantity', 'unit_price'];

// Helper to sanitize spreadsheet formula injection threats (=, +, -, @, \t, \r)
export function sanitizeCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  let str = String(value).trim();
  // Strip potential formula trigger prefixes if cell looks like formula
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return str;
}

export function isValidDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  // Match standard YYYY-MM-DD or standard ISO date format
  const match = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!match) return false;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  if (year < 1990 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

export interface ParseOptions {
  fileName?: string;
  fileSize?: number;
  isSample?: boolean;
}

export function parseAndValidateCsv(
  csvContent: string,
  options: ParseOptions = {}
): { rows: DataRow[]; validation: ValidationResult } {
  const fileName = options.fileName || 'uploaded_data.csv';
  const fileSize = options.fileSize || csvContent.length;
  const isSample = Boolean(options.isSample);

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size limit
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    errors.push(
      `File size (${(fileSize / (1024 * 1024)).toFixed(2)} MB) exceeds the 5.0 MB limit.`
    );
    return {
      rows: [],
      validation: {
        isValid: false,
        errors,
        warnings,
        rowCount: 0,
        columnCount: 0,
        columns: [],
        hasCost: false,
        hasStock: false,
        fileSize,
        fileName,
        isSample,
      },
    };
  }

  // Check empty content
  if (!csvContent || csvContent.trim().length === 0) {
    errors.push('File is completely empty. Please upload a valid CSV with headers and data rows.');
    return {
      rows: [],
      validation: {
        isValid: false,
        errors,
        warnings,
        rowCount: 0,
        columnCount: 0,
        columns: [],
        hasCost: false,
        hasStock: false,
        fileSize,
        fileName,
        isSample,
      },
    };
  }

  // Parse with PapaParse
  const parseResult = Papa.parse<RawCsvRow>(csvContent, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header: string) => header.trim().toLowerCase().replace(/\s+/g, '_'),
  });

  if (parseResult.errors && parseResult.errors.length > 0) {
    for (const err of parseResult.errors) {
      errors.push(`Row ${err.row ?? 'header'}: ${err.message}`);
    }
  }

  const rawRows = parseResult.data;
  if (rawRows.length === 0) {
    errors.push('No data rows found in CSV. Expected at least one row beneath headers.');
    return {
      rows: [],
      validation: {
        isValid: false,
        errors,
        warnings,
        rowCount: 0,
        columnCount: 0,
        columns: [],
        hasCost: false,
        hasStock: false,
        fileSize,
        fileName,
        isSample,
      },
    };
  }

  if (rawRows.length > MAX_ALLOWED_ROWS) {
    errors.push(
      `Row count (${rawRows.length}) exceeds the maximum demo limit of ${MAX_ALLOWED_ROWS} rows.`
    );
  }

  const headers = parseResult.meta.fields || Object.keys(rawRows[0] || {});
  const missingHeaders = REQUIRED_COLUMNS.filter((col) => !headers.includes(col));
  if (missingHeaders.length > 0) {
    errors.push(
      `Missing required column headers: [${missingHeaders.join(
        ', '
      )}]. Required columns are: ${REQUIRED_COLUMNS.join(', ')}.`
    );
  }

  const hasCost = headers.includes('unit_cost');
  const hasStock = headers.includes('stock_on_hand');

  if (!hasCost) {
    warnings.push(
      "Optional column 'unit_cost' not present. Gross margin & profit metrics will be omitted."
    );
  }
  if (!hasStock) {
    warnings.push("Optional column 'stock_on_hand' not present. Stockout risk signals will be omitted.");
  }

  // Profile columns
  const columnProfiles: ColumnProfile[] = headers.map((col) => {
    let validCount = 0;
    let invalidCount = 0;
    const sampleValues: (string | number)[] = [];

    for (let i = 0; i < rawRows.length; i++) {
      const val = rawRows[i][col];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        validCount++;
        if (sampleValues.length < 3) sampleValues.push(String(val).trim());
      } else {
        invalidCount++;
      }
    }

    let inferredType: 'string' | 'number' | 'date' = 'string';
    if (col === 'date') {
      inferredType = 'date';
    } else if (['quantity', 'unit_price', 'unit_cost', 'stock_on_hand'].includes(col)) {
      inferredType = 'number';
    }

    return {
      name: col,
      inferredType,
      validCount,
      invalidCount,
      sampleValues,
    };
  });

  // Validate and parse individual rows
  const parsedRows: DataRow[] = [];
  const maxRowErrorsToReport = 10;
  let rowErrorCount = 0;

  for (let idx = 0; idx < rawRows.length; idx++) {
    const raw = rawRows[idx];
    const rowNumber = idx + 2; // +1 for 0-index, +1 for header line

    const dateStr = String(raw.date || '').trim();
    if (!isValidDate(dateStr)) {
      if (rowErrorCount < maxRowErrorsToReport) {
        errors.push(`Row ${rowNumber}: Invalid or missing date '${raw.date}'. Must be YYYY-MM-DD.`);
      }
      rowErrorCount++;
    }

    const orderId = sanitizeCell(raw.order_id);
    if (!orderId) {
      if (rowErrorCount < maxRowErrorsToReport) {
        errors.push(`Row ${rowNumber}: Missing order_id.`);
      }
      rowErrorCount++;
    }

    const category = sanitizeCell(raw.category) || 'Uncategorized';
    const product = sanitizeCell(raw.product) || 'Unnamed Product';

    // Quantity validation (must be positive integer)
    const qtyNum = Number(raw.quantity);
    if (isNaN(qtyNum) || !Number.isFinite(qtyNum) || qtyNum <= 0) {
      if (rowErrorCount < maxRowErrorsToReport) {
        errors.push(`Row ${rowNumber}: Quantity '${raw.quantity}' must be a positive number.`);
      }
      rowErrorCount++;
    }

    // Unit price validation (must be non-negative number)
    const priceNum = Number(raw.unit_price);
    if (isNaN(priceNum) || !Number.isFinite(priceNum) || priceNum < 0) {
      if (rowErrorCount < maxRowErrorsToReport) {
        errors.push(`Row ${rowNumber}: Unit price '${raw.unit_price}' must be a valid positive number.`);
      }
      rowErrorCount++;
    }

    let costNum: number | null = null;
    if (hasCost && raw.unit_cost !== undefined && raw.unit_cost !== '') {
      const c = Number(raw.unit_cost);
      if (!isNaN(c) && Number.isFinite(c) && c >= 0) {
        costNum = c;
      } else {
        warnings.push(`Row ${rowNumber}: Non-numeric unit_cost '${raw.unit_cost}' ignored.`);
      }
    }

    let stockNum: number | null = null;
    if (hasStock && raw.stock_on_hand !== undefined && raw.stock_on_hand !== '') {
      const s = Number(raw.stock_on_hand);
      if (!isNaN(s) && Number.isFinite(s)) {
        stockNum = s;
      }
    }

    const revenue = qtyNum * priceNum;
    const cost = costNum !== null ? qtyNum * costNum : null;
    const profit = cost !== null ? revenue - cost : null;
    const margin = profit !== null && revenue > 0 ? (profit / revenue) * 100 : null;

    parsedRows.push({
      date: dateStr,
      order_id: orderId,
      category,
      product,
      quantity: qtyNum,
      unit_price: priceNum,
      unit_cost: costNum,
      stock_on_hand: stockNum,
      revenue,
      cost,
      profit,
      margin,
    });
  }

  if (rowErrorCount > maxRowErrorsToReport) {
    errors.push(`...and ${rowErrorCount - maxRowErrorsToReport} additional row format errors.`);
  }

  // Sort rows chronologically
  parsedRows.sort((a, b) => a.date.localeCompare(b.date));

  const isValid = errors.length === 0;

  return {
    rows: isValid ? parsedRows : [],
    validation: {
      isValid,
      errors,
      warnings,
      rowCount: rawRows.length,
      columnCount: headers.length,
      columns: columnProfiles,
      hasCost,
      hasStock,
      fileSize,
      fileName,
      isSample,
    },
  };
}
