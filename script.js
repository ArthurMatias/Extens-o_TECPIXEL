// ===== DIAGNOSTIC TREE =====
// Each node is either a question (has "options") or a result (has "diagnosis")
// Questions have: question, description, badge (optional), options[]
// Each option has: label, icon (optional), next (child node)
// Results have: diagnosis, explanation, steps[], tip, videoSearch

const diagnosticTree = {
  question: "Qual problema voce esta enfrentando?",
  description: "Selecione a categoria que melhor descreve a situacao do seu computador.",
  badge: "Categoria",
  isGrid: true,
  options: [
    {
      label: "Computador lento", icon: "🐢",
      next: {
        question: "Quando o computador fica lento?",
        description: "Isso nos ajuda a identificar se o problema e de hardware ou software.",
        badge: "Momento",
        options: [
          {
            label: "Lento desde que liga",
            next: {
              question: "O que exatamente acontece ao ligar?",
              description: "Descreva o comportamento que voce observa na inicializacao.",
              badge: "Sintoma",
              options: [
                {
                  label: "Demora muito para chegar na area de trabalho",
                  next: {
                    question: "Quanto tempo aproximadamente demora para iniciar?",
                    description: "O tempo de inicializacao nos ajuda a avaliar a gravidade.",
                    badge: "Tempo",
                    options: [
                      {
                        label: "Entre 2 e 5 minutos",
                        next: {
                          question: "Seu computador possui SSD ou HD?",
                          description: "O tipo de disco e crucial para a velocidade de inicializacao.",
                          badge: "Armazenamento",
                          options: [
                            {
                              label: "HD (disco rigido mecanico)",
                              next: {
                                diagnosis: "Inicializacao lenta causada por HD mecanico com excesso de programas na inicializacao",
                                explanation: "O disco rigido mecanico (HD) possui partes moveis que leem dados de forma sequencial, muito mais lento que um SSD. Quando existem muitos programas configurados para abrir junto com o Windows, o HD precisa ler dezenas de arquivos ao mesmo tempo, criando um gargalo enorme. Cada programa na inicializacao pode adicionar de 5 a 30 segundos ao tempo de boot. Alem disso, com o tempo, a fragmentacao do disco piora, pois os arquivos ficam espalhados em diferentes partes do disco, exigindo mais movimentos mecanicos para leitura.",
                                steps: [
                                  "Pressione Ctrl + Shift + Esc para abrir o Gerenciador de Tarefas",
                                  "Clique na aba 'Inicializar' para ver todos os programas que abrem com o Windows",
                                  "Para cada programa, veja o 'Impacto na inicializacao' - desabilite os que mostram 'Alto' ou 'Medio' e que nao sao essenciais",
                                  "Clique com botao direito no programa > Desabilitar (isso NAO desinstala, apenas impede de abrir automaticamente)",
                                  "Abra o menu Iniciar, digite 'Limpeza de Disco' e execute na unidade C:",
                                  "Marque 'Arquivos temporarios', 'Lixeira' e 'Cache' e clique em OK",
                                  "Abra o menu Iniciar, digite 'Desfragmentar' e otimize a unidade C: (apenas para HD, NAO faca em SSD)",
                                  "Reinicie o computador e compare o tempo de inicializacao"
                                ],
                                tip: "A melhor melhoria possivel e trocar o HD por um SSD. Um SSD de 240GB custa entre R$100-150 e reduz o tempo de inicializacao de minutos para 15-30 segundos. E a atualizacao com melhor custo-beneficio que existe.",
                                videoSearch: "como deixar PC mais rapido trocar HD por SSD tutorial"
                              }
                            },
                            {
                              label: "SSD (disco de estado solido)",
                              next: {
                                diagnosis: "SSD com excesso de programas na inicializacao ou pouco espaco livre",
                                explanation: "Mesmo com SSD, o computador pode demorar se houver muitos programas configurados para abrir automaticamente. O SSD precisa de pelo menos 15-20% de espaco livre para funcionar bem - quando fica muito cheio, a velocidade cai drasticamente porque o controlador nao consegue gerenciar os dados de forma eficiente. Alem disso, drivers desatualizados ou o firmware do SSD podem causar lentidao.",
                                steps: [
                                  "Verifique o espaco livre: clique com botao direito no disco C: > Propriedades",
                                  "Se o espaco livre for menor que 20%, delete arquivos grandes desnecessarios ou mova para HD externo",
                                  "Abra Gerenciador de Tarefas (Ctrl+Shift+Esc) > aba Inicializar",
                                  "Desabilite todos os programas que nao sao essenciais na inicializacao",
                                  "Abra Configuracoes > Windows Update e instale todas as atualizacoes pendentes",
                                  "Verifique se o modo AHCI esta ativado na BIOS (essencial para performance do SSD)",
                                  "Desabilite a Indexacao do Windows: Painel de Controle > Opcoes de Indexacao > Modificar > desmarque unidades",
                                  "Reinicie e verifique a melhora no tempo de boot"
                                ],
                                tip: "Nunca desfragmente um SSD! Isso reduz a vida util dele sem nenhum beneficio. O Windows ja faz o TRIM automaticamente. Mantenha sempre pelo menos 20% de espaco livre no SSD.",
                                videoSearch: "como otimizar SSD Windows mais rapido tutorial"
                              }
                            },
                            {
                              label: "Nao sei qual tenho",
                              next: {
                                diagnosis: "Inicializacao lenta - necessario identificar tipo de disco e otimizar inicializacao",
                                explanation: "Para descobrir seu tipo de disco, abra o Gerenciador de Tarefas (Ctrl+Shift+Esc), va na aba 'Desempenho' e clique em 'Disco'. Se mostrar 'HDD' e um disco mecanico, se mostrar 'SSD' e solido. O HD mecanico e a causa mais comum de lentidao na inicializacao - ele pode ler dados a apenas 100 MB/s enquanto um SSD le a 500-3500 MB/s. Independente do tipo, muitos programas na inicializacao pioram o tempo de boot.",
                                steps: [
                                  "Primeiro, descubra seu tipo de disco: Ctrl+Shift+Esc > Desempenho > Disco 0",
                                  "Se nao mostrar claramente, abra o menu Iniciar, digite 'Desfragmentar e Otimizar Unidades'",
                                  "Na coluna 'Tipo de midia' voce vera se e 'Unidade de disco rigido' (HD) ou 'Unidade de estado solido' (SSD)",
                                  "Independente do tipo, va no Gerenciador de Tarefas > Inicializar e desabilite programas desnecessarios",
                                  "Execute a Limpeza de Disco (menu Iniciar > digite 'Limpeza de Disco')",
                                  "Clique em 'Limpar arquivos do sistema' para uma limpeza mais profunda",
                                  "Se for HD: execute a Desfragmentacao. Se for SSD: NAO desfragmente",
                                  "Considere trocar para SSD se tiver HD - e a melhor melhoria possivel"
                                ],
                                tip: "Voce pode ver o tipo de disco no Gerenciador de Tarefas > Desempenho > Disco. Se tiver HD, trocar por SSD e a melhoria mais impactante que pode fazer.",
                                videoSearch: "como saber se tenho SSD ou HD e deixar PC mais rapido"
                              }
                            }
                          ]
                        }
                      },
                      {
                        label: "Mais de 5 minutos",
                        next: {
                          diagnosis: "Inicializacao extremamente lenta - possivel disco rígido com falhas ou sistema comprometido",
                          explanation: "Um tempo de inicializacao superior a 5 minutos indica problemas serios. O disco rigido pode estar com setores defeituosos (bad blocks), forcando o sistema a tentar ler dados varias vezes antes de conseguir. Tambem pode haver corrupcao nos arquivos do sistema operacional, malware consumindo recursos desde a inicializacao, ou a memoria RAM pode estar com defeito, causando erros de leitura que o sistema tenta corrigir repetidamente.",
                          steps: [
                            "Inicie o computador e observe se aparece alguma mensagem de erro antes do Windows carregar",
                            "Se conseguir entrar no Windows, abra o Prompt de Comando como Administrador",
                            "Execute: chkdsk C: /f /r (agende para proxima reinicializacao se pedir)",
                            "Execute tambem: sfc /scannow para verificar arquivos do sistema",
                            "Execute: DISM /Online /Cleanup-Image /RestoreHealth para reparar componentes",
                            "Baixe o CrystalDiskInfo (gratuito) e verifique a saude do disco - se mostrar 'Atencao' ou 'Ruim', o disco esta falhando",
                            "Faca backup IMEDIATO de todos os seus arquivos importantes",
                            "Se o disco estiver com saude ruim, substitua-o por um SSD novo e reinstale o Windows",
                            "Se o disco estiver OK, considere fazer uma instalacao limpa do Windows"
                          ],
                          tip: "Disco com setores defeituosos e um disco morrendo. Faca backup urgente! Nao espere ele parar completamente - quando isso acontecer, recuperar os dados sera muito mais dificil e caro.",
                          videoSearch: "como verificar saude do HD disco rigido CrystalDiskInfo tutorial"
                        }
                      }
                    ]
                  }
                },
                {
                  label: "Trava na tela de carregamento e nao avanca",
                  next: {
                    question: "A tela de carregamento fica travada permanentemente ou eventualmente avanca?",
                    description: "Isso ajuda a diferenciar entre problema de software e hardware.",
                    badge: "Comportamento",
                    options: [
                      {
                        label: "Fica travada para sempre (preciso forcar desligamento)",
                        next: {
                          diagnosis: "Falha critica no boot - arquivos do sistema corrompidos ou falha no disco",
                          explanation: "Quando o Windows trava permanentemente na tela de carregamento, significa que ele nao consegue ler um arquivo essencial para completar a inicializacao. Isso pode ser causado por setores defeituosos no disco exatamente onde estao os arquivos do sistema, uma atualizacao do Windows que corrompeu arquivos criticos, ou um driver incompativel que trava o sistema ao ser carregado.",
                          steps: [
                            "Desligue o PC segurando o botao de energia por 5 segundos",
                            "Ligue novamente e pressione F8 repetidamente antes do logo do Windows",
                            "Se aparecer o menu, selecione 'Modo de Seguranca'",
                            "Se NAO aparecer o menu: desligue e ligue 3 vezes seguidas para forcar o modo de recuperacao",
                            "No modo de recuperacao, va em Solucionar Problemas > Opcoes Avancadas > Prompt de Comando",
                            "Execute: sfc /scannow",
                            "Execute: DISM /Online /Cleanup-Image /RestoreHealth",
                            "Execute: bootrec /fixmbr e depois bootrec /fixboot",
                            "Se nada funcionar, use a opcao 'Restauracao do Sistema' para voltar a um ponto anterior",
                            "Ultimo recurso: 'Restaurar este PC' mantendo arquivos pessoais"
                          ],
                          tip: "Sempre crie pontos de restauracao do sistema antes de instalar programas novos ou atualizacoes grandes. Isso permite voltar atras se algo der errado.",
                          videoSearch: "Windows travado na tela de carregamento como resolver modo seguranca"
                        }
                      },
                      {
                        label: "Demora mas eventualmente carrega",
                        next: {
                          diagnosis: "Inicializacao travando temporariamente - servico ou driver problematico",
                          explanation: "Quando o Windows eventualmente carrega mas demora muito em uma tela especifica, geralmente um servico ou driver esta falhando e o sistema espera um tempo limite (timeout) antes de continuar. Isso e comum apos atualizacoes de driver, instalacao de novos dispositivos ou quando um servico de rede tenta conectar a um recurso indisponivel.",
                          steps: [
                            "Anote quanto tempo demora e em qual tela fica travado (logo do Windows, tela preta, etc)",
                            "Apos entrar no Windows, pressione Win+R, digite 'msconfig' e pressione Enter",
                            "Na aba 'Servicos', marque 'Ocultar todos os servicos Microsoft'",
                            "Desmarque todos os servicos restantes e clique em OK",
                            "Na aba 'Inicializacao de Programas', clique em 'Abrir Gerenciador de Tarefas'",
                            "Desabilite todos os programas de inicializacao",
                            "Reinicie e veja se o tempo melhorou - se sim, o problema e um dos servicos/programas desabilitados",
                            "Reative os servicos um a um (reiniciando entre cada) para encontrar o culpado",
                            "Quando encontrar, desinstale ou atualize o programa problematico"
                          ],
                          tip: "O 'Boot Limpo' (clean boot) e a melhor tecnica para identificar qual programa esta causando lentidao. E como um processo de eliminacao sistematico.",
                          videoSearch: "como fazer boot limpo clean boot Windows resolver lentidao"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            label: "Fica lento depois de um tempo usando",
            next: {
              question: "O que voce costuma usar quando percebe a lentidao?",
              description: "Saber quais programas estao abertos ajuda a identificar o gargalo.",
              badge: "Uso",
              options: [
                {
                  label: "Navegador com muitas abas abertas",
                  next: {
                    question: "Quantas abas voce costuma manter abertas?",
                    description: "Cada aba consome memoria RAM do seu computador.",
                    badge: "Quantidade",
                    options: [
                      {
                        label: "Menos de 10 abas",
                        next: {
                          diagnosis: "Pouca memoria RAM para uso basico do navegador",
                          explanation: "Se o computador fica lento com menos de 10 abas, e muito provavel que voce tenha apenas 4GB de RAM ou menos. O Windows 10/11 sozinho ja usa cerca de 2-3GB, e cada aba do Chrome consome entre 100-300MB. Com 4GB de RAM, sobram apenas 1-2GB para o navegador, o que e insuficiente para uso confortavel. Quando a RAM acaba, o Windows comeca a usar o disco como memoria auxiliar (swap), o que e 100x mais lento.",
                          steps: [
                            "Verifique quanta RAM voce tem: Ctrl+Shift+Esc > Desempenho > Memoria",
                            "Observe a porcentagem de uso - se esta acima de 80% com pouco aberto, a RAM e insuficiente",
                            "Feche programas desnecessarios rodando em segundo plano",
                            "No navegador, instale a extensao 'Auto Tab Discard' que suspende abas inativas",
                            "Nas configuracoes do Chrome, desative 'Continuar executando apps em segundo plano'",
                            "Desative extensoes do navegador que nao usa",
                            "Se tiver 4GB ou menos, considere expandir para 8GB - e relativamente barato",
                            "Considere usar o Edge em vez do Chrome - ele usa menos RAM"
                          ],
                          tip: "Em 2024+, 8GB de RAM e o minimo recomendado para uso confortavel. Se seu PC aceita, esse upgrade custa entre R$80-150 e faz enorme diferenca.",
                          videoSearch: "como aumentar memoria RAM computador tutorial instalar"
                        }
                      },
                      {
                        label: "10 a 30 abas",
                        next: {
                          diagnosis: "Consumo elevado de RAM pelo navegador com multiplas abas",
                          explanation: "Com 10-30 abas abertas, o Chrome pode facilmente consumir 2-6GB de RAM. Sites modernos com videos, animacoes e scripts pesados consomem muito mais que paginas simples. Redes sociais como Facebook, YouTube e Twitter sao particularmente pesadas. Alem disso, extensoes do navegador tambem consomem memoria adicional para cada aba.",
                          steps: [
                            "No Chrome, pressione Shift+Esc para abrir o Gerenciador de Tarefas do Chrome",
                            "Veja quais abas e extensoes consomem mais memoria e feche as desnecessarias",
                            "Instale a extensao 'The Great Suspender' ou 'Auto Tab Discard' para suspender abas inativas",
                            "Organize abas em grupos (clique direito na aba > Adicionar a grupo) para melhor controle",
                            "Use marcadores/favoritos em vez de manter abas abertas 'para depois'",
                            "Nas configuracoes do Chrome > Sistema, desative 'Aceleracao por hardware' se tiver pouca RAM",
                            "Considere usar perfis separados no Chrome para trabalho e pessoal",
                            "Se tiver 8GB de RAM ou menos com esse uso, considere upgrade para 16GB"
                          ],
                          tip: "Use a funcao de Grupos de Abas do Chrome para organizar por assunto. E crie o habito de fechar abas que nao precisa no momento - use favoritos para salvar para depois.",
                          videoSearch: "Chrome usando muita memoria RAM como resolver otimizar"
                        }
                      },
                      {
                        label: "Mais de 30 abas",
                        next: {
                          diagnosis: "Sobrecarga massiva de memoria por excesso de abas abertas",
                          explanation: "Com mais de 30 abas, o Chrome pode consumir 6-12GB de RAM ou mais. Isso sobrecarrega ate computadores com 16GB de RAM. O navegador precisa manter todas essas paginas em memoria, incluindo scripts, imagens e videos. Quando a RAM fisica acaba, o sistema usa o disco como memoria virtual (pagefile), causando lentidao extrema pois o disco e centenas de vezes mais lento que a RAM.",
                          steps: [
                            "Primeiro, salve as abas importantes: Ctrl+Shift+D salva TODAS as abas em uma pasta de favoritos",
                            "Instale a extensao 'OneTab' que converte todas as abas em uma lista, liberando ate 95% da memoria",
                            "Feche todas as abas desnecessarias imediatamente",
                            "Configure o Chrome para 'Economia de memoria' em chrome://settings/performance",
                            "Ative a opcao 'Economia de memoria' que suspende abas inativas automaticamente",
                            "Use a extensao 'Session Buddy' para salvar e restaurar sessoes de abas",
                            "Crie o habito de organizar abas em grupos por projeto/assunto",
                            "Considere ter 16GB de RAM no minimo se voce trabalha com muitas abas"
                          ],
                          tip: "A extensao OneTab e revolucionaria para quem usa muitas abas. Ela converte todas as abas abertas em uma lista simples, liberando a memoria, e voce pode restaurar individualmente quando precisar.",
                          videoSearch: "como organizar abas Chrome OneTab economia memoria tutorial"
                        }
                      }
                    ]
                  }
                },
                {
                  label: "Programas pesados (jogos, editores, design)",
                  next: {
                    question: "Qual componente parece estar no limite? (Abra Gerenciador de Tarefas > Desempenho)",
                    description: "Verifique durante o uso do programa: CPU, Memoria ou Disco - qual fica em 90-100%?",
                    badge: "Gargalo",
                    options: [
                      {
                        label: "CPU (Processador) em 100%",
                        next: {
                          diagnosis: "Processador insuficiente para os programas utilizados",
                          explanation: "Quando a CPU fica constantemente em 100%, o processador nao consegue executar todas as instrucoes na velocidade necessaria. Isso causa travamentos, engasgos e lentidao geral. Pode ser que o processador seja antigo demais para o software atual, ou que processos em segundo plano estejam competindo por recursos com o programa principal.",
                          steps: [
                            "Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc) e ordene por uso de CPU",
                            "Identifique processos que consomem CPU sem necessidade e encerre-os",
                            "Verifique se o Windows Update nao esta rodando em segundo plano",
                            "Desative animacoes do Windows: Configuracoes > Sistema > Sobre > Config. Avancadas > Desempenho > Ajustar para melhor desempenho",
                            "No programa pesado, reduza configuracoes de qualidade (resolucao, efeitos)",
                            "Verifique se o plano de energia esta em 'Alto Desempenho'",
                            "Atualize os drivers do chipset pelo site do fabricante da placa-mae",
                            "Se o processador for muito antigo (mais de 6-7 anos), considere um upgrade"
                          ],
                          tip: "Antes de comprar um processador novo, verifique os requisitos minimos e recomendados do programa. As vezes atualizar apenas RAM ou trocar HD por SSD resolve, sem precisar trocar CPU.",
                          videoSearch: "CPU 100% como resolver processador lento Windows tutorial"
                        }
                      },
                      {
                        label: "Memoria (RAM) em 90-100%",
                        next: {
                          diagnosis: "Memoria RAM insuficiente para os programas utilizados",
                          explanation: "Quando a RAM atinge 90-100%, o sistema comeca a usar o disco como memoria virtual (paginacao), que e dramaticamente mais lento. Programas como Photoshop, Premiere, jogos modernos e IDEs de programacao podem facilmente consumir 8-16GB de RAM. Cada programa aberto simultaneamente compete por espaco na memoria, e quando nao ha espaco suficiente, tudo fica lento.",
                          steps: [
                            "Verifique quanta RAM total voce tem e quanta esta em uso",
                            "Feche todos os programas que nao esta usando ativamente",
                            "No Gerenciador de Tarefas, identifique processos que consomem muita RAM",
                            "Aumente a memoria virtual: Configuracoes > Sistema > Sobre > Config. Avancadas > Desempenho > Avancado > Memoria Virtual",
                            "Configure o tamanho personalizado: minimo 1.5x sua RAM, maximo 3x sua RAM",
                            "Desinstale programas que nao usa para liberar recursos",
                            "Se tiver 8GB: considere expandir para 16GB. Se tiver 4GB: 8GB e o minimo",
                            "Verifique quantos slots de RAM a placa-mae tem e quais estao ocupados"
                          ],
                          tip: "Para saber quanta RAM voce pode expandir, use o programa CPU-Z (gratuito) - ele mostra quantos slots sua placa-mae tem, quais estao ocupados e a velocidade da RAM instalada.",
                          videoSearch: "como aumentar memoria RAM notebook PC tutorial passo a passo"
                        }
                      },
                      {
                        label: "Disco em 100%",
                        next: {
                          diagnosis: "Disco rigido (HD) sobrecarregado - principal gargalo do sistema",
                          explanation: "Disco em 100% e o gargalo mais comum em computadores com HD mecanico. O HD so consegue fazer uma operacao de leitura/escrita por vez, e quando varios programas pedem dados simultaneamente, forma-se uma fila. O Windows constantemente le e escreve no disco (cache, memoria virtual, indexacao, antivirus), e quando voce adiciona um programa pesado, o disco simplesmente nao da conta.",
                          steps: [
                            "Abra Gerenciador de Tarefas > Desempenho > Disco para confirmar o tipo (HD ou SSD)",
                            "Se for HD: a solucao definitiva e trocar por SSD",
                            "Temporariamente, desative a Indexacao do Windows: services.msc > Windows Search > Desabilitar",
                            "Desative o Superfetch/SysMain: services.msc > SysMain > Desabilitar",
                            "Agende verificacoes do antivirus para horarios que nao esta usando o PC",
                            "Desative atualizacoes automaticas do Windows temporariamente",
                            "Execute: chkdsk C: /f para verificar erros no disco",
                            "Se for SSD e estiver em 100%, verifique se o driver AHCI esta correto e atualize o firmware do SSD",
                            "A solucao definitiva para HD em 100%: trocar por SSD"
                          ],
                          tip: "Disco em 100% com HD mecanico? A unica solucao real e trocar por SSD. Todas as outras sao paleativas. Um SSD de 240GB resolve esse problema completamente.",
                          videoSearch: "disco 100% como resolver Windows HD lento trocar SSD"
                        }
                      },
                      {
                        label: "Nao sei verificar / tudo parece alto",
                        next: {
                          diagnosis: "Hardware geral insuficiente - multiplos componentes no limite",
                          explanation: "Quando CPU, RAM e Disco estao todos proximos do limite, o computador como um todo nao e adequado para o tipo de programa que voce esta tentando usar. Isso e comum em computadores com mais de 5 anos tentando rodar softwares atuais. Os requisitos de software aumentam a cada ano, enquanto o hardware permanece o mesmo.",
                          steps: [
                            "Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc) e va na aba 'Desempenho'",
                            "Observe os 4 graficos: CPU, Memoria, Disco e Rede",
                            "Se a CPU fica acima de 90% constantemente, o processador e insuficiente",
                            "Se a Memoria fica acima de 85%, voce precisa de mais RAM",
                            "Se o Disco fica em 100% e e HD, trocar por SSD e prioridade",
                            "Verificacoes dos requisitos do programa: compare com as specs do seu PC",
                            "Prioridade de upgrade: 1o SSD, 2o RAM, 3o Processador/Placa de Video",
                            "Se o PC for muito antigo, pode ser mais vantajoso comprar um novo"
                          ],
                          tip: "Ordem de custo-beneficio para upgrades: SSD (R$100-150) > RAM (R$80-200) > Processador (pode exigir trocar placa-mae). Sempre comece pelo SSD se ainda tiver HD.",
                          videoSearch: "como saber se preciso trocar PC upgrade hardware tutorial"
                        }
                      }
                    ]
                  }
                },
                {
                  label: "Qualquer coisa fica lento, ate tarefas simples",
                  next: {
                    question: "A lentidao comecou de repente ou foi piorando gradualmente?",
                    description: "Isso ajuda a diferenciar entre malware e desgaste natural.",
                    badge: "Inicio",
                    options: [
                      {
                        label: "Comecou de repente",
                        next: {
                          diagnosis: "Possivel infeccao por malware ou programa indesejado recente",
                          explanation: "Lentidao subita geralmente indica que algo foi instalado recentemente sem seu conhecimento. Malwares, mineradores de criptomoeda e adwares consomem recursos em segundo plano. Tambem pode ser uma atualizacao do Windows que causou incompatibilidade com algum driver, ou um programa que voce instalou que trouxe componentes extras indesejados.",
                          steps: [
                            "Abra Gerenciador de Tarefas (Ctrl+Shift+Esc) > aba Detalhes, ordene por CPU",
                            "Anote processos desconhecidos que consomem muita CPU ou memoria",
                            "Pesquise o nome do processo no Google para verificar se e legitimo",
                            "Baixe o Malwarebytes (gratuito) do site oficial malwarebytes.com",
                            "Execute uma verificacao completa do sistema - aguarde a conclusao",
                            "Remova todas as ameacas encontradas",
                            "Va em Configuracoes > Aplicativos, ordene por data de instalacao",
                            "Desinstale programas instalados recentemente que nao reconhece",
                            "Verifique extensoes dos navegadores e remova as que nao instalou",
                            "Reinicie e verifique se a lentidao foi resolvida"
                          ],
                          tip: "Sempre baixe programas apenas dos sites oficiais. Evite sites de download como Baixaki ou Softonic que frequentemente incluem adware nos instaladores.",
                          videoSearch: "como remover virus malware do computador Malwarebytes tutorial"
                        }
                      },
                      {
                        label: "Foi piorando com o tempo",
                        next: {
                          diagnosis: "Acumulo de arquivos temporarios, programas desnecessarios e fragmentacao",
                          explanation: "Com o uso diario ao longo de meses ou anos, o Windows acumula gigabytes de arquivos temporarios, caches, logs de erro, restos de programas desinstalados e entradas invalidas no registro. Cada programa instalado e desinstalado deixa residuos. Alem disso, em HDs mecanicos, a fragmentacao vai piorando, fazendo o disco demorar cada vez mais para encontrar e ler arquivos.",
                          steps: [
                            "Abra Configuracoes > Sistema > Armazenamento e ative 'Sensor de Armazenamento'",
                            "Clique em 'Executar Sensor de Armazenamento agora' para limpeza automatica",
                            "Abra 'Limpeza de Disco' e selecione 'Limpar arquivos do sistema' para limpeza profunda",
                            "Desinstale programas que nao usa: Configuracoes > Aplicativos, ordene por tamanho",
                            "Limpe os navegadores: apague caches, cookies e historico antigo",
                            "Execute a Desfragmentacao se tiver HD (NAO faca em SSD)",
                            "Desabilite efeitos visuais desnecessarios do Windows",
                            "Considere uma reinstalacao limpa do Windows se o PC tem mais de 3 anos sem formatacao",
                            "Apos a limpeza, crie uma rotina mensal de manutencao"
                          ],
                          tip: "Faca uma limpeza geral a cada 2-3 meses: limpeza de disco, verificacao de programas desnecessarios e desfragmentacao (se HD). Isso mantem o PC rapido por muito mais tempo.",
                          videoSearch: "como limpar PC lento Windows limpeza completa otimizar tutorial"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            label: "Lento o tempo todo, em tudo",
            next: {
              question: "Ha quanto tempo o computador esta assim?",
              description: "Se sempre foi lento ou ficou lento recentemente muda o diagnostico.",
              badge: "Historico",
              options: [
                {
                  label: "Sempre foi lento (desde que comprei)",
                  next: {
                    diagnosis: "Hardware abaixo dos requisitos minimos para o uso pretendido",
                    explanation: "Se o computador sempre foi lento, o hardware nao e adequado para o tipo de uso que voce faz. Muitos computadores de entrada sao vendidos com configuracoes minimas (processadores Celeron/Pentium, 4GB de RAM, HD mecanico) que mal conseguem rodar o Windows confortavelmente. Esses PCs sao pensados para uso ultra basico, mas ate abrir o Chrome com algumas abas ja fica pesado.",
                    steps: [
                      "Descubra a configuracao do PC: Win+R > dxdiag > ver processador, RAM e sistema",
                      "Compare com os requisitos dos programas que voce usa",
                      "Se tiver HD mecanico: trocar por SSD (prioridade #1 - maior impacto)",
                      "Se tiver 4GB de RAM: expandir para 8GB (prioridade #2)",
                      "Configuracoes > Sistema > Sobre > verifique se o Windows esta atualizado",
                      "Desabilite TODOS os efeitos visuais: Config. Avancadas > Desempenho > Ajustar para melhor desempenho",
                      "Desabilite apps de fundo: Configuracoes > Privacidade > Apps em segundo plano > desative tudo",
                      "Considere usar Linux (Ubuntu ou Linux Mint) se o hardware for muito fraco para Windows"
                    ],
                    tip: "Computadores com processador Celeron/Pentium, 4GB de RAM e HD mecanico serao sempre lentos com Windows. O upgrade mais impactante e SSD + 8GB RAM, que custa menos de R$300 e transforma a experiencia.",
                    videoSearch: "como fazer upgrade PC fraco barato SSD RAM tutorial"
                  }
                },
                {
                  label: "Ficou lento recentemente (era rapido antes)",
                  next: {
                    diagnosis: "Degradacao de performance - sistema precisa de manutencao ou verificacao de malware",
                    explanation: "Um computador que era rapido e ficou lento tem algum problema que pode ser resolvido. As causas mais comuns sao: acumulo de programas e lixo digital, malware ou adware consumindo recursos, disco rígido comecando a falhar, ou uma atualizacao do Windows que trouxe incompatibilidades.",
                    steps: [
                      "Primeiro, verifique malware: baixe Malwarebytes e faca uma verificacao completa",
                      "Verifique saude do disco: baixe CrystalDiskInfo e veja o status",
                      "Abra Gerenciador de Tarefas > Inicializar e desabilite programas desnecessarios",
                      "Execute Limpeza de Disco com opcao 'Limpar arquivos do sistema'",
                      "Desinstale programas que nao usa: Configuracoes > Aplicativos",
                      "Verifique se alguma atualizacao do Windows causou o problema: Historico de Atualizacoes",
                      "Se o problema comecou apos uma atualizacao, tente desinstala-la",
                      "Se nada resolver, considere usar a opcao 'Restaurar este PC' mantendo arquivos pessoais",
                      "Faca backup antes de qualquer acao drastica"
                    ],
                    tip: "Sempre tente identificar quando exatamente o problema comecou. Se foi apos instalar algo, desinstale. Se foi apos uma atualizacao, reverta. Isso guia direto para a solucao.",
                    videoSearch: "computador ficou lento como resolver diagnosticar problema Windows"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      label: "Tela azul (BSOD)", icon: "🟦",
      next: {
        question: "Quando a tela azul aparece?",
        description: "O momento em que o erro ocorre e a pista mais importante para o diagnostico.",
        badge: "Momento",
        options: [
          {
            label: "Ao ligar o computador",
            next: {
              question: "A tela azul aparece antes ou depois do logo do Windows?",
              description: "Isso diferencia problemas de hardware de problemas de software.",
              badge: "Fase",
              options: [
                {
                  label: "Antes do logo do Windows (logo na BIOS)",
                  next: {
                    diagnosis: "Falha de hardware critica - problema no disco, RAM ou placa-mae",
                    explanation: "Tela azul antes do Windows sequer comecar a carregar indica falha grave de hardware. Nessa fase, o computador esta testando os componentes basicos (POST) e tentando acessar o disco de boot. Pode ser memoria RAM com defeito, disco rigido falhando, ou problema na placa-mae. O codigo de erro na tela azul e essencial para o diagnostico preciso.",
                    steps: [
                      "Anote o codigo de erro exibido na tela azul (ex: 0x0000007B, INACCESSIBLE_BOOT_DEVICE)",
                      "Desligue o PC, abra o gabinete e remova os pentes de RAM",
                      "Limpe os contatos dourados da RAM com borracha branca suavemente",
                      "Recoloque a RAM firmemente ate ouvir o clique de encaixe",
                      "Se tiver 2 pentes, teste com apenas 1 de cada vez para identificar defeituoso",
                      "Verifique se os cabos do HD/SSD estao bem conectados (SATA e alimentacao)",
                      "Tente acessar a BIOS (Del ou F2 ao ligar) e verifique se o disco aparece",
                      "Se o disco nao aparecer na BIOS, o disco pode ter falhado",
                      "Teste com outro disco ou pendrive bootavel com Windows para confirmar"
                    ],
                    tip: "Limpar os contatos da RAM com borracha resolve o problema em 70% dos casos de tela azul na inicializacao. E simples, gratuito e pode salvar uma ida ao tecnico.",
                    videoSearch: "tela azul ao ligar PC como resolver limpar memoria RAM tutorial"
                  }
                },
                {
                  label: "Depois do logo do Windows (durante carregamento)",
                  next: {
                    diagnosis: "Driver corrompido ou arquivo do sistema danificado durante o boot",
                    explanation: "Tela azul durante o carregamento do Windows significa que um driver de dispositivo esta falhando ao ser carregado. Isso e comum apos atualizacoes do Windows que instalam drivers incompativeis, apos instalar novo hardware, ou quando arquivos essenciais do sistema foram corrompidos por desligamento incorreto ou falha de disco.",
                    steps: [
                      "Anote o codigo de erro e o nome do arquivo .sys mencionado (se houver)",
                      "Force o modo de recuperacao: desligue e ligue 3 vezes seguidas durante o boot",
                      "Va em Solucionar Problemas > Opcoes Avancadas > Configuracoes de Inicializacao > Reiniciar",
                      "Selecione 'Modo de Seguranca' (opcao 4 ou F4)",
                      "No Modo de Seguranca, abra Gerenciador de Dispositivos e procure dispositivos com icone amarelo",
                      "Clique direito > Atualizar driver ou Desinstalar para dispositivos problematicos",
                      "Abra Prompt de Comando como Admin e execute: sfc /scannow",
                      "Execute: DISM /Online /Cleanup-Image /RestoreHealth",
                      "Se souber qual atualizacao causou, desinstale em Configuracoes > Windows Update > Historico",
                      "Reinicie normalmente e verifique se o problema foi resolvido"
                    ],
                    tip: "O nome do arquivo .sys na tela azul e a chave do diagnostico. Pesquise esse nome no Google - geralmente descobre qual driver/hardware esta causando o problema.",
                    videoSearch: "tela azul Windows carregamento driver corrompido como resolver"
                  }
                }
              ]
            }
          },
          {
            label: "Aleatoriamente durante o uso",
            next: {
              question: "Com que frequencia a tela azul aparece?",
              description: "A frequencia ajuda a determinar a gravidade do problema.",
              badge: "Frequencia",
              options: [
                {
                  label: "Varias vezes ao dia",
                  next: {
                    diagnosis: "Falha grave de hardware - provavelmente RAM defeituosa ou superaquecimento critico",
                    explanation: "Telas azuis frequentes (varias ao dia) quase sempre indicam problema de hardware. A memoria RAM com defeito corrompe dados aleatoriamente, causando crashes imprevisiveis. Superaquecimento do processador tambem causa erros de calculo que levam a tela azul. Em casos raros, pode ser a fonte de alimentacao fornecendo energia instavel.",
                    steps: [
                      "Verifique a temperatura: baixe HWMonitor e monitore CPU e GPU",
                      "Se a temperatura da CPU passar de 85C em idle, ha problema de refrigeracao",
                      "Teste a RAM: abra menu Iniciar, digite 'Diagnostico de Memoria do Windows' e execute",
                      "Reinicie - o teste sera feito antes do Windows carregar (demora 15-30 min)",
                      "Se encontrar erros: teste cada pente individualmente para identificar o defeituoso",
                      "Verifique se todas as ventoinhas estao funcionando (visual e sonoro)",
                      "Limpe a poeira interna com ar comprimido",
                      "Se a temperatura estiver alta, a pasta termica pode ter secado - leve a um tecnico",
                      "Verifique se a fonte de alimentacao nao esta fazendo ruidos estranhos",
                      "Se os testes de RAM e temperatura estiverem OK, pode ser problema na placa-mae"
                    ],
                    tip: "O 'Diagnostico de Memoria do Windows' e uma ferramenta nativa poderosa. Para um teste mais completo, baixe o MemTest86 - ele testa a RAM com mais rigor.",
                    videoSearch: "tela azul toda hora como resolver testar memoria RAM temperatura"
                  }
                },
                {
                  label: "Algumas vezes por semana",
                  next: {
                    diagnosis: "Driver instavel ou conflito de software intermitente",
                    explanation: "Telas azuis semanais geralmente indicam um driver problematico que so falha em determinadas condicoes. Pode ser o driver da placa de video, do Wi-Fi, ou de algum periferico USB. Tambem pode ser um conflito entre dois programas que ocasionalmente tentam acessar o mesmo recurso do sistema.",
                    steps: [
                      "Verifique o Visualizador de Eventos: Win+R > eventvwr > Logs do Windows > Sistema",
                      "Procure eventos com nivel 'Critico' ou 'Erro' proximos ao horario da tela azul",
                      "Anote o 'Bug Check Code' ou nome do erro",
                      "Atualize TODOS os drivers: placa de video, chipset, rede, audio",
                      "Baixe os drivers do site do fabricante (NVIDIA, AMD, Intel, Realtek), nao do Windows Update",
                      "Verifique se ha atualizacoes de BIOS disponiveis no site do fabricante da placa-mae",
                      "Se a tela azul menciona 'ntoskrnl.exe', geralmente e RAM ou driver de kernel",
                      "Desinstale programas instalados recentemente que possam estar causando conflito",
                      "Verifique se o Windows esta totalmente atualizado"
                    ],
                    tip: "O Visualizador de Eventos do Windows registra detalhes de cada crash. E como uma caixa preta de aviao - analisar os logs leva direto a causa do problema.",
                    videoSearch: "tela azul Windows como descobrir causa Visualizador Eventos tutorial"
                  }
                },
                {
                  label: "Raramente (uma vez por mes ou menos)",
                  next: {
                    diagnosis: "Erro esporadico - geralmente nao e critico mas deve ser monitorado",
                    explanation: "Telas azuis ocasionais podem acontecer por diversos motivos nao graves: pico de energia, driver que falhou em situacao especifica, ou aquecimento momentaneo. Se acontece raramente e nao segue um padrao, geralmente nao e preocupante, mas deve ser monitorado.",
                    steps: [
                      "Anote a data, hora e o que estava fazendo quando a tela azul apareceu",
                      "Verifique se ha um padrao (sempre ao usar determinado programa, periferico, etc)",
                      "Mantenha todos os drivers atualizados, especialmente placa de video e chipset",
                      "Mantenha o Windows atualizado",
                      "Verifique se o computador esta bem ventilado e limpo internamente",
                      "Use um estabilizador ou nobreak para proteger contra picos de energia",
                      "Se comecar a ficar mais frequente, revise os passos para 'varias vezes ao dia'"
                    ],
                    tip: "Se a tela azul e rara e nao segue padrao, nao se preocupe demais. Mas se a frequencia aumentar, investigue imediatamente - pode ser sinal de hardware comecando a falhar.",
                    videoSearch: "tela azul Windows esporadica o que fazer monitorar"
                  }
                }
              ]
            }
          },
          {
            label: "Apenas ao rodar jogos ou programas pesados",
            next: {
              question: "O que acontece antes da tela azul aparecer?",
              description: "O comportamento antes do crash ajuda a identificar o componente com problema.",
              badge: "Pre-crash",
              options: [
                {
                  label: "O computador fica muito quente antes de travar",
                  next: {
                    diagnosis: "Superaquecimento da GPU ou CPU sob carga pesada",
                    explanation: "Jogos e programas de edicao exigem o maximo do processador e placa de video. Se o sistema de refrigeracao nao e adequado (pasta termica seca, ventoinhas sujas, fluxo de ar bloqueado), a temperatura sobe alem do limite seguro e o sistema desliga para proteger o hardware. A placa de video (GPU) e especialmente vulneravel pois gera muito calor.",
                    steps: [
                      "Instale o MSI Afterburner para monitorar temperaturas durante jogos",
                      "Configure o overlay na tela para ver temperatura de CPU e GPU em tempo real",
                      "Se a GPU passar de 85C ou CPU passar de 90C, ha problema de refrigeracao",
                      "Limpe toda a poeira interna do computador com ar comprimido",
                      "Verifique se todas as ventoinhas estao funcionando (gabinete, CPU, GPU)",
                      "Se o PC tem mais de 2 anos, a pasta termica pode ter secado - troque",
                      "Melhore o fluxo de ar: organize cabos e adicione ventoinhas ao gabinete",
                      "Se for notebook, use um cooler pad e nao use em superficies macias",
                      "Reduza configuracoes graficas do jogo ate a temperatura ficar aceitavel"
                    ],
                    tip: "Temperatura ideal de GPU durante jogos: 65-80C. Acima de 85C ja e preocupante. Use o MSI Afterburner para monitorar - ele mostra temperatura, uso e FPS em tempo real.",
                    videoSearch: "placa de video superaquecendo jogo como resolver limpar pasta termica"
                  }
                },
                {
                  label: "Trava de repente sem aviso (nao parece ser calor)",
                  next: {
                    diagnosis: "Driver da placa de video instavel ou fonte de alimentacao insuficiente",
                    explanation: "Crashes repentinos durante jogos sem superaquecimento geralmente sao causados por driver da placa de video com bug, ou fonte de alimentacao que nao fornece energia suficiente durante picos de consumo. Quando a GPU entra em carga maxima, ela pode consumir 150-350W, e se a fonte nao aguenta, a tensao cai e o sistema trava.",
                    steps: [
                      "Atualize o driver da placa de video pela ULTIMA versao do site oficial (NVIDIA/AMD)",
                      "Se ja esta atualizado, tente uma versao ANTERIOR do driver (rollback)",
                      "Use o DDU (Display Driver Uninstaller) para limpar completamente o driver antigo antes de instalar novo",
                      "Verifique a potencia da fonte: veja a etiqueta lateral e compare com o recomendado para sua placa de video",
                      "Se tiver overclock na GPU, retorne aos valores padrao",
                      "Teste jogos com configuracoes minimas para ver se o problema persiste",
                      "Verifique se a placa de video esta bem encaixada no slot PCIe",
                      "Confirme que os cabos de alimentacao da placa de video estao bem conectados",
                      "Se a fonte for generica ou menor que o recomendado, substitua por uma de qualidade"
                    ],
                    tip: "Fontes de alimentacao genericas sao uma das maiores causas de instabilidade em PCs gamer. Invista em fontes 80 Plus (Bronze no minimo) de marcas conhecidas como Corsair, EVGA ou Cooler Master.",
                    videoSearch: "PC trava jogando tela azul driver placa video fonte como resolver"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      label: "Sem internet", icon: "📡",
      next: {
        question: "Qual e a situacao atual da sua conexao?",
        description: "Descreva o que voce observa no icone de rede da barra de tarefas.",
        badge: "Status",
        options: [
          {
            label: "Wi-Fi conectado mas sem internet",
            next: {
              question: "Outros dispositivos na mesma rede conseguem acessar a internet?",
              description: "Isso ajuda a determinar se o problema e no computador ou no roteador.",
              badge: "Abrangencia",
              options: [
                {
                  label: "Sim, outros dispositivos funcionam normalmente",
                  next: {
                    diagnosis: "Problema de configuracao de rede no seu computador",
                    explanation: "Se outros dispositivos funcionam na mesma rede, o problema esta na configuracao de rede do seu computador. As causas mais comuns sao: cache DNS corrompido, configuracao de IP incorreta, driver de rede com problema, ou proxy/VPN ativa interferindo na conexao.",
                    steps: [
                      "Abra o Prompt de Comando como Administrador (pesquise cmd, clique direito > Admin)",
                      "Execute: ipconfig /flushdns (limpa o cache de DNS)",
                      "Execute: ipconfig /release (libera o IP atual)",
                      "Execute: ipconfig /renew (solicita novo IP)",
                      "Execute: netsh winsock reset (reseta as configuracoes de rede)",
                      "Execute: netsh int ip reset (reseta protocolos IP)",
                      "Reinicie o computador apos todos os comandos",
                      "Se nao resolver, va em Configuracoes > Rede > Wi-Fi > Propriedades do hardware",
                      "Em IPv4 > Propriedades, marque 'Usar os seguintes DNS': 8.8.8.8 e 8.8.4.4",
                      "Se ainda nao funcionar, desinstale o driver Wi-Fi no Gerenciador de Dispositivos e reinicie"
                    ],
                    tip: "O comando 'netsh winsock reset' resolve a maioria dos problemas de rede no Windows. E como um reset de fabrica das configuracoes de rede.",
                    videoSearch: "wifi conectado sem internet Windows como resolver reset rede"
                  }
                },
                {
                  label: "Nao, nenhum dispositivo tem internet",
                  next: {
                    diagnosis: "Problema no roteador ou na conexao do provedor de internet",
                    explanation: "Se nenhum dispositivo consegue acessar a internet, o problema nao e no seu computador - e no roteador ou no servico do provedor (ISP). O roteador pode estar travado, o modem pode ter perdido sincronismo com a operadora, ou pode haver uma queda no servico na sua regiao.",
                    steps: [
                      "Verifique as luzes do roteador/modem - a luz de 'Internet' ou 'WAN' deve estar acesa e verde",
                      "Desligue o roteador e o modem da tomada completamente",
                      "Aguarde 60 segundos (isso limpa a memoria do equipamento)",
                      "Ligue primeiro o modem, espere 2 minutos ate estabilizar",
                      "Depois ligue o roteador, espere mais 2 minutos",
                      "Verifique se os cabos ethernet estao bem conectados entre modem e roteador",
                      "Teste a conexao novamente em qualquer dispositivo",
                      "Se nao funcionar, verifique se ha queda na sua regiao no site/app da operadora",
                      "Ligue para o suporte da operadora para verificar status da conexao",
                      "Se o problema persistir, o roteador pode estar com defeito"
                    ],
                    tip: "Sempre desligue roteador e modem da tomada (nao so apertar reset) e espere pelo menos 60 segundos. Isso limpa completamente a memoria e resolve a maioria dos problemas.",
                    videoSearch: "internet caiu roteador sem internet como resolver reiniciar modem"
                  }
                }
              ]
            }
          },
          {
            label: "Wi-Fi nao aparece ou nao conecta",
            next: {
              question: "Voce consegue ver a lista de redes Wi-Fi disponiveis?",
              description: "Isso diferencia problema no adaptador Wi-Fi de problema na rede.",
              badge: "Visibilidade",
              options: [
                {
                  label: "Nao vejo nenhuma rede Wi-Fi (lista vazia)",
                  next: {
                    diagnosis: "Adaptador Wi-Fi desativado ou com driver corrompido",
                    explanation: "Se nenhuma rede aparece, o adaptador Wi-Fi esta desativado ou seu driver falhou. Isso pode acontecer por um atalho de teclado pressionado acidentalmente (muitos notebooks tem Fn+F2/F3 para Wi-Fi), uma atualizacao do Windows que corrompeu o driver, ou em casos raros, falha no hardware Wi-Fi.",
                    steps: [
                      "Verifique se o Wi-Fi esta ativado: clique no icone de rede na barra de tarefas",
                      "Em notebooks, procure uma tecla Fn + tecla com icone de antena (F2, F3 ou F5 geralmente)",
                      "Verifique se o Modo Aviao NAO esta ativado",
                      "Abra Gerenciador de Dispositivos (pesquise no menu Iniciar)",
                      "Expanda 'Adaptadores de rede' e procure seu adaptador Wi-Fi",
                      "Se tiver seta para baixo, clique direito > Habilitar",
                      "Se tiver icone amarelo, clique direito > Desinstalar dispositivo > Reiniciar PC",
                      "Ao reiniciar, o Windows reinstalara o driver automaticamente",
                      "Se nao aparecer nenhum adaptador Wi-Fi, o hardware pode ter falhado",
                      "Nesse caso, use um adaptador Wi-Fi USB como solucao (custam R$20-50)"
                    ],
                    tip: "Tecla de atalho do Wi-Fi e a causa #1 de 'sumiram as redes'. Antes de qualquer coisa, tente todas as combinacoes Fn+F1 ate Fn+F12 procurando o icone de antena/Wi-Fi.",
                    videoSearch: "wifi sumiu nao aparece redes Windows como resolver adaptador"
                  }
                },
                {
                  label: "Vejo as redes mas nao consigo conectar na minha",
                  next: {
                    diagnosis: "Problema de autenticacao ou configuracao da rede Wi-Fi especifica",
                    explanation: "Se voce ve as redes mas nao consegue conectar na sua, pode ser: senha incorreta, configuracao de seguranca incompativel, perfil de rede corrompido no Windows, ou o roteador bloqueando seu dispositivo (filtro MAC). Tambem pode ser interferencia de canal se a conexao fica tentando mas nunca completa.",
                    steps: [
                      "Primeiro, verifique se a senha esta correta (atencao a maiusculas/minusculas)",
                      "Esqueca a rede e reconecte: Configuracoes > Rede > Wi-Fi > Gerenciar redes conhecidas",
                      "Encontre sua rede e clique em 'Esquecer'",
                      "Clique no icone Wi-Fi novamente e conecte inserindo a senha",
                      "Se nao funcionar, reinicie o roteador (desligue 60 segundos, ligue novamente)",
                      "Verifique se o roteador nao tem filtro de MAC ativado (acesse 192.168.1.1 de outro dispositivo)",
                      "Tente mudar o canal do Wi-Fi no roteador para evitar interferencia",
                      "Se nenhum dispositivo novo conecta, o roteador pode estar com limite de dispositivos",
                      "Tente conectar via cabo ethernet para confirmar que a internet funciona"
                    ],
                    tip: "A opcao 'Esquecer rede' e reconectar resolve a maioria dos problemas de conexao. O Windows as vezes armazena configuracoes antigas que conflitam com mudancas feitas no roteador.",
                    videoSearch: "wifi nao conecta rede como resolver esquecer rede reconectar Windows"
                  }
                }
              ]
            }
          },
          {
            label: "Internet muito lenta",
            next: {
              question: "A lentidao e em todos os dispositivos ou so no computador?",
              description: "Isso identifica se o problema e na rede ou no seu aparelho.",
              badge: "Escopo",
              options: [
                {
                  label: "Lenta em todos os dispositivos",
                  next: {
                    diagnosis: "Problema na conexao do provedor ou congestionamento da rede Wi-Fi",
                    explanation: "Se todos os dispositivos estao lentos, o problema e na fonte: o provedor de internet nao esta entregando a velocidade contratada, o roteador esta congestionado com muitos dispositivos, ou ha interferencia no sinal Wi-Fi. Roteadores antigos tambem podem limitar a velocidade se nao suportam os padroes mais recentes.",
                    steps: [
                      "Faca um teste de velocidade em speedtest.net de um dispositivo conectado por cabo (se possivel)",
                      "Compare o resultado com a velocidade contratada no seu plano de internet",
                      "Se a velocidade por cabo estiver boa mas Wi-Fi nao, o problema e no roteador/sinal",
                      "Reinicie o roteador e modem (desligue, espere 60s, ligue)",
                      "Acesse o roteador (192.168.1.1 ou 192.168.0.1) e verifique quantos dispositivos estao conectados",
                      "Mude o canal do Wi-Fi: use canal 1, 6 ou 11 para 2.4GHz, ou use 5GHz se disponivel",
                      "Posicione o roteador em local central e elevado, longe de paredes grossas",
                      "Se a velocidade por cabo tambem estiver ruim, entre em contato com a operadora",
                      "Considere trocar o roteador se ele for antigo (mais de 3-4 anos)"
                    ],
                    tip: "A rede 5GHz e muito mais rapida que 2.4GHz em distancias curtas. Se seu roteador tem 5GHz, use-a para dispositivos proximos. Use 2.4GHz para dispositivos distantes.",
                    videoSearch: "internet lenta como resolver roteador wifi canal configuracao tutorial"
                  }
                },
                {
                  label: "Lenta apenas no meu computador",
                  next: {
                    diagnosis: "Problema de configuracao de rede ou programa consumindo banda no PC",
                    explanation: "Se so o seu computador esta lento, algum programa pode estar consumindo sua banda em segundo plano (atualizacoes do Windows, backup em nuvem, torrent), o driver de rede pode estar desatualizado, ou as configuracoes de DNS estao lentas.",
                    steps: [
                      "Abra Gerenciador de Tarefas > aba Desempenho > Wi-Fi para ver consumo de rede",
                      "Na aba Processos, ordene por 'Rede' para encontrar qual programa esta usando internet",
                      "Pause ou feche programas que consomem muita banda (OneDrive, Dropbox, Windows Update)",
                      "Mude o DNS para Google (8.8.8.8) ou Cloudflare (1.1.1.1) - mais rapidos que DNS padrao",
                      "Atualize o driver de rede: Gerenciador de Dispositivos > Adaptadores de rede > Atualizar",
                      "Desative 'Grande Envio de Descarregamento' (LSO) nas propriedades do adaptador de rede",
                      "Execute: netsh int tcp set global autotuninglevel=normal no Prompt de Comando Admin",
                      "Verifique se nao ha malware usando sua internet: execute Malwarebytes",
                      "Esqueca e reconecte na rede Wi-Fi"
                    ],
                    tip: "Trocar o DNS para 1.1.1.1 (Cloudflare) ou 8.8.8.8 (Google) pode melhorar notavelmente a velocidade de carregamento de sites. O DNS padrao da operadora geralmente e mais lento.",
                    videoSearch: "internet lenta no PC como resolver DNS rapido otimizar Windows"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      label: "Nao liga", icon: "⚫",
      next: {
        question: "O que acontece quando voce aperta o botao de ligar?",
        description: "Cada comportamento indica um tipo diferente de problema.",
        badge: "Sintoma",
        options: [
          {
            label: "Nada acontece (sem luz, sem som, sem ventoinha)",
            next: {
              question: "Voce verificou se a tomada esta funcionando?",
              description: "Teste a tomada com outro aparelho como carregador de celular.",
              badge: "Energia",
              options: [
                {
                  label: "Sim, a tomada funciona",
                  next: {
                    diagnosis: "Fonte de alimentacao queimada ou botao de energia com defeito",
                    explanation: "Se a tomada funciona mas o computador nao da sinal de vida, a fonte de alimentacao provavelmente queimou. Isso pode acontecer por picos de energia, sobrecarga, ou simplesmente desgaste. A fonte converte a energia da tomada (110/220V) para tensoes que o computador usa (12V, 5V, 3.3V). Quando ela falha, nada funciona. Menos comumente, o botao de ligar pode estar com mau contato.",
                    steps: [
                      "Em desktops: verifique o interruptor I/O na parte traseira da fonte",
                      "Tente outro cabo de energia (o mesmo tipo usado em monitores/PCs)",
                      "Em notebooks: teste com outro carregador compativel se possivel",
                      "Remova a bateria do notebook, conecte so o carregador e tente ligar",
                      "Verifique se o LED do carregador acende ao plugar (se nao acende, carregador com defeito)",
                      "Em desktops: teste a fonte com o metodo do jumper (clips no pino verde + preto do conector 24 pinos)",
                      "ATENCAO: o teste de jumper envolve eletricidade - siga tutoriais com cuidado",
                      "Se a ventoinha da fonte nao girar no teste, ela queimou e precisa ser substituida",
                      "Se a fonte funcionar, o problema pode ser no botao de ligar ou na placa-mae",
                      "Leve a um tecnico se nao se sentir seguro para testar"
                    ],
                    tip: "Use um nobreak ou estabilizador para proteger contra picos de energia. Fontes genericas queimam com muito mais facilidade - invista em fontes de qualidade (80 Plus certificadas).",
                    videoSearch: "PC nao liga fonte queimada como testar trocar tutorial"
                  }
                },
                {
                  label: "Nao testei / nao sei",
                  next: {
                    diagnosis: "Problema de alimentacao eletrica - verificar tomada, cabos e fonte",
                    explanation: "Antes de diagnosticar componentes internos, e essencial garantir que a energia esta chegando ao computador. Problemas simples como tomada sem energia, cabo solto, disjuntor desarmado ou chave de voltagem errada sao responsaveis por uma boa parcela dos casos de 'computador nao liga'.",
                    steps: [
                      "Primeiro: teste a tomada plugando outro aparelho (carregador de celular, por exemplo)",
                      "Verifique se o disjuntor do quadro de energia esta ligado",
                      "Verifique o cabo de forca: esta bem conectado tanto na tomada quanto no PC?",
                      "Em desktops: verifique se a chave 110/220V na fonte esta na posicao correta",
                      "Em desktops: verifique se o interruptor I/O na fonte esta ligado (I = ligado)",
                      "Em notebooks: o LED do carregador acende? Se nao, teste outra tomada",
                      "Tente outra tomada em outro comodo da casa",
                      "Se nada funcionar mesmo com tomada confirmada, a fonte queimou"
                    ],
                    tip: "Sempre comece pelo basico! Disjuntor desarmado e a causa mais embaracosa mas tambem mais comum de 'computador nao liga'. Verifique antes de desmontar qualquer coisa.",
                    videoSearch: "computador nao liga verificar energia tomada fonte tutorial"
                  }
                }
              ]
            }
          },
          {
            label: "Luzes acendem mas a tela fica preta",
            next: {
              question: "Voce ouve beeps (apitos) quando liga o computador?",
              description: "Beeps da placa-mae sao codigos de erro que indicam o problema.",
              badge: "Sons",
              options: [
                {
                  label: "Sim, ouco beeps repetidos",
                  next: {
                    diagnosis: "Falha de hardware detectada pelo POST - codigo de beep indica o componente",
                    explanation: "Os beeps sao o sistema de diagnostico da placa-mae (POST - Power On Self Test). Quando algo falha, ela emite uma sequencia de beeps que e um codigo de erro. O padrao mais comum: beeps curtos repetidos = problema de RAM; beep longo + curtos = problema de video; beep continuo = problema de energia. O significado exato depende do fabricante da BIOS (AMI, Award, Phoenix).",
                    steps: [
                      "Conte quantos beeps e o padrao (curtos, longos, ou combinacao)",
                      "Pesquise: '[marca da placa-mae] bios beep codes' no Google",
                      "Se forem beeps curtos repetidos (muito comum): problema de RAM",
                      "Desligue, remova os pentes de RAM e limpe os contatos com borracha branca",
                      "Recoloque a RAM firmemente e teste",
                      "Se tiver 2 pentes, teste um de cada vez em cada slot",
                      "Se beep longo + curtos: remova e recoloque a placa de video",
                      "Limpe o contato dourado da placa de video com borracha tambem",
                      "Se o problema persistir mesmo com limpeza, o componente pode estar com defeito"
                    ],
                    tip: "A limpeza dos contatos de RAM e placa de video com borracha escolar branca e a tecnica mais eficaz e barata de manutencao. Funciona em 70% dos casos de tela preta com beeps.",
                    videoSearch: "PC liga mas nao da video beeps tela preta limpar RAM como resolver"
                  }
                },
                {
                  label: "Nao, nenhum beep",
                  next: {
                    diagnosis: "Falha no video - RAM mal encaixada, placa de video ou cabo do monitor",
                    explanation: "Quando o PC liga (ventoinhas giram, LEDs acendem) mas sem beeps e sem imagem, o computador pode nao estar completando o POST. Causas comuns: RAM nao detectada, placa de video com mau contato, cabo do monitor desconectado, ou monitor em entrada errada (HDMI vs VGA vs DisplayPort).",
                    steps: [
                      "Verifique se o cabo do monitor esta bem conectado em AMBAS as pontas",
                      "Verifique se o monitor esta na entrada correta (botao Source/Input)",
                      "Tente outro cabo ou outra saida de video (HDMI, VGA, DisplayPort)",
                      "Se tiver placa de video dedicada, tente conectar o monitor na saida da placa-mae",
                      "Desligue, abra o gabinete, remova e limpe os pentes de RAM (borracha branca nos contatos dourados)",
                      "Recoloque firmemente ate ouvir o clique",
                      "Se tiver placa de video, remova, limpe o contato e recoloque",
                      "Tente ligar com o minimo: apenas 1 pente de RAM, sem placa de video dedicada",
                      "Se funcionar com o minimo, va adicionando componentes um a um para encontrar o defeituoso"
                    ],
                    tip: "O metodo de 'minimo necessario' e a melhor tecnica de diagnostico: conecte apenas o essencial (1 RAM, processador, monitor na placa-mae) e va adicionando um componente por vez.",
                    videoSearch: "PC liga tela preta sem imagem como resolver limpar memoria RAM"
                  }
                }
              ]
            }
          },
          {
            label: "Liga e desliga sozinho em loop (reinicia repetidamente)",
            next: {
              question: "Quanto tempo o computador fica ligado antes de desligar?",
              description: "O tempo ligado indica se e superaquecimento ou problema eletrico.",
              badge: "Duracao",
              options: [
                {
                  label: "Menos de 5 segundos (quase imediatamente)",
                  next: {
                    diagnosis: "Curto-circuito ou fonte de alimentacao insuficiente",
                    explanation: "Desligamento quase instantaneo indica que a placa-mae detectou um curto-circuito ou a fonte nao consegue fornecer a energia minima para a inicializacao. Pode ser um parafuso solto fazendo contato onde nao devia, um componente mal encaixado causando curto, ou a fonte incapaz de sustentar a carga de todos os componentes.",
                    steps: [
                      "Desligue completamente e desconecte da tomada",
                      "Abra o gabinete e verifique visualmente se nao ha parafusos soltos na placa-mae",
                      "Verifique se nao ha fios descascados encostando na placa-mae",
                      "Remova TODOS os perifericos (placa de video, HDs extras, leitores) e teste com o minimo",
                      "Teste com apenas 1 pente de RAM",
                      "Se funcionar com o minimo, va reconectando um componente por vez para identificar o curto",
                      "Verifique se os espaçadores (standoffs) da placa-mae estao nos lugares corretos",
                      "Se nada funcionar, a fonte ou a placa-mae pode estar com defeito",
                      "Teste com outra fonte se possivel"
                    ],
                    tip: "Parafusos soltos dentro do gabinete sao uma causa surpreendentemente comum de curto-circuito. Incline o gabinete suavemente e ouca se algo rola dentro dele.",
                    videoSearch: "PC liga e desliga sozinho imediatamente curto como resolver fonte"
                  }
                },
                {
                  label: "10-30 segundos antes de desligar",
                  next: {
                    diagnosis: "Superaquecimento do processador - pasta termica seca ou cooler com defeito",
                    explanation: "Se o PC funciona por alguns segundos antes de desligar, o processador esta esquentando muito rapido e atingindo o limite termico. Isso acontece quando a pasta termica secou completamente (nao transfere calor para o cooler), a ventoinha do processador esta parada ou muito lenta, ou o cooler nao esta fazendo contato adequado com o processador.",
                    steps: [
                      "Ao ligar, observe imediatamente se a ventoinha do processador (cooler) gira",
                      "Se NAO gira: a ventoinha esta com defeito e precisa ser substituida",
                      "Se gira mas o PC desliga: a pasta termica provavelmente secou",
                      "Verifique se o cooler esta firmemente preso ao processador (sem folga)",
                      "Limpe toda a poeira acumulada no cooler e nas ventoinhas",
                      "Para trocar a pasta termica: remova o cooler, limpe a antiga com alcool isopropilico",
                      "Aplique nova pasta termica (quantidade de um grao de arroz no centro do processador)",
                      "Recoloque o cooler firmemente",
                      "Se nao tem experiencia, leve a um tecnico - custa em media R$50-80"
                    ],
                    tip: "A pasta termica deve ser trocada a cada 2-3 anos. E uma manutencao simples mas que faz enorme diferenca. Se nunca foi trocada e o PC tem mais de 2 anos, quase certamente esta seca.",
                    videoSearch: "PC desliga sozinho superaquecimento trocar pasta termica cooler"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      label: "Superaquecimento", icon: "🌡️",
      next: {
        question: "Como voce percebe o superaquecimento?",
        description: "Os sintomas indicam a gravidade e a origem do calor excessivo.",
        badge: "Sintoma",
        options: [
          {
            label: "Ventoinhas fazendo muito barulho",
            next: {
              question: "O barulho e constante ou so quando usa programas pesados?",
              description: "Isso diferencia entre obstrucao de ar e carga de trabalho alta.",
              badge: "Padrao",
              options: [
                {
                  label: "Constante, mesmo sem fazer nada",
                  next: {
                    diagnosis: "Acumulo severo de poeira nas ventoinhas e dissipadores",
                    explanation: "Quando as ventoinhas fazem barulho constante mesmo com o PC ocioso, significa que o sistema de refrigeracao esta muito comprometido. A poeira acumulada funciona como um cobertor termico, impedindo que o calor se dissipe. As ventoinhas tentam compensar girando em velocidade maxima, mas sem fluxo de ar adequado, nao conseguem resfriar. A temperatura fica alta mesmo sem uso intenso.",
                    steps: [
                      "Desligue o computador e desconecte da tomada",
                      "Em notebooks: use ar comprimido nas saidas de ar laterais e traseiras",
                      "Em desktops: abra o gabinete com uma chave Phillips",
                      "Use ar comprimido para limpar TODAS as ventoinhas (segure-as para nao danificar)",
                      "Limpe especialmente o dissipador do processador (a grade de aluminio/cobre sobre a CPU)",
                      "Remova poeira acumulada nos filtros de ar do gabinete",
                      "Verifique se todas as ventoinhas giram livremente com o dedo",
                      "Se alguma ventoinha estiver travada ou fazendo barulho de rolamento, substitua-a",
                      "Reorganize os cabos internos para nao bloquear o fluxo de ar",
                      "Apos limpar, ligue e verifique se o barulho diminuiu"
                    ],
                    tip: "Faca limpeza interna a cada 6 meses. Em ambientes com pets ou muita poeira, a cada 3 meses. Use ar comprimido vendido em latas - e seguro e eficiente.",
                    videoSearch: "como limpar computador por dentro poeira ventoinha barulho tutorial"
                  }
                },
                {
                  label: "So quando joga ou usa programas pesados",
                  next: {
                    diagnosis: "Refrigeracao insuficiente para carga pesada - normal mas pode ser melhorado",
                    explanation: "Ventoinhas acelerando durante jogos e programas pesados e comportamento normal - o hardware esta gerando mais calor e as ventoinhas respondem aumentando a velocidade. Porem, se o barulho e excessivo (parece uma turbina), o sistema de refrigeracao pode estar subdimensionado ou precisando de manutencao (limpeza + pasta termica).",
                    steps: [
                      "Instale o HWMonitor para verificar temperaturas durante o uso pesado",
                      "Temperaturas aceitaveis: CPU ate 85C, GPU ate 83C durante jogos",
                      "Se as temperaturas estiverem dentro do aceitavel, o barulho e normal",
                      "Para reduzir o barulho: limpe a poeira interna do computador",
                      "Troque a pasta termica se tiver mais de 2 anos",
                      "Em desktops: adicione mais ventoinhas ao gabinete (entrada de ar na frente, saida atras/em cima)",
                      "Em notebooks: use um cooler pad (suporte com ventoinhas)",
                      "Na BIOS, ajuste a curva de velocidade das ventoinhas se disponivel",
                      "Considere trocar o cooler de estoque por um aftermarket mais silencioso (em desktops)"
                    ],
                    tip: "Um cooler aftermarket de CPU (como DeepCool Gammaxx ou Cooler Master Hyper) custa R$60-150 e e muito mais silencioso e eficiente que o cooler de estoque que vem com o processador.",
                    videoSearch: "como diminuir barulho ventoinha PC notebook jogo tutorial cooler"
                  }
                }
              ]
            }
          },
          {
            label: "Computador desliga sozinho do nada",
            next: {
              question: "Quando ele desliga, voce consegue ligar imediatamente ou precisa esperar?",
              description: "Se precisa esperar para ligar, e confirmacao de protecao termica.",
              badge: "Reinicio",
              options: [
                {
                  label: "Preciso esperar alguns minutos para ligar de novo",
                  next: {
                    diagnosis: "Protecao termica ativada - superaquecimento critico do processador",
                    explanation: "O processador tem um sensor termico que desliga o computador quando a temperatura passa do limite seguro (95-105C). Apos desligar, o PC nao liga imediatamente porque o sensor detecta que ainda esta quente demais. Isso e uma protecao para evitar danos permanentes ao chip. A causa e pasta termica completamente seca, ventoinha parada, ou acumulo extremo de poeira.",
                    steps: [
                      "PARE de usar o computador ate resolver o problema - risco de dano permanente",
                      "Quando conseguir ligar, instale rapidamente o HWMonitor e verifique as temperaturas",
                      "Se a temperatura subir rapidamente acima de 80C sem fazer nada, a pasta termica secou",
                      "Verifique se a ventoinha do processador esta girando ao ligar",
                      "Limpe toda a poeira interna com ar comprimido",
                      "A pasta termica PRECISA ser trocada - isso requer remover o cooler do processador",
                      "Se tem experiencia: limpe com alcool isopropilico, aplique pasta nova (grao de arroz)",
                      "Se nao tem experiencia: leve a um tecnico (custa R$50-80 a troca)",
                      "Em notebooks: a troca de pasta termica requer desmontagem - recomendado tecnico",
                      "Apos a troca, monitore as temperaturas por alguns dias para confirmar"
                    ],
                    tip: "Temperatura normal em idle: 30-50C. Em uso: 60-80C. Se chegar a 90C+ em idle, e emergencia. Nao ignore desligamentos termicos - cada vez que acontece, reduz a vida util do processador.",
                    videoSearch: "computador desligando sozinho superaquecimento trocar pasta termica passo a passo"
                  }
                },
                {
                  label: "Consigo ligar imediatamente",
                  next: {
                    diagnosis: "Possivel problema na fonte de alimentacao ou instabilidade eletrica",
                    explanation: "Se o PC desliga mas liga imediatamente, pode nao ser superaquecimento. A fonte de alimentacao pode estar falhando intermitentemente, nao conseguindo manter a energia estavel sob carga. Tambem pode ser instabilidade na rede eletrica (quedas de tensao), RAM com defeito, ou ate mesmo um driver de energia do Windows com bug.",
                    steps: [
                      "Instale HWMonitor e verifique as temperaturas - se estiverem normais, nao e superaquecimento",
                      "Verifique se o desligamento acontece sob carga (jogos) ou aleatoriamente",
                      "Se for sob carga: a fonte pode ser insuficiente para o hardware",
                      "Verifique a potencia da fonte e compare com o consumo do sistema",
                      "Se for aleatorio: teste com outro cabo de forca e outra tomada",
                      "Use um nobreak/estabilizador para eliminar problemas de rede eletrica",
                      "No Visualizador de Eventos, verifique logs de erro no momento do desligamento",
                      "Teste a memoria RAM com Diagnostico de Memoria do Windows",
                      "Se os testes apontarem para a fonte, substitua por uma de qualidade e potencia adequada"
                    ],
                    tip: "Um nobreak (UPS) basico custa R$200-400 e protege contra quedas de energia, picos de tensao e flutuacoes. Alem de proteger o hardware, evita corrupcao de dados por desligamento abrupto.",
                    videoSearch: "computador desliga sozinho fonte fraca como testar diagnosticar"
                  }
                }
              ]
            }
          },
          {
            label: "Notebook esquenta muito (quente ao toque)",
            next: {
              diagnosis: "Notebook com ventilacao comprometida e/ou pasta termica degradada",
              explanation: "Notebooks sao projetados com sistemas de refrigeracao compactos que tem pouca margem de erro. Com o tempo, a poeira bloqueia os dutos de ar internos e a pasta termica seca, causando aumento progressivo de temperatura. Usar o notebook em superficies macias (cama, sofa, colo) piora drasticamente porque bloqueia as entradas de ar inferiores.",
              steps: [
                "NUNCA use o notebook em cama, sofa, almofada ou colo - sempre em superficie rigida e plana",
                "Instale o HWMonitor para monitorar as temperaturas",
                "Use ar comprimido para soprar as saidas de ar laterais/traseiras do notebook",
                "Se possivel, posicione o notebook levemente inclinado para melhorar o fluxo de ar",
                "Adquira um cooler pad (suporte com ventoinhas) para uso prolongado - custam R$40-80",
                "Nas configuracoes de energia, selecione 'Equilibrado' em vez de 'Alto Desempenho'",
                "Reduza o brilho da tela, que e uma fonte significativa de calor",
                "Feche programas em segundo plano que nao esta usando",
                "Se o notebook tem mais de 2 anos, leve a um tecnico para limpeza interna e troca de pasta termica",
                "Considere usar a funcao de limitacao de CPU: Opcoes de Energia > Estado maximo do processador: 80%"
              ],
              tip: "Um suporte para notebook com inclinacao ja melhora a ventilacao, mesmo sem ventoinhas extras. Custam a partir de R$20 e fazem diferenca significativa na temperatura.",
              videoSearch: "notebook esquentando muito como resolver limpar limpeza interna pasta termica"
            }
          }
        ]
      }
    },
    {
      label: "Virus / Malware", icon: "🛡️",
      next: {
        question: "Quais sintomas voce esta observando?",
        description: "Cada sintoma indica um tipo diferente de ameaca digital.",
        badge: "Sintoma",
        options: [
          {
            label: "Pop-ups e propagandas estranhas aparecendo",
            next: {
              question: "Onde os pop-ups aparecem?",
              description: "O local ajuda a identificar se e problema do navegador ou do sistema.",
              badge: "Local",
              options: [
                {
                  label: "Apenas no navegador (dentro das paginas)",
                  next: {
                    diagnosis: "Adware ou extensao maliciosa no navegador",
                    explanation: "Pop-ups apenas no navegador geralmente indicam uma extensao maliciosa instalada sem seu conhecimento, ou um adware que modificou as configuracoes do navegador. Esses programas injetam propagandas em paginas que normalmente nao teriam, redirecionam suas pesquisas para sites falsos e coletam dados de navegacao.",
                    steps: [
                      "Abra o navegador e va em Configuracoes > Extensoes (ou chrome://extensions)",
                      "Remova TODAS as extensoes que voce nao reconhece ou nao lembra de ter instalado",
                      "Na duvida, remova - voce pode reinstalar depois se precisar",
                      "Restaure as configuracoes do navegador: Configuracoes > Avancado > Redefinir configuracoes",
                      "Verifique se a pagina inicial e o mecanismo de busca nao foram alterados",
                      "Baixe e execute o AdwCleaner (da Malwarebytes) - e gratuito e rapido",
                      "Execute uma verificacao e remova tudo que encontrar",
                      "Limpe cookies e cache do navegador: Ctrl+Shift+Del",
                      "Se usar Chrome, verifique chrome://settings/cleanup para remocao de software prejudicial",
                      "Apos a limpeza, instale um bloqueador de anuncios como uBlock Origin"
                    ],
                    tip: "Instale o uBlock Origin como extensao do navegador - e o melhor bloqueador de anuncios, gratuito e open source. Ele bloqueia propagandas invasivas e protege contra sites maliciosos.",
                    videoSearch: "como remover adware propagandas navegador Chrome extensao maliciosa"
                  }
                },
                {
                  label: "Na area de trabalho ou como notificacoes do Windows",
                  next: {
                    diagnosis: "Malware instalado no sistema operacional ou notificacoes de sites maliciosos",
                    explanation: "Pop-ups na area de trabalho podem ser notificacoes do navegador que voce acidentalmente autorizou em algum site, ou pode ser um malware mais serio instalado no sistema. Muitos sites enganam usuarios a clicar 'Permitir' em notificacoes push, que depois enviam spam diretamente para o desktop.",
                    steps: [
                      "Primeiro, verifique notificacoes do navegador: Chrome > Configuracoes > Privacidade > Notificacoes",
                      "Remova todos os sites da lista de 'Permitidos' que voce nao reconhece",
                      "Se os pop-ups persistirem, va em Configuracoes > Aplicativos e ordene por data de instalacao",
                      "Desinstale programas recentes que nao reconhece",
                      "Baixe Malwarebytes (malwarebytes.com) e faca verificacao completa",
                      "Baixe tambem o AdwCleaner e execute",
                      "No Gerenciador de Tarefas > Inicializar, desabilite itens suspeitos",
                      "Verifique programas instalados com nomes estranhos ou genericos",
                      "Apos limpar, reinicie e verifique se os pop-ups pararam",
                      "Se persistir, considere restaurar o Windows mantendo arquivos pessoais"
                    ],
                    tip: "Quando um site pedir para 'Permitir notificacoes', SEMPRE clique em 'Bloquear'. Nenhum site legitimo precisa enviar notificacoes push obrigatorias.",
                    videoSearch: "como remover notificacoes indesejadas Windows pop-up virus malware"
                  }
                }
              ]
            }
          },
          {
            label: "Computador muito lento com processos estranhos",
            next: {
              question: "Voce nota o computador lento especialmente em algum momento?",
              description: "Malwares podem ter diferentes padroes de atividade.",
              badge: "Padrao",
              options: [
                {
                  label: "Lento o tempo todo (desde que liga)",
                  next: {
                    diagnosis: "Malware pesado (minerador de criptomoeda ou trojan) rodando em segundo plano",
                    explanation: "Lentidao constante com processos desconhecidos consumindo CPU geralmente indica um minerador de criptomoeda (cryptojacker) ou trojan. Mineradores usam o poder de processamento do seu PC para gerar criptomoedas para criminosos. Trojans podem estar roubando dados, enviando spam, ou fazendo parte de uma rede de computadores zumbis (botnet).",
                    steps: [
                      "Abra Gerenciador de Tarefas (Ctrl+Shift+Esc) > aba Detalhes",
                      "Ordene por CPU - anote nomes de processos que consomem muita CPU e que nao reconhece",
                      "Pesquise cada nome no Google para verificar se e malware",
                      "DESCONECTE DA INTERNET antes de fazer a limpeza (para impedir comunicacao do malware)",
                      "Baixe Malwarebytes em outro dispositivo e transfira por pendrive se necessario",
                      "Inicie o PC em Modo de Seguranca (F8 ou Shift+Reiniciar > Solucionar > Inicializacao)",
                      "No Modo de Seguranca, execute a verificacao completa do Malwarebytes",
                      "Remova TODAS as ameacas encontradas",
                      "Execute tambem o Windows Defender offline scan (Seguranca > Protecao > Verificacao Offline)",
                      "Apos a limpeza, MUDE TODAS as senhas (email, banco, redes sociais) de outro dispositivo"
                    ],
                    tip: "Se encontrou um trojan, mude TODAS as suas senhas imediatamente a partir de OUTRO dispositivo limpo. O malware pode ter capturado tudo que voce digitou.",
                    videoSearch: "como remover virus minerador trojan do computador Windows Malwarebytes"
                  }
                },
                {
                  label: "Lento apenas quando esta conectado a internet",
                  next: {
                    diagnosis: "Malware de rede - possivelmente botnet, spyware ou adware com conexao remota",
                    explanation: "Se a lentidao aparece ou piora quando conectado a internet, um malware esta usando sua conexao para atividades maliciosas: envio de spam, download de mais malwares, upload dos seus dados para servidores remotos, ou participacao em ataques DDoS como parte de uma botnet.",
                    steps: [
                      "Abra Gerenciador de Tarefas > aba Desempenho > Rede para ver o trafego",
                      "Na aba Processos, ordene por 'Rede' para ver o que esta usando internet",
                      "Se houver processos desconhecidos com alto trafego, e quase certamente malware",
                      "Desconecte da internet imediatamente",
                      "Execute verificacao com Malwarebytes em Modo de Seguranca",
                      "Execute verificacao com Windows Defender Offline",
                      "Verifique configuracoes de Proxy: Configuracoes > Rede > Proxy (deve estar desativado)",
                      "Verifique DNS: nao devem estar apontando para enderecos estranhos",
                      "Apos limpar, execute: netsh winsock reset no Prompt Admin para resetar rede",
                      "Mude as senhas do roteador e Wi-Fi tambem"
                    ],
                    tip: "Se o malware estava usando sua rede, mude tambem a senha do roteador. Acesse 192.168.1.1 e troque a senha de admin e a senha do Wi-Fi.",
                    videoSearch: "como remover malware spyware usando internet do PC Windows tutorial"
                  }
                }
              ]
            }
          },
          {
            label: "Arquivos sumiram ou estao criptografados",
            next: {
              diagnosis: "Infeccao por Ransomware - ameaca critica de perda de dados",
              explanation: "Ransomware e o tipo mais perigoso de malware. Ele criptografa seus arquivos pessoais (documentos, fotos, videos) com uma chave que so os criminosos possuem e exige pagamento (geralmente em Bitcoin) para descriptografar. E uma extorsao digital. NAO pague - nao ha garantia de que os arquivos serao devolvidos, e pagar financia mais crimes.",
              steps: [
                "NAO PAGUE o resgate em hipotese alguma",
                "DESCONECTE imediatamente da internet (cabo e Wi-Fi)",
                "DESCONECTE discos externos, pendrives e HDs de backup (para protege-los)",
                "NÃO desligue o computador (a chave de descriptografia pode estar na RAM)",
                "Tire foto da mensagem do ransomware com o celular (inclua o email/endereco Bitcoin exibido)",
                "Acesse nomoreransom.org de OUTRO dispositivo - la tem ferramentas gratuitas de descriptografia",
                "Procure o nome do ransomware na mensagem e pesquise se ja tem solucao",
                "Registre boletim de ocorrencia (crime digital - delegacia de crimes ciberneticos)",
                "Se tiver backup em disco externo que NAO estava conectado, seus arquivos estao seguros",
                "Formate o computador completamente e reinstale o Windows do zero",
                "Restaure os arquivos do backup"
              ],
              tip: "PREVENCAO: Mantenha backups regulares em disco externo que fica DESCONECTADO do computador. Backup em nuvem (Google Drive, OneDrive) tambem ajuda. A regra 3-2-1: 3 copias, 2 midias diferentes, 1 fora do local.",
              videoSearch: "ransomware como recuperar arquivos criptografados o que fazer tutorial"
            }
          },
          {
            label: "Programas abrem sozinhos ou cursor se move sozinho",
            next: {
              diagnosis: "Possivel acesso remoto nao autorizado (RAT - Remote Access Trojan)",
              explanation: "Se programas abrem sozinhos, o cursor se move sem voce tocar no mouse, ou janelas aparecem e desaparecem, alguem pode estar controlando seu computador remotamente. Um RAT (Remote Access Trojan) da ao invasor controle total da maquina, incluindo acesso a camera, microfone, teclado e todos os arquivos. E uma das infeccoes mais graves.",
              steps: [
                "DESCONECTE DA INTERNET IMEDIATAMENTE (puxe o cabo ou desligue o Wi-Fi no roteador)",
                "Se possivel, cubra a webcam com fita adesiva",
                "NÃO use o computador infectado para acessar contas bancarias ou emails",
                "De outro dispositivo limpo, mude TODAS as senhas (email, banco, redes sociais)",
                "Ative autenticacao de dois fatores em todas as contas importantes",
                "Inicie o PC infectado em Modo de Seguranca SEM rede",
                "Execute verificacao completa com Malwarebytes e Windows Defender",
                "Verifique programas de acesso remoto instalados: TeamViewer, AnyDesk, etc (desinstale se nao instalou)",
                "Verifique Gerenciador de Tarefas > Inicializar por programas suspeitos",
                "RECOMENDADO: formate o computador completamente - e a unica forma de ter certeza",
                "Apos formatar, instale Windows limpo e mude todas as senhas novamente"
              ],
              tip: "Se houve acesso remoto, considere que TODAS as suas senhas foram comprometidas. Mude absolutamente tudo de um dispositivo limpo. Ative verificacao em duas etapas em todas as contas.",
              videoSearch: "como saber se PC foi hackeado acesso remoto virus RAT remover tutorial"
            }
          }
        ]
      }
    }
  ]
};

// ===== FAQ =====
const faqAnswers = [
  "Sim! Nosso diagnostico foi desenvolvido por tecnicos especializados e cobre os problemas mais comuns de computadores. Ele identifica o problema com base nos sintomas que voce descreve e oferece solucoes testadas e comprovadas.",
  "Nao, o TECPIXEL e totalmente gratuito! Nossa missao e democratizar o conhecimento tecnico e ajudar as pessoas a resolverem problemas de computador por conta propria.",
  "Sim! O site e totalmente responsivo e funciona perfeitamente em celulares, tablets e computadores.",
  "Estamos sempre expandindo nosso banco de diagnosticos. Se seu problema nao esta listado, entre em contato conosco pelo Instagram que teremos prazer em ajudar!",
  "A melhor forma de entrar em contato conosco e pelo nosso Instagram @projeto.tecpixel. Respondemos todas as mensagens!"
];

// ===== STATE =====
let history = []; // stack of nodes for back navigation
let currentNode = diagnosticTree;
let totalSteps = 5; // estimate

// ===== DOM =====
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const contactFab = document.getElementById('contactFab');
const contactPanel = document.getElementById('contactPanel');
const contactClose = document.getElementById('contactClose');
const faqList = document.getElementById('faqList');
const faqAnswer = document.getElementById('faqAnswer');
const faqAnswerText = document.getElementById('faqAnswerText');
const faqBack = document.getElementById('faqBack');

const stepQuestion = document.getElementById('step-question');
const stepResult = document.getElementById('step-result');
const backBtn = document.getElementById('backBtn');

// ===== RENDER QUESTION =====
function renderQuestion(node) {
  currentNode = node;
  const stepNum = history.length + 1;

  // Progress
  const pct = Math.min((stepNum / totalSteps) * 100, 90);
  progressFill.style.width = pct + '%';
  progressText.textContent = `Etapa ${stepNum} de ~${totalSteps}`;

  // Badge
  const badge = document.getElementById('stepBadge');
  if (node.badge) {
    badge.textContent = node.badge;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }

  // Question & description
  document.getElementById('stepQuestion').textContent = node.question;
  document.getElementById('stepDescription').textContent = node.description || '';

  // Options
  const container = document.getElementById('stepOptionsContainer');
  container.innerHTML = '';
  container.className = node.isGrid ? 'options-grid' : 'options-list';

  node.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    if (opt.icon) {
      btn.innerHTML = `<span class="option-icon">${opt.icon}</span><span class="option-label">${opt.label}</span>`;
    } else {
      btn.innerHTML = `<span class="option-label">${opt.label}</span>`;
    }
    btn.addEventListener('click', () => {
      if (opt.next.diagnosis) {
        // It's a result
        history.push(node);
        displayResult(opt.next);
      } else {
        // It's another question
        history.push(node);
        renderQuestion(opt.next);
      }
    });
    container.appendChild(btn);
  });

  // Back button
  if (history.length > 0) {
    backBtn.classList.remove('hidden');
  } else {
    backBtn.classList.add('hidden');
  }

  // Show question, hide result
  stepQuestion.classList.remove('hidden');
  stepResult.classList.add('hidden');
}

// ===== DISPLAY RESULT =====
function displayResult(result) {
  // Progress
  progressFill.style.width = '100%';
  progressText.textContent = 'Diagnostico concluido!';

  document.getElementById('resultDiagnosis').textContent = result.diagnosis;
  document.getElementById('resultExplanation').textContent = result.explanation;
  document.getElementById('resultTip').textContent = result.tip;

  // Steps
  const stepsList = document.getElementById('resultSteps');
  stepsList.innerHTML = '';
  result.steps.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    stepsList.appendChild(li);
  });

  // YouTube video
  const videoContainer = document.getElementById('resultVideo');
  if (result.videoSearch) {
    const searchQuery = encodeURIComponent(result.videoSearch);
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
    videoContainer.innerHTML = `
      <a href="${youtubeSearchUrl}" target="_blank" rel="noopener" class="video-card">
        <div class="video-card-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#FF0000"/>
            <path d="M20 16L32 24L20 32V16Z" fill="white"/>
          </svg>
        </div>
        <div class="video-card-info">
          <span class="video-card-title">Assistir Tutorial no YouTube</span>
          <span class="video-card-desc">Clique para ver videos que ensinam a resolver este problema passo a passo</span>
        </div>
        <span class="video-card-arrow">→</span>
      </a>
    `;
  } else {
    videoContainer.innerHTML = '<p class="video-placeholder-text">Video tutorial em breve</p>';
  }

  // Show result, hide question
  stepQuestion.classList.add('hidden');
  stepResult.classList.remove('hidden');
}

// ===== BACK BUTTON =====
backBtn.addEventListener('click', () => {
  if (history.length > 0) {
    const prev = history.pop();
    renderQuestion(prev);
  }
});

// ===== RESTART =====
document.getElementById('restartDiagnostic').addEventListener('click', () => {
  history = [];
  renderQuestion(diagnosticTree);
});

// ===== INIT =====
renderQuestion(diagnosticTree);

// ===== Header scroll =====
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== Mobile menu =====
mobileMenuBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });
});

// ===== Active nav on scroll =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    document.querySelectorAll(`.nav-link[href="#${id}"]`).forEach(l => {
      l.classList.toggle('active', scrollY >= top && scrollY < top + height);
    });
  });
});

// ===== Contact panel =====
contactFab.addEventListener('click', () => contactPanel.classList.toggle('hidden'));
contactClose.addEventListener('click', () => contactPanel.classList.add('hidden'));
document.addEventListener('click', (e) => {
  if (!contactPanel.contains(e.target) && !contactFab.contains(e.target)) {
    contactPanel.classList.add('hidden');
  }
});

// FAQ
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    faqAnswerText.textContent = faqAnswers[parseInt(btn.dataset.faq)];
    faqList.classList.add('hidden');
    faqAnswer.classList.remove('hidden');
  });
});
faqBack.addEventListener('click', () => {
  faqAnswer.classList.add('hidden');
  faqList.classList.remove('hidden');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
