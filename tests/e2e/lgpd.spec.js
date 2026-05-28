import { test, expect } from '@playwright/test';

test.describe('LGPD — privacidade e conformidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Modal de Aviso de Privacidade ─────────────────────────────────────────
  test('modal de privacidade está oculto ao carregar', async ({ page }) => {
    await expect(page.locator('#lgpdModal')).toHaveClass(/hidden/);
  });

  test('botão LGPD no rodapé abre o modal', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).not.toHaveClass(/hidden/);
  });

  test('modal fecha ao clicar no botão X', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).not.toHaveClass(/hidden/);

    await page.locator('#lgpdModalClose').click();
    await expect(page.locator('#lgpdModal')).toHaveClass(/hidden/);
  });

  test('modal fecha ao clicar no overlay (fora do conteúdo)', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).not.toHaveClass(/hidden/);

    // Clica no overlay (canto superior esquerdo do modal, fora do .lgpd-modal)
    await page.locator('#lgpdModal').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#lgpdModal')).toHaveClass(/hidden/);
  });

  test('modal fecha ao pressionar Escape', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).not.toHaveClass(/hidden/);

    await page.keyboard.press('Escape');
    await expect(page.locator('#lgpdModal')).toHaveClass(/hidden/);
  });

  // ── Conteúdo do modal ─────────────────────────────────────────────────────
  test('modal contém número da lei (13.709/2018)', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).toContainText('13.709/2018');
  });

  test('modal cita o Google Fonts como terceiro', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).toContainText('Google Fonts');
  });

  test('modal menciona transferência de endereço IP', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).toContainText('IP');
  });

  test('modal menciona base legal (legítimo interesse)', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).toContainText('legítimo interesse');
  });

  test('modal menciona direitos do titular (Art. 18)', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    await expect(page.locator('#lgpdModal')).toContainText('Art. 18');
  });

  test('modal tem canal de contato da equipe', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    // Instagram é o canal de contato declarado
    await expect(page.locator('#lgpdModal')).toContainText(/instagram/i);
  });

  test('modal tem atributo role="dialog" para acessibilidade', async ({ page }) => {
    await expect(page.locator('#lgpdModal')).toHaveAttribute('role', 'dialog');
  });

  test('modal tem aria-modal="true"', async ({ page }) => {
    await expect(page.locator('#lgpdModal')).toHaveAttribute('aria-modal', 'true');
  });

  test('modal tem aria-labelledby apontando para o título', async ({ page }) => {
    await page.locator('#lgpdBtn').click();
    const labelledBy = await page.locator('#lgpdModal').getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    await expect(page.locator(`#${labelledBy}`)).toBeVisible();
  });

  // ── Links externos ────────────────────────────────────────────────────────
  test('todos os links externos têm rel="noopener"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      const href = await externalLinks.nth(i).getAttribute('href');
      expect(rel, `Link "${href}" deve ter rel="noopener"`).toContain('noopener');
    }
  });

  test('sem scripts de terceiros não declarados no aviso', async ({ page }) => {
    const thirdPartyScripts = await page.evaluate(() => {
      const allowed = ['fonts.googleapis.com', 'fonts.gstatic.com'];
      const origin = window.location.origin;
      return Array.from(document.querySelectorAll('script[src]'))
        .map((s) => s.src)
        // Ignora scripts da própria origem (bundle/Vite dev) — só sinaliza terceiros externos
        .filter((src) => !src.startsWith(origin) && !allowed.some((host) => src.includes(host)));
    });
    expect(thirdPartyScripts).toHaveLength(0);
  });

  test('sem cookies de rastreamento no carregamento inicial', async ({ page }) => {
    const cookies = await page.context().cookies();
    const trackingCookies = cookies.filter((c) =>
      /^(_ga|_gid|_fbp|_utm|gtag)/.test(c.name)
    );
    expect(trackingCookies).toHaveLength(0);
  });

  test('sem dados pessoais no localStorage ao carregar', async ({ page }) => {
    const localStorageData = await page.evaluate(() => {
      const result = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        result[key] = localStorage.getItem(key);
      }
      return result;
    });
    // O projeto não deve armazenar nada no localStorage por padrão
    expect(Object.keys(localStorageData)).toHaveLength(0);
  });

  // ── Painel de contato/FAQ ─────────────────────────────────────────────────
  test('painel de contato abre e fecha', async ({ page }) => {
    await expect(page.locator('#contactPanel')).toHaveClass(/hidden/);

    await page.locator('#contactFab').click();
    await expect(page.locator('#contactPanel')).not.toHaveClass(/hidden/);

    await page.locator('#contactClose').click();
    await expect(page.locator('#contactPanel')).toHaveClass(/hidden/);
  });

  test('FAQ exibe respostas ao clicar nas perguntas', async ({ page }) => {
    await page.locator('#contactFab').click();

    await page.locator('.faq-btn').first().click();
    await expect(page.locator('#faqAnswer')).not.toHaveClass(/hidden/);
    await expect(page.locator('#faqAnswerText')).not.toBeEmpty();

    await page.locator('#faqBack').click();
    await expect(page.locator('#faqList')).not.toHaveClass(/hidden/);
    await expect(page.locator('#faqAnswer')).toHaveClass(/hidden/);
  });
});
