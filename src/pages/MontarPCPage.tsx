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
import { COMPUTER_PARTS, findPart } from '../data/computerParts';
import type { ComputerPart, PartId } from '../data/computerParts';
import { PartIcon } from '../components/PixelArt';
import MotherboardSVG from '../components/MotherboardSVG';

interface SlotDef {
  id: PartId;
  label: string;
  /** posição do centro do socket sobre a placa-mãe (em %) */
  top: string;
  left: string;
}

// Posições aproximam o layout real de uma placa-mãe.
// O rótulo é derivado do nome da peça (findPart) para nunca divergir do inventário.
const SLOT_POSITIONS: { id: PartId; top: string; left: string }[] = [
  { id: 'cooler', top: '16%', left: '33%' },
  { id: 'cpu', top: '40%', left: '33%' },
  { id: 'ram', top: '30%', left: '71%' },
  { id: 'ssd', top: '60%', left: '20%' },
  { id: 'gpu', top: '78%', left: '52%' },
  { id: 'psu', top: '55%', left: '87%' },
];

const SLOTS: SlotDef[] = SLOT_POSITIONS.map((s) => ({
  ...s,
  label: findPart(s.id).shortName,
}));

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
interface DraggablePartProps {
  part: ComputerPart;
  selected: boolean;
  onSelect: (id: PartId) => void;
  onPreview: (id: PartId) => void;
}

function DraggablePart({ part, selected, onSelect, onPreview }: DraggablePartProps) {
  // Não espalhamos `attributes` do dnd-kit: o elemento já é um <button> real e,
  // sem KeyboardSensor, o aria-roledescription="draggable" + instruções de
  // arraste por teclado que o dnd-kit injeta seriam enganosos para leitores de
  // tela. O caminho de teclado aqui é clicar para selecionar → "Encaixar aqui".
  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: part.id,
    data: { label: part.shortName },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className="dnd-piece part-card"
      data-dragging={isDragging}
      data-selected={selected}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        touchAction: 'none',
      }}
      onClick={() => onSelect(part.id)}
      onMouseEnter={() => onPreview(part.id)}
      onFocus={() => onPreview(part.id)}
      {...listeners}
      aria-pressed={selected}
      aria-label={`${part.shortName}. ${selected ? 'Selecionada — escolha um slot para encaixar.' : 'Arraste para a placa-mãe ou clique para selecionar.'}`}
    >
      <PartIcon id={part.id} className="pixel-icon" />
      <span className="part-card-name">
        <span className="part-card-emoji" aria-hidden="true">{part.emoji}</span>{' '}
        {part.shortName}
      </span>
    </button>
  );
}

// ─── Socket (drop zone) sobre a placa-mãe ───────────────────────────────────
interface DropSlotProps {
  slot: SlotDef;
  filled: boolean;
  activePart: PartId | null;
  selectedPart: PartId | null;
  hint: boolean;
  onPlaceClick: (slotId: PartId) => void;
  onReview: (id: PartId) => void;
}

