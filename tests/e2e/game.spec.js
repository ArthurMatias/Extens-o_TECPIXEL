// @ts-check
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Monta a placa-mãe inteira pelo caminho acessível (clique-para-selecionar →
 * "Encaixar aqui"), respeitando a sequência real: trava → CPU → trava → cooler.
 */
async function assembleEverything(page) {
  // 1. levantar a trava
  await page.locator('.lever-btn').click();
  // 2. CPU no socket
  await page.locator('[data-piece="cpu"]').click();
  await page.locator('#slot-socket .slot-place-btn').click();
  // 3. fechar a trava
  await page.locator('.lever-btn').click();
  // 4. cooler
  await page.locator('[data-piece="cooler"]').click();
  await page.locator('#slot-cooler-mount .slot-place-btn').click();
  // 5. RAM x2
  await page.locator('[data-piece="ram-1"]').click();
  await page.locator('#slot-dimm-1 .slot-place-btn').click();
  await page.locator('[data-piece="ram-2"]').click();
  await page.locator('#slot-dimm-2 .slot-place-btn').click();
  // 6. GPU
  await page.locator('[data-piece="gpu"]').click();
  await page.locator('#slot-pcie .slot-place-btn').click();
  // 7. cabos
  await page.locator('[data-piece="atx24"]').click();
  await page.locator('#slot-atx24-port .slot-place-btn').click();
  await page.locator('[data-piece="eps8"]').click();
  await page.locator('#slot-eps8-port .slot-place-btn').click();
}

