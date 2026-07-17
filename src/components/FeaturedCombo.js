'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function FeaturedCombo({ combo }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!combo) return null;

  const handleAdd = () => {
    addItem(combo);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  // Parse combo items from observacion
  const comboItems = combo.observacion
    ? combo.observacion.split(',').map((s) => s.trim())
    : [];

  return (
    <section className="featured-combo" id="featured-combo">
      <div className="featured-combo__inner container">
        {/* Decorative elements */}
        <div className="featured-combo__sparkle featured-combo__sparkle--1">✦</div>
        <div className="featured-combo__sparkle featured-combo__sparkle--2">✦</div>
        <div className="featured-combo__sparkle featured-combo__sparkle--3">🌿</div>

        <div className="featured-combo__content">
          <div className="featured-combo__text">
            <div className="featured-combo__badge">
              <span className="featured-combo__badge-icon">🔥</span>
              <span>¡OFERTA DESTACADA!</span>
            </div>
            <h2 className="featured-combo__title">{combo.nombre}</h2>
            <p className="featured-combo__description">
              Todo lo que necesitás para tu semana en un solo paquete, 
              al mejor precio 💪
            </p>

            {/* Combo items list */}
            <div className="featured-combo__items">
              {comboItems.map((item, i) => (
                <span key={i} className="featured-combo__item">
                  ✓ {item}
                </span>
              ))}
            </div>

            <div className="featured-combo__pricing">
              <span className="featured-combo__price">
                ${Number(combo.precio).toLocaleString('es-AR')}
              </span>
              <span className="featured-combo__price-label">por combo</span>
            </div>

            <button
              className={`featured-combo__cta ${added ? 'added' : ''}`}
              onClick={handleAdd}
              id="add-featured-combo"
            >
              {added ? (
                <>✅ ¡Agregado al carrito!</>
              ) : (
                <>🛒 Agregar Combo al Pedido</>
              )}
            </button>
          </div>

          <div className="featured-combo__image-wrapper">
            {combo.imagen_url ? (
              <img
                src={combo.imagen_url}
                alt={combo.nombre}
                className="featured-combo__image"
              />
            ) : (
              <div className="featured-combo__image-placeholder">🎁</div>
            )}
            <div className="featured-combo__image-glow" />
          </div>
        </div>
      </div>
    </section>
  );
}
