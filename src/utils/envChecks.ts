// cli/src/utils/envChecks.ts

import { spawnSync } from "child_process";
import { ConfigFile } from "../types";
import { Logger } from "./logger";
import { CLIError } from "../types";

export function checkEnvironment(config: ConfigFile) {
  Logger.info("Performing environment checks...");

  // 1. Check Python version
  const pyVersionCmd = spawnSync("python", ["--version"]);
  if (pyVersionCmd.error) {
    const err: CLIError = new Error(
      "Python not found. Ensure Python 3.x is installed."
    ) as CLIError;
    err.code = 500;
    throw err;
  }

  const output = pyVersionCmd.stdout.toString().trim();
  Logger.info(`Detected: ${output}`);

  // If config specifies a pythonVersion, parse and compare
  if (config.environment?.pythonVersion) {
    // naive example: "3.8.0"
    const [majorCfg, minorCfg] = config.environment.pythonVersion
      .split(".")
      .map(Number);
    const versionMatch = output.match(/Python (\d+)\.(\d+)/);
    if (versionMatch) {
      const currentMajor = Number(versionMatch[1]);
      const currentMinor = Number(versionMatch[2]);

      if (
        currentMajor < majorCfg ||
        (currentMajor === majorCfg && currentMinor < minorCfg)
      ) {
        throw new Error(
          `Required Python version is ${config.environment.pythonVersion} but found ${output}. Please upgrade.`
        );
      }
    }
  }

  // 2. Check requiredPackages (skipping actual logic for brevity)
  if (config.environment?.requiredPackages) {
    Logger.info(
      "Checking required Python packages (skipped real logic in sample)..."
    );
    // Typically you'd do `pip freeze` or something similar, parse, compare versions
  }

  Logger.info("Environment checks passed successfully.");
}
