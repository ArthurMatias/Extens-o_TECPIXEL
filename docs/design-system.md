# TECPIXEL — Design System

> Documento autoritativo. **Toda nova página, componente, seção ou função visual deste projeto deve seguir este sistema.** Qualquer desvio precisa de justificativa explícita.

O objetivo é manter coerência visual, acessibilidade WCAG 2.1 AA e conformidade LGPD em todo o produto, sem reinventar padrões a cada feature.

---

## 1. Princípios

1. **Educativo primeiro** — todo elemento ensina ou orienta. Nada decorativo sem propósito.
2. **Acessível por padrão** — contraste AA, foco visível, semântica correta, suporte a teclado.
3. **Privacy-safe** — sem dados pessoais em estado, logs ou analytics. JSX escapa por padrão; nunca `dangerouslySetInnerHTML` com dados do usuário.
4. **Dois registros de linguagem**:
   - **Padrão (adulto)**: claro, direto, sem jargão desnecessário.
   - **Infantil**: analogias do cotidiano, frases curtas, primeira pessoa quando ajuda.
5. **Sem dependências de design externas** — mantemos CSS puro com variáveis em `src/index.css`.

---

## 2. Tokens

Todos os tokens vivem como variáveis CSS no `:root` de [`src/index.css`](../src/index.css). **Sempre referencie pela variável**, nunca hex inline em componentes de UI (a única exceção é pixel art representando hardware real — ver §5.2).

### 2.1 Cores

| Token | Valor | Uso |
|---|---|---|
| `--white` | `#ffffff` | fundo padrão |
| `--gray-50` … `--gray-900` | escala de cinzas | textos, fundos secundários, bordas |
| `--blue-500` / `--blue-600` / `--blue-700` | azul de marca | CTAs, links, destaques |
| `--blue-50` / `--blue-100` | azul claro | fundos suaves, badges |

**Regra de contraste**:
- Texto sobre fundo claro: mínimo `--gray-600` (passa 4.5:1 sobre `--gray-50`).
- Texto sobre fundo escuro (`--gray-900`): mínimo `--gray-400`.
- Nunca `--gray-400` sobre `--gray-50` (falha 4.5:1 — verificado por axe).

### 2.2 Tipografia

- Família: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- Pesos disponíveis: 400, 500, 600, 700, 800
- Hierarquia:
  - `h1` em hero: 2.5–3rem, peso 800
  - `h2` de seção: ~2rem, peso 700
  - `h3` interno: ~1.25rem, peso 600
  - `h4` cartões: ~1rem, peso 600
  - body: 1rem, line-height 1.6
  - small: 0.8–0.9rem para metadados

### 2.3 Espaçamento

Grade implícita de **8px**. Use múltiplos: 8, 16, 24, 32, 48, 64, 80.

### 2.4 Raios

| Token | Uso |
|---|---|
| `--radius-sm` (8px) | botões pequenos, badges |
| `--radius` (12px) | cards, botões padrão |
| `--radius-lg` (16px) | seções destacadas |
| `--radius-full` (9999px) | pills, FABs, avatars circulares |

### 2.5 Sombras

`--shadow-sm` → `--shadow` → `--shadow-md` → `--shadow-lg` → `--shadow-xl`.

Regra: elementos flutuantes (FAB, modal, painel) usam `--shadow-lg` ou `--shadow-xl`. Cards em repouso usam `--shadow-sm` ou nenhuma.

---

## 3. Layout

### 3.1 Container

Todo conteúdo principal vive dentro de `.container` (max-width 1120px, padding lateral 24px).

### 3.2 Seções

Cada seção temática usa `<section className="section" id="ancora">`. Alternância visual usando `.section-gray` para fundo claro suave (`--gray-50`).

**Padrão obrigatório de seção**:

```tsx
<section className="section section-gray" id="ancora-da-secao">
  <div className="container">
    <div className="section-header">
      <h2>Título da Seção</h2>
      <p>Subtítulo curto explicando o propósito.</p>
    </div>
    {/* conteúdo */}
  </div>
</section>
```

A `id` da seção deve ser kebab-case em pt-BR (sem acentos: `montar-pc`, `quem-somos`).

### 3.3 Navegação

Toda seção principal deve ter um link correspondente em `NAV_LINKS` no [`Header.tsx`](../src/components/Header.tsx). O scroll spy do Header marca `active` automaticamente. Use `scroll-padding-top: 80px` já configurado no `:root`.

---

## 4. Componentes recorrentes

### 4.1 Botão

```tsx
<button className="btn btn-primary">Texto</button>
<button className="btn btn-primary btn-lg">CTA grande</button>
<button className="btn btn-ghost">Secundário</button>
<button className="btn btn-ghost btn-sm">Pequeno</button>
<button className="btn btn-ghost btn-back">← Voltar</button>
```

