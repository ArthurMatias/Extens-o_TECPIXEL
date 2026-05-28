# TECPIXEL

Ferramenta educacional de **diagnóstico de hardware/software** para computadores. O usuário responde a um passo a passo de perguntas e recebe um diagnóstico com explicação, solução, vídeo tutorial e dica de prevenção.

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

A pasta `dist/` é estática e pode ser publicada em qualquer hospedagem de sites estáticos (GitHub Pages, Netlify, Vercel, etc.).

---

## Estrutura do projeto

```
.
├── index.html                  # Shell do Vite (div#root + <script> para main.tsx)
├── vite.config.ts              # Configuração do Vite (porta 8080)
├── tsconfig.json               # Configuração do TypeScript
├── src/
│   ├── main.tsx                # Entrypoint React (monta o App no #root)
│   ├── App.tsx                 # Compõe a página e controla o modal LGPD
│   ├── index.css               # Estilos e layout responsivo
│   ├── types.ts                # Tipos do diagnóstico (QuestionNode, ResultNode…)
│   ├── data/
│   │   ├── diagnosticTree.ts   # Árvore de diagnóstico (dados das perguntas/resultados)
│   │   └── faq.ts              # Respostas do FAQ
│   └── components/
│       ├── Header.tsx          # Cabeçalho, navegação, menu mobile, scroll spy
│       ├── Hero.tsx            # Seção inicial
│       ├── Diagnostic.tsx      # Diagnóstico interativo (pergunta → resultado)
│       ├── QuemSomos.tsx       # Equipe do projeto
│       ├── Footer.tsx          # Rodapé + botão do Aviso de Privacidade
│       ├── LgpdModal.tsx       # Modal do Aviso de Privacidade (LGPD)
│       ├── ContactWidget.tsx   # Botão flutuante + painel de FAQ/contato
│       └── InstagramIcon.tsx   # Ícone SVG reutilizável
├── tests/
│   ├── e2e/                    # Testes Playwright (smoke, diagnóstico, LGPD, acessibilidade)
│   └── lgpd/compliance.js      # Checagem estática de conformidade LGPD
├── .github/workflows/ci.yml    # Pipeline de CI (roda em cada PR)
├── lighthouserc.json           # Metas do Lighthouse CI
├── playwright.config.ts        # Configuração dos testes E2E
└── .claude/skills/lgpd.md      # Skill de conformidade LGPD (guia detalhado)
```

### Como o diagnóstico funciona

A lógica é guiada por dados: `src/data/diagnosticTree.ts` é uma árvore onde cada nó é uma **pergunta** (tem `options`) ou um **resultado** (tem `diagnosis`). O componente `Diagnostic.tsx` percorre essa árvore conforme os cliques do usuário, mantendo um histórico para o botão "Voltar". Para adicionar/editar diagnósticos, basta alterar os dados em `src/data/` — sem mexer nos componentes.

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
