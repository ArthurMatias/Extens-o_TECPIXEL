import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Diagnostic from '../components/Diagnostic';
import QuemSomos from '../components/QuemSomos';

interface ScrollState {
  scrollTo?: string;
}

export default function HomePage() {
  const location = useLocation();

  // Ao chegar de outra página pedindo uma seção, rola até ela após render.
  useEffect(() => {
    const state = location.state as ScrollState | null;
    const id = state?.scrollTo;
    if (id) {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
      // Consome o state para que um reload de "/" não reative o scroll.
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <Diagnostic />
      <QuemSomos />
    </>
  );
}
