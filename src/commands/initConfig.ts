// cli/src/commands/initConfig.ts

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { Logger } from "../utils/logger";

// A more comprehensive default config for demonstration
const DEFAULT_CONFIG = {
  tests: [
    {
      name: "Model Accuracy",
      type: "metric_threshold",
      metric: "accuracy",
      threshold: 0.85,
    },
  ],
  dataPath: "./data/dataset.csv",
  dataValidation: {
    requiredColumns: ["prompt", "expected_label"],
    maxRows: 100000,
    checkNulls: true,
    checkStats: true,
    maxStdDev: 100.0,
  },
  environment: {
    pythonVersion: "3.8",
    requiredPackages: {
      // e.g. "torch": ">=1.13",
      // "scikit-learn": ">=1.0"
    },
  },
};

/**
 * Merges user config with DEFAULT_CONFIG without overwriting user-defined fields.
 */
function mergeConfig(userConfig: any, defaultConfig: any) {
  // For top-level keys
  for (const key of Object.keys(defaultConfig)) {
    // If user doesn't have this key, assign it from defaults
    if (!Object.prototype.hasOwnProperty.call(userConfig, key)) {
      userConfig[key] = defaultConfig[key];
      Logger.info(`Inserted default '${key}' field.`);
    } else {
      // If it's an object, we do a shallow merge of subfields
      if (
        typeof userConfig[key] === "object" &&
        !Array.isArray(userConfig[key]) &&
        typeof defaultConfig[key] === "object" &&
        !Array.isArray(defaultConfig[key])
      ) {
        for (const subKey of Object.keys(defaultConfig[key])) {
          if (!Object.prototype.hasOwnProperty.call(userConfig[key], subKey)) {
            userConfig[key][subKey] = defaultConfig[key][subKey];
            Logger.info(`Inserted default '${key}.${subKey}' field.`);
          }
        }
      }
    }
  }
  return userConfig;
}

export function initConfig() {
  try {
    const configPath = path.resolve(process.cwd(), "config.yaml");

    // 1. If config.yaml doesn't exist, create it fresh
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, yaml.dump(DEFAULT_CONFIG), {
        encoding: "utf-8",
      });
      console.log(`Sample config.yaml created at: ${configPath}`);
      return;
    }

    // 2. If config.yaml exists, parse and merge
    const existingContent = fs.readFileSync(configPath, "utf-8");
    let userConfig: any;
    try {
      userConfig = yaml.load(existingContent) || {};
    } catch (err) {
      console.log(
        "Failed to parse existing config.yaml as YAML. Creating fresh sample."
      );
      fs.writeFileSync(configPath, yaml.dump(DEFAULT_CONFIG), "utf-8");
      return;
    }

    // 3. Merge user config with defaults
    const mergedConfig = mergeConfig(userConfig, DEFAULT_CONFIG);

    // 4. Write back the result
    fs.writeFileSync(configPath, yaml.dump(mergedConfig), "utf-8");
    console.log(
      `Merged default fields into existing config.yaml at: ${configPath}`
    );
  } catch (error) {
    console.log("Failed to initialize or merge config file");
    throw error;
  }
}
