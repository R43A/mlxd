// cli/src/types.d.ts

export interface TestThreshold {
  name: string; // e.g. "Model Accuracy"
  type: "metric_threshold"; // or different test type
  metric: string; // "accuracy", "f1", "rmse", etc.
  threshold: number; // pass/fail threshold (e.g. 0.85)
  severity?: "warning" | "critical";
}

export interface DataValidationConfig {
  requiredColumns?: string[];
  maxRows?: number;
  checkNulls?: boolean;
  checkStats?: boolean;
  maxStdDev?: number;
}

/**
 * Main CLI configuration interface.
 */
export interface ConfigFile {
  tests: TestThreshold[];

  environment?: {
    pythonVersion?: string;
    requiredPackages?: { [pkg: string]: string };
  };

  /**
   * Optional data validation rules for checking dataset shape, nulls, etc.
   */
  dataValidation?: DataValidationConfig;

  /**
   * Optional path to your dataset for validation or inference.
   */
  dataPath?: string;
}

export interface TestResultPayload {
  testName: string;
  metric: string;
  value: number;
  threshold: number;
  passed: boolean;
  severity?: "warning" | "critical";
  timestamp?: number; // Add this
}

export interface CLIError extends Error {
  code?: number;
}
