// cli/src/index.ts
// #!/usr/bin/env node

import { exec } from "child_process";
import { initConfig } from "./commands/initConfig";
import { runTests } from "./commands/runTests";
import { verifyEnv } from "./commands/verifyEnv";
// import { loginCommand } from "./commands/login";

const VERSION = "1.0.1";

async function main() {
  const [, , cmd, arg1, arg2] = process.argv;

  switch (cmd) {
    case "uninstall":
      // Execute npm uninstall -g to remove your CLI
      console.log("Attempting global uninstall...");
      exec("npm uninstall -g @codnx/mlxd", (error, stdout, stderr) => {
        if (error) {
          console.log(`Uninstall failed: ${error.message}`);
          process.exit(1);
        } else {
          console.log(`Uninstalled successfully:\n${stdout}`);
          process.exit(0);
        }
      });
      break;

    // case "login":
    //   await loginCommand();
    //   break;

    case "--version":
    case "-v":
      console.log(`mlxd version: ${VERSION}`);
      break;

    case "init":
      initConfig();
      break;

    case "verify":
      await verifyEnv();
      break;

    case "run":
      await runTests(arg1);
      break;

    default:
      console.log(`
Usage:
  mlxd uninstall                   # Uninstalls this CLI globally
  mlxd --version or -v             # Print CLI version
  mlxd init                        # Create sample config.yaml
  mlxd verify                      # Check environment
`);
      process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
