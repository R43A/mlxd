const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "mlxd", "index.bundle.js");

// Check if the file exists
if (fs.existsSync(filePath)) {
  const shebang = "#!/usr/bin/env node\n";
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Prepend the shebang to the existing file content
  fs.writeFileSync(filePath, shebang + fileContent);
  console.log("Shebang added to index.bundle.js");
} else {
  console.error("index.bundle.js not found!");
}
