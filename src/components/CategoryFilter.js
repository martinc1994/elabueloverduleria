export default function CategoryFilter({ categories, active, onSelect }) {
  const categoryLabels = {
    verduras: '🥬 Verduras',
    frutas: '🍊 Frutas',
    panaderia: '🍞 Panadería',
    combos: '🎁 Combos',
    almacen: '🏪 Almacén',
  };

  return (
    <div className="category-filter" id="category-filter">
      <button
        className={`category-filter__btn ${active === 'todos' ? 'active' : ''}`}
        onClick={() => onSelect('todos')}
      >
        🛒 Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-filter__btn ${active === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {categoryLabels[cat] || cat}
        </button>
      ))}
    </div>
  );
}
