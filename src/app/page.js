'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import Footer from '../components/Footer';
import { supabase, getProducts } from '../lib/supabase';

// Fallback products from CSV — used when Supabase is not configured yet
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

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      let data = [];

      if (supabase) {
        data = await getProducts();
      }

      // Use fallback if no Supabase data
      if (!data || data.length === 0) {
        data = FALLBACK_PRODUCTS;
      }

      setProducts(data);

      // Extract unique categories
      const cats = [...new Set(data.map((p) => p.categoria))];
      // Sort with preferred order
      const order = ['combos', 'verduras', 'frutas', 'panaderia', 'almacen'];
      cats.sort((a, b) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      });
      setCategories(cats);

      setLoading(false);
    }

    loadProducts();
  }, []);

  // When showing 'todos', put combos first so they're prominent
  const filteredProducts =
    activeCategory === 'todos'
      ? [
        ...products.filter((p) => p.categoria === 'combos'),
        ...products.filter((p) => p.categoria !== 'combos'),
      ]
      : products.filter((p) => p.categoria === activeCategory);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero />

        <section className="products-section" id="productos">
          <div className="container">
            <h2 className="products-section__title">Nuestros Productos</h2>
            <p className="products-section__subtitle">
              Seleccioná lo que necesites y armá tu pedido 🛒
            </p>

            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
            />

            {loading ? (
              <div className="product-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="product-card">
                    <div className="product-card__image-wrapper skeleton" />
                    <div className="product-card__body">
                      <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 14, width: '40%' }} />
                    </div>
                    <div className="product-card__footer">
                      <div className="skeleton" style={{ height: 24, width: 60 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