function DropSlot({
  slot, filled, activePart, selectedPart, hint, onPlaceClick, onReview,
}: DropSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: slot.id,
    data: { label: slot.label },
    disabled: filled,
  });

  let state: 'idle' | 'valid' | 'invalid' = 'idle';
  if (isOver && activePart) {
    state = activePart === slot.id ? 'valid' : 'invalid';
  }

  return (
    <div
      ref={setNodeRef}
      id={`slot-${slot.id}`}
      className={`dnd-slot ${filled ? 'slot-filled' : 'slot-empty'}`}
      data-state={state}
      data-hint={hint ? 'pulse' : undefined}
      style={{ top: slot.top, left: slot.left }}
      tabIndex={-1}
    >
      {filled ? (
        <button
          type="button"
          className="slot-piece"
          onClick={() => onReview(slot.id)}
          aria-label={`${slot.label} encaixado. Ver explicação novamente.`}
        >
          <PartIcon id={slot.id} className="pixel-icon" />
        </button>
      ) : (
        <>
          {/* pista (a): rótulo textual */}
          <span className="slot-label">{slot.label}</span>
          {/* pista (b): silhueta fantasma da peça */}
          <PartIcon id={slot.id} className="pixel-icon slot-ghost" />
          {/* alternativa por ponteiro único (WCAG 2.5.7) + teclado */}
          {selectedPart && (
            <button
              type="button"
              className="slot-place-btn"
              onClick={() => onPlaceClick(slot.id)}
              aria-label={`Encaixar ${findPart(selectedPart).shortName} no ${slot.label}`}
            >
              Encaixar aqui
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function MontarPCPage() {
  const reducedMotion = usePrefersReducedMotion();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const [placed, setPlaced] = useState<Set<PartId>>(new Set());
  const [activePart, setActivePart] = useState<PartId | null>(null);
  const [selectedPart, setSelectedPart] = useState<PartId | null>(null);
  const [infoPart, setInfoPart] = useState<ComputerPart | null>(null);
  const [message, setMessage] = useState<string>('');
  const [hintFor, setHintFor] = useState<PartId | null>(null);
  const errorCountsRef = useRef<Record<string, number>>({});
  const focusSlotRef = useRef<PartId | null>(null);

  const total = SLOTS.length;
  const count = placed.size;
  const pct = (count / total) * 100;
  const allDone = count === total;
  const available = COMPUTER_PARTS.filter((p) => !placed.has(p.id));

  // Devolve o foco ao socket recém-preenchido (acessibilidade).
  useEffect(() => {
    if (focusSlotRef.current) {
      const id = focusSlotRef.current;
      focusSlotRef.current = null;
      requestAnimationFrame(() =>
        document.querySelector<HTMLButtonElement>(`#slot-${id} .slot-piece`)?.focus()
      );
    }
  }, [placed]);

  const placePart = (part: PartId) => {
    setPlaced((prev) => new Set(prev).add(part));
    setInfoPart(findPart(part));
    setMessage(`Boa! ${findPart(part).shortName} encaixou no lugar certo. 🎉`);
    setSelectedPart(null);
    setHintFor(null);
    focusSlotRef.current = part;
    if ('vibrate' in navigator) {
      try { navigator.vibrate(10); } catch { /* sem suporte */ }
    }
  };

  const failPlace = (part: PartId, slot: PartId) => {
    const partName = findPart(part).shortName;
    const slotName = SLOTS.find((s) => s.id === slot)?.label ?? 'esse lugar';
    setMessage(`Quase! A ${partName} não vai no ${slotName}. Tente outro lugar. 😉`);
    const next = (errorCountsRef.current[part] ?? 0) + 1;
    errorCountsRef.current[part] = next;
    if (next >= 2) setHintFor(part); // após 2 erros, mostra onde é a peça certa
  };

  const attemptPlace = (part: PartId, slot: PartId) => {
    if (part === slot) placePart(part);
    else failPlace(part, slot);
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActivePart(e.active.id as PartId);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActivePart(null);
    const part = e.active.id as PartId;
    const slot = e.over?.id as PartId | undefined;
    if (!slot) return; // soltou fora → snap-back automático, sem punição
    attemptPlace(part, slot);
  };

  const handleSelect = (id: PartId) => {
    setSelectedPart((prev) => (prev === id ? null : id));
    setInfoPart(findPart(id));
    setMessage('');
  };

  const reset = () => {
    setPlaced(new Set());
    setActivePart(null);
    setSelectedPart(null);
    setInfoPart(null);
    setMessage('');
    errorCountsRef.current = {};
    setHintFor(null);
  };

  return (
    <section className="section" id="montar-pc">
      <div className="container">
        <div className="section-header">
          <h1>Monte seu Computador</h1>
          <p>
            Arraste cada peça para o lugar certo na placa-mãe — ou clique numa peça e
            depois no encaixe. A cada acerto você descobre o que ela faz!
          </p>
        </div>

        <div className="game-wrapper">
          <div className="game-header">
            <div className="game-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-text">{count} de {total} peças encaixadas</div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={reset}
              disabled={count === 0 && !selectedPart}
            >
              Recomeçar
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragCancel={() => setActivePart(null)}
            onDragEnd={handleDragEnd}
          >
            <div className="game-board">
              {/* Placa-mãe + sockets sobrepostos */}
              <div className="motherboard" role="group" aria-label="Placa-mãe com encaixes">
                <MotherboardSVG className="motherboard-bg" />
                {SLOTS.map((slot) => (
                  <DropSlot
                    key={slot.id}
                    slot={slot}
                    filled={placed.has(slot.id)}
                    activePart={activePart}
                    selectedPart={selectedPart && !placed.has(slot.id) ? selectedPart : null}
                    hint={hintFor === slot.id && !placed.has(slot.id)}
                    onPlaceClick={(slotId) => selectedPart && attemptPlace(selectedPart, slotId)}
                    onReview={(id) => setInfoPart(findPart(id))}
                  />
                ))}
              </div>

              {/* Inventário de peças */}
              <div className="inventory">
                <h2 className="inventory-title">
                  {allDone ? 'Tudo encaixado!' : 'Peças disponíveis'}
                </h2>
                <div className="inventory-grid">
                  {available.map((part) => (
                    <DraggablePart
                      key={part.id}
                      part={part}
                      selected={selectedPart === part.id}
                      onSelect={handleSelect}
                      onPreview={(id) => setInfoPart(findPart(id))}
                    />
                  ))}
                  {available.length === 0 && (
                    <p className="inventory-empty">Você usou todas as peças.</p>
                  )}
                </div>
              </div>

              <DragOverlay
                dropAnimation={
                  reducedMotion ? null : { duration: 250, easing: 'cubic-bezier(.2,.8,.2,1)' }
                }
              >
                {activePart ? (
                  <div className="dnd-piece dnd-overlay">
                    <PartIcon id={activePart} className="pixel-icon" />
                  </div>
                ) : null}
              </DragOverlay>
            </div>
          </DndContext>

          {/* Mensagens para leitor de tela + visíveis */}
          <p className="game-message" aria-live="assertive">{message}</p>

          {/* Card de explicação */}
          <div
            className={infoPart ? 'info-card' : 'info-card info-card-empty'}
            aria-live="polite"
            aria-atomic="true"
          >
            {infoPart ? (
              <>
                <div className="info-card-header">
                  <span className="info-card-icon" aria-hidden="true">{infoPart.emoji}</span>
                  <h3>{infoPart.name}</h3>
                </div>
                <p className="info-card-line"><strong>Para entender:</strong> {infoPart.analogy}</p>
                <p className="info-card-line"><strong>Tecnicamente:</strong> {infoPart.technical}</p>
                <p className="info-card-line"><strong>Sem essa peça:</strong> {infoPart.withoutIt}</p>
                <p className="info-card-fact">💡 <strong>Curiosidade:</strong> {infoPart.funFact}</p>
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
              <h3>Parabéns! Você montou um computador inteiro!</h3>
              <p>Agora você conhece o nome e a função de cada peça principal. Quer montar de novo?</p>
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
