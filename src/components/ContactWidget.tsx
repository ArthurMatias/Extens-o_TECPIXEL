import { useEffect, useRef, useState } from 'react';
import { faqAnswers } from '../data/faq';
import InstagramIcon from './InstagramIcon';

const FAQ_QUESTIONS = [
  'O diagnóstico é confiável?',
  'Preciso pagar algo?',
  'Posso usar no celular?',
  'Meu problema não está listado',
  'Como entro em contato?',
];

export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current && !panelRef.current.contains(target) &&
        fabRef.current && !fabRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <>
      <button
        className="contact-fab"
        id="contactFab"
        aria-label="Contato"
        ref={fabRef}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span className="fab-label">Dúvidas</span>
      </button>

      <div
        className={open ? 'contact-panel' : 'contact-panel hidden'}
        id="contactPanel"
        ref={panelRef}
      >
        <div className="contact-panel-header">
          <h4>Dúvidas Frequentes</h4>
          <button className="contact-close" id="contactClose" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>
        <div className="contact-panel-body" id="contactBody">
          <div className={selectedFaq === null ? 'faq-list' : 'faq-list hidden'} id="faqList">
            {FAQ_QUESTIONS.map((question, i) => (
              <button
                className="faq-btn"
                data-faq={i}
                key={i}
                onClick={() => setSelectedFaq(i)}
              >
                {question}
              </button>
            ))}
          </div>

          <div className={selectedFaq !== null ? 'faq-answer' : 'faq-answer hidden'} id="faqAnswer">
            <p id="faqAnswerText">{selectedFaq !== null ? faqAnswers[selectedFaq] : ''}</p>
            <button
              className="btn btn-ghost btn-sm"
              id="faqBack"
              onClick={() => setSelectedFaq(null)}
            >
              ← Voltar às perguntas
            </button>
          </div>

          <div className="contact-instagram">
            <p>Ainda tem dúvidas? Fale conosco!</p>
            <a
              href="https://instagram.com/projeto.tecpixel"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
            >
              <InstagramIcon size={18} />
              @projeto.tecpixel
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
