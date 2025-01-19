// cli/src/utils/dataValidator.ts
import fs from "fs";
import path from "path";
import { parse } from "papaparse"; // Yarn or npm install papaparse
import { Logger } from "./logger";

export interface DataValidationRule {
  requiredColumns: string[];
  maxRows?: number; // Example: If your dataset shouldn't exceed a certain size
  checkNulls?: boolean; // Whether to scan for null/empty cells
  checkStats?: boolean; // Whether to do simple mean/std checks
  maxStdDev?: number; // e.g., if std dev is too high => potential anomaly
}

export interface DataValidationResult {
  passed: boolean;
  errors: string[];
  stats?: {
    rowCount?: number;
    columnCount?: number;
    [columnName: string]: any; // e.g., min, max, mean
  };
}

/**
 * Validates CSV data against a set of rules.
 */
export function validateDataset(
  filePath: string,
  rules: DataValidationRule
): DataValidationResult {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    return {
      passed: false,
      errors: [`Data file not found: ${filePath}`],
    };
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const parseResult = parse(fileContent, {
    header: true,
    dynamicTyping: true, // Convert numeric strings to numbers
    skipEmptyLines: true,
  });

  if (parseResult.errors.length > 0) {
    return {
      passed: false,
      errors: parseResult.errors.map((e) => e.message),
    };
  }

  // 1. Basic shape checks
  const rows = parseResult.data as any[];
  const columns = parseResult.meta.fields || [];
  const errors: string[] = [];

  // Check required columns
  const missingCols = rules.requiredColumns.filter(
    (col) => !columns.includes(col)
  );
  if (missingCols.length > 0) {
    errors.push(`Missing required columns: ${missingCols.join(", ")}`);
  }

  // Check row count
  if (rules.maxRows && rows.length > rules.maxRows) {
    errors.push(
      `Row count (${rows.length}) exceeds maxRows (${rules.maxRows}).`
    );
  }

  // 2. Null-checks
  if (rules.checkNulls) {
    for (const col of columns) {
      const nullCount = rows.filter((r) => r[col] == null).length;
      if (nullCount > 0) {
        errors.push(`Column "${col}" has ${nullCount} null/undefined cells.`);
      }
    }
  }

  // 3. Statistical checks
  const stats: Record<string, any> = {};
  if (rules.checkStats) {
    for (const col of columns) {
      // Only compute stats if the column is numeric
      const numericValues = rows
        .map((r) => r[col])
        .filter((val) => typeof val === "number");
      if (numericValues.length === 0) continue;

      const sum = numericValues.reduce((acc, val) => acc + val, 0);
      const mean = sum / numericValues.length;
      const variance =
        numericValues.reduce((acc, val) => acc + (val - mean) ** 2, 0) /
        numericValues.length;
      const stdDev = Math.sqrt(variance);

      stats[col] = {
        mean: parseFloat(mean.toFixed(3)),
        stdDev: parseFloat(stdDev.toFixed(3)),
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
      };

      // If user wants to ensure data isn't too spread out
      if (rules.maxStdDev && stdDev > rules.maxStdDev) {
        errors.push(
          `Column "${col}" has high standard deviation: ${stdDev.toFixed(2)}`
        );
      }
    }
  }

  // Build final result
  return {
    passed: errors.length === 0,
    errors,
    stats: {
      rowCount: rows.length,
      columnCount: columns.length,
      ...stats,
    },
  };
}
