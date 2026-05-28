import InstagramIcon from './InstagramIcon';

interface FooterProps {
  onOpenLgpd: () => void;
}

export default function Footer({ onOpenLgpd }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-logo">
          <span className="logo-tec">TEC</span><span className="logo-pixel">PIXEL</span>
        </div>
        <p className="footer-text">Diagnóstico inteligente e educativo para seu computador.</p>
        <div className="footer-social">
          <a
            href="https://instagram.com/projeto.tecpixel"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-instagram"
          >
            <InstagramIcon size={20} />
            @projeto.tecpixel
          </a>
        </div>
        <p className="footer-copy">© 2026 TECPIXEL. Todos os direitos reservados.</p>
        <p className="footer-lgpd">
          <button className="lgpd-link" id="lgpdBtn" onClick={onOpenLgpd}>
            Aviso de Privacidade (LGPD)
          </button>
        </p>
      </div>
    </footer>
  );
}
