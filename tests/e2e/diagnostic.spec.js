import { test, expect } from '@playwright/test';

test.describe('Diagnóstico — fluxo interativo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Estado inicial ──────────────────────────────────────────────────────
  test('exibe a pergunta inicial ao carregar', async ({ page }) => {
    const question = page.locator('#stepQuestion');
    await expect(question).toBeVisible();
    await expect(question).toContainText('problema');
  });

  test('botão Voltar está oculto na primeira pergunta', async ({ page }) => {
    await expect(page.locator('#backBtn')).toHaveClass(/hidden/);
  });

  test('barra de progresso é exibida', async ({ page }) => {
    await expect(page.locator('#diagnostico .progress-bar')).toBeVisible();
    await expect(page.locator('#progressText')).toContainText('Etapa');
  });

  test('opções da grade inicial são renderizadas', async ({ page }) => {
    const options = page.locator('#stepOptionsContainer .option-btn');
    await expect(options).toHaveCount(6);
  });

  // ── Navegação entre perguntas ────────────────────────────────────────────
  test('clicar em uma opção avança para a próxima pergunta', async ({ page }) => {
    const initialQuestion = await page.locator('#stepQuestion').textContent();

    await page.locator('.option-btn', { hasText: 'Sem internet' }).click();

    const nextQuestion = await page.locator('#stepQuestion').textContent();
    expect(nextQuestion).not.toBe(initialQuestion);
    expect(nextQuestion).toContain('conexao');
  });

  test('botão Voltar aparece após navegar para sub-pergunta', async ({ page }) => {
    await page.locator('.option-btn', { hasText: 'Sem internet' }).click();
    await expect(page.locator('#backBtn')).not.toHaveClass(/hidden/);
  });

  test('botão Voltar retorna à pergunta anterior', async ({ page }) => {
    const initial = await page.locator('#stepQuestion').textContent();

    await page.locator('.option-btn', { hasText: 'Sem internet' }).click();
    await page.locator('#backBtn').click();

    const current = await page.locator('#stepQuestion').textContent();
    expect(current).toBe(initial);
  });

  test('múltiplas navegações mantêm histórico correto', async ({ page }) => {
    const q0 = await page.locator('#stepQuestion').textContent();

    await page.locator('.option-btn', { hasText: 'Computador lento' }).click();
    const q1 = await page.locator('#stepQuestion').textContent();

    await page.locator('.option-btn', { hasText: 'Lento o tempo todo' }).click();
    const q2 = await page.locator('#stepQuestion').textContent();

    // Voltar duas vezes
    await page.locator('#backBtn').click();
    expect(await page.locator('#stepQuestion').textContent()).toBe(q1);

    await page.locator('#backBtn').click();
    expect(await page.locator('#stepQuestion').textContent()).toBe(q0);
  });

  // ── Resultado final ──────────────────────────────────────────────────────
  test('fluxo completo exibe diagnóstico com resultado', async ({ page }) => {
    // Caminho: Computador lento → Lento o tempo todo → Sempre foi lento
    await page.locator('.option-btn', { hasText: 'Computador lento' }).click();
    await page.locator('.option-btn', { hasText: 'Lento o tempo todo, em tudo' }).click();
    await page.locator('.option-btn', { hasText: 'Sempre foi lento (desde que comprei)' }).click();

    await expect(page.locator('#step-result')).not.toHaveClass(/hidden/);
    await expect(page.locator('#step-question')).toHaveClass(/hidden/);
  });

  test('resultado contém diagnóstico, explicação e passos', async ({ page }) => {
    await page.locator('.option-btn', { hasText: 'Computador lento' }).click();
    await page.locator('.option-btn', { hasText: 'Lento o tempo todo, em tudo' }).click();
    await page.locator('.option-btn', { hasText: 'Sempre foi lento (desde que comprei)' }).click();

    await expect(page.locator('#resultDiagnosis')).not.toBeEmpty();
    await expect(page.locator('#resultExplanation')).not.toBeEmpty();
    const stepsCount = await page.locator('#resultSteps li').count();
    expect(stepsCount).toBeGreaterThanOrEqual(3);
    await expect(page.locator('#resultTip')).not.toBeEmpty();
  });

  test('resultado exibe link para tutorial do YouTube', async ({ page }) => {
    await page.locator('.option-btn', { hasText: 'Computador lento' }).click();
    await page.locator('.option-btn', { hasText: 'Lento o tempo todo, em tudo' }).click();
    await page.locator('.option-btn', { hasText: 'Sempre foi lento (desde que comprei)' }).click();

    const videoLink = page.locator('#resultVideo a');
    await expect(videoLink).toBeVisible();
    const href = await videoLink.getAttribute('href');
    expect(href).toContain('youtube.com');
  });

  test('link do YouTube tem rel="noopener"', async ({ page }) => {
    await page.locator('.option-btn', { hasText: 'Computador lento' }).click();
    await page.locator('.option-btn', { hasText: 'Lento o tempo todo, em tudo' }).click();
    await page.locator('.option-btn', { hasText: 'Sempre foi lento (desde que comprei)' }).click();

    const videoLink = page.locator('#resultVideo a');
    const rel = await videoLink.getAttribute('rel');
    expect(rel).toContain('noopener');
  });

  test('barra de progresso atinge 100% no resultado', async ({ page }) => {
    await page.locator('.option-btn', { hasText: 'Computador lento' }).click();
    await page.locator('.option-btn', { hasText: 'Lento o tempo todo, em tudo' }).click();
    await page.locator('.option-btn', { hasText: 'Sempre foi lento (desde que comprei)' }).click();

    const width = await page.locator('#progressFill').evaluate((el) => el.style.width);
    expect(width).toBe('100%');
  });

  // ── Reiniciar ────────────────────────────────────────────────────────────
  test('botão "Novo Diagnóstico" reinicia do zero', async ({ page }) => {
    const initial = await page.locator('#stepQuestion').textContent();

    await page.locator('.option-btn', { hasText: 'Computador lento' }).click();
    await page.locator('.option-btn', { hasText: 'Lento o tempo todo, em tudo' }).click();
    await page.locator('.option-btn', { hasText: 'Sempre foi lento (desde que comprei)' }).click();

    await page.locator('#restartDiagnostic').click();

    await expect(page.locator('#step-result')).toHaveClass(/hidden/);
    await expect(page.locator('#step-question')).not.toHaveClass(/hidden/);
    expect(await page.locator('#stepQuestion').textContent()).toBe(initial);
    await expect(page.locator('#backBtn')).toHaveClass(/hidden/);
  });

  // ── Fluxo alternativo: Tela azul ─────────────────────────────────────────
  test('caminho "Tela azul" chega a um diagnóstico', async ({ page }) => {
    await page.locator('.option-btn', { hasText: 'Tela azul' }).click();
    await page.locator('.option-btn', { hasText: 'Aleatoriamente durante o uso' }).click();
    await page.locator('.option-btn', { hasText: 'Varias vezes ao dia' }).click();

    await expect(page.locator('#step-result')).not.toHaveClass(/hidden/);
    await expect(page.locator('#resultDiagnosis')).not.toBeEmpty();
  });
});
