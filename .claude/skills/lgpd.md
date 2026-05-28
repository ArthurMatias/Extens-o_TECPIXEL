# Skill: LGPD — Conformidade Total (Lei 13.709/2018)

## Ativação obrigatória
Esta skill é ativada automaticamente antes de qualquer implementação neste projeto. Não é opcional.

---

## 1. Fundamentos legais

### Princípios do Art. 6º (todos aplicáveis)

| Princípio | Obrigação concreta neste projeto |
|---|---|
| **Finalidade** | Diagnóstico educativo de hardware/software; nenhum outro uso |
| **Adequação** | Qualquer dado deve ser estritamente compatível com diagnóstico educativo |
| **Necessidade** | Coletar o mínimo absoluto; preferir processamento local sem coleta |
| **Livre acesso** | Orientar o usuário sobre como exercer direitos (modal LGPD) |
| **Qualidade** | Não armazenar dados — sem risco de dados desatualizados |
| **Transparência** | Modal de privacidade acessível em todos os cenários de uso |
| **Segurança** | Sanitização de inputs; sem exposição de dados em logs |
| **Prevenção** | Privacy by Design em toda feature nova |
| **Não discriminação** | Diagnóstico nunca pode inferir ou usar dados pessoais sensíveis |
| **Responsabilização** | Checklist cumprido e documentado antes de cada commit |

### Bases legais disponíveis (Art. 7º e 11º)

```
SITUAÇÃO ATUAL DO TECPIXEL:
  - Sem coleta de dados → não precisa de base legal para dados comuns
  - Google Fonts → base: legítimo interesse (Art. 7º, IX) — JÁ documentado

AO ADICIONAR FEATURES, usar obrigatoriamente uma dessas bases:
  1. Consentimento      → opt-in explícito, granular, revogável, documentado
  2. Obrigação legal    → descrever a norma aplicável
  3. Legítimo interesse → justificativa formal + teste de proporcionalidade
  4. Execução de contrato → só se houver cadastro/serviço
  5. Estudos/pesquisa  → anonimização mandatória
```

---

## 2. Inventário de dados e terceiros (estado atual)

### Dados tratados agora
| Dado | Base legal | Armazenamento | Retenção |
|---|---|---|---|
| Endereço IP (via Google Fonts) | Legítimo interesse — Art. 7º, IX | Google (EUA) — transferência internacional | Conforme política Google |
| Respostas do diagnóstico | Nenhuma — processamento local apenas | Memória do navegador (sessionStorage implícita) | Descartado ao fechar/recarregar |

### Terceiros documentados
| Serviço | Finalidade | Dados transferidos | País | Link política |
|---|---|---|---|---|
| Google Fonts | Tipografia (Inter) | IP do usuário | EUA | https://policies.google.com/privacy |
| YouTube | Vídeos tutoriais (clique voluntário) | IP + comportamento | EUA | https://policies.google.com/privacy |
| Instagram | Contato da equipe (clique voluntário) | IP + comportamento | EUA | https://privacycenter.instagram.com |

**Regra:** Todo novo serviço externo = nova linha nesta tabela + atualização do modal LGPD antes de fazer o commit.

---

## 3. Dados sensíveis (Art. 5º, II) — proibição absoluta sem base legal expressa

Os dados abaixo requerem **consentimento específico e destacado** OU base legal expressa do Art. 11º:
- Origem racial ou étnica
- Convicção religiosa ou filosófica
- Opinião política
- Filiação sindical ou de organização de caráter religioso, filosófico ou político
- Saúde, vida sexual ou genéticos
- Dados biométricos (impressão digital, reconhecimento facial, voz)
- Dados de crianças e adolescentes (Art. 14º — proteção reforçada, consentimento dos responsáveis)

**Regra para este projeto:** Se uma feature exige qualquer dado da lista acima → não implementar sem análise jurídica formal.

---

## 4. Direitos dos titulares (Art. 18º) — como o TECPIXEL os atende

| Direito | Como atender |
|---|---|
| Confirmação de tratamento | Modal LGPD descreve o que é tratado |
| Acesso aos dados | Modal informa que não há dados armazenados |
| Correção | Não aplicável (sem armazenamento) |
| Anonimização / bloqueio / eliminação | Não aplicável (sem armazenamento) |
| Portabilidade | Não aplicável (sem armazenamento) |
| Eliminação dos dados tratados com consentimento | Função de limpeza de storage quando consentimento for usado |
| Informação sobre compartilhamento | Modal LGPD lista todos os terceiros |
| Revogação de consentimento | Botão acessível sempre que consentimento for utilizado |
| Petição à ANPD | Informar no modal que o usuário pode contatar a ANPD |

