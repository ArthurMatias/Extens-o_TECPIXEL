import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#diagnostico', label: 'Diagnóstico' },
  { href: '#montar-pc', label: 'Montar PC' },
  { href: '#quem-somos', label: 'Quem Somos' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

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
  }, []);

  return (
    <header className={scrolled ? 'header scrolled' : 'header'} id="header">
      <div className="container header-inner">
        <a href="#inicio" className="logo">
          <span className="logo-tec">TEC</span><span className="logo-pixel">PIXEL</span>
        </a>

        <nav className="nav">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={activeId === link.href.slice(1) ? 'nav-link active' : 'nav-link'}
            >
              {link.label}
            </a>
          ))}
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
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="nav-link" onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
