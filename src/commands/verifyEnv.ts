// cli/src/commands/verifyEnv.ts

import { Logger } from "../utils/logger";
import { loadConfig } from "../utils/configLoader";
import { checkEnvironment } from "../utils/envChecks";

export async function verifyEnv() {
  try {
    Logger.info("=== CLI: verifyEnv ===");
    const config = loadConfig();
    checkEnvironment(config);
    Logger.info("Environment is correctly set up.");
  } catch (error) {
    Logger.error(`verifyEnv error: ${(error as Error).message}`);
    process.exit(1);
  }
}