**Ao adicionar coleta de dados:** implementar página/modal de exercício de direitos antes de ir ao ar.

---

## 5. Checklist obrigatório pré-commit

### 5.1 Coleta e base legal
- [ ] Cada dado novo tem base legal identificada e documentada nesta skill (seção 2)
- [ ] Dados coletados são o mínimo absoluto para a finalidade (princípio da necessidade)
- [ ] O usuário foi informado de forma clara e acessível antes da coleta
- [ ] Há mecanismo visível para revogar consentimento (se consentimento for a base)
- [ ] Novos terceiros foram adicionados ao inventário (seção 2) e ao modal LGPD no `index.html`

### 5.2 Formulários e inputs
- [ ] Todo campo tem label descritivo (WCAG + LGPD — transparência)
- [ ] Sem campos ocultos coletando dados sem conhecimento do usuário
- [ ] Checkbox de consentimento é opt-in (nunca pré-marcado)
- [ ] Dados de crianças (<13 anos) requerem consentimento dos responsáveis (Art. 14º)

### 5.3 Storage (localStorage, sessionStorage, cookies, IndexedDB)
- [ ] Dados pessoais em storage têm prazo de retenção definido com `setWithExpiry()`
- [ ] Dados sensíveis nunca em texto puro — nem mesmo no storage local
- [ ] Cookies/storage não essenciais só escritos após consentimento confirmado via `hasConsent()`
- [ ] Há função de exportação e exclusão de dados acessível ao usuário
- [ ] Consentimento armazenado inclui: `{categorias, timestamp, version}`

### 5.4 JavaScript/TypeScript/React — segurança e privacidade
- [ ] Texto dinâmico via JSX `{valor}` (escapado por padrão); NUNCA `dangerouslySetInnerHTML` com dados do usuário
- [ ] Dados pessoais ausentes em `console.log`, `console.error` e mensagens de erro
- [ ] Event listeners capturam apenas o estritamente necessário
- [ ] Sem fingerprinting de navegador (canvas, WebGL, AudioContext, navigator.plugins, screen metrics) sem consentimento explícito
- [ ] Sem exfiltração de dados via beacon, fetch ou XHR sem aviso claro ao usuário
- [ ] Links externos com `target="_blank" rel="noopener noreferrer"` (evita acesso ao `window.opener`)

### 5.5 Aviso de privacidade (modal LGPD no `index.html`)
- [ ] Responsável pelo tratamento identificado com contato
- [ ] Lista completa de dados coletados (ou confirmação de ausência)
- [ ] Lista completa de terceiros com link para as políticas deles
- [ ] Direitos do titular descritos (Art. 18º)
- [ ] Menção à possibilidade de contatar a ANPD
- [ ] Data da última atualização presente
- [ ] "Em conformidade com a Lei 13.709/2018 (LGPD)" presente

### 5.6 Incidentes de segurança (Art. 48º)
- [ ] Se o projeto passar a ter backend: processo de comunicação de incidentes à ANPD documentado (prazo: 72h da ciência)

---

## 6. Padrões de implementação seguros

### 6.1 Consentimento granular (usar quando necessário)
```javascript
// Verificar antes de qualquer ação que dependa de consentimento
function hasConsent(category) {
  const raw = localStorage.getItem('lgpd_consent');
  if (!raw) return false;
  try {
    const consent = JSON.parse(raw);
    // Consentimento expira em 365 dias (Art. 8º, §5º — revogação fácil)
    if (Date.now() > consent.expiry) {
      localStorage.removeItem('lgpd_consent');
      return false;
    }
    return consent.categories[category] === true;
  } catch {
    return false;
  }
}

// Salvar consentimento com granularidade e prazo
function saveConsent(categories) {
  localStorage.setItem('lgpd_consent', JSON.stringify({
    categories,                              // ex: { analytics: true, funcional: false }
    timestamp: new Date().toISOString(),     // rastreabilidade do consentimento
    expiry: Date.now() + 365 * 86400000,     // 365 dias
    version: '1.0'                           // versão da política
  }));
}

// Revogar consentimento — deve ser tão fácil quanto conceder (Art. 8º, §5º)
function revokeConsent() {
  localStorage.removeItem('lgpd_consent');
  // Remover também quaisquer dados coletados com base nesse consentimento
  localStorage.removeItem('lgpd_analytics_data');
}
```

