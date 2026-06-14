# TECPIXEL

Ferramenta educacional sobre hardware/software de computadores, com duas experiências:

- **Diagnóstico interativo** (`/`) — o usuário responde a um passo a passo de perguntas e recebe um diagnóstico com explicação, solução, vídeo tutorial e dica de prevenção.
- **Monte seu Computador** (`/montar-pc`) — um game em **pixel art** onde se monta uma placa-mãe peça por peça, na ordem real (levantar a trava do socket → encaixar a CPU → fechar a trava → cooler → memórias → placa de vídeo → cabos da fonte), por arraste ou por clique. Cada peça é explicada de forma lúdica, voltada também a crianças.

É uma **SPA (Single Page Application)** — roda inteiramente no navegador, **sem backend** e **sem coletar dados pessoais**. Interface em português (pt-BR).

---

## Stack

| Camada | Tecnologia |
|---|---|
| UI | React 18 |
| Linguagem | TypeScript (strict) |
| Build / Dev server | Vite 5 |
| Estilo | CSS puro (`src/index.css`) |
| Testes E2E | Playwright + axe-core (acessibilidade) |
| Qualidade | ESLint, Stylelint, Lighthouse CI |
| Conformidade | Checker estático de LGPD |

---

## Pré-requisitos

- **Node.js 20+** e **npm**
- Para rodar os testes E2E localmente, os navegadores do Playwright:
  ```bash
  npx playwright install
  ```

