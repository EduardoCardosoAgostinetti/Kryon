import { test, expect } from '@playwright/test';

// Gera um email e username aleatórios para testes
function generateRandomUser() {
  const random = Math.floor(Math.random() * 100000);
  return {
    fullName: `Test User ${random}`,
    username: `user${random}`,
    email: `user${random}@test.com`,
    password: `Senha123!`
  };
}

test('Criar usuário e fazer login', async ({ page }) => {
  const user = generateRandomUser();

  // --- Teste de SignUp ---
  await page.goto('http://localhost:5173/signup');

  // Preenche o formulário
  await page.fill('#name', user.fullName);
  await page.fill('#username', user.username);
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);
  await page.fill('#confirm-password', user.password);
  await page.check('#terms');

  // Envia o formulário
  await page.click('button[type="submit"]');

  // Aguarda o alerta de sucesso e verifica a URL de redirecionamento
  await page.waitForSelector('text=User created successfully.');
  await page.click('button:has-text("Close")');

  // Verifica redirecionamento para SignIn
  await expect(page).toHaveURL('http://localhost:5173/signin');
  // --- Teste de SignIn ---
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);

  // Clica no login
  await page.click('button[type="submit"]');

  await page.waitForSelector('text=Logged in successfully.');
  await page.click('button:has-text("Close")');
  
  

  await page.waitForURL('http://localhost:5173/');
  await expect(page).toHaveURL('http://localhost:5173/');
});
