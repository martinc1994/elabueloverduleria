'use client';

import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Carrito de compras"
        id="cart-drawer"
      >
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            🛒 Mi Pedido
          </h2>
          <button
            className="cart-drawer__close"
            onClick={onClose}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer__items">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">🧺</div>
              <p className="cart-drawer__empty-text">Tu carrito está vacío</p>
              <p className="cart-drawer__empty-hint">
                Agregá productos del catálogo para armar tu pedido
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                {item.imagen_url ? (
                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    className="cart-item__image"
                  />
                ) : (
                  <div className="cart-item__placeholder">
                    {item.categoria === 'frutas' ? '🍊' :
                     item.categoria === 'panaderia' ? '🍞' :
                     item.categoria === 'combos' ? '🎁' : '🥬'}
                  </div>
                )}
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.nombre}</div>
                  <div className="cart-item__price">
                    ${(Number(item.precio || 0) * item.quantity).toLocaleString('es-AR')}
                  </div>
                </div>
                <div className="cart-item__controls">
                  <button
                    className="cart-item__qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <span className="cart-item__qty">{item.quantity}</span>
                  <button
                    className="cart-item__qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Quitar ${item.nombre}`}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span className="cart-drawer__total-label">Total estimado</span>
              <span className="cart-drawer__total-price">
                ${total.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="cart-drawer__actions">
              <button
                className="btn btn--primary"
                onClick={onCheckout}
                id="btn-checkout"
              >
                ✅ Finalizar Pedido
              </button>
              <button
                className="btn btn--outline btn--sm"
                onClick={clearCart}
                id="btn-clear-cart"
              >
                🗑 Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
