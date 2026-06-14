import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { PIECES, findInfo, findPiece } from '../data/computerParts';
import type { InfoKey, PartKind, Piece, PieceId } from '../data/computerParts';
import { InstalledIcon, PartIcon } from '../components/PixelArt';
import MotherboardSVG from '../components/MotherboardSVG';

type SlotId = 'socket' | 'cooler-mount' | 'dimm-1' | 'dimm-2' | 'pcie' | 'atx24-port' | 'eps8-port';
type LeverState = 'closed' | 'open' | 'locked';

interface SlotDef {
  id: SlotId;
  accepts: PartKind;
  label: string;
  /** centro e tamanho sobre a placa-mãe, em % (alinhados ao desenho do MotherboardSVG) */
  cx: number;
  cy: number;
  w: number;
  h: number;
  orient?: 'vertical';
  ghost?: boolean;
}

// Geometria casada com as features desenhadas no MotherboardSVG (viewBox 480x400).
// IMPORTANTE: os slots são posicionados por left/top calculados (sem transform):
// o dnd-kit mede droppables ignorando transforms CSS, e um translate(-50%,-50%)
// deslocaria o retângulo medido em relação ao visual, quebrando o pointerWithin.
const SLOTS: SlotDef[] = [
  { id: 'socket', accepts: 'cpu', label: 'Socket da CPU', cx: 33.3, cy: 39, w: 23, h: 27.5, ghost: true },
  { id: 'cooler-mount', accepts: 'cooler', label: 'Cooler', cx: 33.3, cy: 39, w: 30, h: 36, ghost: true },
  { id: 'dimm-1', accepts: 'ram', label: 'DIMM 1', cx: 55, cy: 41.5, w: 9, h: 52, orient: 'vertical' },
  { id: 'dimm-2', accepts: 'ram', label: 'DIMM 2', cx: 62.5, cy: 41.5, w: 9, h: 52, orient: 'vertical' },
  { id: 'pcie', accepts: 'gpu', label: 'PCI Express x16', cx: 34.6, cy: 76.7, w: 50, h: 10, ghost: true },
  { id: 'atx24-port', accepts: 'atx24', label: 'ATX 24 pinos', cx: 92.3, cy: 49.5, w: 10, h: 27.5, orient: 'vertical' },
  { id: 'eps8-port', accepts: 'eps8', label: 'EPS 8 pinos', cx: 17.5, cy: 8.5, w: 14, h: 9 },
];

function findSlot(id: SlotId): SlotDef {
  const slot = SLOTS.find((s) => s.id === id);
  if (!slot) throw new Error(`Slot desconhecido: ${id}`);
  return slot;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

// ─── Peça arrastável (inventário) ───────────────────────────────────────────
interface DraggablePieceProps {
  piece: Piece;
  selected: boolean;
  onSelect: (id: PieceId) => void;
  onPreview: (kind: PartKind) => void;
}

function DraggablePiece({ piece, selected, onSelect, onPreview }: DraggablePieceProps) {
  // Sem KeyboardSensor, não espalhamos `attributes` do dnd-kit: o elemento já é
  // um <button> real e as instruções de arraste por teclado seriam enganosas.
  // O caminho de teclado é clicar para selecionar → "Encaixar aqui".
  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: piece.id,
    data: { label: piece.label },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className="dnd-piece part-card"
      data-piece={piece.id}
      data-dragging={isDragging}
      data-selected={selected}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        touchAction: 'none',
      }}
      onClick={() => onSelect(piece.id)}
      onMouseEnter={() => onPreview(piece.kind)}
      onFocus={() => onPreview(piece.kind)}
      {...listeners}
      aria-pressed={selected}
      aria-label={`${piece.label}. ${selected ? 'Selecionada — escolha um encaixe na placa-mãe.' : 'Arraste para a placa-mãe ou clique para selecionar.'}`}
    >
      <PartIcon kind={piece.kind} className="pixel-icon" />
      <span className="part-card-name">{piece.label}</span>
    </button>
  );
}

