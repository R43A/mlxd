// cli/src/utils/configLoader.ts

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { ConfigFile } from "../types";
import { CLIError } from "../types.d";
import { Logger } from "./logger";

export function loadConfig(configName = "config.yaml"): ConfigFile {
  const configPath = path.resolve(process.cwd(), configName);

  if (!fs.existsSync(configPath)) {
    const err: CLIError = new Error(
      `Cannot find ${configName} in current directory.`
    ) as CLIError;
    err.code = 404;
    throw err;
  }

  try {
    const fileContent = fs.readFileSync(configPath, "utf-8");
    const config = yaml.load(fileContent) as ConfigFile;
    if (!config.tests || !Array.isArray(config.tests)) {
      throw new Error("Invalid config file: missing 'tests' array.");
    }
    return config;
  } catch (error) {
    Logger.error(`Error loading config: ${(error as Error).message}`);
    throw error;
  }
}
