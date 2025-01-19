const fs = require("fs-extra");
const path = require("path");

try {
  console.log("\n=== Starting postinstall script ===");

  // Get npm_config_local_prefix which points to the actual project root
  const projectRoot =
    process.env.INIT_CWD ||
    process.env.npm_config_local_prefix ||
    process.cwd();
  console.log("Project root:", projectRoot);

  // Package root is where postinstall.js is located
  const packageRoot = __dirname;
  console.log("Package root:", packageRoot);

  const sourceDir = path.join(packageRoot, "mlxd");
  const targetDir = path.join(projectRoot, "mlxd");

  console.log("Source directory:", sourceDir);
  console.log("Target directory:", targetDir);

  // List what's in the package directory
  console.log("\nPackage directory contents:");
  console.log(fs.readdirSync(packageRoot));

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source mlxd directory not found at: ${sourceDir}`);
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.copySync(sourceDir, targetDir, {
    overwrite: true,
    errorOnExist: false,
  });

  // Install mlxd directory as a separate package
  // const mlxdPackage = require(path.join(targetDir, "package.json"));
  const mlxdPath = path.join(projectRoot, "node_modules", "mlxd");
  fs.mkdirSync(mlxdPath, { recursive: true });
  fs.copySync(targetDir, mlxdPath, {
    overwrite: true,
    errorOnExist: false,
  });

  // Update package.json to include mlxd as a dependency
  const packageJson = require(path.join(projectRoot, "package.json"));
  // packageJson.dependencies["@codin-io/mlxd"] = mlxdPackage.version;
  fs.writeFileSync(
    path.join(projectRoot, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  console.log(
    "\n✅ Successfully copied mlxd to project root and installed as a separate package:",
    mlxdPath
  );
} catch (error) {
  console.error("\n❌ Error during postinstall:", error);
  process.exit(1);
}
