import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SECTION_LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'quem-somos', label: 'Quem Somos' },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      if (!onHome) {
        setActiveId('');
        return;
      }

      const scrollY = window.scrollY + 100;
      let current = '';
      document.querySelectorAll<HTMLElement>('section[id]').forEach((section) => {
        const top = section.offsetTop - 100;
        if (scrollY >= top && scrollY < top + section.offsetHeight) {
          current = section.id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onHome]);

  const goToSection = (e: React.MouseEvent, id: string) => {
    // Deixa o navegador tratar ctrl/cmd/shift/alt+clique (abrir em nova aba/janela).
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setMenuOpen(false);
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <header className={scrolled ? 'header scrolled' : 'header'} id="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-tec">TEC</span><span className="logo-pixel">PIXEL</span>
        </Link>

        <nav className="nav">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href="#/"
              className={onHome && activeId === link.id ? 'nav-link active' : 'nav-link'}
              onClick={(e) => goToSection(e, link.id)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/montar-pc"
            className={location.pathname === '/montar-pc' ? 'nav-link active' : 'nav-link'}
          >
            Montar PC
          </Link>
        </nav>

        <button
          className="mobile-menu-btn"
          id="mobileMenuBtn"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <nav className={menuOpen ? 'mobile-nav open' : 'mobile-nav'} id="mobileNav">
        {SECTION_LINKS.map((link) => (
          <a
            key={link.id}
            href="#/"
            className="nav-link"
            onClick={(e) => goToSection(e, link.id)}
          >
            {link.label}
          </a>
        ))}
        <Link to="/montar-pc" className="nav-link" onClick={() => setMenuOpen(false)}>
          Montar PC
        </Link>
      </nav>
    </header>
  );
}