// ─── Encaixe (drop zone) sobre a placa-mãe ──────────────────────────────────
interface DropSlotProps {
  slot: SlotDef;
  active: boolean;
  filledBy: PieceId | null;
  dragging: boolean;
  /** o drop NESTE encaixe, AGORA, daria certo? (considera trava etc.) */
  dragValid: boolean;
  selectedPiece: PieceId | null;
  hint: boolean;
  onPlaceClick: (slotId: SlotId) => void;
  onReview: (kind: PartKind) => void;
}

function DropSlot({
  slot, active, filledBy, dragging, dragValid, selectedPiece, hint, onPlaceClick, onReview,
}: DropSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: slot.id,
    data: { label: slot.label },
    disabled: !active,
  });

  let state: 'idle' | 'valid' | 'invalid' = 'idle';
  if (isOver && dragging && active) {
    state = dragValid ? 'valid' : 'invalid';
  }

  const filledKind = filledBy ? findPiece(filledBy).kind : null;

  return (
    <div
      ref={setNodeRef}
      id={`slot-${slot.id}`}
      className={`dnd-slot ${filledBy ? 'slot-filled' : active ? 'slot-empty' : 'slot-dormant'}`}
      data-state={state}
      data-orient={slot.orient}
      data-hint={hint && !filledBy ? 'pulse' : undefined}
      style={{
        top: `${slot.cy - slot.h / 2}%`,
        left: `${slot.cx - slot.w / 2}%`,
        width: `${slot.w}%`,
        height: `${slot.h}%`,
      }}
    >
      {filledBy && filledKind ? (
        <button
          type="button"
          className="slot-piece"
          onClick={() => onReview(filledKind)}
          aria-label={`${slot.label} com ${findPiece(filledBy).label} instalado. Ver explicação novamente.`}
        >
          <InstalledIcon kind={filledKind} className="pixel-installed" />
        </button>
      ) : active ? (
        <>
          <span className="slot-label">{slot.label}</span>
          {slot.ghost && <PartIcon kind={slot.accepts} className="pixel-icon slot-ghost" />}
          {selectedPiece && (
            <button
              type="button"
              className="slot-place-btn"
              onClick={() => onPlaceClick(slot.id)}
              aria-label={`Encaixar ${findPiece(selectedPiece).label} em ${slot.label}`}
            >
              Encaixar aqui
            </button>
          )}
        </>
      ) : null}
    </div>
  );
}

// ─── Ícone da trava (3 estados) ─────────────────────────────────────────────
function LeverIcon({ state }: { state: LeverState }) {
  return (
    <svg viewBox="0 0 20 20" shapeRendering="crispEdges" aria-hidden="true" className="lever-icon">
      {/* pivô */}
      <rect x="2" y="14" width="6" height="6" fill="#6b7280" />
      {state === 'closed' && <rect x="2" y="15" width="16" height="4" fill="#d1d5db" />}
      {state === 'open' && <rect x="3" y="0" width="4" height="16" fill="#fbbf24" />}
      {state === 'locked' && (
        <>
          <rect x="2" y="15" width="16" height="4" fill="#22c55e" />
          <rect x="14" y="10" width="4" height="4" fill="#22c55e" />
        </>
      )}
    </svg>
  );
}

const LEVER_TEXT: Record<LeverState, string> = {
  closed: 'Trava do socket fechada. Clique para levantar e liberar o encaixe do processador.',
  open: 'Trava do socket levantada. Encaixe o processador, ou clique para abaixar.',
  locked: 'Trava do socket fechada protegendo o processador.',
};

