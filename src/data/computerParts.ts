export type PartId = 'cpu' | 'ram' | 'gpu' | 'ssd' | 'psu' | 'cooler';

export interface ComputerPart {
  id: PartId;
  name: string;
  shortName: string;
  emoji: string;
  analogy: string;
  technical: string;
  withoutIt: string;
  funFact: string;
}

export const COMPUTER_PARTS: ComputerPart[] = [
  {
    id: 'cpu',
    name: 'CPU — Processador',
    shortName: 'Processador',
    emoji: '🧠',
    analogy: 'É o cérebro do computador. Faz milhões de continhas por segundo para tudo funcionar.',
    technical: 'A CPU (Central Processing Unit) executa as instruções dos programas. Sua velocidade é medida em GHz.',
    withoutIt: 'O computador não consegue pensar nem fazer nada — fica completamente parado.',
    funFact: 'Uma CPU moderna faz mais de 4 bilhões de operações por segundo!',
  },
  {
    id: 'ram',
    name: 'RAM — Memória',
    shortName: 'Memória RAM',
    emoji: '📝',
    analogy: 'É a memória de curto prazo, igual quando você guarda um número de telefone na cabeça pra discar agora.',
    technical: 'A RAM guarda os programas e dados que estão em uso. Quando o PC desliga, ela esquece tudo.',
    withoutIt: 'O computador não consegue lembrar do que está fazendo enquanto trabalha — tudo trava.',
    funFact: '8 GB de RAM equivalem a guardar 8 bilhões de letrinhas ao mesmo tempo!',
  },
  {
    id: 'gpu',
    name: 'GPU — Placa de Vídeo',
    shortName: 'Placa de Vídeo',
    emoji: '🎨',
    analogy: 'É a artista do computador. Desenha tudo que aparece na tela: jogos, vídeos, animações.',
    technical: 'A GPU (Graphics Processing Unit) processa imagens em paralelo, milhares de pixels ao mesmo tempo.',
    withoutIt: 'A tela fica preta ou os gráficos ficam bem feios e travados.',
    funFact: 'Em 1 segundo, uma GPU pode pintar a tela mais de 100 vezes!',
  },
  {
    id: 'ssd',
    name: 'SSD — Armazenamento',
    shortName: 'Armazenamento',
    emoji: '🎒',
    analogy: 'É a mochila do computador. Guarda tudo: fotos, jogos, vídeos. E não esquece quando desliga.',
    technical: 'O SSD (Solid State Drive) usa chips de memória flash. É bem mais rápido que o HD antigo.',
    withoutIt: 'Não tem onde guardar nada — nem o sistema operacional consegue ficar salvo.',
    funFact: 'Um SSD lê dados até 100 vezes mais rápido que um HD mecânico!',
  },
  {
    id: 'psu',
    name: 'Fonte — Energia',
    shortName: 'Fonte',
    emoji: '❤️',
    analogy: 'É o coração do computador. Pega energia da tomada e distribui pra todas as peças.',
    technical: 'A PSU (Power Supply Unit) converte a corrente alternada da tomada em corrente contínua para os componentes.',
    withoutIt: 'Nada liga! É como tentar acender uma lâmpada sem fio.',
    funFact: 'Uma fonte comum entrega cerca de 500 watts — energia para 50 lâmpadas LED juntas!',
  },
  {
    id: 'cooler',
    name: 'Cooler — Ventoinha',
    shortName: 'Ventoinha',
    emoji: '❄️',
    analogy: 'É o ar-condicionado do processador. Sem ele, o cérebro do PC ficaria quente demais.',
    technical: 'O cooler dissipa o calor da CPU usando ar (ventoinha) ou líquido (water cooler).',
    withoutIt: 'A CPU esquenta tanto que o computador desliga sozinho para se proteger.',
    funFact: 'Sem cooler, o processador pode chegar a 100°C — temperatura da água fervendo!',
  },
];

export function findPart(id: PartId): ComputerPart {
  const part = COMPUTER_PARTS.find((p) => p.id === id);
  if (!part) throw new Error(`Peça desconhecida: ${id}`);
  return part;
}
