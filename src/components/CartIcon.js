'use client';

import { useCart } from '../context/CartContext';

export default function CartIcon({ onClick }) {
  const { itemCount, lastAdded } = useCart();

  return (
    <button
      className="cart-btn"
      onClick={onClick}
      aria-label={`Carrito: ${itemCount} productos`}
      id="cart-icon"
    >
      🛒
      {itemCount > 0 && (
        <span className={`cart-btn__badge ${lastAdded ? 'bounce' : ''}`}>
          {itemCount}
        </span>
      )}
    </button>
  );
}
