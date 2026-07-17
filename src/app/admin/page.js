'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const EMPTY_PRODUCT = {
  nombre: '',
  precio: '',
  peso_kg: '',
  cantidad: '',
  observacion: '',
  categoria: 'verduras',
  imagen_url: '',
  activo: true,
  orden: 0,
};

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    if (!supabase) {
      setMessage('⚠️ Supabase no está configurado. Configurá las variables de entorno en .env.local');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('categoria')
      .order('orden')
      .order('nombre');

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  function handleNew() {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setShowForm(true);
  }

  function handleEdit(product) {
    setEditing(product.id);
    setForm({
      nombre: product.nombre || '',
      precio: product.precio || '',
      peso_kg: product.peso_kg || '',
      cantidad: product.cantidad || '',
      observacion: product.observacion || '',
      categoria: product.categoria || 'verduras',
      imagen_url: product.imagen_url || '',
      activo: product.activo,
      orden: product.orden || 0,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!supabase) return;
    setSaving(true);

    const payload = {
      nombre: form.nombre,
      precio: form.precio ? Number(form.precio) : null,
      peso_kg: form.peso_kg ? Number(form.peso_kg) : null,
      cantidad: form.cantidad ? Number(form.cantidad) : null,
      observacion: form.observacion || null,
      categoria: form.categoria,
      imagen_url: form.imagen_url || null,
      activo: form.activo,
      orden: Number(form.orden) || 0,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editing) {
      ({ error } = await supabase
        .from('productos')
        .update(payload)
        .eq('id', editing));
    } else {
      ({ error } = await supabase
        .from('productos')
        .insert(payload));
    }

    if (error) {
      setMessage(`Error al guardar: ${error.message}`);
    } else {
      setMessage(editing ? '✅ Producto actualizado' : '✅ Producto creado');
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_PRODUCT);
      await loadProducts();
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleDelete(id) {
    if (!supabase) return;
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage(`Error al eliminar: ${error.message}`);
    } else {
      setMessage('🗑 Producto eliminado');
      await loadProducts();
    }
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleToggle(product) {
    if (!supabase) return;

    const { error } = await supabase
      .from('productos')
      .update({ activo: !product.activo, updated_at: new Date().toISOString() })
      .eq('id', product.id);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      await loadProducts();
    }
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="admin container" id="admin-page">
      <div className="admin__header">
        <h1 className="admin__title">🛠 Panel de Administración</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/" className="btn btn--outline btn--sm">← Volver a la tienda</a>
          <button className="btn btn--primary btn--sm" onClick={handleNew} id="btn-new-product">
            + Nuevo Producto
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '8px',
          background: message.includes('Error') || message.includes('⚠️')
            ? '#FEE2E2' : '#E8F0E6',
          color: message.includes('Error') || message.includes('⚠️')
            ? '#991B1B' : '#365A2E',
          marginBottom: '20px',
          fontWeight: 500,
          fontSize: '0.9rem',
        }}>
          {message}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal" style={{ maxWidth: '560px' }}>
            <div className="modal__header">
              <h2 className="modal__title">
                {editing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
              </h2>
              <button className="modal__close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="modal__body">
              <div className="admin__form">
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Nombre *</label>
                  <input
                    className="admin__form-input"
                    value={form.nombre}
                    onChange={(e) => handleFormChange('nombre', e.target.value)}
                    placeholder="Ej: Papa"
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Precio ($)</label>
                  <input
                    className="admin__form-input"
                    type="number"
                    value={form.precio}
                    onChange={(e) => handleFormChange('precio', e.target.value)}
                    placeholder="Ej: 1400"
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Categoría</label>
                  <select
                    className="admin__form-select"
                    value={form.categoria}
                    onChange={(e) => handleFormChange('categoria', e.target.value)}
                  >
                    <option value="verduras">🥬 Verduras</option>
                    <option value="frutas">🍊 Frutas</option>
                    <option value="panaderia">🍞 Panadería</option>
                    <option value="combos">🎁 Combos</option>
                    <option value="almacen">🏪 Almacén</option>
                  </select>
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Peso (kg)</label>
                  <input
                    className="admin__form-input"
                    type="number"
                    step="0.1"
                    value={form.peso_kg}
                    onChange={(e) => handleFormChange('peso_kg', e.target.value)}
                    placeholder="Ej: 1"
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Cantidad (unidades)</label>
                  <input
                    className="admin__form-input"
                    type="number"
                    value={form.cantidad}
                    onChange={(e) => handleFormChange('cantidad', e.target.value)}
                    placeholder="Ej: 6"
                  />
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">URL de Imagen</label>
                  <input
                    className="admin__form-input"
                    value={form.imagen_url}
                    onChange={(e) => handleFormChange('imagen_url', e.target.value)}
                    placeholder="Ej: /img/papa.webp"
                  />
                </div>
                <div className="admin__form-group admin__form-group--full">
                  <label className="admin__form-label">Observación</label>
                  <input
                    className="admin__form-input"
                    value={form.observacion}
                    onChange={(e) => handleFormChange('observacion', e.target.value)}
                    placeholder="Ej: Bolsita 10g."
                  />
                </div>
                <div className="admin__form-group">
                  <label className="admin__form-label">Orden</label>
                  <input
                    className="admin__form-input"
                    type="number"
                    value={form.orden}
                    onChange={(e) => handleFormChange('orden', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="admin__form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                  <input
                    type="checkbox"
                    id="form-activo"
                    checked={form.activo}
                    onChange={(e) => handleFormChange('activo', e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="form-activo" className="admin__form-label" style={{ margin: 0 }}>
                    Activo (visible en la tienda)
                  </label>
                </div>
              </div>
            </div>
            <div className="modal__footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn--outline btn--sm" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button
                className="btn btn--primary btn--sm"
                onClick={handleSave}
                disabled={saving || !form.nombre.trim()}
                style={{ opacity: saving || !form.nombre.trim() ? 0.5 : 1 }}
              >
                {saving ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-secondary)' }}>
          Cargando productos...
        </div>
      ) : (
        <div className="admin__table-wrapper">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Peso/Cant</th>
                <th>Categoría</th>
                <th>Observación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ opacity: p.activo ? 1 : 0.5 }}>
                  <td>
                    <button
                      className={`admin__btn admin__btn--toggle ${p.activo ? 'active' : ''}`}
                      onClick={() => handleToggle(p)}
                      title={p.activo ? 'Desactivar' : 'Activar'}
                    >
                      {p.activo ? '✅' : '❌'}
                    </button>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                  <td>{p.precio ? `$${Number(p.precio).toLocaleString('es-AR')}` : '—'}</td>
                  <td>
                    {p.peso_kg ? `${p.peso_kg} kg` : ''}
                    {p.cantidad ? `${p.cantidad} un.` : ''}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{p.categoria}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    {p.observacion || '—'}
                  </td>
                  <td>
                    <div className="admin__table-actions">
                      <button className="admin__btn admin__btn--edit" onClick={() => handleEdit(p)}>
                        ✏️ Editar
                      </button>
                      <button className="admin__btn admin__btn--delete" onClick={() => handleDelete(p.id)}>
                        🗑 Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                    No hay productos. Creá el primero haciendo clic en &quot;+ Nuevo Producto&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
