// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Game — Monte seu Computador (página /montar-pc)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/montar-pc');
    await expect(page.locator('#montar-pc')).toBeVisible();
  });

  test('é uma página própria com título e instruções', async ({ page }) => {
    await expect(page).toHaveURL(/\/montar-pc$/);
    await expect(
      page.getByRole('heading', { level: 1, name: /Monte seu Computador/i })
    ).toBeVisible();
    // a página principal (diagnóstico) NÃO está presente aqui
    await expect(page.locator('#diagnostico')).toHaveCount(0);
  });

  test('inicia com 6 peças no inventário e 6 sockets vazios', async ({ page }) => {
    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(6);
    await expect(page.locator('.dnd-slot.slot-empty')).toHaveCount(6);
    await expect(page.locator('.slot-filled')).toHaveCount(0);
  });

  test('a placa-mãe é renderizada', async ({ page }) => {
    await expect(page.locator('.motherboard')).toBeVisible();
    await expect(page.locator('.motherboard .motherboard-bg')).toBeVisible();
  });

  test('hover numa peça mostra a explicação no card', async ({ page }) => {
    const cpu = page.locator('.dnd-piece.part-card', { hasText: 'Processador' });
    await cpu.hover();
    const info = page.locator('.info-card[aria-live="polite"]');
    await expect(info).toContainText('Para entender:');
    await expect(info).toContainText('Tecnicamente:');
  });

  // ── Fluxo acessível: clique-para-selecionar → clique-para-encaixar ──────────
  test('selecionar peça e encaixar no slot correto preenche e explica', async ({ page }) => {
    const cpu = page.locator('.dnd-piece.part-card', { hasText: 'Processador' });
    await cpu.click();
    await expect(cpu).toHaveAttribute('data-selected', 'true');

    // botões "Encaixar aqui" aparecem nos slots vazios
    await expect(page.locator('.slot-place-btn')).toHaveCount(6);

    // encaixa no slot certo (#slot-cpu)
    await page.locator('#slot-cpu .slot-place-btn').click();

    await expect(page.locator('#slot-cpu.slot-filled')).toBeVisible();
    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(5);
    await expect(page.locator('.slot-filled')).toHaveCount(1);

    const info = page.locator('.info-card[aria-live="polite"]');
    await expect(info).toContainText('Sem essa peça:');
    await expect(info).toContainText('Curiosidade:');
    await expect(page.locator('.game-message')).toContainText(/Boa!/);
  });

  test('encaixar no slot errado não preenche e dá mensagem amigável', async ({ page }) => {
    const cpu = page.locator('.dnd-piece.part-card', { hasText: 'Processador' });
    await cpu.click();
    // tenta encaixar a CPU no slot da RAM (errado)
    await page.locator('#slot-ram .slot-place-btn').click();

    await expect(page.locator('.slot-filled')).toHaveCount(0);
    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(6);
    await expect(page.locator('.game-message')).toContainText(/Quase!/);
  });

  test('completar todas as peças mostra a celebração', async ({ page }) => {
    const order = ['Processador', 'Memória RAM', 'Placa de Vídeo', 'Armazenamento', 'Fonte', 'Ventoinha'];
    const slotIds = ['cpu', 'ram', 'gpu', 'ssd', 'psu', 'cooler'];
    for (let i = 0; i < order.length; i++) {
      await page.locator('.dnd-piece.part-card', { hasText: order[i] }).first().click();
      await page.locator(`#slot-${slotIds[i]} .slot-place-btn`).click();
      await expect(page.locator(`#slot-${slotIds[i]}.slot-filled`)).toBeVisible();
    }
    await expect(page.locator('.celebration')).toBeVisible();
    await expect(page.locator('.celebration').getByRole('heading')).toContainText(/Parabéns/);
  });

  test('botão recomeçar reseta o jogo', async ({ page }) => {
    const cpu = page.locator('.dnd-piece.part-card', { hasText: 'Processador' });
    await cpu.click();
    await page.locator('#slot-cpu .slot-place-btn').click();
    await expect(page.locator('.slot-filled')).toHaveCount(1);

    await page.getByRole('button', { name: 'Recomeçar' }).click();
    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(6);
    await expect(page.locator('.slot-empty')).toHaveCount(6);
    await expect(page.locator('.slot-filled')).toHaveCount(0);
  });

  // ── Drag-and-drop com ponteiro ──────────────────────────────────────────────
  test('arrastar a peça para o slot certo encaixa', async ({ page }) => {
    const piece = page.locator('.dnd-piece.part-card', { hasText: 'Processador' });
    const slot = page.locator('#slot-cpu');
    const pb = await piece.boundingBox();
    const sb = await slot.boundingBox();
    if (!pb || !sb) throw new Error('bounding box ausente');

    await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
    await page.mouse.down();
    // ultrapassa o limiar de ativação (8px) para iniciar o arraste
    await page.mouse.move(pb.x + pb.width / 2 + 12, pb.y + pb.height / 2 + 12, { steps: 6 });
    // confirma que o arraste começou (preview flutuante visível)
    await expect(page.locator('.dnd-overlay')).toBeVisible();
    // move até o centro do slot, em passos, e assenta antes de soltar
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2, { steps: 16 });
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2);
    await page.waitForTimeout(80);
    await page.mouse.up();

    await expect(page.locator('#slot-cpu.slot-filled')).toBeVisible();
    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(5);
  });

  test('sem violações de acessibilidade críticas/sérias', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe estável apenas no chromium');
    // seleciona uma peça para escanear também os botões "Encaixar aqui" e o info card
    await page.locator('.dnd-piece.part-card', { hasText: 'Processador' }).click();
    const results = await new AxeBuilder({ page }).include('#montar-pc').analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toHaveLength(0);
  });
});
