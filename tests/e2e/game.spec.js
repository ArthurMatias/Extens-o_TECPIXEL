// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Game — Monte seu Computador', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#montar-pc').scrollIntoViewIfNeeded();
  });

  test('seção carrega com título e subtítulo', async ({ page }) => {
    const section = page.locator('#montar-pc');
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { name: /Monte seu Computador/i })).toBeVisible();
  });

  test('inventário inicia com 6 peças disponíveis', async ({ page }) => {
    const cards = page.locator('#montar-pc .part-card');
    await expect(cards).toHaveCount(6);
  });

  test('placa-mãe tem 6 slots vazios no início', async ({ page }) => {
    const emptySlots = page.locator('#montar-pc .slot-empty');
    await expect(emptySlots).toHaveCount(6);
  });

  test('clicar em peça encaixa no slot e exibe explicação', async ({ page }) => {
    // clica na primeira peça do inventário
    await page.locator('#montar-pc .part-card').first().click();

    // info card mostra texto da peça
    const info = page.locator('#montar-pc [aria-live="polite"]');
    await expect(info).toContainText(/Para entender:/);
    await expect(info).toContainText(/Tecnicamente:/);
    await expect(info).toContainText(/Sem essa peça:/);
    await expect(info).toContainText(/Curiosidade:/);

    // 5 peças restantes
    await expect(page.locator('#montar-pc .part-card')).toHaveCount(5);
    // 5 slots vazios
    await expect(page.locator('#montar-pc .slot-empty')).toHaveCount(5);
    // 1 slot preenchido
    await expect(page.locator('#montar-pc .slot-filled')).toHaveCount(1);
  });

  test('completar todas as peças exibe celebração', async ({ page }) => {
    // clica em todas as 6 peças disponíveis em ordem
    for (let i = 0; i < 6; i++) {
      await page.locator('#montar-pc .part-card').first().click();
    }
    // celebração aparece
    await expect(page.locator('#montar-pc .celebration')).toBeVisible();
    await expect(
      page.locator('#montar-pc .celebration').getByRole('heading')
    ).toContainText(/Parabéns/);
  });

  test('botão recomeçar reseta o jogo', async ({ page }) => {
    await page.locator('#montar-pc .part-card').first().click();
    await expect(page.locator('#montar-pc .slot-filled')).toHaveCount(1);

    await page.getByRole('button', { name: 'Recomeçar' }).click();

    await expect(page.locator('#montar-pc .part-card')).toHaveCount(6);
    await expect(page.locator('#montar-pc .slot-empty')).toHaveCount(6);
    await expect(page.locator('#montar-pc .slot-filled')).toHaveCount(0);
  });

  test('navegação tem link para a seção do game', async ({ page }) => {
    const navLink = page.locator('.nav').getByRole('link', { name: 'Montar PC' });
    await expect(navLink).toHaveAttribute('href', '#montar-pc');
  });

  test('seção do game sem violações de acessibilidade críticas/sérias', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe estável apenas no chromium');

    // monta uma peça para escanear também o info card preenchido
    await page.locator('#montar-pc .part-card').first().click();

    const results = await new AxeBuilder({ page }).include('#montar-pc').analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toHaveLength(0);
  });
});
