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

const FALLBACK_PRODUCTS = [
  { id: '1', nombre: 'Papa', precio: 1400, peso_kg: 1, cantidad: null, observacion: '', categoria: 'verduras', imagen_url: '/img/papa.webp', activo: true },
  { id: '2', nombre: 'Zanahoria', precio: 850, peso_kg: 0.5, cantidad: null, observacion: '', categoria: 'verduras', imagen_url: '/img/zanahoria.jpg', activo: true },
  { id: '3', nombre: 'Cebolla', precio: 1200, peso_kg: 1, cantidad: null, observacion: '', categoria: 'verduras', imagen_url: '/img/cebolla.webp', activo: true },
  { id: '4', nombre: 'Zapallo', precio: 1200, peso_kg: 1, cantidad: null, observacion: '', categoria: 'verduras', imagen_url: '/img/zapallo.jpg', activo: true },
  { id: '5', nombre: 'Mandarinas', precio: 1000, peso_kg: null, cantidad: 5, observacion: '', categoria: 'frutas', imagen_url: '/img/mandarina.jpg', activo: true },
  { id: '6', nombre: 'Naranjas', precio: 1000, peso_kg: null, cantidad: 5, observacion: '', categoria: 'frutas', imagen_url: '/img/naranja.jpg', activo: true },
  { id: '7', nombre: 'Limón', precio: 500, peso_kg: null, cantidad: 6, observacion: '', categoria: 'frutas', imagen_url: '/img/lemon.webp', activo: true },
  { id: '8', nombre: 'Morrón Verde', precio: 1500, peso_kg: 0.5, cantidad: null, observacion: '', categoria: 'verduras', imagen_url: '/img/morronverde.webp', activo: true },
  { id: '9', nombre: 'Morrón Rojo', precio: 2000, peso_kg: 0.5, cantidad: null, observacion: '', categoria: 'verduras', imagen_url: '/img/pimientorojo.webp', activo: true },
  { id: '10', nombre: 'Banana', precio: 1000, peso_kg: null, cantidad: 4, observacion: '', categoria: 'frutas', imagen_url: '/img/banana.webp', activo: true },
  { id: '11', nombre: 'Bandeja de Sopa', precio: 1800, peso_kg: 1, cantidad: null, observacion: '', categoria: 'verduras', imagen_url: '/img/sopa.webp', activo: true },
  { id: '12', nombre: 'Ajo', precio: 800, peso_kg: null, cantidad: 1, observacion: '', categoria: 'verduras', imagen_url: '/img/ajo.webp', activo: true },
  { id: '13', nombre: 'Laurel', precio: 800, peso_kg: null, cantidad: 1, observacion: 'Bolsita 10g.', categoria: 'verduras', imagen_url: '/img/laurel.jpg', activo: true },
  { id: '14', nombre: 'Huevos', precio: 1500, peso_kg: null, cantidad: 6, observacion: '', categoria: 'almacen', imagen_url: '/img/huevos.jpg', activo: true },
  { id: '15', nombre: 'Acelga', precio: 800, peso_kg: null, cantidad: 1, observacion: 'Medio atado', categoria: 'verduras', imagen_url: '/img/acelga.webp', activo: true },
  { id: '16', nombre: 'Perejil', precio: 300, peso_kg: 0.1, cantidad: null, observacion: '100 g.', categoria: 'verduras', imagen_url: '/img/perejil.webp', activo: true },
  { id: '17', nombre: 'Apio', precio: 300, peso_kg: 0.1, cantidad: null, observacion: '100 g.', categoria: 'verduras', imagen_url: '/img/apio.jpg', activo: true },
  { id: '18', nombre: 'Bollo casero con chicharrón', precio: 500, peso_kg: null, cantidad: 1, observacion: '', categoria: 'panaderia', imagen_url: '/img/bollochicharron.jpeg', activo: true },
  { id: '19', nombre: 'Bollo casero simple', precio: 500, peso_kg: null, cantidad: 1, observacion: '', categoria: 'panaderia', imagen_url: '/img/bollocasero.jpeg', activo: true },
  { id: '20', nombre: 'Tira de pan', precio: 500, peso_kg: null, cantidad: 1, observacion: '', categoria: 'panaderia', imagen_url: '/img/tiradepan.webp', activo: true },
  { id: '21', nombre: 'Pastafrola (porción)', precio: 2000, peso_kg: null, cantidad: 1, observacion: '', categoria: 'panaderia', imagen_url: '/img/pastafrola.webp', activo: true },
  { id: '22', nombre: 'Magdalena', precio: 700, peso_kg: null, cantidad: 1, observacion: '', categoria: 'panaderia', imagen_url: '/img/magdalena.png', activo: true },
  { id: '23', nombre: 'Combo Familiar', precio: 6000, peso_kg: null, cantidad: 1, observacion: '1kg tomate, 1kg papa, ½kg cebolla, ½kg zapallo, ½kg zanahoria, 1 ajo, 1 morrón verde, perejil y acelga', categoria: 'combos', imagen_url: '/img/combo_verduras.png', activo: true },
];

