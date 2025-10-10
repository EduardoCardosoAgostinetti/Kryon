const { execSync } = require("child_process");

const tests = [
  "tests/register_route.test.js",      
  "tests/login_route.test.js",           
  "tests/forgot_password_route.test.js", 
  "tests/reset_password_route.test.js",
  "tests/update_fullname_route.test.js",
  "tests/update_email_route.test.js",
  "tests/update_username_route.test.js",
  "tests/update_password_route.test.js"
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
