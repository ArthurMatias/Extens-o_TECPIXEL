// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Navegação entre páginas', () => {
  test('link "Montar PC" leva à página do jogo', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav').getByRole('link', { name: 'Montar PC' }).click();
    await expect(page).toHaveURL(/\/montar-pc$/);
    await expect(page.getByRole('heading', { level: 1, name: /Monte seu Computador/i })).toBeVisible();
    // diagnóstico não está nesta página
    await expect(page.locator('#diagnostico')).toHaveCount(0);
  });

  test('logo volta para a home a partir do jogo', async ({ page }) => {
    await page.goto('/montar-pc');
    await page.locator('.logo').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#inicio')).toBeVisible();
  });

  test('link de seção a partir do jogo volta para a home e rola até a seção', async ({ page }) => {
    await page.goto('/montar-pc');
    await page.locator('.nav').getByRole('link', { name: 'Diagnóstico' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#diagnostico')).toBeVisible();
  });

  test('header e rodapé aparecem em ambas as páginas', async ({ page }) => {
    await page.goto('/montar-pc');
    await expect(page.locator('#header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('#lgpdBtn')).toBeVisible();
    await expect(page.locator('#contactFab')).toBeVisible();
  });
});