export default function AdminPage() {
  // Auth states
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Image Upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // CRUD states
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Stats state
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    // Auth Session setup
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setCheckingAuth(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local fallback auth
      const mockSession = localStorage.getItem('elabueloadmin_mock_session');
      if (mockSession) {
        setSession({ user: { email: 'marcelobolivar@elabueloverduleria.com' } });
      }
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      loadProducts();
      loadStats();
    }
  }, [session]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    let email = username.trim();
    if (email && !email.includes('@')) {
      email = `${email}@elabueloverduleria.com`;
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(
          error.message === 'Invalid login credentials'
            ? 'Usuario o contraseña incorrectos.'
            : error.message
        );
      } else {
        setSession(data.session);
      }
    } else {
      // Offline fallback login for client presentation
      if (
        (username.trim() === 'marcelobolivar' || username.trim() === 'marcelobolivar@elabueloverduleria.com') &&
        password === 'elabuelo2026-'
      ) {
        const mockSess = { user: { email: 'marcelobolivar@elabueloverduleria.com' } };
        setSession(mockSess);
        localStorage.setItem('elabueloadmin_mock_session', 'true');
      } else {
        setLoginError('Usuario o contraseña incorrectos.');
      }
    }
    setLoggingIn(false);
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('elabueloadmin_mock_session');
      setSession(null);
    }
  }

  async function loadProducts() {
    setLoading(true);
    if (!supabase) {
      // Local fallback CRUD loading from localStorage or FALLBACK_PRODUCTS
      const stored = localStorage.getItem('elabueloadmin_mock_products');
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts(FALLBACK_PRODUCTS);
        localStorage.setItem('elabueloadmin_mock_products', JSON.stringify(FALLBACK_PRODUCTS));
      }
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

  async function loadStats() {
    if (!supabase) {
      // Local fallback stats from localStorage
      const mockOrders = JSON.parse(localStorage.getItem('elabueloadmin_mock_orders') || '[]');
      const totalRev = mockOrders.reduce((sum, o) => sum + Number(o.total), 0);
      setStats({ totalOrders: mockOrders.length, totalRevenue: totalRev });
      return;
    }

    const { data, error } = await supabase
      .from('registro_pedidos')
      .select('total');

    if (error) {
      console.error('Error fetching stats:', error.message);
    } else if (data) {
      const totalRev = data.reduce((sum, o) => sum + Number(o.total), 0);
      setStats({ totalOrders: data.length, totalRevenue: totalRev });
    }
  }

  function handleNew() {
    setEditing(null);
    setForm(EMPTY_PRODUCT);
    setImageFile(null);
    setImagePreview('');
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
    setImageFile(null);
    setImagePreview(product.imagen_url || '');
    setShowForm(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const localUrl = URL.createObjectURL(file);
      setImagePreview(localUrl);
    }
  }

  async function handleSave() {
    setSaving(true);
    let finalImageUrl = form.imagen_url;

    // Handle image file upload
    if (imageFile) {
      if (supabase) {
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `products/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('productos')
            .upload(filePath, imageFile);

          if (uploadError) {
            throw new Error(uploadError.message);
          }

          const { data: { publicUrl } } = supabase.storage
            .from('productos')
            .getPublicUrl(filePath);

          finalImageUrl = publicUrl;
        } catch (err) {
          setMessage(`⚠️ Error al subir imagen: ${err.message}`);
          setSaving(false);
          setTimeout(() => setMessage(''), 5000);
          return;
        }
      } else {
        // Local mode: convert to base64 Data URL for temporary storage
        const reader = new FileReader();
        const promise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
        });
        reader.readAsDataURL(imageFile);
        finalImageUrl = await promise;
      }
    }

    const payload = {
      nombre: form.nombre,
      precio: form.precio ? Number(form.precio) : null,
      peso_kg: form.peso_kg ? Number(form.peso_kg) : null,
      cantidad: form.cantidad ? Number(form.cantidad) : null,
      observacion: form.observacion || null,
      categoria: form.categoria,
      imagen_url: finalImageUrl || null,
      activo: form.activo,
      orden: Number(form.orden) || 0,
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
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
        setImageFile(null);
        setImagePreview('');
        await loadProducts();
        await loadStats();
      }
    } else {
      // Mock LocalStorage save
      let currentMock = [];
      const stored = localStorage.getItem('elabueloadmin_mock_products');
      if (stored) {
        currentMock = JSON.parse(stored);
      } else {
        currentMock = FALLBACK_PRODUCTS;
      }

      if (editing) {
        currentMock = currentMock.map((p) =>
          p.id === editing ? { ...p, ...payload } : p
        );
        setMessage('✅ Producto actualizado (Local)');
      } else {
        const newProduct = {
          id: `${Date.now()}`,
          ...payload,
        };
        currentMock.unshift(newProduct);
        setMessage('✅ Producto creado (Local)');
      }

      localStorage.setItem('elabueloadmin_mock_products', JSON.stringify(currentMock));
      setProducts(currentMock);
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_PRODUCT);
      setImageFile(null);
      setImagePreview('');
      loadStats();
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleDelete(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    if (supabase) {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) {
        setMessage(`Error al eliminar: ${error.message}`);
      } else {
        setMessage('🗑 Producto eliminado');
        await loadProducts();
        await loadStats();
      }
    } else {
      // Mock LocalStorage delete
      let currentMock = JSON.parse(localStorage.getItem('elabueloadmin_mock_products') || '[]');
      currentMock = currentMock.filter((p) => p.id !== id);
      localStorage.setItem('elabueloadmin_mock_products', JSON.stringify(currentMock));
      setProducts(currentMock);
      setMessage('🗑 Producto eliminado (Local)');
      loadStats();
    }
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleToggle(product) {
    if (supabase) {
      const { error } = await supabase
        .from('productos')
        .update({ activo: !product.activo, updated_at: new Date().toISOString() })
        .eq('id', product.id);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        await loadProducts();
      }
    } else {
      // Mock LocalStorage toggle
      let currentMock = JSON.parse(localStorage.getItem('elabueloadmin_mock_products') || '[]');
      currentMock = currentMock.map((p) =>
        p.id === product.id ? { ...p, activo: !p.activo, updated_at: new Date().toISOString() } : p
      );
      localStorage.setItem('elabueloadmin_mock_products', JSON.stringify(currentMock));
      setProducts(currentMock);
    }
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
        <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Verificando credenciales...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <img
            src="/img/logo.jpeg"
            alt="El Abuelo Verdulería"
            className="login-card__logo"
          />
          <h1 className="login-card__title">Panel de Control</h1>
          <p className="login-card__subtitle">El Abuelo Verdulería & Almacén</p>

          <form className="login-card__form" onSubmit={handleLogin}>
            {loginError && (
              <div className="login-card__error">
                {loginError}
              </div>
            )}
            <div className="login-card__group">
              <label className="login-card__label" htmlFor="username">Usuario</label>
              <input
                id="username"
                type="text"
                className="login-card__input"
                placeholder="Ej: marcelobolivar"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="login-card__group">
              <label className="login-card__label" htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                className="login-card__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn--primary login-card__btn"
              disabled={loggingIn}
            >
              {loggingIn ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
            <a href="/" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '10px' }}>
              ← Volver a la tienda
            </a>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin container" id="admin-page">
      <div className="admin__header">
        <div>
          <h1 className="admin__title">🛠 Panel de Administración</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Sesión iniciada como: <strong>{session.user.email}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/" className="btn btn--outline btn--sm">← Volver a la tienda</a>
          <button className="btn btn--primary btn--sm" onClick={handleNew} id="btn-new-product">
            + Nuevo Producto
          </button>
          <button className="btn btn--outline btn--sm" onClick={handleLogout} style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {!supabase && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '8px',
          background: '#FFFBEB',
          color: '#B45309',
          border: '1px solid #FDE68A',
          marginBottom: '20px',
          fontWeight: 500,
          fontSize: '0.9rem',
        }}>
          ⚠️ Modo Demostración Local: Supabase no está conectado todavía. Los cambios se guardarán solo temporalmente en memoria para mostrarle al cliente.
        </div>
      )}

      {/* Stats Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          background: 'var(--color-surface)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🛒 Pedidos Concretados (WhatsApp)
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            {stats.totalOrders}
          </span>
        </div>
        <div style={{
          background: 'var(--color-surface)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💰 Facturación Estimada
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent-dark)' }}>
            ${stats.totalRevenue.toLocaleString('es-AR')}
          </span>
        </div>
        <div style={{
          background: 'var(--color-surface)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📊 Ticket Promedio
          </span>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            ${stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('es-AR') : '0'}
          </span>
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
                  <label className="admin__form-label">Imagen del Producto</label>
                  
                  {/* Preview Area */}
                  {imagePreview && (
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '2px solid var(--color-primary-bg)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', padding: '6px 12px' }}
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          handleFormChange('imagen_url', '');
                        }}
                      >
                        Quitar Imagen
                      </button>
                    </div>
                  )}

                  {/* File Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="admin__form-input"
                      style={{ padding: '8px' }}
                    />
                    
                    {/* Fallback Text Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        O ingresá la URL del archivo de imagen si preferís:
                      </span>
                      <input
                        className="admin__form-input"
                        value={form.imagen_url}
                        onChange={(e) => {
                          handleFormChange('imagen_url', e.target.value);
                          setImagePreview(e.target.value);
                          setImageFile(null); // Clear file selection if they use manual URL
                        }}
                        placeholder="Ej: /img/papa.webp o https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                  </div>
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
