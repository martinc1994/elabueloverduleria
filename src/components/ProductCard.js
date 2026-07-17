'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 500);
  };

  // Build unit text
  let unitText = '';
  if (product.peso_kg) {
    unitText = `${product.peso_kg} kg`;
  } else if (product.cantidad) {
    unitText = `${product.cantidad} un.`;
  }

  const isCombo = product.categoria === 'combos';

  return (
    <article className={`product-card ${isCombo ? 'product-card--combo' : ''}`} id={`product-${product.id}`}>
      {isCombo && (
        <span className="product-card__badge product-card__badge--promo">🔥 ¡Promo!</span>
      )}
      <div className="product-card__image-wrapper">
        {product.imagen_url ? (
          <img
            src={product.imagen_url}
            alt={product.nombre}
            className="product-card__image"
            loading="lazy"
          />
        ) : (
          <div className="product-card__placeholder">
            {product.categoria === 'frutas' ? '🍊' :
             product.categoria === 'panaderia' ? '🍞' :
             product.categoria === 'combos' ? '🎁' : '🥬'}
          </div>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.nombre}</h3>
        {unitText && <span className="product-card__unit">{unitText}</span>}
        {product.observacion && (
          <span className="product-card__observation">{product.observacion}</span>
        )}
      </div>
      <div className="product-card__footer">
        <span className="product-card__price">
          {product.precio ? `$${Number(product.precio).toLocaleString('es-AR')}` : 'Consultar'}
        </span>
        <button
          className={`product-card__add-btn ${added ? 'added' : ''}`}
          onClick={handleAdd}
          aria-label={`Agregar ${product.nombre} al carrito`}
          id={`add-${product.id}`}
        >
          {added ? '✓' : '+'}
        </button>
      </div>
    </article>
  );
}
