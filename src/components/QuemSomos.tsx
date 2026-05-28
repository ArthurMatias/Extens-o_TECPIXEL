const TEAM = [
  'Arthur Tintino',
  'Kaua Galvao',
  'Samuel Costa',
  'Luiz Francisco',
  'Ana Laura Acioly',
  'Fabio Assis',
];

function Avatar() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="60" fill="#E5E7EB" />
      <circle cx="60" cy="45" r="20" fill="#9CA3AF" />
      <ellipse cx="60" cy="95" rx="35" ry="25" fill="#9CA3AF" />
    </svg>
  );
}

export default function QuemSomos() {
  return (
    <section className="section" id="quem-somos">
      <div className="container">
        <div className="section-header">
          <h2>Quem Somos</h2>
          <p>Conheça a equipe por trás do projeto TECPIXEL.</p>
        </div>

        <div className="about-text">
          <p>
            O <strong>TECPIXEL</strong> é um projeto acadêmico desenvolvido por estudantes
            de Engenharia da Computação, com o objetivo de ajudar comunidades e pessoas em
            situações de urgência na resolução de problemas voltados a hardware de computador.
          </p>
          <p>
            Acreditamos que o conhecimento técnico deve ser acessível a todos. Por isso, nossa
            missão é disseminar o conhecimento da área de Engenharia da Computação de forma
            simples, prática e gratuita, capacitando as pessoas a entenderem e resolverem os
            problemas dos seus próprios equipamentos.
          </p>
        </div>

        <div className="team-grid">
          {TEAM.map((name) => (
            <div className="team-card" key={name}>
              <div className="team-photo">
                <Avatar />
              </div>
              <h4>{name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
