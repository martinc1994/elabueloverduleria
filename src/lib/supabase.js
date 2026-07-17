import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate that we have real Supabase credentials (not placeholders)
const isValidUrl = supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://');
const hasCredentials = isValidUrl && supabaseAnonKey.length > 10;

if (!hasCredentials) {
  console.warn(
    'Supabase not configured. Using local fallback data. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all active products from Supabase, ordered by category then orden.
 */
export async function getProducts() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('categoria', { ascending: true })
    .order('orden', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all unique categories.
 */
export async function getCategories() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('productos')
    .select('categoria')
    .eq('activo', true);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const unique = [...new Set(data.map((p) => p.categoria))];
  return unique;
}
