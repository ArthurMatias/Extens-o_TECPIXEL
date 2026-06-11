import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LgpdModal from './components/LgpdModal';
import ContactWidget from './components/ContactWidget';
import HomePage from './pages/HomePage';
import MontarPCPage from './pages/MontarPCPage';

export default function App() {
  const [lgpdOpen, setLgpdOpen] = useState(false);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/montar-pc" element={<MontarPCPage />} />
        </Routes>
      </main>
      <Footer onOpenLgpd={() => setLgpdOpen(true)} />
      <LgpdModal isOpen={lgpdOpen} onClose={() => setLgpdOpen(false)} />
      <ContactWidget />
    </>
  );
}
