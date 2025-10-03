import { test, expect } from '@playwright/test';

test('Formulário de login deve aceitar email e senha', async ({ page }) => {
  // Acessa a página de login
  await page.goto('http://localhost:5173/signin');

  // Preenche o email
  await page.fill('#email', 'usuario@teste.com');

  // Preenche a senha
  await page.fill('#password', 'minhaSenha123');

  // Clica no botão Login
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('http://localhost:5173/signin');
});