### 6.2 Storage com prazo de retenção
```javascript
// SEMPRE usar para dados pessoais em localStorage
function setWithExpiry(key, value, ttlDays) {
  localStorage.setItem(key, JSON.stringify({
    value,
    expiry: Date.now() + ttlDays * 86400000
  }));
}

function getWithExpiry(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const item = JSON.parse(raw);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
```

### 6.3 Sanitização de inputs (obrigatória para qualquer input do usuário)
```javascript
// Usar SEMPRE antes de inserir input no DOM
// Projeto já usa .textContent — manter esse padrão
function sanitize(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;                      // só usado para construção interna segura
}

// Para inserir texto no DOM: sempre .textContent, nunca .innerHTML com dados do usuário
element.textContent = userInput;            // ✅ seguro
element.innerHTML = userInput;              // ❌ proibido com dados externos
element.innerHTML = sanitize(userInput);    // ⚠️ só em casos onde HTML é realmente necessário
```

### 6.4 Logs sem dados pessoais
```javascript
// ❌ PROIBIDO — expõe dado pessoal
console.log('IP do usuário:', userIp);
console.error('Falha ao processar:', userData.email);

// ✅ CORRETO — identificador anônimo ou apenas tipo do erro
console.log('Diagnóstico concluído — categoria:', result.category);
console.error('Falha ao processar resposta — código:', errorCode);
```

### 6.5 Carregamento lazy de terceiros não essenciais
```javascript
// Não carregar scripts de terceiros automaticamente sem consentimento
// (aplicável quando/se analytics for adicionado)
function loadAnalytics() {
  if (!hasConsent('analytics')) return;
  const script = document.createElement('script');
  script.src = 'https://exemplo-analytics.com/script.js';
  document.head.appendChild(script);
}

// Google Fonts é essencial para o design — carrega normalmente
// YouTube e Instagram carregam apenas no clique do usuário — já correto
```

### 6.6 Banner de cookies (para quando cookies não essenciais forem adicionados)
```javascript
// Mostrar antes de qualquer cookie/storage não essencial
function showConsentBanner() {
  if (localStorage.getItem('lgpd_consent')) return; // já respondido
  document.getElementById('lgpdConsentBanner').classList.remove('hidden');
}

// Estrutura HTML mínima do banner (adicionar ao index.html quando necessário):
/*
<div id="lgpdConsentBanner" class="consent-banner hidden" role="dialog" aria-live="polite">
  <p>Usamos cookies funcionais para melhorar sua experiência.
     <a href="#" id="lgpdBannerDetails">Saiba mais</a></p>
  <div class="consent-actions">
    <button id="consentAccept">Aceitar</button>
    <button id="consentReject">Recusar</button>
    <button id="consentCustomize">Personalizar</button>
  </div>
</div>
*/
```

### 6.7 React/JSX — segurança no front-end
```tsx
// ✅ SEGURO — JSX escapa automaticamente qualquer texto, inclusive input do usuário
<p id="resultDiagnosis">{result.diagnosis}</p>
<span className="option-label">{opt.label}</span>

// ❌ PROIBIDO com dados do usuário — equivale ao innerHTML do DOM (risco de XSS)
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ⚠️ Se HTML dinâmico for inevitável, sanitizar antes (ex.: DOMPurify) e documentar o porquê
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(trustedHtml) }} />
```
Regras específicas de React neste projeto:
- **Nunca** `dangerouslySetInnerHTML` com dados vindos do usuário, URL, querystring ou storage.
- Links externos em JSX: `target="_blank" rel="noopener noreferrer"`.
- Não logar estado/props com dados pessoais (`console.log(props)` pode vazar PII).
- Carregar SDKs de terceiros (analytics, mapas, redes sociais) só após consentimento — preferir import dinâmico dentro de um gate `hasConsent()`.
- `useEffect` que envia dados a terceiros precisa de base legal e, se for consentimento, de gate explícito.
- O checker `npm run test:lgpd` varre `src/**/*.{ts,tsx}` e bloqueia `dangerouslySetInnerHTML` com input do usuário, links sem `noreferrer`, fingerprinting e storage de rastreamento.

---

## 7. Cenários de features futuras — guia de conformidade

### 7.1 Analytics / rastreamento de uso
**Exige:**
- Banner de cookies opt-in **antes** de carregar qualquer script de analytics
- Descrição clara do que é coletado (páginas visitadas, tempo na página, etc.)
- Opção de recusa sem degradação da funcionalidade principal
- Inclusão no inventário de terceiros (seção 2) e no modal LGPD
- Validade do consentimento e mecanismo de renovação anual

