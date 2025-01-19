// cli/src/commands/runTests.ts

import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import fs from "fs";
import path from "path";
import { loadConfig } from "../utils/configLoader";
// If you want environment checks, re-enable:
import { checkEnvironment } from "../utils/envChecks";
import { runModelTests } from "../utils/testRunner";
import { validateDataset, DataValidationRule } from "../utils/dataValidator";

/**
 * Where we store the user’s JWT after post-install login.
 * e.g. ~/.mlxd/auth.json
 */
const globalConfigDir = process.env.HOME
  ? path.join(process.env.HOME, ".mlxd")
  : path.join(".", ".mlxd");
const globalAuthFile = path.join(globalConfigDir, "auth.json");

export async function runTests(keyFilePath?: string) {
  try {
    console.log("CLI: runTests");

    // 1. Load config
    const config = loadConfig();

    // 2. (Optional) environment checks
    if (process.env.NODE_ENV !== "test") {
      checkEnvironment(config);
    }

    // 3. Data validation (if any)
    if (config.dataValidation) {
      if (!config.dataPath) {
        console.log("No dataPath found in config. Unable to validate dataset.");
        process.exit(1);
      }

      const rule: DataValidationRule = {
        requiredColumns: config.dataValidation.requiredColumns || [],
        maxRows: config.dataValidation.maxRows,
        checkNulls: config.dataValidation.checkNulls,
        checkStats: config.dataValidation.checkStats,
        maxStdDev: config.dataValidation.maxStdDev,
      };

      const validationResult = validateDataset(config.dataPath, rule);
      if (!validationResult.passed) {
        console.log("Data validation failed with errors:");
        validationResult.errors.forEach((err) => console.log(err));
        process.exit(1);
      } else {
        console.log("Data validation passed.");
      }
    }

    // 4. Run local model tests
    console.log("Starting test runner (real metrics)...");
    const results = await runModelTests(config.tests);

    // 5. POST these results to your server
    //    The server will handle daily usage (10 runs for free plan).
    //    We must include Authorization: Bearer <token> from post-install login.

    // Attempt to read the token from ~/.mlxd/auth.json
    // if (!fs.existsSync(globalAuthFile)) {
    //   console.log(
    //     "No auth file found. Please reinstall or ensure post-install login was successful."
    //   );
    //   process.exit(1);
    // }
    // const authData = JSON.parse(fs.readFileSync(globalAuthFile, "utf8"));
    // const token = authData.token;
    // if (!token) {
    //   console.log(
    //     "No token found in auth.json. Please reinstall or contact support."
    //   );
    //   process.exit(1);
    // }

    // const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

    // try {
    //   const response = await axios.post(
    //     `${SERVER_URL}/api/tests/run`,
    //     { results },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // <--- Use JWT from post-install login
    //       },
    //     }
    //   );

    //   console.log(`Server responded: ${response.data.message}`);
    // } catch (postErr) {
    //   console.log(`Server call failed: ${(postErr as Error).message}`);
    //   process.exit(1);
    // }

    // 6. Print final test results for reference
    console.log("Test Results");
    results.forEach((r) => {
      console.log(
        `Metric: ${r.metric}, Value: ${r.value}, Threshold: ${r.threshold}, Passed: ${r.passed}`
      );
    });

    // 7. Optional: encrypt & store locally
  } catch (error) {
    console.log(`runTests error: ${(error as Error).message}`);
    process.exit(1);
  }
}
