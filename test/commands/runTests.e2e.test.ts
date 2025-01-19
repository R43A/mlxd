// cli/test/commands/runTests.e2e.test.ts
import fs from "fs";
import path from "path";
import execa from "execa";

jest.setTimeout(60000);

describe("CLI End-to-End", () => {
  beforeAll(() => {
    const configPath = path.join(__dirname, "../../config.yaml");
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath); // remove the existing config.yaml
    }
  });

  it("should run tests successfully with sample config", async () => {
    // Now the CLI will create a brand-new config.yaml
    const { stdout } = await execa("npx", ["ts-node", "src/index.ts", "init"], {
      shell: true, // <--- Add this
    });
    console.log(stdout);
    expect(stdout).toContain("Sample config.yaml created");

    // Then run tests
    const runResult = await execa("npx", ["ts-node", "src/index.ts", "run"]);
    expect(runResult.stdout).toContain("Test Results");
  });
});