### 7.2 Formulário de contato
**Exige:**
- Coletar apenas nome (opcional) + email ou canal de contato
- Checkbox opt-in para resposta (se não for resposta imediata)
- Aviso claro de quem receberá os dados e em qual plataforma
- Prazo de retenção declarado
- Link para política de privacidade no formulário

### 7.3 Login e cadastro de usuários
**Exige:**
- Política de privacidade completa (não só aviso)
- DPO designado ou canal de contato para exercício de direitos
- Criptografia de senhas (bcrypt/argon2 — nunca MD5/SHA1)
- Mecanismo de exclusão de conta (direito ao esquecimento — Art. 18º, IV)
- Controle de retenção por tipo de dado
- Processo de comunicação de incidentes (Art. 48º)

### 7.4 Comentários e feedback abertos
**Exige:**
- Moderação antes de publicação para evitar exposição de dados de terceiros
- Prazo de retenção definido e automatizado
- Mecanismo para o usuário solicitar exclusão do seu comentário
- Aviso de que o conteúdo pode ser lido por outros usuários

### 7.5 Integração com redes sociais (botões de compartilhar, login social)
**Exige:**
- Não carregar SDKs de redes sociais automaticamente — usar links simples
- Aviso de que ao clicar, o usuário será redirecionado e sujeito à política daquele serviço
- Documentar no inventário de terceiros

### 7.6 CDNs e bibliotecas externas
**Exige:**
- Documentar no inventário (seção 2) e no modal LGPD
- Verificar a política de privacidade do serviço
- Avaliar alternativa local (self-hosted) para minimizar transferências internacionais

---

## 8. Transferência internacional de dados (Art. 33º)

Transferência para fora do Brasil só é permitida quando:
- O país destino tem proteção adequada (Resolução ANPD)
- Há garantias contratuais (cláusulas-padrão)
- Há **consentimento específico** do titular
- É para cooperação jurídica internacional
- É necessária para execução de contrato com o titular

**Situação atual:** Google Fonts transfere IP para os EUA. Base: legítimo interesse + o titular é informado no modal LGPD. Manter esse padrão para novos terceiros.

---

## 9. Crianças e adolescentes (Art. 14º) — proteção especial

O TECPIXEL é uma ferramenta educacional que pode ser usada por menores.

**Regras inegociáveis:**
- **Nenhum dado** de criança (<13 anos) pode ser coletado sem consentimento **dos pais ou responsáveis**
- O consentimento dos responsáveis deve ser **verificável** (não basta checkbox)
- Dados de crianças devem ter proteção adicional — nunca compartilhados com terceiros para fins comerciais
- Se houver cadastro: campo de data de nascimento com bloqueio para menores de 13 anos

**Situação atual:** Sem coleta de dados → sem risco com menores. Manter assim.

---

## 10. Responsabilização e governança (Art. 37º e 50º)

### Obrigações do controlador (a equipe TECPIXEL)
- Manter registro das operações de tratamento de dados (RIPD — Relatório de Impacto à Proteção de Dados)
- Designar DPO (Encarregado) se o projeto escalar ou passar a processar dados em grande volume
- Implementar programa de governança e privacidade
- Responder às solicitações da ANPD

### RIPD (Relatório de Impacto à Proteção de Dados)
Necessário quando o tratamento puder gerar riscos às liberdades civis. **Situação atual:** não obrigatório (sem tratamento de dados de usuários). Será necessário ao adicionar:
- Analytics comportamental
- Cadastro de usuários
- Processamento de dados sensíveis

---

## 11. Referências normativas

| Documento | URL |
|---|---|
| Lei 13.709/2018 (LGPD) | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm |
| ANPD — Autoridade Nacional | https://www.gov.br/anpd/ |
| Resolução CD/ANPD nº 2/2022 (MEI/MPE) | https://www.gov.br/anpd/pt-br/assuntos/noticias/resolucao-cd-anpd-no-2-2022 |
| Resolução CD/ANPD nº 15/2024 (incidentes) | https://www.gov.br/anpd/pt-br/assuntos/noticias |
| Orientações ANPD — Cookies | https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies |
| Guia ANPD — Crianças e Adolescentes | https://www.gov.br/anpd/pt-br/documentos-e-publicacoes |
| Transferência Internacional — ANPD | https://www.gov.br/anpd/pt-br/assuntos/transferencia-internacional |