Regras:
- Sempre use `<button>` (nunca `<div onClick>`) para clicáveis.
- `aria-label` obrigatório quando o botão tem só ícone.
- Foco visível obrigatório (já no CSS).

### 4.2 Card

Padrão de card claro: `border-radius: var(--radius)`, `background: var(--white)`, `box-shadow: var(--shadow-sm)`, `padding: 24-32px`.

Variações nomeadas existentes: `.diagnostic-card`, `.team-card`, `.video-card`, `.part-card`, `.info-card`.

### 4.3 Badge

`.step-badge` para rotular contexto (categoria, etapa). Pill com `--radius-full`, fundo `--blue-100`, texto `--blue-700`.

### 4.4 Progress bar

```tsx
<div className="progress-bar">
  <div className="progress-fill" style={{ width: `${pct}%` }} />
</div>
<div className="progress-text">{texto}</div>
```

A cor do texto deve ser `--gray-600` (contraste sobre `--gray-50`).

### 4.5 Modal

Estrutura obrigatória para modais:
- Overlay com `role="dialog"`, `aria-modal="true"`, `aria-labelledby="..."`.
- Conteúdo com header (h2 + botão de fechar) + body.
- Fechar via: clique no overlay, botão `×`, tecla `Escape`.
- A classe `hidden` controla visibilidade.

### 4.6 Painel flutuante / FAB

Para ferramentas auxiliares (contato, dúvidas). FAB no canto inferior-direito, painel anexo com header + body. Fecha ao clicar fora.

---

## 5. Iconografia

### 5.1 Ícones de interface

SVG inline, `width`/`height` em pixels, `fill="currentColor"` para herdar a cor do contexto, `aria-hidden="true"` quando puramente decorativo.

### 5.2 Pixel art — peças de hardware

Convenção para representar componentes reais (CPU, RAM, GPU…) em estilo retrô:

- `viewBox="0 0 32 32"` (ou múltiplo) para todos os ícones
- `shapeRendering="crispEdges"` obrigatório (sem anti-aliasing)
- **Apenas `<rect>`** — sem curvas, paths ou círculos
- Paleta limitada (~3-5 cores por peça), refletindo a aparência real do hardware
- Tamanho de renderização: 48-96px (ampliado mostra os "pixels")

Esta convenção centraliza a estética lúdica do game e qualquer ícone futuro de hardware.

---

## 6. Padrões de página educativa

Toda página/seção com objetivo de ensinar deve ter:

1. **Título claro** explicando o que se aprende.
2. **Subtítulo de uma frase** dizendo como.
3. **Indicador de progresso** quando houver passos (`.progress-bar`).
4. **Conteúdo principal interativo**.
5. **Card de explicação** com a estrutura:
   - Nome do conceito
   - **Analogia infantil** (uma linha, com emoji opcional)
   - **Nota técnica curta** (uma linha)
   - **Importância** (o que acontece sem isso)
6. **Botão de reiniciar/recomeçar** quando aplicável.
7. **Feedback de conclusão** (celebração) ao terminar.

---

## 7. Linguagem

### 7.1 Tom padrão (adulto)
- Direto, segunda pessoa: "Você consegue", "Verifique se…".
- Português brasileiro neutro.
- Termos técnicos só quando necessários e sempre explicados na primeira ocorrência.

### 7.2 Tom infantil
- Frases curtas (até ~15 palavras).
- Analogias do cotidiano: "É o cérebro", "É a mochila", "É o coração".
- Emojis no início de frases-chave (🧠 cérebro, 🎒 mochila, ❤️ coração) — moderado, no máximo 1 por bloco.
- Curiosidades em forma de pergunta ou comparação ("Você sabia que…?").
- Evite negações complexas; prefira a forma afirmativa.

---

## 8. Acessibilidade (WCAG 2.1 AA)

Cada componente novo deve passar pelos checks já automatizados:

- `npm run test:e2e` roda axe-core filtrando severity ≥ serious.
- **Contraste** mínimo 4.5:1 para texto normal, 3:1 para texto grande.
- Todo `<button>` clicável tem texto visível ou `aria-label`.
- Conteúdo dinâmico que muda em resposta a ação do usuário deve usar `aria-live="polite"` quando relevante para leitor de tela.
- Foco visível: nunca remover `outline` sem substituir.
- SVGs decorativos: `aria-hidden="true"`. SVGs informativos: `<title>` interno + `role="img"`.

---

## 9. LGPD (Lei 13.709/2018)

Sempre que criar página/componente novo:

- **Não coletar** dados pessoais sem base legal (Art. 7º) — este projeto opera no princípio da minimização absoluta (zero coleta).
- **Não usar** `dangerouslySetInnerHTML` com qualquer dado externo (usuário, URL, querystring, storage).
- **Links externos** sempre `target="_blank" rel="noopener noreferrer"`.
- **Terceiros novos** (CDN, analytics, fonte, SDK) → adicionar ao Aviso de Privacidade em [`LgpdModal.tsx`](../src/components/LgpdModal.tsx) ANTES de fazer merge.
- **Storage** (localStorage/sessionStorage/cookies) não essencial → exige consentimento opt-in.
- **Logs**: nunca `console.log(props)` ou `console.error(state)` com dados pessoais.

