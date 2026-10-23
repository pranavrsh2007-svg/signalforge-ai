import { describe, it, expect } from 'vitest';
import {
  parseAndValidateCsv,
  sanitizeCell,
  isValidDate,
  MAX_FILE_SIZE_BYTES,
} from '../src/lib/csv/parseCsv';

describe('CSV Ingestion & Validation Engine', () => {
  it('correctly validates and parses a valid CSV with standard columns', () => {
    const validCsv = `date,order_id,category,product,quantity,unit_price,unit_cost,stock_on_hand
2026-09-01,O-1001,Home,Storage Box,4,18,10,80
2026-09-02,O-1002,Office,Notebook Set,8,7,3,120`;

    const { rows, validation } = parseAndValidateCsv(validCsv, { fileName: 'test.csv' });

    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
    expect(rows.length).toBe(2);
    expect(rows[0].revenue).toBe(72); // 4 * 18
    expect(rows[0].cost).toBe(40); // 4 * 10
    expect(rows[0].profit).toBe(32);
    expect(validation.hasCost).toBe(true);
    expect(validation.hasStock).toBe(true);
  });

  it('rejects an empty file or whitespace only file', () => {
    const { rows, validation } = parseAndValidateCsv('   \n  ');
    expect(validation.isValid).toBe(false);
    expect(rows.length).toBe(0);
    expect(validation.errors[0]).toContain('empty');
  });

  it('rejects files exceeding the 5 MB limit', () => {
    const fakeOversized = MAX_FILE_SIZE_BYTES + 1024;
    const { validation } = parseAndValidateCsv('date,order_id\n', { fileSize: fakeOversized });
    expect(validation.isValid).toBe(false);
    expect(validation.errors[0]).toContain('exceeds the 5.0 MB limit');
  });

  it('detects missing required columns and explains what is missing', () => {
    const missingHeadersCsv = `date,product,quantity
2026-09-01,Widget,5`;

    const { validation } = parseAndValidateCsv(missingHeadersCsv);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some((e) => e.includes('Missing required column headers'))).toBe(true);
  });

  it('neutralizes spreadsheet formula injection characters', () => {
    expect(sanitizeCell('=1+1')).toBe("'=1+1");
    expect(sanitizeCell('+SUM(A1:A10)')).toBe("'+SUM(A1:A10)");
    expect(sanitizeCell('-cmd|calc')).toBe("'-cmd|calc");
    expect(sanitizeCell('@alert')).toBe("'@alert");
    expect(sanitizeCell('Normal Text')).toBe('Normal Text');
  });

  it('validates calendar dates strictly', () => {
    expect(isValidDate('2026-09-15')).toBe(true);
    expect(isValidDate('2026-02-31')).toBe(false); // Invalid Feb 31
    expect(isValidDate('not-a-date')).toBe(false);
    expect(isValidDate('')).toBe(false);
  });

  it('correctly loads and parses the verified public sample sales CSV yielding exactly 26 valid rows & 8 columns', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const samplePath = path.resolve(__dirname, '../public/sample-data/sales.csv');
    const content = fs.readFileSync(samplePath, 'utf-8');

    const { rows, validation } = parseAndValidateCsv(content, {
      fileName: 'public_sample_data_sales.csv',
      isSample: true,
    });

    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
    expect(validation.rowCount).toBe(26);
    expect(validation.columnCount).toBe(8);
    expect(rows.length).toBe(26);
    expect(validation.hasCost).toBe(true);
    expect(validation.hasStock).toBe(true);
    expect(rows[0].order_id).toBe('O-1001');
    expect(rows[25].order_id).toBe('O-1026');
  });
});
