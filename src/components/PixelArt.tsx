import type { ReactNode, SVGProps } from 'react';
import type { PartKind } from '../data/computerParts';

type IconProps = SVGProps<SVGSVGElement>;

// Paleta de pixel art (representa hardware real — exceção §5.2 do design system)
const C = {
  gold: '#fbbf24',
  silver: '#9ca3af',
  lightSilver: '#d1d5db',
  darkSilver: '#4b5563',
  dark: '#1f2937',
  veryDark: '#111827',
  pcbGreen: '#16a34a',
  pcbDarkGreen: '#15803d',
  blue: '#3b82f6',
  darkBlue: '#1e3a8a',
  red: '#dc2626',
  yellow: '#eab308',
  orange: '#f97316',
  white: '#ffffff',
  hubGray: '#6b7280',
  chipDark: '#374151',
} as const;

interface PixelSvgProps extends IconProps {
  viewBox?: string;
  children: ReactNode;
}

function PixelSvg({ viewBox = '0 0 32 32', children, ...props }: PixelSvgProps) {
  return (
    <svg
      viewBox={viewBox}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

// ─── Ícones de inventário (32x32) ───────────────────────────────────────────

export function CpuIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Substrato verde com contatos */}
      <rect x="4" y="4" width="24" height="24" fill={C.pcbGreen} />
      <rect x="6" y="6" width="20" height="20" fill={C.darkSilver} />
      {/* Heat spreader prata */}
      <rect x="8" y="8" width="16" height="16" fill={C.silver} />
      <rect x="10" y="10" width="12" height="12" fill={C.lightSilver} />
      {/* Gravação central */}
      <rect x="13" y="13" width="6" height="6" fill={C.silver} />
      {/* Seta de alinhamento (canto) */}
      <rect x="4" y="4" width="4" height="4" fill={C.gold} />
      {/* Contatos dourados nas bordas do substrato */}
      <rect x="8" y="28" width="2" height="2" fill={C.gold} />
      <rect x="12" y="28" width="2" height="2" fill={C.gold} />
      <rect x="16" y="28" width="2" height="2" fill={C.gold} />
      <rect x="20" y="28" width="2" height="2" fill={C.gold} />
      <rect x="8" y="2" width="2" height="2" fill={C.gold} />
      <rect x="12" y="2" width="2" height="2" fill={C.gold} />
      <rect x="16" y="2" width="2" height="2" fill={C.gold} />
      <rect x="20" y="2" width="2" height="2" fill={C.gold} />
    </PixelSvg>
  );
}

export function CoolerIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Moldura externa */}
      <rect x="2" y="2" width="28" height="28" fill={C.dark} />
      {/* Área interna */}
      <rect x="4" y="4" width="24" height="24" fill={C.darkBlue} />
      {/* Pás */}
      <rect x="14" y="6" width="4" height="20" fill={C.blue} />
      <rect x="6" y="14" width="20" height="4" fill={C.blue} />
      {/* Hub central */}
      <rect x="12" y="12" width="8" height="8" fill={C.dark} />
      <rect x="14" y="14" width="4" height="4" fill={C.hubGray} />
      {/* Parafusos */}
      <rect x="2" y="2" width="2" height="2" fill={C.silver} />
      <rect x="28" y="2" width="2" height="2" fill={C.silver} />
      <rect x="2" y="28" width="2" height="2" fill={C.silver} />
      <rect x="28" y="28" width="2" height="2" fill={C.silver} />
    </PixelSvg>
  );
}

export function RamIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      <rect x="10" y="2" width="12" height="28" fill={C.pcbGreen} />
      <rect x="10" y="2" width="12" height="1" fill={C.pcbDarkGreen} />
      <rect x="12" y="4" width="8" height="4" fill={C.dark} />
      <rect x="12" y="10" width="8" height="4" fill={C.dark} />
      <rect x="12" y="16" width="8" height="4" fill={C.dark} />
      <rect x="12" y="22" width="8" height="4" fill={C.dark} />
      {/* Contatos dourados + chanfro */}
      <rect x="10" y="28" width="12" height="2" fill={C.gold} />
      <rect x="14" y="28" width="2" height="2" fill={C.pcbGreen} />
    </PixelSvg>
  );
}

