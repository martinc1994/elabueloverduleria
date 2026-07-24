export default function Footer() {
  const currentYear = new Date().getFullYear();
  const devPhone = process.env.NEXT_PUBLIC_DEVELOPER_WHATSAPP || '543816232650';
  const devMessage = encodeURIComponent('Hola Martín, vi tu trabajo en la web de El Abuelo Verdulería y me gustaría consultarte por tus servicios de desarrollo web.');
  const devLink = `https://api.whatsapp.com/send?phone=${devPhone}&text=${devMessage}`;

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
              href="https://api.whatsapp.com/send?phone=543815760508"
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

      <div className="footer__bottom" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 12px' }}>
        <span>© {currentYear} El Abuelo Verdulería — Rosario de Lerma, Salta.</span>
        <span>|</span>
        <span>
          Desarrollado por{' '}
          <a
            href={devLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-accent-light)',
              fontWeight: '700',
              textDecoration: 'underline',
              transition: 'color var(--transition-fast)',
            }}
            onMouseOver={(e) => (e.target.style.color = '#ffffff')}
            onMouseOut={(e) => (e.target.style.color = 'var(--color-accent-light)')}
          >
            Martín Castillo
          </a>
        </span>
      </div>
    </footer>
  );
}
