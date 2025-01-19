// cli/test/utils/dataValidator.test.ts
import { validateDataset } from "../../src/utils/dataValidator";

describe("Data Validator", () => {
  it("should fail if file is missing", () => {
    const result = validateDataset("nonexistent.csv", {
      requiredColumns: ["price", "quantity"],
    });
    expect(result.passed).toBe(false);
    expect(result.errors[0]).toContain("not found");
  });

  // ... more tests
});
