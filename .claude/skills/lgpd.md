# Skill: LGPD — Lei Geral de Proteção de Dados (Lei 13.709/2018)

## Quando usar esta skill
Sempre que qualquer código, funcionalidade ou conteúdo deste projeto for criado ou modificado. Todo o desenvolvimento deve estar em conformidade com a LGPD.

---

## Princípios fundamentais da LGPD (Art. 6º)

| Princípio | Obrigação prática |
|---|---|
| **Finalidade** | Coletar dados apenas para propósitos legítimos, específicos e explícitos |
| **Adequação** | Dados coletados devem ser compatíveis com a finalidade declarada |
| **Necessidade** | Coletar somente o mínimo necessário (minimização de dados) |
| **Livre acesso** | Usuário pode consultar, corrigir e excluir seus dados |
| **Qualidade** | Dados devem ser exatos e atualizados |
| **Transparência** | Informações claras sobre o tratamento ao titular |
| **Segurança** | Medidas técnicas e administrativas para proteger os dados |
| **Prevenção** | Adotar medidas preventivas (Privacy by Design) |
| **Não discriminação** | Dados não podem ser usados para fins discriminatórios |
| **Responsabilização** | Demonstrar conformidade com as normas |

---

## Checklist obrigatório antes de qualquer commit

### Coleta de dados
- [ ] Há base legal definida para cada dado coletado? (consentimento, legítimo interesse, obrigação legal, etc.)
- [ ] Apenas os dados estritamente necessários estão sendo coletados?
- [ ] O usuário foi informado claramente sobre o que será coletado e por quê?
- [ ] Há mecanismo para o usuário revogar consentimento?

### Formulários e inputs
- [ ] Campos de formulário têm labels claros e não coletam mais do que o necessário
- [ ] Dados sensíveis (CPF, email, telefone) têm proteção adequada (HTTPS, sanitização)
- [ ] Não há campos ocultos coletando dados sem conhecimento do usuário
- [ ] Checkbox de consentimento é opt-in (não pré-marcado)

### Armazenamento (localStorage, sessionStorage, cookies, IndexedDB)
- [ ] Dados pessoais em storage têm prazo de retenção definido
- [ ] Dados sensíveis não são armazenados em texto puro no cliente
- [ ] Cookies de rastreamento requerem consentimento explícito antes de serem definidos
- [ ] Há função para limpar/exportar dados do usuário

### Terceiros e APIs externas
- [ ] Cada serviço de terceiro (analytics, fontes, CDNs) está documentado
- [ ] O usuário é informado sobre transferências internacionais de dados
- [ ] APIs externas recebem apenas os dados mínimos necessários
- [ ] Há fallback ou carregamento lazy para serviços de terceiros não essenciais

### Código JavaScript
- [ ] Não usar `innerHTML` com dados fornecidos pelo usuário (risco de XSS)
- [ ] Dados pessoais não aparecem em `console.log` ou mensagens de erro
- [ ] Event listeners não capturam mais dados do que o necessário
- [ ] Fingerprinting de navegador (canvas, WebGL, AudioContext) é proibido sem consentimento

### Aviso de privacidade / Política de privacidade
- [ ] Existe um aviso de privacidade acessível (mínimo: rodapé ou banner)
- [ ] O aviso descreve: quem coleta, o quê, para quê, por quanto tempo, e direitos do usuário
- [ ] Dados de contato do responsável pelo tratamento estão disponíveis

---

## Bases legais disponíveis (Art. 7º e 11º)

```
1. Consentimento          → Obter aprovação explícita, granular e revogável
2. Obrigação legal        → Cumprimento de lei ou regulamento
3. Políticas públicas     → Execução de políticas públicas
4. Estudos/pesquisa       → Anonimização sempre que possível
5. Execução de contrato   → Necessário para cumprir contrato com o titular
6. Exercício de direitos  → Em processo judicial/administrativo
7. Proteção da vida       → Emergências de saúde
8. Tutela da saúde        → Procedimentos de saúde (operadores)
9. Legítimo interesse     → Desde que não prevaleçam direitos do titular
10. Proteção do crédito   → Informações de crédito e cobrança
```

---

## Dados sensíveis (Art. 5º, II) — proteção reforçada

Estes dados exigem **consentimento específico e destacado** ou base legal expressa:
- Origem racial ou étnica
- Convicção religiosa
- Opinião política
- Filiação sindical
- Saúde ou vida sexual
- Dados genéticos ou biométricos
- Pertencimento a criança ou adolescente

**Regra prática**: Se o projeto não precisar desses dados, **não os colete**.

---

## Direitos dos titulares (Art. 18º) — deve ser implementável

O sistema deve permitir (ou orientar como obter):
- Confirmação de tratamento
- Acesso aos dados
- Correção de dados incompletos ou incorretos
- Anonimização, bloqueio ou eliminação de dados desnecessários
- Portabilidade dos dados
- Eliminação dos dados tratados com consentimento
- Informação sobre compartilhamento
- Revogação de consentimento

---

## Padrões de implementação seguros

### Consentimento de cookies (implementação mínima)
```javascript
// Verificar consentimento antes de definir qualquer cookie não essencial
function hasConsent(category) {
  const consent = localStorage.getItem('lgpd_consent');
  if (!consent) return false;
  return JSON.parse(consent)[category] === true;
}

// Salvar consentimento granular
function saveConsent(categories) {
  localStorage.setItem('lgpd_consent', JSON.stringify({
    ...categories,
    timestamp: new Date().toISOString(),
    version: '1.0'
  }));
}
```

### Anonimização de dados
```javascript
// Nunca logar dados pessoais diretamente
// Errado:
console.log('Usuário:', user.email);

// Correto:
console.log('Usuário autenticado:', user.id.slice(0, 8) + '***');
```

### Sanitização de inputs
```javascript
// Sempre sanitizar dados antes de inserir no DOM
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

### Prazo de retenção em storage
```javascript
function setWithExpiry(key, value, ttlDays) {
  const item = {
    value,
    expiry: Date.now() + ttlDays * 86400000,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const item = JSON.parse(localStorage.getItem(key));
  if (!item || Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
```

---

## Regras para este projeto (TECPIXEL)

### Situação atual
- Sem coleta de dados pessoais ✅
- Sem backend ✅
- Sem cookies de rastreamento ✅
- Google Fonts carregado (transfere IP para Google) → requer menção no aviso de privacidade ⚠️

### Ao adicionar novas features, verificar:
1. **Formulário de contato** → exige consentimento, aviso de privacidade e destino dos dados
2. **Analytics** → exige banner de cookies e consentimento antes de carregar scripts
3. **Login/cadastro** → exige política de privacidade completa, criptografia e controle de retenção
4. **Comentários/feedback** → dados ficam onde? Por quanto tempo? Quem acessa?
5. **CDNs externos** → documentar no aviso de privacidade

---

## Referências normativas
- Lei 13.709/2018 (LGPD): https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD (Autoridade Nacional de Proteção de Dados): https://www.gov.br/anpd/
- Resolução CD/ANPD nº 15/2024 (comunicação de incidentes)
- Resolução CD/ANPD nº 2/2022 (micro e pequenas empresas)
