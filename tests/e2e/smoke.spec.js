import { test, expect } from '@playwright/test';

test.describe('Smoke — estrutura da página', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carrega com título correto', async ({ page }) => {
    await expect(page).toHaveTitle(/TECPIXEL/i);
  });

  test('seção hero está visível', async ({ page }) => {
    await expect(page.locator('#inicio')).toBeVisible();
    await expect(page.locator('.hero-badge')).toBeVisible();
    await expect(page.locator('h1')).toContainText('computador');
  });

  test('botão "Iniciar Diagnóstico" existe e aponta para #diagnostico', async ({ page }) => {
    const btn = page.getByRole('link', { name: /Iniciar Diagnóstico/i });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', '#diagnostico');
  });

  test('seção de diagnóstico está presente', async ({ page }) => {
    await expect(page.locator('#diagnostico')).toBeVisible();
    await expect(page.locator('#diagnosticCard')).toBeVisible();
  });

  test('seção Quem Somos está presente', async ({ page }) => {
    await expect(page.locator('#quem-somos')).toBeVisible();
    await expect(page.locator('.team-grid')).toBeVisible();
    // 6 membros da equipe
    await expect(page.locator('.team-card')).toHaveCount(6);
  });

  test('rodapé está presente com copyright', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('.footer-copy')).toContainText('TECPIXEL');
  });

  test('botão de aviso LGPD existe no rodapé', async ({ page }) => {
    const lgpdBtn = page.locator('#lgpdBtn');
    await expect(lgpdBtn).toBeVisible();
    await expect(lgpdBtn).toContainText(/Privacidade|LGPD/i);
  });

  test('botão de contato (FAB) está visível', async ({ page }) => {
    await expect(page.locator('#contactFab')).toBeVisible();
  });

  test('navegação desktop tem os links corretos', async ({ page }) => {
    const nav = page.locator('.nav');
    await expect(nav.getByRole('link', { name: 'Início' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Diagnóstico' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Montar PC' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Quem Somos' })).toBeVisible();
  });

  test('Google Fonts está declarado no <head>', async ({ page }) => {
    // Verifica a declaração (que controlamos e documentamos na LGPD),
    // sem depender da disponibilidade de rede externa.
    await expect(
      page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com"]')
    ).toHaveCount(1);
  });
});
