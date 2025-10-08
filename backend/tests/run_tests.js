const { execSync } = require("child_process");

const tests = [
  "tests/register_route.test.js",       // Register
  "tests/login_route.test.js",           // Login
  "tests/forgot_password_route.test.js", // Forgot Password
  "tests/reset_password_route.test.js"   // Reset Password
];

for (const test of tests) {
  console.log(`\n🧪 Executando: ${test} ...\n`);
  try {
    execSync(`npx jest ${test} --runInBand --detectOpenHandles`, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Teste falhou: ${test}`);
    process.exit(1);
  }
}
