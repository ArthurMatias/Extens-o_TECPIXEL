import { useEffect } from 'react';

interface LgpdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LgpdModal({ isOpen, onClose }: LgpdModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={isOpen ? 'lgpd-modal-overlay' : 'lgpd-modal-overlay hidden'}
      id="lgpdModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lgpdModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lgpd-modal">
        <div className="lgpd-modal-header">
          <h2 id="lgpdModalTitle">Aviso de Privacidade</h2>
          <button
            className="lgpd-modal-close"
            id="lgpdModalClose"
            aria-label="Fechar aviso de privacidade"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="lgpd-modal-body">
          <p>
            <strong>Responsável pelo tratamento:</strong> Equipe TECPIXEL (projeto acadêmico de
            Engenharia da Computação).<br />
            Contato:{' '}
            <a
              href="https://instagram.com/projeto.tecpixel"
              target="_blank"
              rel="noopener noreferrer"
            >
              @projeto.tecpixel
            </a>
          </p>

          <h3>Dados que coletamos</h3>
          <p>
            O TECPIXEL <strong>não coleta, armazena nem compartilha nenhum dado pessoal</strong> dos
            usuários. As respostas do diagnóstico ficam apenas na memória do seu navegador e são
            descartadas ao fechar ou atualizar a página.
          </p>

          <h3>Serviços de terceiros</h3>
          <p>
            Esta página utiliza o <strong>Google Fonts</strong> para carregar a tipografia do site.
            Essa requisição envia o endereço IP do seu dispositivo aos servidores do Google (EUA),
            conforme a{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Política de Privacidade do Google
            </a>
            . O endereço IP é considerado dado pessoal nos termos da LGPD (Lei 13.709/2018). A base
            legal para essa transferência internacional é o <strong>legítimo interesse</strong> na
            prestação do serviço educativo gratuito, nos termos do Art. 7º, IX da LGPD.
          </p>
          <p>
            Links para o <strong>YouTube</strong> e o <strong>Instagram</strong> são acionados
            somente quando você clica voluntariamente. O acesso a essas plataformas é regido pelas
            respectivas políticas de privacidade.
          </p>

          <h3>Seus direitos (Art. 18 da LGPD)</h3>
          <p>
            Como titular de dados, você tem direito a: confirmação de tratamento, acesso, correção,
            exclusão, portabilidade e revogação de consentimento. Para exercer esses direitos, entre
            em contato conosco pelo Instagram. Você também pode peticionar diretamente à ANPD
            (Autoridade Nacional de Proteção de Dados).
          </p>

          <h3>Segurança</h3>
          <p>
            O site não possui formulários de cadastro, login, cookies de rastreamento ou analytics.
            Todo o processamento do diagnóstico ocorre localmente no seu navegador.
          </p>

          <p className="lgpd-footer-note">
            Última atualização: maio de 2026 — Em conformidade com a Lei 13.709/2018 (LGPD).
          </p>
        </div>
      </div>
    </div>
  );
}
