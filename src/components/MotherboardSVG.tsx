import type { SVGProps } from 'react';

// PCB decorativa em pixel art (apenas <rect>, shapeRendering=crispEdges).
// Os 6 sockets interativos (drop slots) são renderizados POR CIMA no
// MontarPCPage; aqui ficam só a textura e os elementos de contexto
// (painel traseiro, chipset, capacitores, trilhas, furos de fixação).
const P = {
  pcb: '#15803d',
  pcbDark: '#14532d',
  pcbLight: '#16a34a',
  trace: '#fbbf24',
  traceDim: '#a16207',
  dark: '#111827',
  chip: '#1f2937',
  silver: '#9ca3af',
  hole: '#0b3d1f',
  cap: '#1e3a8a',
  capTop: '#3b82f6',
  port: '#374151',
  portBlue: '#2563eb',
  portYellow: '#ca8a04',
} as const;

export default function MotherboardSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 400 320"
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Base da placa */}
      <rect x="0" y="0" width="400" height="320" rx="6" fill={P.pcb} />
      <rect x="4" y="4" width="392" height="312" fill={P.pcbDark} />
      <rect x="8" y="8" width="384" height="304" fill={P.pcb} />

      {/* Furos de fixação (cantos + meio) */}
      {[
        [16, 16], [376, 16], [16, 296], [376, 296], [196, 16], [16, 156], [376, 156],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 6} y={y - 6} width="12" height="12" fill={P.silver} />
          <rect x={x - 3} y={y - 3} width="6" height="6" fill={P.hole} />
        </g>
      ))}

      {/* Painel de entradas/saídas (I/O) no topo-esquerdo */}
      <rect x="28" y="14" width="92" height="26" fill={P.dark} />
      <rect x="34" y="20" width="16" height="6" fill={P.portBlue} />
      <rect x="34" y="29" width="16" height="6" fill={P.portBlue} />
      <rect x="56" y="20" width="22" height="15" fill={P.port} />
      <rect x="84" y="20" width="14" height="15" fill={P.portYellow} />
      <rect x="102" y="22" width="12" height="12" fill={P.port} />

      {/* Chipset (dissipador) centro-inferior */}
      <rect x="180" y="186" width="44" height="44" fill={P.chip} />
      <rect x="186" y="192" width="32" height="32" fill={P.dark} />
      <rect x="192" y="198" width="8" height="8" fill={P.silver} />
      <rect x="204" y="198" width="8" height="8" fill={P.silver} />
      <rect x="192" y="210" width="8" height="8" fill={P.silver} />
      <rect x="204" y="210" width="8" height="8" fill={P.silver} />

      {/* Capacitores (espalhados) */}
      {[
        [150, 70], [165, 70], [150, 250], [320, 250], [338, 250],
      ].map(([x, y], i) => (
        <g key={`cap-${i}`}>
          <rect x={x} y={y} width="10" height="16" fill={P.cap} />
          <rect x={x} y={y} width="10" height="4" fill={P.capTop} />
        </g>
      ))}

      {/* Trilhas douradas (decorativas) */}
      <rect x="120" y="120" width="80" height="2" fill={P.trace} />
      <rect x="198" y="120" width="2" height="40" fill={P.trace} />
      <rect x="60" y="170" width="120" height="2" fill={P.traceDim} />
      <rect x="250" y="90" width="2" height="70" fill={P.traceDim} />
      <rect x="250" y="158" width="90" height="2" fill={P.trace} />
      <rect x="90" y="210" width="2" height="60" fill={P.traceDim} />
    </svg>
  );
}