test.describe('Game — Monte seu Computador (montagem realista)', () => {
  // Viewport alto: page.mouse não rola a tela, então placa e inventário
  // precisam estar visíveis ao mesmo tempo nos testes de arraste.
  test.use({ viewport: { width: 1280, height: 1200 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/montar-pc');
    await expect(page.locator('#montar-pc')).toBeVisible();
    await page.locator('.game-board').scrollIntoViewIfNeeded();
  });

  test('é uma página própria com título e manual de montagem', async ({ page }) => {
    await expect(page).toHaveURL(/\/montar-pc$/);
    await expect(
      page.getByRole('heading', { level: 1, name: /Monte seu Computador/i })
    ).toBeVisible();
    await expect(page.locator('#diagnostico')).toHaveCount(0);
    await expect(page.locator('.assembly-steps li')).toHaveCount(8);
  });

  test('estado inicial: 7 peças, trava fechada, 0 etapas concluídas', async ({ page }) => {
    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(7);
    await expect(page.locator('.lever-btn[data-state="closed"]')).toBeVisible();
    await expect(page.locator('.progress-text')).toContainText('0 de 8');
    await expect(page.locator('.slot-filled')).toHaveCount(0);
  });

  test('CPU é bloqueada enquanto a trava está fechada', async ({ page }) => {
    await page.locator('[data-piece="cpu"]').click();
    await page.locator('#slot-socket .slot-place-btn').click();
    await expect(page.locator('.game-message')).toContainText(/levante a trava/i);
    await expect(page.locator('.slot-filled')).toHaveCount(0);
    // a trava ganha destaque de dica
    await expect(page.locator('.lever-btn[data-hint="pulse"]')).toBeVisible();
  });

  test('sequência da CPU: levantar trava → encaixar → fechar trava', async ({ page }) => {
    await page.locator('.lever-btn').click();
    await expect(page.locator('.lever-btn[data-state="open"]')).toBeVisible();
    await expect(page.locator('.game-message')).toContainText(/trava levantada/i);

    await page.locator('[data-piece="cpu"]').click();
    await page.locator('#slot-socket .slot-place-btn').click();
    await expect(page.locator('#slot-socket.slot-filled')).toBeVisible();
    await expect(page.locator('.game-message')).toContainText(/prend|trava/i);

    await page.locator('.lever-btn').click();
    await expect(page.locator('.lever-btn[data-state="locked"]')).toBeVisible();
    await expect(page.locator('.game-message')).toContainText(/cooler/i);
    await expect(page.locator('.progress-text')).toContainText('3 de 8');
  });

  test('cooler só fica disponível depois da trava fechada', async ({ page }) => {
    // antes de tudo: o encaixe do cooler está dormindo (sem botão)
    await page.locator('[data-piece="cooler"]').click();
    await expect(page.locator('#slot-cooler-mount .slot-place-btn')).toHaveCount(0);

    // trava aberta + CPU, ainda sem fechar → continua indisponível
    await page.locator('.lever-btn').click();
    await page.locator('[data-piece="cpu"]').click();
    await page.locator('#slot-socket .slot-place-btn').click();
    await page.locator('[data-piece="cooler"]').click();
    await expect(page.locator('#slot-cooler-mount .slot-place-btn')).toHaveCount(0);

    // fecha a trava → agora sim (o cooler segue selecionado do passo anterior)
    await page.locator('.lever-btn').click();
    await page.locator('#slot-cooler-mount .slot-place-btn').click();
    await expect(page.locator('#slot-cooler-mount.slot-filled')).toBeVisible();
  });

  test('os dois módulos de RAM encaixam em qualquer slot DIMM', async ({ page }) => {
    await page.locator('[data-piece="ram-1"]').click();
    await page.locator('#slot-dimm-2 .slot-place-btn').click();
    await expect(page.locator('#slot-dimm-2.slot-filled')).toBeVisible();

    await page.locator('[data-piece="ram-2"]').click();
    await page.locator('#slot-dimm-1 .slot-place-btn').click();
    await expect(page.locator('#slot-dimm-1.slot-filled')).toBeVisible();
  });

  test('peça no encaixe errado dá mensagem amigável e não encaixa', async ({ page }) => {
    await page.locator('[data-piece="gpu"]').click();
    await page.locator('#slot-dimm-1 .slot-place-btn').click();
    await expect(page.locator('.game-message')).toContainText(/Quase!/);
    await expect(page.locator('.slot-filled')).toHaveCount(0);
  });

  test('cabos da fonte conectam nos dois conectores', async ({ page }) => {
    await page.locator('[data-piece="atx24"]').click();
    await page.locator('#slot-atx24-port .slot-place-btn').click();
    await expect(page.locator('#slot-atx24-port.slot-filled')).toBeVisible();

    await page.locator('[data-piece="eps8"]').click();
    await page.locator('#slot-eps8-port .slot-place-btn').click();
    await expect(page.locator('#slot-eps8-port.slot-filled')).toBeVisible();
  });

  test('montagem completa na ordem certa mostra a celebração', async ({ page }) => {
    await assembleEverything(page);
    await expect(page.locator('.progress-text')).toContainText('8 de 8');
    await expect(page.locator('.celebration')).toBeVisible();
    await expect(page.locator('.celebration').getByRole('heading')).toContainText(/Parabéns/);
    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(0);
  });

  test('recomeçar reseta peças, encaixes e a trava', async ({ page }) => {
    await assembleEverything(page);
    await page.getByRole('button', { name: 'Montar outra vez' }).click();

    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(7);
    await expect(page.locator('.slot-filled')).toHaveCount(0);
    await expect(page.locator('.lever-btn[data-state="closed"]')).toBeVisible();
    await expect(page.locator('.progress-text')).toContainText('0 de 8');
  });

  test('arrastar a GPU até o slot PCIe encaixa', async ({ page }) => {
    const piece = page.locator('[data-piece="gpu"]');
    const slot = page.locator('#slot-pcie');
    const pb = await piece.boundingBox();
    const sb = await slot.boundingBox();
    if (!pb || !sb) throw new Error('bounding box ausente');

    await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
    await page.mouse.down();
    await page.mouse.move(pb.x + pb.width / 2 + 12, pb.y + pb.height / 2 + 12, { steps: 6 });
    await expect(page.locator('.dnd-overlay')).toBeVisible();
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2, { steps: 16 });
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2);
    await page.waitForTimeout(80);
    await page.mouse.up();

    await expect(page.locator('#slot-pcie.slot-filled')).toBeVisible();
    await expect(page.locator('.dnd-piece.part-card')).toHaveCount(6);
  });

  test('arrastar a RAM até um slot DIMM (vertical, estreito) encaixa', async ({ page }) => {
    // DIMM é a geometria mais sensível à armadilha de medição do dnd-kit.
    const piece = page.locator('[data-piece="ram-1"]');
    const slot = page.locator('#slot-dimm-1');
    const pb = await piece.boundingBox();
    const sb = await slot.boundingBox();
    if (!pb || !sb) throw new Error('bounding box ausente');

    await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
    await page.mouse.down();
    await page.mouse.move(pb.x + pb.width / 2 + 12, pb.y + pb.height / 2 + 12, { steps: 6 });
    await expect(page.locator('.dnd-overlay')).toBeVisible();
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2, { steps: 16 });
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2);
    await page.waitForTimeout(80);
    await page.mouse.up();

    await expect(page.locator('#slot-dimm-1.slot-filled')).toBeVisible();
  });

  test('abaixar a trava sem CPU volta a bloquear o socket', async ({ page }) => {
    await page.locator('.lever-btn').click(); // open
    await expect(page.locator('.lever-btn[data-state="open"]')).toBeVisible();
    await page.locator('.lever-btn').click(); // closed de novo (sem CPU)
    await expect(page.locator('.lever-btn[data-state="closed"]')).toBeVisible();
    await expect(page.locator('.game-message')).toContainText(/trava abaixada/i);

    // com a trava fechada, a CPU deve ser bloqueada
    await page.locator('[data-piece="cpu"]').click();
    await page.locator('#slot-socket .slot-place-btn').click();
    await expect(page.locator('.slot-filled')).toHaveCount(0);
    await expect(page.locator('.game-message')).toContainText(/Ops! Primeiro levante a trava/);
  });

  test('arrastar o cooler para o socket cedo demais explica a ordem', async ({ page }) => {
    const piece = page.locator('[data-piece="cooler"]');
    const slot = page.locator('#slot-socket');
    const pb = await piece.boundingBox();
    const sb = await slot.boundingBox();
    if (!pb || !sb) throw new Error('bounding box ausente');

    await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
    await page.mouse.down();
    await page.mouse.move(pb.x + pb.width / 2 + 12, pb.y + pb.height / 2 + 12, { steps: 6 });
    await page.mouse.move(sb.x + sb.width / 2, sb.y + sb.height / 2, { steps: 16 });
    await page.mouse.up();

    await expect(page.locator('.game-message')).toContainText(/primeiro o processador/i);
    await expect(page.locator('.slot-filled')).toHaveCount(0);
  });

  test('info card explica a peça ao passar o mouse', async ({ page }) => {
    await page.locator('[data-piece="atx24"]').hover();
    const info = page.locator('.info-card');
    await expect(info).toContainText('Para entender:');
    await expect(info).toContainText(/24 (fios|pinos)/i);
  });

  test('sem violações de acessibilidade críticas/sérias', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe estável apenas no chromium');
    // estado misto: trava aberta + uma peça selecionada + uma instalada
    await page.locator('.lever-btn').click();
    await page.locator('[data-piece="cpu"]').click();
    await page.locator('#slot-socket .slot-place-btn').click();
    await page.locator('[data-piece="ram-1"]').click();

    const results = await new AxeBuilder({ page }).include('#montar-pc').analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toHaveLength(0);
  });
});
