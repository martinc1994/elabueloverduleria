'use client';

import { useState, useEffect } from 'react';
import CartIcon from './CartIcon';

export default function Header({ onCartClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} id="site-header">
      <div className="header__inner">
        <a href="/" className="header__brand">
          <img
            src="/img/logo.jpeg"
            alt="El Abuelo Verdulería"
            className="header__logo"
            width={50}
            height={50}
          />
          <div>
            <div className="header__title">El Abuelo</div>
            <div className="header__subtitle">Verdulería & Almacén</div>
          </div>
        </a>
        <div className="header__actions">
          <CartIcon onClick={onCartClick} />
        </div>
      </div>
    </header>
  );
}
