import { useEffect, useRef, useState } from 'react';
import { COMPUTER_PARTS, findPart } from '../data/computerParts';
import type { ComputerPart, PartId } from '../data/computerParts';
import { PartIcon } from './PixelArt';

const SLOTS: { id: PartId; label: string }[] = [
  { id: 'cooler', label: 'Ventoinha' },
  { id: 'cpu', label: 'Processador' },
  { id: 'ram', label: 'Memória RAM' },
  { id: 'gpu', label: 'Placa de Vídeo' },
  { id: 'ssd', label: 'Armazenamento' },
  { id: 'psu', label: 'Fonte' },
];

export default function MontarPC() {
  const [placed, setPlaced] = useState<Set<PartId>>(new Set());
  const [info, setInfo] = useState<ComputerPart | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const place = (part: ComputerPart) => {
    setPlaced((prev) => {
      const next = new Set(prev);
      next.add(part.id);
      return next;
    });
    setInfo(part);
  };

  const reset = () => {
    setPlaced(new Set());
    setInfo(null);
  };

  const total = SLOTS.length;
  const count = placed.size;
  const pct = (count / total) * 100;
  const allDone = count === total;
  const available = COMPUTER_PARTS.filter((p) => !placed.has(p.id));

  // Rolar o card de explicação para a área visível ao mudar de peça
  useEffect(() => {
    if (info && infoRef.current) {
      infoRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [info]);

  return (
    <section className="section" id="montar-pc">
      <div className="container">
        <div className="section-header">
          <h2>Monte seu Computador</h2>
          <p>Aprenda as peças encaixando cada uma no lugar certo da placa-mãe.</p>
        </div>

        <div className="game-wrapper">
          <div className="game-header">
            <div className="game-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-text">
                {count} de {total} peças encaixadas
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={reset}
              disabled={count === 0}
            >
              Recomeçar
            </button>
          </div>

          <div className="game-board">
            <div className="motherboard" aria-label="Placa-mãe">
              {SLOTS.map((slot) => {
                const isPlaced = placed.has(slot.id);
                return (
                  <div
                    key={slot.id}
                    className={`slot slot-${slot.id} ${isPlaced ? 'slot-filled' : 'slot-empty'}`}
                  >
                    {isPlaced ? (
                      <button
                        type="button"
                        className="slot-piece"
                        onClick={() => setInfo(findPart(slot.id))}
                        aria-label={`${slot.label} encaixado — ver explicação novamente`}
                      >
                        <PartIcon id={slot.id} className="pixel-icon" />
                      </button>
                    ) : (
                      <span className="slot-label">{slot.label}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="inventory">
              <h3 className="inventory-title">
                {allDone ? 'Tudo encaixado!' : 'Peças disponíveis'}
              </h3>
              <div className="inventory-grid">
                {available.map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    className="part-card"
                    onClick={() => place(part)}
                    aria-label={`Encaixar ${part.shortName}`}
                  >
                    <PartIcon id={part.id} className="pixel-icon" />
                    <span className="part-card-name">
                      <span className="part-card-emoji" aria-hidden="true">
                        {part.emoji}
                      </span>
                      {' '}
                      {part.shortName}
                    </span>
                  </button>
                ))}
                {available.length === 0 && (
                  <p className="inventory-empty">Você usou todas as peças.</p>
                )}
              </div>
            </div>
          </div>

          <div
            ref={infoRef}
            className={info ? 'info-card' : 'info-card info-card-empty'}
            aria-live="polite"
            aria-atomic="true"
          >
            {info ? (
              <>
                <div className="info-card-header">
                  <span className="info-card-icon" aria-hidden="true">{info.emoji}</span>
                  <h3>{info.name}</h3>
                </div>
                <p className="info-card-line">
                  <strong>Para entender:</strong> {info.analogy}
                </p>
                <p className="info-card-line">
                  <strong>Tecnicamente:</strong> {info.technical}
                </p>
                <p className="info-card-line">
                  <strong>Sem essa peça:</strong> {info.withoutIt}
                </p>
                <p className="info-card-fact">
                  💡 <strong>Curiosidade:</strong> {info.funFact}
                </p>
              </>
            ) : (
              <p className="info-card-prompt">
                👆 Clique em uma peça acima para descobrir o que ela faz!
              </p>
            )}
          </div>

          {allDone && (
            <div className="celebration" role="status">
              <span className="celebration-emoji" aria-hidden="true">🎉</span>
              <h3>Parabéns! Você montou um computador inteiro!</h3>
              <p>
                Agora você sabe o nome e a função de cada peça principal. Que tal montar de novo?
              </p>
              <button type="button" className="btn btn-primary" onClick={reset}>
                Montar outra vez
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
