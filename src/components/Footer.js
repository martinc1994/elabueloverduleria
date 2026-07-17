export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        {/* Brand */}
        <div>
          <div className="footer__brand">
            <img
              src="/img/logo.jpeg"
              alt="El Abuelo Verdulería"
              className="footer__logo"
              width={48}
              height={48}
            />
            <span className="footer__name">El Abuelo Verdulería</span>
          </div>
          <p className="footer__text">
            Productos frescos seleccionados con el cariño de siempre. 
            Frutas, verduras y mucho más, directo a tu mesa.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="footer__section-title">Contacto</h3>
          <div className="footer__info-item">
            <span className="footer__info-icon">📍</span>
            <span>Julio Paz 502, Rosario de Lerma, Salta</span>
          </div>
          <div className="footer__info-item">
            <span className="footer__info-icon">📱</span>
            <span>+54 381 576 0508</span>
          </div>
          <div className="footer__info-item">
            <span className="footer__info-icon">💬</span>
            <a
              href="https://wa.me/543815760508"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-whatsapp)' }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Hours */}
        <div>
          <h3 className="footer__section-title">Horarios</h3>
          <div className="footer__info-item">
            <span className="footer__info-icon">📅</span>
            <span>Lunes a Sábado: 8:00 a 22:00 hs</span>
          </div>
          <div className="footer__info-item">
            <span className="footer__info-icon">📅</span>
            <span>Domingo: 9:00 a 15:00 hs</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        © {currentYear} El Abuelo Verdulería — Rosario de Lerma, Salta. Todos los derechos reservados.
      </div>
    </footer>
  );
}
