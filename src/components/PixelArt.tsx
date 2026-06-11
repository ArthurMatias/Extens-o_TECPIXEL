import type { ReactNode, SVGProps } from 'react';
import type { PartId } from '../data/computerParts';

type IconProps = SVGProps<SVGSVGElement>;

// Paleta de pixel art (representa hardware real — exceção §5.2 do design system)
const C = {
  gold: '#fbbf24',
  silver: '#9ca3af',
  darkSilver: '#4b5563',
  dark: '#1f2937',
  veryDark: '#111827',
  pcbGreen: '#16a34a',
  pcbDarkGreen: '#15803d',
  blue: '#3b82f6',
  darkBlue: '#1e3a8a',
  red: '#dc2626',
  white: '#ffffff',
  hubGray: '#6b7280',
  chipDark: '#374151',
} as const;

interface PixelSvgProps extends IconProps {
  children: ReactNode;
}

function PixelSvg({ children, ...props }: PixelSvgProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CpuIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Pinos topo */}
      <rect x="6" y="2" width="2" height="4" fill={C.gold} />
      <rect x="11" y="2" width="2" height="4" fill={C.gold} />
      <rect x="19" y="2" width="2" height="4" fill={C.gold} />
      <rect x="24" y="2" width="2" height="4" fill={C.gold} />
      {/* Pinos baixo */}
      <rect x="6" y="26" width="2" height="4" fill={C.gold} />
      <rect x="11" y="26" width="2" height="4" fill={C.gold} />
      <rect x="19" y="26" width="2" height="4" fill={C.gold} />
      <rect x="24" y="26" width="2" height="4" fill={C.gold} />
      {/* Pinos esquerda */}
      <rect x="2" y="6" width="4" height="2" fill={C.gold} />
      <rect x="2" y="11" width="4" height="2" fill={C.gold} />
      <rect x="2" y="19" width="4" height="2" fill={C.gold} />
      <rect x="2" y="24" width="4" height="2" fill={C.gold} />
      {/* Pinos direita */}
      <rect x="26" y="6" width="4" height="2" fill={C.gold} />
      <rect x="26" y="11" width="4" height="2" fill={C.gold} />
      <rect x="26" y="19" width="4" height="2" fill={C.gold} />
      <rect x="26" y="24" width="4" height="2" fill={C.gold} />
      {/* Corpo prata */}
      <rect x="6" y="6" width="20" height="20" fill={C.silver} />
      <rect x="8" y="8" width="16" height="16" fill={C.darkSilver} />
      {/* Marca dourada central */}
      <rect x="14" y="14" width="4" height="4" fill={C.gold} />
    </PixelSvg>
  );
}

export function RamIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* PCB vertical */}
      <rect x="10" y="2" width="12" height="28" fill={C.pcbGreen} />
      {/* Sombra de borda */}
      <rect x="10" y="2" width="12" height="1" fill={C.pcbDarkGreen} />
      <rect x="10" y="29" width="12" height="1" fill={C.pcbDarkGreen} />
      {/* Chips de memória (4) */}
      <rect x="12" y="4" width="8" height="4" fill={C.dark} />
      <rect x="12" y="10" width="8" height="4" fill={C.dark} />
      <rect x="12" y="16" width="8" height="4" fill={C.dark} />
      <rect x="12" y="22" width="8" height="4" fill={C.dark} />
      {/* Contatos dourados na base */}
      <rect x="10" y="28" width="12" height="2" fill={C.gold} />
      {/* Entalhe (notch) nos contatos */}
      <rect x="14" y="28" width="4" height="2" fill={C.pcbGreen} />
    </PixelSvg>
  );
}

export function GpuIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Corpo da placa */}
      <rect x="2" y="8" width="28" height="18" fill={C.dark} />
      {/* Chip principal (esquerda) */}
      <rect x="4" y="10" width="8" height="8" fill={C.chipDark} />
      <rect x="6" y="12" width="4" height="4" fill={C.blue} />
      {/* Ventoinha quadrada (direita) */}
      <rect x="16" y="10" width="12" height="12" fill={C.veryDark} />
      {/* Pás da ventoinha (cruz) */}
      <rect x="21" y="11" width="2" height="10" fill={C.silver} />
      <rect x="17" y="15" width="10" height="2" fill={C.silver} />
      {/* Hub central */}
      <rect x="20" y="14" width="4" height="4" fill={C.hubGray} />
      {/* Conector PCIe dourado */}
      <rect x="4" y="26" width="20" height="2" fill={C.gold} />
      <rect x="10" y="26" width="2" height="2" fill={C.dark} />
      {/* Saída de vídeo */}
      <rect x="28" y="10" width="2" height="4" fill={C.hubGray} />
    </PixelSvg>
  );
}