export function GpuIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      <rect x="2" y="8" width="28" height="18" fill={C.dark} />
      <rect x="4" y="10" width="8" height="8" fill={C.chipDark} />
      <rect x="6" y="12" width="4" height="4" fill={C.blue} />
      <rect x="16" y="10" width="12" height="12" fill={C.veryDark} />
      <rect x="21" y="11" width="2" height="10" fill={C.silver} />
      <rect x="17" y="15" width="10" height="2" fill={C.silver} />
      <rect x="20" y="14" width="4" height="4" fill={C.hubGray} />
      <rect x="4" y="26" width="20" height="2" fill={C.gold} />
      <rect x="10" y="26" width="2" height="2" fill={C.dark} />
      <rect x="28" y="10" width="2" height="4" fill={C.hubGray} />
    </PixelSvg>
  );
}

export function Atx24Icon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Conector 2x12 (visto de frente, vertical) */}
      <rect x="6" y="2" width="12" height="28" fill={C.veryDark} />
      {[4, 8, 12, 16, 20, 24].map((y) => (
        <g key={y}>
          <rect x="8" y={y} width="3" height="3" fill={C.chipDark} />
          <rect x="13" y={y} width="3" height="3" fill={C.chipDark} />
        </g>
      ))}
      {/* Presilha */}
      <rect x="4" y="12" width="2" height="8" fill={C.silver} />
      {/* Feixe de fios coloridos saindo à direita */}
      <rect x="18" y="6" width="12" height="3" fill={C.yellow} />
      <rect x="18" y="11" width="12" height="3" fill={C.red} />
      <rect x="18" y="16" width="12" height="3" fill={C.orange} />
      <rect x="18" y="21" width="12" height="3" fill={C.dark} />
    </PixelSvg>
  );
}

export function Eps8Icon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Conector 4x2 (horizontal) */}
      <rect x="2" y="12" width="20" height="12" fill={C.veryDark} />
      {[4, 9, 14].map((x) => (
        <g key={x}>
          <rect x={x} y={14} width="3" height="3" fill={C.chipDark} />
          <rect x={x} y={19} width="3" height="3" fill={C.chipDark} />
        </g>
      ))}
      <rect x="19" y={14} width="2" height="3" fill={C.chipDark} />
      <rect x="19" y={19} width="2" height="3" fill={C.chipDark} />
      {/* Presilha em cima */}
      <rect x="8" y="10" width="8" height="2" fill={C.silver} />
      {/* Fios saindo para cima/direita */}
      <rect x="22" y="14" width="8" height="3" fill={C.yellow} />
      <rect x="22" y="19" width="8" height="3" fill={C.dark} />
    </PixelSvg>
  );
}

// ─── Variantes instaladas (proporção do encaixe real) ───────────────────────

/** Módulo de RAM em pé, dentro do slot DIMM (alto e fino). */
export function RamStickIcon(props: IconProps) {
  return (
    <PixelSvg viewBox="0 0 12 48" {...props}>
      <rect x="1" y="0" width="10" height="46" fill={C.pcbGreen} />
      <rect x="1" y="0" width="10" height="1" fill={C.pcbDarkGreen} />
      {[3, 11, 19, 27, 35].map((y) => (
        <rect key={y} x="3" y={y} width="6" height="6" fill={C.dark} />
      ))}
      <rect x="1" y="46" width="10" height="2" fill={C.gold} />
    </PixelSvg>
  );
}

