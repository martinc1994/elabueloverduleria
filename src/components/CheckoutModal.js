'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { buildWhatsAppURL } from '../utils/whatsapp';
import { track } from '@vercel/analytics';
import { supabase } from '../lib/supabase';

export default function CheckoutModal({ isOpen, onClose }) {
  const { items, total, clearCart } = useCart();
  const [modalidad, setModalidad] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const canSubmit = modalidad && nombre.trim().length > 0 &&
    (modalidad === 'retiro' || (modalidad === 'delivery' && direccion.trim().length > 0));

  const handleSubmit = () => {
    const url = buildWhatsAppURL(items, {
      nombre,
      modalidad,
      direccion,
      observaciones,
    });

    // Track the successful order action
    try {
      track('Confirmar Pedido WhatsApp', {
        modalidad,
        cantidad_productos: items.length,
        total_pedido: total,
      });
    } catch (e) {
      console.error('Analytics error:', e);
    }

    // Log the order to Supabase database for free tracking
    if (supabase) {
      supabase
        .from('registro_pedidos')
        .insert({
          modalidad,
          total: Number(total),
          items_count: items.length,
        })
        .then(({ error }) => {
          if (error) console.error('Error logging order:', error);
        });
    } else {
      // Save local mock order for admin stats preview
      const mockOrders = JSON.parse(localStorage.getItem('elabueloadmin_mock_orders') || '[]');
      mockOrders.push({
        id: Date.now(),
        modalidad,
        total: Number(total),
        items_count: items.length,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('elabueloadmin_mock_orders', JSON.stringify(mockOrders));
    }

    // Open WhatsApp in a new tab
    window.open(url, '_blank');

    // Clear form and cart
    clearCart();
    setModalidad('');
    setNombre('');
    setDireccion('');
    setObservaciones('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-label="Finalizar pedido" id="checkout-modal">
        {/* Header */}
        <div className="modal__header">
          <h2 className="modal__title">📋 Finalizar Pedido</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {/* Name */}
          <div className="modal__section">
            <label className="modal__label" htmlFor="checkout-name">
              👤 Tu nombre
            </label>
            <input
              type="text"
              id="checkout-name"
              className="modal__input"
              placeholder="Ej: Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
          </div>

          {/* Delivery Options */}
          <div className="modal__section">
            <label className="modal__label">¿Cómo querés recibir tu pedido?</label>
            <div className="delivery-options">
              <button
                type="button"
                className={`delivery-option ${modalidad === 'retiro' ? 'selected' : ''}`}
                onClick={() => setModalidad('retiro')}
                id="opt-retiro"
              >
                <div className="delivery-option__icon">🏪</div>
                <div className="delivery-option__label">Retiro en local</div>
                <div className="delivery-option__desc">Julio Paz 502</div>
              </button>
              <button
                type="button"
                className={`delivery-option ${modalidad === 'delivery' ? 'selected' : ''}`}
                onClick={() => setModalidad('delivery')}
                id="opt-delivery"
              >
                <div className="delivery-option__icon">🚚</div>
                <div className="delivery-option__label">Delivery</div>
                <div className="delivery-option__desc">Te lo llevamos</div>
              </button>
            </div>
          </div>

          {/* Address (only for delivery) */}
          {modalidad === 'delivery' && (
            <div className="modal__section" style={{ animation: 'fadeInUp 0.3s ease' }}>
              <label className="modal__label" htmlFor="checkout-address">
                📍 Dirección de entrega
              </label>
              <input
                type="text"
                id="checkout-address"
                className="modal__input"
                placeholder="Ej: Av. San Martín 1234, Rosario de Lerma"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
          )}

          {/* Observations */}
          <div className="modal__section">
            <label className="modal__label" htmlFor="checkout-obs">
              📝 Observaciones (opcional)
            </label>
            <textarea
              id="checkout-obs"
              className="modal__input"
              placeholder="Ej: Tocar timbre, dejar en portería, etc."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal__footer">
          <div className="modal__total">
            <span className="modal__total-label">Total del pedido</span>
            <span className="modal__total-price">
              ${total.toLocaleString('es-AR')}
            </span>
          </div>
          <button
            className="btn btn--whatsapp"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ width: '100%', opacity: canSubmit ? 1 : 0.5 }}
            id="btn-send-whatsapp"
          >
            <span style={{ fontSize: '1.2rem' }}>💬</span>
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