export function SsdIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Corpo do SSD */}
      <rect x="2" y="8" width="28" height="16" fill={C.veryDark} />
      {/* Label azul */}
      <rect x="6" y="12" width="20" height="8" fill={C.blue} />
      {/* "Texto" no label (linhas brancas) */}
      <rect x="8" y="14" width="8" height="1" fill={C.white} />
      <rect x="8" y="17" width="12" height="1" fill={C.white} />
      {/* Parafusos nos cantos */}
      <rect x="3" y="9" width="2" height="2" fill={C.silver} />
      <rect x="27" y="9" width="2" height="2" fill={C.silver} />
      <rect x="3" y="21" width="2" height="2" fill={C.silver} />
      <rect x="27" y="21" width="2" height="2" fill={C.silver} />
      {/* Conector SATA na borda */}
      <rect x="30" y="12" width="2" height="8" fill={C.gold} />
    </PixelSvg>
  );
}

export function PsuIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Corpo da fonte */}
      <rect x="2" y="6" width="28" height="22" fill={C.darkSilver} />
      {/* Sombra superior */}
      <rect x="2" y="6" width="28" height="1" fill={C.hubGray} />
      {/* Ventilação quadrada */}
      <rect x="18" y="10" width="10" height="10" fill={C.veryDark} />
      {/* Slots de ventilação */}
      <rect x="18" y="12" width="10" height="1" fill={C.darkSilver} />
      <rect x="18" y="14" width="10" height="1" fill={C.darkSilver} />
      <rect x="18" y="16" width="10" height="1" fill={C.darkSilver} />
      <rect x="18" y="18" width="10" height="1" fill={C.darkSilver} />
      {/* Botão liga/desliga vermelho */}
      <rect x="6" y="10" width="6" height="3" fill={C.red} />
      {/* Entrada de força */}
      <rect x="6" y="15" width="8" height="6" fill={C.veryDark} />
      <rect x="8" y="17" width="4" height="2" fill={C.gold} />
      {/* Cabo saindo */}
      <rect x="14" y="23" width="14" height="2" fill={C.dark} />
    </PixelSvg>
  );
}

export function CoolerIcon(props: IconProps) {
  return (
    <PixelSvg {...props}>
      {/* Moldura externa */}
      <rect x="2" y="2" width="28" height="28" fill={C.dark} />
      {/* Área interna (azul-escuro) */}
      <rect x="4" y="4" width="24" height="24" fill={C.darkBlue} />
      {/* Pá vertical */}
      <rect x="14" y="6" width="4" height="20" fill={C.blue} />
      {/* Pá horizontal */}
      <rect x="6" y="14" width="20" height="4" fill={C.blue} />
      {/* Hub central escuro */}
      <rect x="12" y="12" width="8" height="8" fill={C.dark} />
      <rect x="14" y="14" width="4" height="4" fill={C.hubGray} />
      {/* Parafusos de canto */}
      <rect x="2" y="2" width="2" height="2" fill={C.silver} />
      <rect x="28" y="2" width="2" height="2" fill={C.silver} />
      <rect x="2" y="28" width="2" height="2" fill={C.silver} />
      <rect x="28" y="28" width="2" height="2" fill={C.silver} />
    </PixelSvg>
  );
}

export function PartIcon({ id, ...props }: IconProps & { id: PartId }) {
  switch (id) {
    case 'cpu': return <CpuIcon {...props} />;
    case 'ram': return <RamIcon {...props} />;
    case 'gpu': return <GpuIcon {...props} />;
    case 'ssd': return <SsdIcon {...props} />;
    case 'psu': return <PsuIcon {...props} />;
    case 'cooler': return <CoolerIcon {...props} />;
  }
}
