// cli/src/utils/testRunner.ts
import { spawnSync } from "child_process";
import { TestThreshold, TestResultPayload } from "../types";
import path from "path";
import * as fs from "fs";

function calculateMetricViaPython(metric: string): number {
  const mlxdDir = process.cwd();
  const pythonDir = path.join(mlxdDir, "python");
  const scriptPath = path.join(pythonDir, "model_inference.py");

  console.log(`Current working directory: ${mlxdDir}`);
  console.log(`Python script path: ${scriptPath}`);

  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Error: Python script not found at ${scriptPath}`);
  }

  const pyProc = spawnSync("python", [scriptPath, metric], {
    encoding: "utf-8",
  });

  console.log("STDOUT:", pyProc.stdout);
  console.log("STDERR:", pyProc.stderr);

  if (pyProc.error) {
    throw new Error(`Failed to run Python script: ${pyProc.error.message}`);
  }

  const output = pyProc.stdout.trim();
  const parsed = JSON.parse(output);
  if (parsed.metric !== metric) {
    throw new Error(`Unexpected metric from Python script: ${parsed.metric}`);
  }
  return parsed.value;
}

export async function runModelTests(
  thresholds: TestThreshold[]
): Promise<TestResultPayload[]> {
  const results: TestResultPayload[] = [];

  for (const t of thresholds) {
    const value = calculateMetricViaPython(t.metric);
    const passed =
      t.metric === "rmse" ? value <= t.threshold : value >= t.threshold;

    results.push({
      testName: t.name,
      metric: t.metric,
      value: parseFloat(value.toFixed(3)),
      threshold: t.threshold,
      passed,
      severity: t.severity || "warning",
    });
  }

  return results;
}