/** Placa de vídeo comprida, encaixada no PCIe. */
export function GpuCardIcon(props: IconProps) {
  return (
    <PixelSvg viewBox="0 0 120 30" {...props}>
      {/* Bracket (suporte traseiro) */}
      <rect x="0" y="0" width="6" height="30" fill={C.silver} />
      <rect x="2" y="4" width="2" height="6" fill={C.veryDark} />
      <rect x="2" y="14" width="2" height="6" fill={C.veryDark} />
      {/* Corpo / shroud */}
      <rect x="6" y="2" width="110" height="22" fill={C.dark} />
      <rect x="8" y="4" width="106" height="18" fill={C.veryDark} />
      {/* Duas ventoinhas */}
      {[22, 70].map((cx) => (
        <g key={cx}>
          <rect x={cx} y="5" width="28" height="16" fill={C.dark} />
          <rect x={cx + 12} y="6" width="4" height="14" fill={C.silver} />
          <rect x={cx + 2} y="11" width="24" height="4" fill={C.silver} />
          <rect x={cx + 10} y="9" width="8" height="8" fill={C.hubGray} />
        </g>
      ))}
      {/* Conector dourado embaixo (entrando no slot) */}
      <rect x="14" y="24" width="70" height="4" fill={C.gold} />
      <rect x="34" y="24" width="4" height="4" fill={C.dark} />
    </PixelSvg>
  );
}

/** Plug ATX 24 pinos encaixado (vertical, fios saindo pela direita). */
export function Atx24PlugIcon(props: IconProps) {
  return (
    <PixelSvg viewBox="0 0 20 48" {...props}>
      <rect x="2" y="2" width="12" height="44" fill={C.veryDark} />
      {[5, 12, 19, 26, 33, 40].map((y) => (
        <g key={y}>
          <rect x="4" y={y} width="3" height="4" fill={C.chipDark} />
          <rect x="9" y={y} width="3" height="4" fill={C.chipDark} />
        </g>
      ))}
      <rect x="0" y="18" width="2" height="12" fill={C.silver} />
      {/* Fios saindo */}
      <rect x="14" y="8" width="6" height="3" fill={C.yellow} />
      <rect x="14" y="16" width="6" height="3" fill={C.red} />
      <rect x="14" y="24" width="6" height="3" fill={C.orange} />
      <rect x="14" y="32" width="6" height="3" fill={C.dark} />
    </PixelSvg>
  );
}

/** Plug EPS 8 pinos encaixado (horizontal, fios saindo por cima). */
export function Eps8PlugIcon(props: IconProps) {
  return (
    <PixelSvg viewBox="0 0 32 16" {...props}>
      <rect x="2" y="4" width="28" height="10" fill={C.veryDark} />
      {[4, 11, 18, 25].map((x) => (
        <g key={x}>
          <rect x={x} y="6" width="4" height="3" fill={C.chipDark} />
          <rect x={x} y="10" width="4" height="3" fill={C.chipDark} />
        </g>
      ))}
      {/* Fios saindo para cima */}
      <rect x="6" y="0" width="3" height="4" fill={C.yellow} />
      <rect x="14" y="0" width="3" height="4" fill={C.dark} />
      <rect x="22" y="0" width="3" height="4" fill={C.yellow} />
    </PixelSvg>
  );
}

// ─── Mapas por tipo de peça ─────────────────────────────────────────────────

export function PartIcon({ kind, ...props }: IconProps & { kind: PartKind }) {
  switch (kind) {
    case 'cpu': return <CpuIcon {...props} />;
    case 'cooler': return <CoolerIcon {...props} />;
    case 'ram': return <RamIcon {...props} />;
    case 'gpu': return <GpuIcon {...props} />;
    case 'atx24': return <Atx24Icon {...props} />;
    case 'eps8': return <Eps8Icon {...props} />;
  }
}

/** Ícone da peça já instalada, com a proporção do encaixe real. */
export function InstalledIcon({ kind, ...props }: IconProps & { kind: PartKind }) {
  switch (kind) {
    case 'cpu': return <CpuIcon {...props} />;
    case 'cooler': return <CoolerIcon {...props} />;
    case 'ram': return <RamStickIcon {...props} />;
    case 'gpu': return <GpuCardIcon {...props} />;
    case 'atx24': return <Atx24PlugIcon {...props} />;
    case 'eps8': return <Eps8PlugIcon {...props} />;
  }
}
