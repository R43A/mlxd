// import readline from "readline";
// import axios from "axios";
// import fs from "fs";
// import path from "path";
// import os from "os";

// // 2. Use `os.homedir()` to find the user's home directory
// const homeDir = os.homedir();
// const globalConfigDir = path.join(homeDir, ".mlxd");
// const globalAuthFile = path.join(globalConfigDir, "auth.json");

// export async function loginCommand() {
//   try {
//     // Prompt for email
//     const email = await question("Email: ", false);
//     if (!email) {
//       console.error("No email provided. Aborting login.");
//       process.exit(1);
//     }

//     // Prompt for password (masked)
//     const password = await question("Password: ", true);
//     if (!password) {
//       console.error("No password provided. Aborting login.");
//       process.exit(1);
//     }

//     // Attempt server login
//     const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
//     const { data } = await axios.post(`${SERVER_URL}/api/auth/login`, {
//       email,
//       password,
//     });

//     if (data.token) {
//       fs.mkdirSync(globalConfigDir, { recursive: true });
//       fs.writeFileSync(
//         globalAuthFile,
//         JSON.stringify({ token: data.token }, null, 2),
//         "utf8"
//       );
//       console.log("\nLogin successful. Token saved to ~/.mlxd/auth.json");
//       process.exit(0);
//     } else {
//       console.error("No token in response. Login failed.");
//       process.exit(1);
//     }
//   } catch (err: any) {
//     console.error(`Login failed: ${err.message || err}`);
//     process.exit(1);
//   }
// }

// /**
//  * Prompts user for input in the console.
//  * If `mask` is true, typed characters are hidden (useful for passwords).
//  */
// function question(prompt: string, mask: boolean): Promise<string> {
//   return new Promise((resolve) => {
//     let muted = false; // track whether to hide characters

//     // Create a standard readline interface
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });

//     // Cast to `any` so we can override internal methods without TypeScript errors
//     const rlAny = rl as any;

//     // Remember the original _writeToOutput
//     const originalWrite = rlAny._writeToOutput;

//     // Override the method to mask characters if `muted` is true
//     rlAny._writeToOutput = function (stringToWrite: string) {
//       if (muted) {
//         // Print '*' instead of actual characters
//         rlAny.output.write("*");
//       } else {
//         rlAny.output.write(stringToWrite);
//       }
//     };

//     // Actually ask the user
//     rl.question(prompt, (answer: string) => {
//       // Restore the original method
//       rlAny._writeToOutput = originalWrite;
//       rl.close();
//       resolve(answer.trim());
//     });

//     if (mask) {
//       muted = true;
//     }
//   });
// }
