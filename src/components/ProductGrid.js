import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-secondary)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No se encontraron productos</p>
        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Probá seleccionando otra categoría</p>
      </div>
    );
  }

  return (
    <div className="product-grid" id="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
