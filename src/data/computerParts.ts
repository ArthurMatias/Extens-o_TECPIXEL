// Dados do game "Monte seu Computador" — montagem realista peça a peça.
// A ordem real de montagem é imposta pela mecânica (trava → CPU → trava → cooler).

export type PartKind = 'cpu' | 'cooler' | 'ram' | 'gpu' | 'atx24' | 'eps8';
export type InfoKey = PartKind | 'lever';

export type PieceId = 'cpu' | 'cooler' | 'ram-1' | 'ram-2' | 'gpu' | 'atx24' | 'eps8';

export interface PartInfo {
  key: InfoKey;
  name: string;
  emoji: string;
  analogy: string;
  technical: string;
  withoutIt: string;
  funFact: string;
}

export interface Piece {
  id: PieceId;
  kind: PartKind;
  label: string;
}

export const PART_INFO: PartInfo[] = [
  {
    key: 'lever',
    name: 'Trava do socket (alavanca de retenção)',
    emoji: '🔒',
    analogy: 'É o cinto de segurança do processador. Levanta para entrar, abaixa para prender.',
    technical: 'A alavanca de retenção prende o processador no socket LGA, garantindo contato dos pinos sem soldar nada.',
    withoutIt: 'O processador ficaria solto e os pinos delicados não fariam contato com a placa.',
    funFact: 'Um socket moderno tem mais de 1700 pininhos — por isso a trava existe: nada de força bruta!',
  },
  {
    key: 'cpu',
    name: 'CPU — Processador',
    emoji: '🧠',
    analogy: 'É o cérebro do computador. Faz bilhões de continhas por segundo para tudo funcionar.',
    technical: 'A CPU encaixa no socket com a seta dourada alinhada ao canto certo — só entra de um jeito.',
    withoutIt: 'O computador não consegue pensar nem fazer nada — fica completamente parado.',
    funFact: 'Uma CPU moderna faz mais de 4 bilhões de operações por segundo!',
  },
  {
    key: 'cooler',
    name: 'Cooler — Refrigeração da CPU',
    emoji: '❄️',
    analogy: 'É o ar-condicionado do cérebro. Fica em cima do processador para ele não fritar.',
    technical: 'Entre o cooler e a CPU vai a pasta térmica, que ajuda o calor a passar para o dissipador.',
    withoutIt: 'A CPU passa de 100°C em segundos e o computador desliga para se proteger.',
    funFact: 'A pasta térmica é tipo um "creme" — uma gota do tamanho de um grão de arroz basta!',
  },
  {
    key: 'ram',
    name: 'RAM — Memória de trabalho',
    emoji: '📝',
    analogy: 'É a memória de curto prazo. Guarda o que o computador está usando agora.',
    technical: 'O módulo entra no slot DIMM com o chanfro alinhado e os clipes fecham com um "clic".',
    withoutIt: 'O computador nem liga direito — não tem onde rascunhar as contas.',
    funFact: 'Dois módulos juntos trabalham em dupla (dual channel) e ficam mais rápidos!',
  },
  {
    key: 'gpu',
    name: 'GPU — Placa de Vídeo',
    emoji: '🎨',
    analogy: 'É a artista do computador. Desenha tudo que aparece na tela.',
    technical: 'A placa entra no slot PCI Express x16, o mais comprido da placa-mãe, até a travinha clicar.',
    withoutIt: 'Sem vídeo dedicado, jogos e programas 3D ficam lentos ou nem abrem.',
    funFact: 'Em 1 segundo, uma GPU pode pintar a tela mais de 100 vezes!',
  },
  {
    key: 'atx24',
    name: 'Cabo ATX de 24 pinos',
    emoji: '🔌',
    analogy: 'É a veia principal de energia. Liga a fonte ao corpo inteiro da placa-mãe.',
    technical: 'O conector de 24 pinos só encaixa numa posição e tem uma presilha que segura firme.',
    withoutIt: 'A placa-mãe fica sem energia nenhuma — nada acende, nada gira.',
    funFact: 'São 24 fios de cores diferentes, cada cor leva uma "voltagem" diferente!',
  },
  {
    key: 'eps8',
    name: 'Cabo EPS de 8 pinos (CPU)',
    emoji: '⚡',
    analogy: 'É o lanche reforçado do processador: energia extra só para ele.',
    technical: 'O conector EPS de 8 pinos fica perto do socket e alimenta diretamente a CPU.',
    withoutIt: 'O computador pode até acender, mas o processador não liga — tela preta.',
    funFact: 'Processadores potentes comem tanta energia que alguns precisam de DOIS cabos desses!',
  },
];

export const PIECES: Piece[] = [
  { id: 'cpu', kind: 'cpu', label: 'Processador' },
  { id: 'cooler', kind: 'cooler', label: 'Cooler' },
  { id: 'ram-1', kind: 'ram', label: 'RAM — módulo 1' },
  { id: 'ram-2', kind: 'ram', label: 'RAM — módulo 2' },
  { id: 'gpu', kind: 'gpu', label: 'Placa de Vídeo' },
  { id: 'atx24', kind: 'atx24', label: 'Cabo 24 pinos' },
  { id: 'eps8', kind: 'eps8', label: 'Cabo 8 pinos' },
];

export function findInfo(key: InfoKey): PartInfo {
  const info = PART_INFO.find((p) => p.key === key);
  if (!info) throw new Error(`Informação desconhecida: ${key}`);
  return info;
}

export function findPiece(id: PieceId): Piece {
  const piece = PIECES.find((p) => p.id === id);
  if (!piece) throw new Error(`Peça desconhecida: ${id}`);
  return piece;
}
