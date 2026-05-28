/**
 * LGPD Compliance Static Checker — TECPIXEL (React + Vite + TypeScript)
 * Verifica violações da Lei 13.709/2018 no código-fonte.
 * Erro (exit 1) → bloqueia o merge. Aviso → passa mas registra.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const SRC = join(ROOT, 'src');

const ERRORS = [];
const WARNS = [];
const err = (msg) => ERRORS.push(`❌  ${msg}`);
const warn = (msg) => WARNS.push(`⚠️  ${msg}`);

// Terceiros aprovados (devem estar documentados no modal LGPD)
const APPROVED_THIRD_PARTIES = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// ─── Coleta de arquivos-fonte ───────────────────────────────────────────────
function collectFiles(dir, exts) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectFiles(full, exts));
    } else if (exts.includes(extname(full))) {
      out.push(full);
    }
  }
  return out;
}

// ─── 1. dangerouslySetInnerHTML (o innerHTML do React) ──────────────────────
function checkDangerousInnerHTML(file, src) {
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*')) return;
    if (/dangerouslySetInnerHTML/.test(line)) {
      // Erro se a fonte parece ser input do usuário; aviso caso contrário
      if (/userInput|formValue|inputValue|\.value\b|params|req\.|searchParams/i.test(line)) {
        err(`${file}:${i + 1} — dangerouslySetInnerHTML com dado de input do usuário: "${t.slice(0, 90)}"`);
      } else {
        warn(`${file}:${i + 1} — dangerouslySetInnerHTML detectado. Confirmar que não inclui dados do usuário: "${t.slice(0, 90)}"`);
      }
    }
  });
}

// ─── 2. Dados pessoais em console.* ────────────────────────────────────────
function checkConsoleSensitiveData(file, src) {
  const sensitive = /\b(?:email|senha|password|cpf|rg|telefone|phone|endereco|address|fullname|userData|dadosPessoais)\b/i;
  src.split('\n').forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//')) return;
    if (/console\.(log|error|warn|info|debug)\s*\(/.test(line) && sensitive.test(line)) {
      err(`${file}:${i + 1} — console.* com possível dado pessoal: "${t.slice(0, 90)}"`);
    }
  });
}

// ─── 3. Links target="_blank" sem rel="noopener noreferrer" ────────────────
// Funciona com atributos JSX em múltiplas linhas (janela de contexto).
function checkExternalLinks(file, src) {
  const re = /target=["']_blank["']/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const window = src.slice(Math.max(0, m.index - 400), m.index + 400);
    if (!window.includes('noopener') || !window.includes('noreferrer')) {
      const lineNo = src.slice(0, m.index).split('\n').length;
      err(`${file}:${lineNo} — target="_blank" sem rel="noopener noreferrer" próximo.`);
    }
  }
}

// ─── 4. APIs de fingerprinting sem consentimento ───────────────────────────
function checkFingerprinting(file, src) {
  const APIs = [
    { re: /getContext\(["'](?:2d|webgl|webgl2)["']\)/, label: 'Canvas/WebGL' },
    { re: /(?:AudioContext|webkitAudioContext)\s*[(=]/, label: 'AudioContext' },
    { re: /navigator\.plugins\b/, label: 'navigator.plugins' },
    { re: /navigator\.hardwareConcurrency\b/, label: 'navigator.hardwareConcurrency' },
    { re: /screen\.(?:availWidth|availHeight|colorDepth|pixelDepth)\b/, label: 'Screen metrics' },
  ];
  src.split('\n').forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*')) return;
    APIs.forEach(({ re, label }) => {
      if (re.test(line)) {
        warn(`${file}:${i + 1} — Uso de ${label} (fingerprinting): "${t.slice(0, 90)}". Verificar consentimento.`);
      }
    });
  });
}

// ─── 5. Storage/cookie de rastreamento sem consentimento ───────────────────
function checkTrackingStorage(file, src) {
  const patterns = [
    /localStorage\.setItem\(["'](?:_ga|_gid|_fbp|_utm|gtag|fbq|analytics_|tracking_)/i,
    /document\.cookie\s*=\s*["'](?:_ga|_gid|_fbp|_utm|gtag)/i,
    /sessionStorage\.setItem\(["'](?:_ga|_gid|_fbp|analytics_)/i,
  ];
  src.split('\n').forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//')) return;
    patterns.forEach((re) => {
      if (re.test(line)) {
        err(`${file}:${i + 1} — Storage/cookie de rastreamento sem consentimento: "${t.slice(0, 90)}"`);
      }
    });
  });
}

// ─── 6. Dados sensíveis hardcoded ──────────────────────────────────────────
function checkHardcodedSensitiveData(file, src) {
  const patterns = [
    { re: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/, label: 'CPF' },
    { re: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/, label: 'CNPJ' },
  ];
  src.split('\n').forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*')) return;
    patterns.forEach(({ re, label }) => {
      if (re.test(line)) {
        warn(`${file}:${i + 1} — Possível ${label} hardcoded: "${t.slice(0, 90)}"`);
      }
    });
  });
}

// ─── 7. Scripts/links de terceiros não aprovados (index.html) ──────────────
function checkThirdPartiesHTML(file, src) {
  const scripts = [...src.matchAll(/<script[^>]+src=["']([^"']*https?:\/\/[^"']+)["'][^>]*>/g)];
  scripts.forEach(([, url]) => {
    if (!APPROVED_THIRD_PARTIES.some((h) => url.includes(h))) {
      err(`${file} — <script> externo não documentado no inventário: ${url}`);
    }
  });
  const links = [...src.matchAll(/<link[^>]+href=["']([^"']*https?:\/\/[^"']+)["'][^>]*>/g)];
  links.forEach(([, url]) => {
    if (!APPROVED_THIRD_PARTIES.some((h) => url.includes(h))) {
      warn(`${file} — <link> externo não no inventário aprovado: ${url}`);
    }
  });
}

// ─── 8. Termos obrigatórios do Aviso de Privacidade (no src) ───────────────
function checkPrivacyTerms(combinedSrc) {
  const required = [
    { term: 'Lei 13.709', label: 'número da lei (13.709/2018)' },
    { term: 'Art. 18', label: 'direitos dos titulares (Art. 18)' },
    { term: 'Google Fonts', label: 'menção ao terceiro Google Fonts' },
    { term: 'endereço IP', label: 'dado transferido (endereço IP)' },
    { term: 'legítimo interesse', label: 'base legal declarada' },
    { term: 'LGPD', label: 'referência à LGPD' },
    { term: 'lgpdModal', label: 'componente do modal (id="lgpdModal")' },
  ];
  required.forEach(({ term, label }) => {
    if (!combinedSrc.includes(term)) {
      err(`Aviso de Privacidade incompleto: falta ${label}. Termo esperado: "${term}"`);
    }
  });
}

// ─── Runner ─────────────────────────────────────────────────────────────────
function run() {
  console.log('\n🔒  LGPD Compliance Checker — TECPIXEL (React + Vite + TS)\n');
  console.log('    Lei 13.709/2018 | Checks: dangerouslySetInnerHTML, console.*,');
  console.log('    links externos, fingerprinting, terceiros, storage, aviso de privacidade\n');

  const srcFiles = collectFiles(SRC, ['.ts', '.tsx']);
  if (srcFiles.length === 0) {
    err('Nenhum arquivo .ts/.tsx encontrado em src/');
    printAndExit();
  }

  let combined = '';
  for (const file of srcFiles) {
    const rel = relative(ROOT, file).replace(/\\/g, '/');
    const content = readFileSync(file, 'utf8');
    combined += content + '\n';

    checkDangerousInnerHTML(rel, content);
    checkConsoleSensitiveData(rel, content);
    checkExternalLinks(rel, content);
    checkFingerprinting(rel, content);
    checkTrackingStorage(rel, content);
    checkHardcodedSensitiveData(rel, content);
  }

  // index.html (shell do Vite)
  const indexPath = join(ROOT, 'index.html');
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, 'utf8');
    checkThirdPartiesHTML('index.html', html);
    checkExternalLinks('index.html', html);
  }

  // Termos do aviso de privacidade (componente LgpdModal + index.html)
  const indexHtml = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : '';
  checkPrivacyTerms(combined + indexHtml);

  printAndExit();
}

function printAndExit() {
  if (WARNS.length > 0) {
    console.log(`── Avisos (${WARNS.length}) ─────────────────────────────────────`);
    WARNS.forEach((w) => console.log(`  ${w}`));
    console.log();
  }
  if (ERRORS.length > 0) {
    console.log(`── Erros bloqueantes (${ERRORS.length}) ────────────────────────────────`);
    ERRORS.forEach((e) => console.log(`  ${e}`));
    console.log(`\n❌  ${ERRORS.length} violação(ões) de LGPD encontrada(s). Corrija antes do merge.\n`);
    process.exit(1);
  }
  const suffix = WARNS.length > 0 ? ` — ${WARNS.length} aviso(s) para revisão humana` : '';
  console.log(`✅  Nenhuma violação bloqueante de LGPD encontrada.${suffix}\n`);
}

run();
