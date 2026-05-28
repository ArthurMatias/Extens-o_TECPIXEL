import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'];

/**
 * Filtra apenas violações de impacto crítico ou sério.
 * Violações "moderate" e "minor" são registradas mas não bloqueiam.
 */
function criticalAndSerious(violations) {
  return violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
}

function formatViolations(violations) {
  return violations
    .map((v) => `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n) => n.html).join(', ')}`)
    .join('\n');
}

test.describe('Acessibilidade — WCAG 2.1 AA (axe-core)', () => {
  test('página inicial sem violações críticas/sérias', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .analyze();

    const blocking = criticalAndSerious(results.violations);

    if (results.violations.length > 0) {
      console.log('\n── Violações de acessibilidade encontradas ──');
      console.log(formatViolations(results.violations));
    }

    expect(blocking, `Violações críticas/sérias:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  test('modal LGPD aberto sem violações críticas/sérias', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).not.toHaveClass(/hidden/);

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include('#lgpdModal')
      .analyze();

    const blocking = criticalAndSerious(results.violations);
    expect(blocking, `Violações críticas/sérias no modal:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  test('tela de diagnóstico em progresso sem violações críticas/sérias', async ({ page }) => {
    await page.goto('/');
    await page.locator('.option-btn', { hasText: 'Sem internet' }).click();

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include('#diagnosticCard')
      .analyze();

    const blocking = criticalAndSerious(results.violations);
    expect(blocking, `Violações críticas/sérias no diagnóstico:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  test('tela de resultado sem violações críticas/sérias', async ({ page }) => {
    await page.goto('/');
    await page.locator('.option-btn', { hasText: 'Computador lento' }).click();
    await page.locator('.option-btn', { hasText: 'Lento o tempo todo, em tudo' }).click();
    await page.locator('.option-btn', { hasText: 'Sempre foi lento (desde que comprei)' }).click();
    await expect(page.locator('#step-result')).not.toHaveClass(/hidden/);

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .include('#step-result')
      .analyze();

    const blocking = criticalAndSerious(results.violations);
    expect(blocking, `Violações críticas/sérias no resultado:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  // ── Navegação por teclado ─────────────────────────────────────────────────
  test('opções do diagnóstico são focáveis via Tab', async ({ page }) => {
    await page.goto('/');

    // Tab até chegar em uma opção
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.className || '');
      if (focused.includes('option-btn')) break;
    }

    const activeClass = await page.evaluate(() => document.activeElement?.className || '');
    expect(activeClass).toContain('option-btn');
  });

  test('opção do diagnóstico é ativável via Enter', async ({ page }) => {
    await page.goto('/');
    const initialQuestion = await page.locator('#stepQuestion').textContent();

    // Foca a primeira opção e pressiona Enter
    await page.locator('.option-btn').first().focus();
    await page.keyboard.press('Enter');

    // Pergunta deve mudar (navegou para sub-pergunta ou resultado)
    const newQuestion = await page.locator('#stepQuestion').textContent();
    const resultVisible = await page.locator('#step-result').evaluate(
      (el) => !el.classList.contains('hidden')
    );
    expect(newQuestion !== initialQuestion || resultVisible).toBe(true);
  });

  test('botão LGPD no rodapé é acessível via teclado', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lgpdBtn').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lgpdModal')).not.toHaveClass(/hidden/);
  });

  test('Escape fecha o modal quando o foco está dentro', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lgpdBtn').click();
    await page.locator('#lgpdModalClose').focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('#lgpdModal')).toHaveClass(/hidden/);
  });

  // ── Contraste e legibilidade ──────────────────────────────────────────────
  test('sem violações de contraste de cor', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .withRules(['color-contrast'])
      .analyze();

    const blocking = criticalAndSerious(results.violations);
    expect(blocking, `Problemas de contraste:\n${formatViolations(blocking)}`).toHaveLength(0);
  });

  // ── Mobile ────────────────────────────────────────────────────────────────
  test('sem violações em viewport mobile', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Teste mobile apenas no Chromium');

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .analyze();

    const blocking = criticalAndSerious(results.violations);
    expect(blocking, `Violações mobile:\n${formatViolations(blocking)}`).toHaveLength(0);
  });
});
