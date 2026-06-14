# TECPIXEL — Guia de Desenvolvimento

## Sobre o projeto
Ferramenta educacional de diagnóstico de hardware/software para computadores. SPA (Single Page Application) em **React + Vite + TypeScript**, sem backend, sem banco de dados. Linguagem da interface: português (pt-BR).

## Stack
- **React 18** + **TypeScript** (strict)
- **Vite** (build e dev server)
- CSS puro (sem framework de estilo) em `src/index.css`
- Sem backend, sem persistência de dados do usuário

### Comandos
```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento (Vite, porta 8080)
npm run build      # build de produção (gera dist/)
npm run preview    # servir o build de produção (porta 8080)
npm run typecheck  # checagem de tipos (tsc --noEmit)
npm run lint:js    # ESLint (src/**/*.{ts,tsx})
npm run lint:css   # Stylelint (src/**/*.css)
npm run test:lgpd  # checagem estática de conformidade LGPD
npm run test:e2e   # testes E2E + acessibilidade (Playwright)
```

## Conformidade LGPD — OBRIGATÓRIO

**Todo código, funcionalidade ou conteúdo adicionado deve estar em conformidade com a LGPD (Lei 13.709/2018).**

A skill completa está em `.claude/skills/lgpd.md`. Consulte-a sempre antes de implementar qualquer mudança.

### Regras inegociáveis:
1. **Minimização de dados** — coletar apenas o estritamente necessário
2. **Consentimento explícito** — opt-in para qualquer coleta de dados ou cookie não essencial; nunca opt-out
3. **Transparência** — todo tratamento de dados deve ser informado no aviso de privacidade
4. **Privacy by Design** — segurança e privacidade são requisitos, não afterthoughts
5. **Sem dados sensíveis** sem base legal expressa e consentimento específico
6. **Sem fingerprinting** de navegador sem consentimento
7. **Terceiros** — documentar cada serviço externo no aviso de privacidade (atualmente: Google Fonts)

### Checklist antes de qualquer commit:
- [ ] Não há coleta de dados pessoais sem base legal
- [ ] Dados pessoais não aparecem em `console.log` ou logs de erro
- [ ] Cookies/storage não essenciais só são definidos após consentimento
- [ ] Conteúdo dinâmico usa renderização JSX (escapada); nunca `dangerouslySetInnerHTML` com dados do usuário
- [ ] Novos terceiros foram adicionados ao aviso de privacidade
- [ ] `npm run test:lgpd` passa sem erros bloqueantes

## Estrutura do projeto
```
index.html                  — Shell do Vite (div#root + script para main.tsx)
src/
  main.tsx                  — Entrypoint React (HashRouter)
  App.tsx                   — Shell: Header + Routes + Footer + modal LGPD + FAB
  index.css                 — Estilos e layout responsivo
  types.ts                  — Tipos do diagnóstico (QuestionNode, ResultNode, DiagnosticNode)
  data/
    diagnosticTree.ts       — Árvore de diagnóstico (dados)
    faq.ts                  — Respostas do FAQ (dados)
    computerParts.ts        — Peças do game (CPU, RAM, GPU, SSD, fonte, cooler)
  pages/                    — Componentes de rota (react-router-dom)
    HomePage.tsx            — Rota "/": Hero + Diagnóstico + Quem Somos
    MontarPCPage.tsx        — Rota "/montar-pc": game drag-and-drop (@dnd-kit)
  components/
    Header.tsx              — Cabeçalho, navegação (rotas + âncoras), menu mobile, scroll spy
    Hero.tsx                — Seção inicial
    Diagnostic.tsx          — Diagnóstico interativo (pergunta → resultado)
    QuemSomos.tsx           — Equipe
    Footer.tsx              — Rodapé + botão do aviso de privacidade
    LgpdModal.tsx           — Modal do Aviso de Privacidade (LGPD)
    ContactWidget.tsx       — Botão flutuante + painel de FAQ/contato
    MotherboardSVG.tsx      — Placa-mãe decorativa em pixel art (fundo do game)
    PixelArt.tsx            — Ícones de hardware em pixel art (CPU, RAM, …)
    InstagramIcon.tsx       — Ícone SVG reutilizável
tests/
  e2e/                      — Testes Playwright (smoke, diagnóstico, game, navegação, LGPD, a11y)
  lgpd/compliance.js        — Checagem estática de LGPD
```

### Roteamento
SPA com `react-router-dom` (`HashRouter` — rotas no `#`, ex.: `…/#/montar-pc`). Rotas: `/` (HomePage) e `/montar-pc` (game). Header/Footer/FAB/modal LGPD são o shell compartilhado entre as rotas. Páginas (componentes de rota) ficam em `src/pages/`; componentes reutilizáveis em `src/components/`. **Por que HashRouter + `base: './'` (vite.config):** o build roda em qualquer host estático (raiz, subcaminho, GitHub Pages, file://) sem fallback de SPA — assets relativos evitam 404/tela-branca e o roteamento por `#` sobrevive a reload. **Consequência:** não use âncoras de URL (`href="#secao"`) para rolagem — o `#` é do roteador; role via JS (`scrollIntoView`).

### Drag-and-drop (game)
O game usa `@dnd-kit/core` com `PointerSensor` + `TouchSensor` e `collisionDetection={pointerWithin}` (o encaixe segue a posição do ponteiro; soltar em área vazia não pune). A montagem é **sequenciada** como na vida real: trava do socket → CPU → trava → cooler; RAM/GPU/cabos são livres. **Sempre** ofereça a alternativa por ponteiro único/teclado (clicar para selecionar → clicar no encaixe) ao lado do arraste — exigência WCAG 2.5.7. **Atenção:** o dnd-kit mede droppables ignorando transforms CSS — posicione drop zones com `left/top` calculados, nunca com `translate(-50%,-50%)`.

## Convenções de código
- **TypeScript strict**: tipar dados e props; evitar `any`
- **Renderização segura**: o JSX escapa texto por padrão — prefira `{valor}`. NUNCA use `dangerouslySetInnerHTML` com dados do usuário
- Links externos: sempre `target="_blank" rel="noopener noreferrer"`
- Dados (árvore de diagnóstico, FAQ, peças) ficam em `src/data/`, separados dos componentes
- Reaproveitar IDs/classes do CSS existente ao criar/alterar componentes
- Comentários somente quando o "porquê" não é óbvio pelo código

## Design System — OBRIGATÓRIO

**Toda página, função ou seção visual nova deste projeto deve seguir o design system documentado em [`docs/design-system.md`](docs/design-system.md).** Não é guia opcional — é a referência autoritativa de tokens, componentes, padrões de layout, iconografia (incluindo o estilo pixel-art para hardware) e tom de linguagem (adulto x infantil).

Antes de criar qualquer feature nova, consulte o **checklist final** do design system (seção 10). Se alguma regra atrapalhar, justifique no PR — não desabilite silenciosamente.

## CI/CD
Pipeline em `.github/workflows/ci.yml` roda em todo PR e push para `main`:
`lint-js`, `lint-css`, `typecheck`, `build`, `lgpd-compliance`, `security-audit`, `e2e-tests` (Playwright + axe), `lighthouse`. O job `all-checks` é o gate final.