Detalhes completos em [`.claude/skills/lgpd.md`](../.claude/skills/lgpd.md). O job `lgpd-compliance` na CI bloqueia merges que violem essas regras.

---

## 9b. Roteamento e páginas

O projeto é uma SPA com `react-router-dom` usando **`HashRouter`** (rotas no `#`, ex.: `…/#/montar-pc`) e **`base: './'`** no `vite.config.ts`.

- **Por quê:** o build precisa rodar em qualquer hospedagem estática (raiz de domínio, subcaminho como GitHub Pages `/<repo>/`, subpasta, `file://`) sem fallback de SPA. Caminho de asset absoluto (`/assets/...`) dá 404 em subcaminho → tela branca; `HashRouter` evita 404 de rota no reload. Não reverter para `BrowserRouter` sem reintroduzir `base`/`basename`/`404.html`.
- **Componentes de rota** (uma tela inteira) ficam em `src/pages/` — ex.: `HomePage.tsx`, `MontarPCPage.tsx`. **Componentes reutilizáveis** ficam em `src/components/`.
- O shell compartilhado (Header, Footer, FAB de contato, modal LGPD) vive no `App.tsx` e envolve o `<Routes>`, aparecendo em todas as páginas.
- Links de navegação para outra rota usam `<Link to="/rota">`. **Rolagem para seções NÃO usa âncora de URL** (`href="#id"`) — o `#` pertence ao roteador; role via JS (`document.getElementById(id)?.scrollIntoView()`), e vindo de outra rota navegue para `/` com `state.scrollTo` (a `HomePage` rola no mount).
- Toda rota nova deve ser adicionada ao `<Routes>` no `App.tsx` e (se for destino principal) ao `Header`.

### Drag-and-drop

Para interações de arrastar (ex.: o game), use `@dnd-kit/core`:
- Sensores: `PointerSensor` (`activationConstraint.distance: 8`) + `TouchSensor` (`delay: 150, tolerance: 8`). `touch-action: none` **apenas** na peça arrastável, nunca no container.
- `collisionDetection={pointerWithin}` — o encaixe segue o ponteiro; soltar fora de qualquer alvo é snap-back sem punição.
- **Armadilha real**: o dnd-kit mede droppables com `ignoreTransform: true`. Drop zones posicionadas com `transform: translate(-50%,-50%)` têm o retângulo medido deslocado meia-largura/meia-altura do visual. Posicione com `left/top` calculados (centro − metade do tamanho) e reserve `transform` só para animações de feedback (`scale`), que não afetam a medição feita no início do arraste.
- Dicas pulsantes em alvos clicáveis devem animar `box-shadow` (brilho), não `transform` — animação de geometria torna o elemento "instável" para testes e desloca o alvo de clique.
- `DragOverlay` para o preview (snap-back automático); `dropAnimation={null}` sob `prefers-reduced-motion`.
- **Obrigatório (WCAG 2.5.7)**: oferecer alternativa por ponteiro único/teclado — clicar para selecionar a peça → clicar no encaixe. O arraste é melhoria, não o único caminho.
- Mensagens de acerto/erro em região `aria-live`. Devolver o foco ao encaixe preenchido após soltar.
- Para fluxos com ordem real (ex.: trava → CPU → cooler), bloqueie pela mecânica com mensagens educativas — nunca esconda a peça nem puna a tentativa.

## 10. Como criar uma nova seção/feature

Checklist obrigatório:

- [ ] Componente de tela em `src/pages/` (rota) ou reutilizável em `src/components/`, PascalCase?
- [ ] Tipou tudo (`interface Props`, dados em `src/data/*.ts`)?
- [ ] Usou variáveis CSS do design system — nada hex inline em UI?
- [ ] Reaproveitou classes existentes (`.section`, `.container`, `.btn`, `.card`…)?
- [ ] Wrap em `<section className="section" id="ancora">` com `section-header`?
- [ ] Adicionou ao `NAV_LINKS` em `Header.tsx` se for seção principal?
- [ ] Botões com texto visível ou `aria-label`?
- [ ] Conteúdo dinâmico com `aria-live` quando apropriado?
- [ ] `npm run typecheck && npm run lint:js && npm run lint:css && npm run test:lgpd` passam?
- [ ] `npm run test:e2e` continua verde (incluindo axe)?
- [ ] `npm run build` gera bundle sem warnings?
- [ ] Texto educativo segue o tom apropriado (padrão ou infantil)?
- [ ] Se introduziu peça/ícone de hardware: SVG em pixel art conforme §5.2?

Se algum item falhar, **corrija antes do commit** — não desabilite checks.
