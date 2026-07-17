export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <div className="hero__badge">
            🌿 Productos frescos todos los días
          </div>
          <h1 className="hero__heading">
            Lo mejor de la huerta,{' '}
            <span>directo a tu mesa</span>
          </h1>
          <p className="hero__description">
            Frutas, verduras y productos artesanales seleccionados con cariño. 
            Armá tu pedido y recibilo en tu casa o pasá a retirarlo.
          </p>
          <div className="hero__info">
            <div className="hero__info-item">
              <span className="hero__info-icon">📍</span>
              <span>Julio Paz 502, Rosario de Lerma</span>
            </div>
            <div className="hero__info-item">
              <span className="hero__info-icon">🕐</span>
              <span>Lun-Sáb 8-22hs | Dom 9-15hs</span>
            </div>
            <div className="hero__info-item">
              <span className="hero__info-icon">🚚</span>
              <span>Retiro y Delivery</span>
            </div>
          </div>
        </div>
        <img
          src="/img/logo.jpeg"
          alt="El Abuelo Verdulería"
          className="hero__logo"
          width={220}
          height={220}
        />
      </div>
    </section>
  );
}
