import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Diagnostic from './components/Diagnostic';
import MontarPC from './components/MontarPC';
import QuemSomos from './components/QuemSomos';
import Footer from './components/Footer';
import LgpdModal from './components/LgpdModal';
import ContactWidget from './components/ContactWidget';

export default function App() {
  const [lgpdOpen, setLgpdOpen] = useState(false);

  return (
    <>
      <Header />
      <Hero />
      <Diagnostic />
      <MontarPC />
      <QuemSomos />
      <Footer onOpenLgpd={() => setLgpdOpen(true)} />
      <LgpdModal isOpen={lgpdOpen} onClose={() => setLgpdOpen(false)} />
      <ContactWidget />
    </>
  );
}
