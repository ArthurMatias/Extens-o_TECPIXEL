import type { SVGProps } from 'react';

// Placa-mãe realista em pixel art (apenas <rect>, shapeRendering=crispEdges).
// Os elementos INTERATIVOS (drop zones, trava do socket) são posicionados por
// cima no MontarPCPage, alinhados às features desenhadas aqui:
//   socket LGA  centro (160,156)  | DIMM 1 x256..272 | DIMM 2 x292..308
//   PCIe x16    y296..318         | ATX 24p x428..458 | EPS 8p x56..112
const P = {
  pcb: '#15803d',
  pcbDark: '#14532d',
  pcbDarker: '#0b3d1f',
  trace: '#fbbf24',
  traceDim: '#a16207',
  dark: '#111827',
  chip: '#1f2937',
  chipLight: '#374151',
  silver: '#9ca3af',
  silverLight: '#d1d5db',
  gold: '#fbbf24',
  cap: '#1e3a8a',
  capTop: '#3b82f6',
  port: '#374151',
  portBlue: '#2563eb',
  audioGreen: '#22c55e',
  audioPink: '#ec4899',
} as const;

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export default function MotherboardSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 480 400"
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* ── Base da placa ── */}
      <rect x="0" y="0" width="480" height="400" fill={P.pcbDark} />
      <rect x="6" y="6" width="468" height="388" fill={P.pcb} />

      {/* Furos de fixação */}
      {[
        [16, 16], [240, 16], [464, 16], [16, 200], [464, 200], [16, 384], [240, 384], [464, 384],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x - 5} y={y - 5} width="10" height="10" fill={P.silver} />
          <rect x={x - 2} y={y - 2} width="4" height="4" fill={P.pcbDarker} />
        </g>
      ))}

      {/* ── Trilhas decorativas ── */}
      <rect x="160" y="216" width="2" height="60" fill={P.traceDim} />
      <rect x="160" y="274" width="60" height="2" fill={P.traceDim} />
      <rect x="220" y="120" width="30" height="2" fill={P.trace} />
      <rect x="248" y="120" width="2" height="40" fill={P.trace} />
      <rect x="320" y="160" width="2" height="80" fill={P.traceDim} />
      <rect x="320" y="238" width="60" height="2" fill={P.traceDim} />
      <rect x="120" y="226" width="80" height="2" fill={P.trace} />
      <rect x="370" y="100" width="50" height="2" fill={P.traceDim} />

      {/* ── Painel I/O (canto superior esquerdo) ── */}
      <rect x="24" y="56" width="120" height="30" fill={P.dark} />
      <rect x="30" y="62" width="16" height="8" fill={P.portBlue} />
      <rect x="30" y="72" width="16" height="8" fill={P.portBlue} />
      <rect x="52" y="62" width="22" height="18" fill={P.port} />
      <rect x="80" y="62" width="14" height="18" fill={P.chipLight} />
      <rect x="100" y="64" width="8" height="8" fill={P.audioGreen} />
      <rect x="112" y="64" width="8" height="8" fill={P.audioPink} />
      <rect x="124" y="64" width="8" height="8" fill={P.portBlue} />

      {/* ── EPS 8 pinos (topo, perto do VRM) — zona interativa por cima ── */}
      <rect x="56" y="22" width="56" height="24" fill={P.dark} />
      {range(4).map((i) => (
        <g key={i}>
          <rect x={62 + i * 13} y="26" width="6" height="6" fill={P.chipLight} />
          <rect x={62 + i * 13} y="36" width="6" height="6" fill={P.chipLight} />
        </g>
      ))}

      {/* ── VRM: dissipadores ao redor do socket ── */}
      <rect x="110" y="58" width="120" height="26" fill={P.silver} />
      {range(7).map((i) => (
        <rect key={i} x={114 + i * 17} y="60" width="6" height="22" fill={P.chipLight} />
      ))}
      <rect x="76" y="108" width="24" height="100" fill={P.silver} />
      {range(6).map((i) => (
        <rect key={i} x="78" y={112 + i * 16} width="20" height="6" fill={P.chipLight} />
      ))}

      {/* Capacitores */}
      {[
        [104, 222], [120, 222], [136, 222], [232, 110], [232, 130], [232, 150],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="10" height="14" fill={P.cap} />
          <rect x={x} y={y} width="10" height="4" fill={P.capTop} />
        </g>
      ))}

      {/* ── Socket LGA (centro-esquerda) ── */}
      <rect x="108" y="104" width="104" height="104" fill={P.silver} />
      <rect x="116" y="112" width="88" height="88" fill={P.chip} />
      {/* Grade de pinos dourados */}
      {range(10).flatMap((r) =>
        range(10).map((c) => (
          <rect key={`${r}-${c}`} x={122 + c * 8} y={118 + r * 8} width="3" height="3" fill={P.gold} />
        ))
      )}
      {/* Marca de alinhamento (triângulo do canto, em pixel) */}
      <rect x="110" y="106" width="8" height="3" fill={P.gold} />
      <rect x="110" y="106" width="3" height="8" fill={P.gold} />
      {/* Apoio da alavanca (gancho à direita) */}
      <rect x="212" y="180" width="8" height="12" fill={P.silver} />

      {/* ── Slots DIMM (2x, à direita do socket) ── */}
      {[256, 292].map((x) => (
        <g key={x}>
          {/* Clipes das pontas */}
          <rect x={x - 2} y="58" width="20" height="12" fill={P.silverLight} />
          <rect x={x - 2} y="262" width="20" height="12" fill={P.silverLight} />
          {/* Corpo do slot */}
          <rect x={x} y="68" width="16" height="196" fill={P.dark} />
          {/* Canal interno */}
          <rect x={x + 5} y="72" width="6" height="188" fill={P.chipLight} />
          {/* Chanfro (key) fora do centro */}
          <rect x={x + 5} y="150" width="6" height="8" fill={P.gold} />
        </g>
      ))}

      {/* ── Conector ATX 24 pinos (borda direita) ── */}
      <rect x="428" y="148" width="30" height="100" fill={P.dark} />
      {range(12).map((i) => (
        <g key={i}>
          <rect x="433" y={152 + i * 8} width="5" height="5" fill={P.chipLight} />
          <rect x="446" y={152 + i * 8} width="5" height="5" fill={P.chipLight} />
        </g>
      ))}

      {/* ── PCIe x16 (parte inferior) ── */}
      <rect x="52" y="296" width="228" height="22" fill={P.dark} />
      <rect x="58" y="301" width="216" height="12" fill={P.chipLight} />
      {/* Chanfro do slot */}
      <rect x="88" y="301" width="6" height="12" fill={P.dark} />
      {/* Trava de retenção na ponta */}
      <rect x="280" y="300" width="12" height="14" fill={P.silver} />

      {/* PCIe x1 decorativo */}
      <rect x="52" y="330" width="70" height="14" fill={P.dark} />
      <rect x="56" y="333" width="62" height="8" fill={P.chipLight} />

      {/* ── M.2 decorativo ── */}
      <rect x="310" y="252" width="110" height="12" fill={P.dark} />
      <rect x="314" y="255" width="80" height="6" fill={P.chipLight} />
      <rect x="424" y="254" width="8" height="8" fill={P.gold} />

      {/* ── Chipset com dissipador ── */}
      <rect x="330" y="296" width="74" height="68" fill={P.silver} />
      <rect x="336" y="302" width="62" height="56" fill={P.chipLight} />
      {range(4).map((i) => (
        <rect key={i} x="340" y={306 + i * 13} width="54" height="6" fill={P.dark} />
      ))}
      <rect x="358" y="322" width="18" height="18" fill={P.capTop} />

      {/* ── Portas SATA ── */}
      {[286, 312].map((y) => (
        <g key={y}>
          <rect x="430" y={y} width="32" height="18" fill={P.dark} />
          <rect x="434" y={y + 5} width="18" height="8" fill={P.chipLight} />
          <rect x="452" y={y + 5} width="6" height="4" fill={P.chipLight} />
        </g>
      ))}

      {/* ── Bateria CMOS ── */}
      <rect x="72" y="336" width="24" height="24" fill={P.silver} />
      <rect x="76" y="340" width="16" height="16" fill={P.silverLight} />
      <rect x="81" y="345" width="6" height="6" fill={P.silver} />

      {/* ── Pinos do painel frontal ── */}
      {range(6).map((i) => (
        <rect key={i} x={414 + i * 8} y="372" width="4" height="8" fill={P.gold} />
      ))}
    </svg>
  );
}
