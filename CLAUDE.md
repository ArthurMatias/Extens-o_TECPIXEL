# TECPIXEL — Guia de Desenvolvimento

## Sobre o projeto
Ferramenta educacional de diagnóstico de hardware/software para computadores. App estático (HTML + CSS + JavaScript vanilla), sem backend, sem banco de dados. Linguagem: português (pt-BR).

## Stack
- HTML5, CSS3, JavaScript ES6 (sem frameworks)
- Servidor de desenvolvimento: `npx http-server` na porta 8080

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
- [ ] Inputs do usuário são sanitizados antes de entrar no DOM
- [ ] Novos terceiros foram adicionados ao aviso de privacidade

## Estrutura do projeto
```
index.html      — Estrutura HTML e aviso de privacidade (rodapé)
script.js       — Árvore de diagnóstico e lógica da aplicação
styles.css      — Estilos e layout responsivo
```

## Convenções de código
- Sem frameworks externos; JavaScript vanilla apenas
- `.textContent` para inserir texto no DOM (nunca `.innerHTML` com dados do usuário)
- Links externos: sempre `target="_blank" rel="noopener noreferrer"`
- Comentários somente quando o "porquê" não é óbvio pelo código
