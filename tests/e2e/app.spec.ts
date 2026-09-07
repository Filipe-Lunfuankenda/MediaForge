import { test, expect } from '@playwright/test';

test.describe('MediaForge E2E Tests', () => {
  test('Deve carregar a página inicial corretamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MediaForge/i);
    // Verificar se o painel do chat existe
    await expect(page.locator('text=Assistente Inteligente')).toBeVisible();
  });

  test('Chaos Monkey - Cliques rápidos e aleatórios', async ({ page }) => {
    await page.goto('/');
    
    // Clica em vários elementos de forma caótica para garantir que a UI não bloqueia
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * 800);
      const y = Math.floor(Math.random() * 600);
      await page.mouse.click(x, y);
    }
    
    // UI ainda deve estar responsiva (o chat box existe)
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('Interação Básica do Chat', async ({ page }) => {
    await page.goto('/');
    
    const chatInput = page.locator('textarea');
    await chatInput.fill('Extrair audio deste video para mp3');
    await chatInput.press('Enter');

    // Como o Llama está mockado ou demora muito no CI, 
    // verificamos apenas se a mensagem do utilizador apareceu na UI.
    await expect(page.locator('text=Extrair audio deste video para mp3')).toBeVisible();
  });
});