---

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Subir o servidor de desenvolvimento (http://localhost:8080)
npm run dev
```

Abra **http://localhost:8080** no navegador. O Vite recarrega automaticamente ao salvar arquivos (HMR).

### Build de produção

```bash
npm run build      # gera a pasta dist/
npm run preview    # serve o build em http://localhost:8080
```

A pasta `dist/` é estática e **funciona em qualquer hospedagem de sites estáticos sem nenhuma configuração extra** — raiz de domínio, subcaminho (ex.: GitHub Pages em `/<repo>/`), subpasta ou até abrindo o `index.html` localmente.

> **Por que funciona em todo lugar.** O build usa `base: './'` (assets com caminho **relativo**, evitando 404 que deixa a tela branca em subcaminhos) e `HashRouter` (rotas no `#`, ex.: `…/#/montar-pc`), que dispensa fallback de SPA do servidor — recarregar ou compartilhar um link de rota funciona em qualquer host estático, inclusive GitHub Pages.

---

## Estrutura do projeto

```
.
├── index.html                  # Shell do Vite (div#root + <script> para main.tsx)
├── vite.config.ts              # Configuração do Vite (porta 8080)
├── tsconfig.json               # Configuração do TypeScript
├── index.html                  # Shell do Vite (div#root + script para main.tsx)
├── src/
│   ├── main.tsx                # Entrypoint React (HashRouter)
│   ├── App.tsx                 # Shell: Header + Routes + Footer + modal LGPD + FAB
│   ├── index.css               # Estilos e layout responsivo
│   ├── types.ts                # Tipos do diagnóstico (QuestionNode, ResultNode…)
│   ├── data/
│   │   ├── diagnosticTree.ts   # Árvore de diagnóstico (dados das perguntas/resultados)
│   │   ├── faq.ts              # Respostas do FAQ
│   │   └── computerParts.ts    # Peças e textos do game (CPU, RAM, GPU, cooler, cabos…)
│   ├── pages/                  # Componentes de rota (react-router-dom)
│   │   ├── HomePage.tsx        # Rota "/": Hero + Diagnóstico + Quem Somos
│   │   └── MontarPCPage.tsx    # Rota "/montar-pc": game drag-and-drop (@dnd-kit)
│   └── components/
│       ├── Header.tsx          # Cabeçalho, navegação (rotas + âncoras), menu mobile
│       ├── Hero.tsx            # Seção inicial
│       ├── Diagnostic.tsx      # Diagnóstico interativo (pergunta → resultado)
│       ├── QuemSomos.tsx       # Equipe do projeto
│       ├── Footer.tsx          # Rodapé + botão do Aviso de Privacidade
│       ├── LgpdModal.tsx       # Modal do Aviso de Privacidade (LGPD)
│       ├── ContactWidget.tsx   # Botão flutuante + painel de FAQ/contato
│       ├── MotherboardSVG.tsx  # Placa-mãe decorativa em pixel art (fundo do game)
│       ├── PixelArt.tsx        # Ícones de hardware em pixel art
│       └── InstagramIcon.tsx   # Ícone SVG reutilizável
├── tests/
│   ├── e2e/                    # Playwright: smoke, diagnostic, game, navigation, lgpd, accessibility
│   └── lgpd/compliance.js      # Checagem estática de conformidade LGPD
├── .github/workflows/ci.yml    # Pipeline de CI (roda em cada PR)
├── lighthouserc.json           # Metas do Lighthouse CI
├── playwright.config.ts        # Configuração dos testes E2E
└── .claude/skills/lgpd.md      # Skill de conformidade LGPD (guia detalhado)
```

### Como o diagnóstico funciona

A lógica é guiada por dados: `src/data/diagnosticTree.ts` é uma árvore onde cada nó é uma **pergunta** (tem `options`) ou um **resultado** (tem `diagnosis`). O componente `Diagnostic.tsx` percorre essa árvore conforme os cliques do usuário, mantendo um histórico para o botão "Voltar". Para adicionar/editar diagnósticos, basta alterar os dados em `src/data/` — sem mexer nos componentes.

### Como o game funciona

`src/pages/MontarPCPage.tsx` usa `@dnd-kit/core` para arrastar peças até encaixes sobre a placa-mãe (`MotherboardSVG`), com alternativa por clique (clicar na peça → "Encaixar aqui") para acessibilidade. A montagem é **sequenciada** (trava → CPU → trava → cooler; RAM/GPU/cabos livres) e o conteúdo de cada peça vem de `src/data/computerParts.ts` — editar lá adiciona/altera peças e explicações.

---

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 8080) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build de produção (porta 8080) |
| `npm run typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `npm run lint:js` | ESLint em `src/**/*.{ts,tsx}` |
| `npm run lint:css` | Stylelint em `src/**/*.css` |
| `npm run test:lgpd` | Checagem estática de conformidade LGPD |
| `npm run test:e2e` | Testes E2E + acessibilidade (Playwright) |
| `npm run lhci` | Lighthouse CI (requer `npm run build` antes) |

---

## Testes e qualidade

```bash
npm run typecheck      # tipos
npm run lint:js        # qualidade do TS/TSX
npm run lint:css       # qualidade do CSS
npm run test:lgpd      # conformidade LGPD
npm run test:e2e       # E2E + acessibilidade (precisa de npx playwright install)
```

Os testes E2E sobem o servidor do Vite automaticamente e cobrem:
- **smoke** — estrutura e carregamento da página
- **diagnostic** — fluxo completo do diagnóstico, navegação e reinício
- **lgpd** — modal de privacidade, ausência de cookies/storage de rastreamento, links externos seguros
- **accessibility** — varredura WCAG 2.1 AA com axe-core (página, modal, resultado, mobile)

---

## CI/CD

A cada **pull request** e push para `main`, o GitHub Actions (`.github/workflows/ci.yml`) executa, em paralelo:

| Job | Verifica |
|---|---|
| `lint-js` | ESLint (TS/TSX) |
| `lint-css` | Stylelint |
| `typecheck` | Tipos TypeScript |
| `build` | Build de produção (Vite) |
| `lgpd-compliance` | Conformidade com a Lei 13.709/2018 |
| `security-audit` | Vulnerabilidades de dependências (`npm audit`) |
| `e2e-tests` | Playwright + axe (Chromium, Firefox, mobile) |
| `lighthouse` | Performance, acessibilidade e SEO |

O job `all-checks` é o **gate final**: o PR só é considerado verde se todos passarem.

---

## Conformidade LGPD

Este projeto segue obrigatoriamente a **LGPD (Lei 13.709/2018)**. O guia completo está em [`.claude/skills/lgpd.md`](.claude/skills/lgpd.md) e o resumo em [`CLAUDE.md`](CLAUDE.md).

Pontos principais:
- Não coleta, armazena nem compartilha dados pessoais.
- Único terceiro: **Google Fonts** (transfere o IP ao Google) — documentado no Aviso de Privacidade com base legal de legítimo interesse.
- Renderização sempre via JSX (escapado); proibido `dangerouslySetInnerHTML` com dados do usuário.
- O job `lgpd-compliance` da CI bloqueia o merge se encontrar violações.

---

## Equipe

Projeto acadêmico de Engenharia da Computação. Contato: [@projeto.tecpixel](https://instagram.com/projeto.tecpixel).
