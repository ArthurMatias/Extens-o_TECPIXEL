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
  main.tsx                  — Entrypoint React
  App.tsx                   — Composição da página + estado do modal LGPD
  index.css                 — Estilos e layout responsivo
  types.ts                  — Tipos do diagnóstico (QuestionNode, ResultNode, DiagnosticNode)
  data/
    diagnosticTree.ts       — Árvore de diagnóstico (dados)
    faq.ts                  — Respostas do FAQ (dados)
  components/
    Header.tsx              — Cabeçalho, navegação, menu mobile, scroll spy
    Hero.tsx                — Seção inicial
    Diagnostic.tsx          — Diagnóstico interativo (pergunta → resultado)
    QuemSomos.tsx           — Equipe
    Footer.tsx              — Rodapé + botão do aviso de privacidade
    LgpdModal.tsx           — Modal do Aviso de Privacidade (LGPD)
    ContactWidget.tsx       — Botão flutuante + painel de FAQ/contato
    InstagramIcon.tsx       — Ícone SVG reutilizável
tests/
  e2e/                      — Testes Playwright (smoke, diagnóstico, LGPD, acessibilidade)
  lgpd/compliance.js        — Checagem estática de LGPD
```

## Convenções de código
- **TypeScript strict**: tipar dados e props; evitar `any`
- **Renderização segura**: o JSX escapa texto por padrão — prefira `{valor}`. NUNCA use `dangerouslySetInnerHTML` com dados do usuário
- Links externos: sempre `target="_blank" rel="noopener noreferrer"`
- Dados (árvore de diagnóstico, FAQ) ficam em `src/data/`, separados dos componentes
- Reaproveitar IDs/classes do CSS existente ao criar/alterar componentes
- Comentários somente quando o "porquê" não é óbvio pelo código

## CI/CD
Pipeline em `.github/workflows/ci.yml` roda em todo PR e push para `main`:
`lint-js`, `lint-css`, `typecheck`, `build`, `lgpd-compliance`, `security-audit`, `e2e-tests` (Playwright + axe), `lighthouse`. O job `all-checks` é o gate final.
