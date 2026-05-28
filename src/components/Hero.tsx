export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-content">
        <div className="hero-badge">Diagnóstico gratuito e educativo</div>
        <h1>
          Descubra o problema do seu<br />
          <span className="text-blue">computador</span> em minutos
        </h1>
        <p className="hero-subtitle">
          Responda algumas perguntas simples e receba um diagnóstico detalhado com
          soluções passo a passo. Aprenda enquanto resolve.
        </p>
        <a href="#diagnostico" className="btn btn-primary btn-lg">Iniciar Diagnóstico</a>
      </div>
      <div className="hero-decoration">
        <div className="hero-circle hero-circle-1"></div>
        <div className="hero-circle hero-circle-2"></div>
        <div className="hero-circle hero-circle-3"></div>
      </div>
    </section>
  );
}
