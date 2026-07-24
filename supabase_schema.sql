-- ============================================
-- El Abuelo Verdulería — Supabase Schema
-- Ejecutar este SQL en el SQL Editor de Supabase
-- ============================================

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio NUMERIC(10,2),
  peso_kg NUMERIC(5,2),
  cantidad INTEGER,
  observacion TEXT,
  categoria TEXT NOT NULL DEFAULT 'verduras',
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública (todos pueden ver productos activos)
CREATE POLICY "Lectura pública de productos"
  ON productos
  FOR SELECT
  USING (true);

-- Política: CRUD para usuarios autenticados (admin)
CREATE POLICY "Admin puede gestionar productos"
  ON productos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Seed: Insertar productos del CSV
-- ============================================

INSERT INTO productos (nombre, precio, peso_kg, cantidad, observacion, categoria, imagen_url, activo, orden)
VALUES
  -- COMBOS
  ('Combo Familiar', 6000, NULL, 1, '1kg tomate, 1kg papa, ½kg cebolla, ½kg zapallo, ½kg zanahoria, 1 ajo, 1 morrón verde, perejil y acelga', 'combos', '/img/combo_verduras.png', true, 1),

  -- VERDURAS
  ('Papa', 1400, 1, NULL, NULL, 'verduras', '/img/papa.webp', true, 1),
  ('Zanahoria', 850, 0.5, NULL, NULL, 'verduras', '/img/zanahoria.jpg', true, 2),
  ('Cebolla', 1200, 1, NULL, NULL, 'verduras', '/img/cebolla.webp', true, 3),
  ('Zapallo', 1200, 1, NULL, NULL, 'verduras', '/img/zapallo.jpg', true, 4),
  ('Morrón Verde', 1500, 0.5, NULL, NULL, 'verduras', '/img/morronverde.webp', true, 5),
  ('Morrón Rojo', 2000, 0.5, NULL, NULL, 'verduras', '/img/pimientorojo.webp', true, 6),
  ('Bandeja de Sopa', 1800, 1, NULL, NULL, 'verduras', '/img/sopa.webp', true, 7),
  ('Ajo', 800, NULL, 1, NULL, 'verduras', '/img/ajo.webp', true, 8),
  ('Laurel', 800, NULL, 1, 'Bolsita 10g.', 'verduras', '/img/laurel.jpg', true, 9),
  ('Acelga', 800, NULL, 1, 'Medio atado', 'verduras', '/img/acelga.webp', true, 10),
  ('Perejil', 300, 0.1, NULL, '100 g.', 'verduras', '/img/perejil.webp', true, 11),
  ('Apio', 300, 0.1, NULL, '100 g.', 'verduras', '/img/apio.jpg', true, 12),

  -- FRUTAS
  ('Mandarinas', 1000, NULL, 5, NULL, 'frutas', '/img/mandarina.jpg', true, 1),
  ('Naranjas', 1000, NULL, 5, NULL, 'frutas', '/img/naranja.jpg', true, 2),
  ('Limón', 500, NULL, 6, NULL, 'frutas', '/img/lemon.webp', true, 3),
  ('Banana', 1000, NULL, 4, NULL, 'frutas', '/img/banana.webp', true, 4),

  -- PANADERÍA
  ('Bollo casero con chicharrón', 500, NULL, 1, NULL, 'panaderia', '/img/bollochicharron.jpeg', true, 1),
  ('Bollo casero simple', 500, NULL, 1, NULL, 'panaderia', '/img/bollocasero.jpeg', true, 2),
  ('Tira de pan', 500, NULL, 1, NULL, 'panaderia', '/img/tiradepan.webp', true, 3),
  ('Pastafrola (porción)', 2000, NULL, 1, NULL, 'panaderia', '/img/pastafrola.webp', true, 4),
  ('Magdalena', 700, NULL, 1, NULL, 'panaderia', '/img/magdalena.png', true, 5),

  -- ALMACÉN
  ('Huevos', 1500, NULL, 6, NULL, 'almacen', '/img/huevos.jpg', true, 1);

-- ============================================
-- Tabla de analíticas de pedidos (Métricas)
-- ============================================

CREATE TABLE IF NOT EXISTS registro_pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  modalidad TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  items_count INTEGER NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE registro_pedidos ENABLE ROW LEVEL SECURITY;

-- Política: Clientes pueden insertar métricas al confirmar pedido
CREATE POLICY "Permitir insertar pedidos públicamente" 
  ON registro_pedidos
  FOR INSERT
  WITH CHECK (true);

-- Política: Solo administradores logueados pueden ver las métricas
CREATE POLICY "Permitir leer pedidos a admins" 
  ON registro_pedidos
  FOR SELECT
  TO authenticated
  USING (true);