// ─── Página ─────────────────────────────────────────────────────────────────
export default function MontarPCPage() {
  const reducedMotion = usePrefersReducedMotion();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const [filled, setFilled] = useState<Partial<Record<SlotId, PieceId>>>({});
  const [lever, setLever] = useState<LeverState>('closed');
  const [activePiece, setActivePiece] = useState<PieceId | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<PieceId | null>(null);
  const [infoKey, setInfoKey] = useState<InfoKey | null>(null);
  const [message, setMessage] = useState('');
  const [hintSlots, setHintSlots] = useState<SlotId[]>([]);
  const [leverHint, setLeverHint] = useState(false);
  const errorCountsRef = useRef<Record<string, number>>({});
  const focusSlotRef = useRef<SlotId | null>(null);
  const focusPlaceRef = useRef<PartKind | null>(null);

  const placedIds = new Set(Object.values(filled));
  const isPlaced = (id: PieceId) => placedIds.has(id);
  const cpuPlaced = isPlaced('cpu');

  const slotActive = (slot: SlotDef): boolean => {
    if (filled[slot.id]) return false;
    if (slot.id === 'socket') return !cpuPlaced;
    if (slot.id === 'cooler-mount') return cpuPlaced && lever === 'locked';
    return true;
  };

  // O drop desta peça NESTE encaixe, agora, seria aceito? (espelha attemptPlace)
  const canPlaceNow = (slot: SlotDef, kind: PartKind): boolean => {
    if (slot.id === 'socket') return kind === 'cpu' && lever === 'open';
    return kind === slot.accepts;
  };

  // Etapas do manual de montagem (na ordem real)
  const steps = [
    { id: 'lever-open', label: 'Levante a trava do socket', done: lever !== 'closed' },
    { id: 'cpu', label: 'Encaixe o processador no socket', done: cpuPlaced },
    { id: 'lever-lock', label: 'Feche a trava para prender a CPU', done: lever === 'locked' },
    { id: 'cooler', label: 'Monte o cooler sobre o processador', done: isPlaced('cooler') },
    { id: 'ram', label: 'Encaixe os dois módulos de RAM', done: isPlaced('ram-1') && isPlaced('ram-2') },
    { id: 'gpu', label: 'Encaixe a placa de vídeo no PCIe', done: isPlaced('gpu') },
    { id: 'atx24', label: 'Conecte o cabo ATX de 24 pinos', done: isPlaced('atx24') },
    { id: 'eps8', label: 'Conecte o cabo EPS de 8 pinos', done: isPlaced('eps8') },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;
  const available = PIECES.filter((p) => !isPlaced(p.id));

  // Devolve o foco à peça instalada (acessibilidade).
  useEffect(() => {
    if (focusSlotRef.current) {
      const id = focusSlotRef.current;
      focusSlotRef.current = null;
      requestAnimationFrame(() =>
        document.querySelector<HTMLButtonElement>(`#slot-${id} .slot-piece`)?.focus()
      );
    }
  }, [filled]);

  // Ao selecionar uma peça, leva o foco ao botão "Encaixar aqui" do primeiro
  // encaixe compatível — o caminho de teclado fica direto e descobrível (WCAG 2.4.3).
  useEffect(() => {
    if (focusPlaceRef.current) {
      const kind = focusPlaceRef.current;
      focusPlaceRef.current = null;
      requestAnimationFrame(() => {
        const target = SLOTS.find((s) => s.accepts === kind && slotActive(s));
        if (target) {
          document.querySelector<HTMLButtonElement>(`#slot-${target.id} .slot-place-btn`)?.focus();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPiece]);

  const showInfo = (key: InfoKey) => setInfoKey(key);

  const place = (piece: Piece, slotId: SlotId) => {
    setFilled((prev) => ({ ...prev, [slotId]: piece.id }));
    setSelectedPiece(null);
    setHintSlots([]);
    showInfo(piece.kind);
    focusSlotRef.current = slotId;
    if (piece.id === 'cpu') {
      setMessage('Boa! Processador no socket. Agora clique na trava para prendê-lo!');
      setLeverHint(true);
    } else {
      setMessage(`Boa! ${piece.label} encaixou no lugar certo. 🎉`);
    }
    if ('vibrate' in navigator) {
      try { navigator.vibrate(10); } catch { /* sem suporte */ }
    }
  };

  const fail = (piece: Piece, slot: SlotDef) => {
    const n = (errorCountsRef.current[piece.id] ?? 0) + 1;
    errorCountsRef.current[piece.id] = n;
    let msg = `Quase! ${piece.label} não vai em "${slot.label}". Tente outro encaixe. 😉`;
    if (n >= 2) {
      const targets = SLOTS.filter((s) => s.accepts === piece.kind && slotActive(s));
      setHintSlots(targets.map((s) => s.id));
      if (targets.length > 0) {
        // dá a dica também em texto (leitor de tela / quem desativou animações)
        msg += ` Dica: procure "${targets.map((s) => s.label).join('" ou "')}" brilhando na placa.`;
      }
    }
    setMessage(msg);
  };

  const attemptPlace = (pieceId: PieceId, slotId: SlotId) => {
    const piece = findPiece(pieceId);
    const slot = findSlot(slotId);

    if (slotId === 'socket') {
      if (piece.kind === 'cooler') {
        setMessage('Calma! Primeiro o processador, depois feche a trava — só então o cooler. 😉');
        return;
      }
      if (piece.kind !== 'cpu') {
        fail(piece, slot);
        return;
      }
      if (lever !== 'open') {
        setMessage('Ops! Primeiro levante a trava do socket — clique nela. 🔒');
        setLeverHint(true);
        showInfo('lever');
        return;
      }
      place(piece, slotId);
      return;
    }

    if (piece.kind !== slot.accepts) {
      fail(piece, slot);
      return;
    }
    place(piece, slotId);
  };

  const handleLever = () => {
    setLeverHint(false);
    showInfo('lever');
    if (lever === 'closed') {
      setLever('open');
      setMessage('Trava levantada! O socket está pronto para receber o processador.');
    } else if (lever === 'open' && !cpuPlaced) {
      setLever('closed');
      setMessage('Trava abaixada. Levante a trava para encaixar o processador.');
    } else if (lever === 'open' && cpuPlaced) {
      setLever('locked');
      setMessage('Clac! Processador preso com segurança. Agora monte o cooler em cima dele. ❄️');
    } else {
      setMessage('A trava já está fechada, protegendo o processador.');
    }
  };

  const handleDragStart = (e: DragStartEvent) => {
    setHintSlots([]); // dica antiga não deve seguir uma peça nova
    setActivePiece(e.active.id as PieceId);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActivePiece(null);
    const slotId = e.over?.id as SlotId | undefined;
    if (!slotId) return; // soltou fora → snap-back sem punição
    attemptPlace(e.active.id as PieceId, slotId);
  };

  const handleSelect = (id: PieceId) => {
    const next = selectedPiece === id ? null : id;
    setSelectedPiece(next);
    setHintSlots([]);
    if (next) {
      const piece = findPiece(next);
      showInfo(piece.kind);
      setMessage(`${piece.label} selecionada. Vá até a placa-mãe e toque em "Encaixar aqui" no encaixe certo.`);
      focusPlaceRef.current = piece.kind;
    } else {
      setMessage('Seleção desfeita.');
    }
  };

  const reset = () => {
    setFilled({});
    setLever('closed');
    setActivePiece(null);
    setSelectedPiece(null);
    setInfoKey(null);
    setMessage('');
    setHintSlots([]);
    setLeverHint(false);
    errorCountsRef.current = {};
  };

  const info = infoKey ? findInfo(infoKey) : null;
  const dragKind = activePiece ? findPiece(activePiece).kind : null;

  return (
    <section className="section" id="montar-pc">
      <div className="container">
        <div className="section-header">
          <h1>Monte seu Computador</h1>
          <p>
            Monte uma placa-mãe de verdade, na ordem certa: levante a trava, encaixe o
            processador, o cooler, as memórias, a placa de vídeo e os cabos da fonte.
            Arraste cada peça — ou clique nela e depois no encaixe.
          </p>
        </div>

        <div className="game-wrapper">
          <div className="game-header">
            <div className="game-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
              </div>
              <div className="progress-text">{doneCount} de {steps.length} etapas concluídas</div>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
              Recomeçar
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragCancel={() => setActivePiece(null)}
            onDragEnd={handleDragEnd}
          >
            <div className="game-board">
              <div className="motherboard" role="group" aria-label="Placa-mãe com encaixes">
                <MotherboardSVG className="motherboard-bg" />

                {SLOTS.map((slot) => {
                  const sel = selectedPiece && !isPlaced(selectedPiece) ? selectedPiece : null;
                  // o cooler-mount cobre o socket: só oferece "Encaixar aqui" quando o
                  // cooler está selecionado, para não interceptar a revisão da CPU.
                  const offerPlace =
                    sel && (slot.id !== 'cooler-mount' || findPiece(sel).kind === 'cooler')
                      ? sel
                      : null;
                  return (
                    <DropSlot
                      key={slot.id}
                      slot={slot}
                      active={slotActive(slot)}
                      filledBy={filled[slot.id] ?? null}
                      dragging={dragKind !== null}
                      dragValid={dragKind !== null && canPlaceNow(slot, dragKind)}
                      selectedPiece={offerPlace}
                      hint={hintSlots.includes(slot.id)}
                      onPlaceClick={(slotId) => selectedPiece && attemptPlace(selectedPiece, slotId)}
                      onReview={showInfo}
                    />
                  );
                })}

                {/* Trava do socket — interativa, ao lado do socket */}
                <button
                  type="button"
                  className="lever-btn"
                  data-state={lever}
                  data-hint={leverHint ? 'pulse' : undefined}
                  style={{ top: '46.5%', left: '45.5%' }}
                  onClick={handleLever}
                  aria-label={LEVER_TEXT[lever]}
                >
                  <LeverIcon state={lever} />
                  <span className="lever-label">Trava</span>
                </button>
              </div>

              <aside className="game-side">
                <div className="inventory">
                  <h2 className="inventory-title">
                    {allDone ? 'Tudo montado!' : 'Peças disponíveis'}
                  </h2>
                  <div className="inventory-grid">
                    {available.map((piece) => (
                      <DraggablePiece
                        key={piece.id}
                        piece={piece}
                        selected={selectedPiece === piece.id}
                        onSelect={handleSelect}
                        onPreview={showInfo}
                      />
                    ))}
                    {available.length === 0 && (
                      <p className="inventory-empty">Você usou todas as peças.</p>
                    )}
                  </div>
                </div>

                <div className="assembly-steps">
                  <h2 className="inventory-title">Manual de montagem</h2>
                  <ol>
                    {steps.map((step, i) => (
                      <li key={step.id} data-done={step.done}>
                        <span className="step-check" aria-hidden="true">{step.done ? '✓' : i + 1}</span>
                        {step.label}
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>

              <DragOverlay
                dropAnimation={
                  reducedMotion ? null : { duration: 250, easing: 'cubic-bezier(.2,.8,.2,1)' }
                }
              >
                {dragKind ? (
                  <div className="dnd-piece dnd-overlay">
                    <PartIcon kind={dragKind} className="pixel-icon" />
                  </div>
                ) : null}
              </DragOverlay>
            </div>
          </DndContext>

          {/* Mensagens (leitor de tela + visível) */}
          <p className="game-message" aria-live="assertive">{message}</p>

          {/* Card de explicação — sem aria-live: já está na ordem de leitura e
              re-anunciá-lo a cada hover/foco de peça inundaria o leitor de tela.
              A confirmação de acerto/erro é anunciada pela .game-message. */}
          <div className={info ? 'info-card' : 'info-card info-card-empty'}>
            {info ? (
              <>
                <div className="info-card-header">
                  <span className="info-card-icon" aria-hidden="true">{info.emoji}</span>
                  <h3>{info.name}</h3>
                </div>
                <p className="info-card-line"><strong>Para entender:</strong> {info.analogy}</p>
                <p className="info-card-line"><strong>Tecnicamente:</strong> {info.technical}</p>
                <p className="info-card-line"><strong>Sem isso:</strong> {info.withoutIt}</p>
                <p className="info-card-fact">💡 <strong>Curiosidade:</strong> {info.funFact}</p>
              </>
            ) : (
              <p className="info-card-prompt">
                👆 Passe o mouse, clique ou arraste uma peça para descobrir o que ela faz!
              </p>
            )}
          </div>

          {allDone && (
            <div className="celebration" role="status">
              <span className="celebration-emoji" aria-hidden="true">🎉</span>
              <h3>Parabéns! Você montou a placa-mãe como um técnico de verdade!</h3>
              <p>
                Trava, processador, cooler, memórias, placa de vídeo e os cabos de energia —
                tudo na ordem certa. Quer montar de novo?
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
