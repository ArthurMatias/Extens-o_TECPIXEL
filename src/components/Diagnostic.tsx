import { useState } from 'react';
import { diagnosticTree } from '../data/diagnosticTree';
import { isResult } from '../types';
import type { DiagnosticNode, QuestionNode, ResultNode } from '../types';

const TOTAL_STEPS = 5;

export default function Diagnostic() {
  const [current, setCurrent] = useState<DiagnosticNode>(diagnosticTree);
  const [history, setHistory] = useState<DiagnosticNode[]>([]);

  const showingResult = isResult(current);
  const question: QuestionNode | undefined = showingResult ? undefined : current;
  const result: ResultNode | undefined = showingResult ? current : undefined;

  const selectOption = (next: DiagnosticNode) => {
    setHistory((h) => [...h, current]);
    setCurrent(next);
  };

  const goBack = () => {
    if (history.length === 0) return;
    setCurrent(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const restart = () => {
    setHistory([]);
    setCurrent(diagnosticTree);
  };

  const stepNum = history.length + 1;
  const progressPct = showingResult ? 100 : Math.min((stepNum / TOTAL_STEPS) * 100, 90);
  const progressText = showingResult
    ? 'Diagnostico concluido!'
    : `Etapa ${stepNum} de ~${TOTAL_STEPS}`;

  const youtubeUrl = result?.videoSearch
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(result.videoSearch)}`
    : null;

  return (
    <section className="section section-gray" id="diagnostico">
      <div className="container">
        <div className="section-header">
          <h2>Diagnóstico Interativo</h2>
          <p>Siga o passo a passo abaixo para identificar e resolver o problema do seu computador.</p>
        </div>

        <div className="diagnostic-wrapper">
          <div className="progress-bar">
            <div className="progress-fill" id="progressFill" style={{ width: `${progressPct}%` }}></div>
          </div>
          <div className="progress-text" id="progressText">{progressText}</div>

          <div className="diagnostic-card" id="diagnosticCard">
            {/* Pergunta dinâmica */}
            <div className={showingResult ? 'diagnostic-step hidden' : 'diagnostic-step'} id="step-question">
              <div
                className="step-badge"
                id="stepBadge"
                style={{ display: question?.badge ? 'inline-block' : 'none' }}
              >
                {question?.badge}
              </div>
              <h3 id="stepQuestion">{question?.question}</h3>
              <p className="step-description" id="stepDescription">{question?.description ?? ''}</p>
              <div
                id="stepOptionsContainer"
                className={question?.isGrid ? 'options-grid' : 'options-list'}
              >
                {question?.options.map((opt, i) => (
                  <button key={i} className="option-btn" onClick={() => selectOption(opt.next)}>
                    {opt.icon && <span className="option-icon">{opt.icon}</span>}
                    <span className="option-label">{opt.label}</span>
                  </button>
                ))}
              </div>
              <button
                className={history.length > 0 ? 'btn btn-ghost btn-back' : 'btn btn-ghost btn-back hidden'}
                id="backBtn"
                onClick={goBack}
              >
                ← Voltar
              </button>
            </div>

            {/* Resultado */}
            <div className={showingResult ? 'diagnostic-step' : 'diagnostic-step hidden'} id="step-result">
              <div className="result-header">
                <span className="result-icon">✅</span>
                <h3>Diagnóstico Concluído</h3>
              </div>

              <div className="result-diagnosis">
                <h4>Problema Identificado</h4>
                <p id="resultDiagnosis">{result?.diagnosis}</p>
              </div>

              <div className="result-explanation">
                <h4>Por que isso acontece?</h4>
                <p id="resultExplanation">{result?.explanation}</p>
              </div>

              <div className="result-solution">
                <h4>Solução Passo a Passo</h4>
                <ol id="resultSteps" className="solution-steps">
                  {result?.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </div>

              <div className="result-video">
                <h4>Vídeo Tutorial</h4>
                <div className="video-container" id="resultVideo">
                  {youtubeUrl ? (
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="video-card">
                      <div className="video-card-icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                          <rect width="48" height="48" rx="12" fill="#FF0000" />
                          <path d="M20 16L32 24L20 32V16Z" fill="white" />
                        </svg>
                      </div>
                      <div className="video-card-info">
                        <span className="video-card-title">Assistir Tutorial no YouTube</span>
                        <span className="video-card-desc">
                          Clique para ver videos que ensinam a resolver este problema passo a passo
                        </span>
                      </div>
                      <span className="video-card-arrow">→</span>
                    </a>
                  ) : (
                    <p className="video-placeholder-text">Video tutorial em breve</p>
                  )}
                </div>
              </div>

              <div className="result-tip">
                <h4>💡 Dica de Prevenção</h4>
                <p id="resultTip">{result?.tip}</p>
              </div>

              <button className="btn btn-primary" id="restartDiagnostic" onClick={restart}>
                Fazer Novo Diagnóstico
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
