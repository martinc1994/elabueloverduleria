import './globals.css';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'El Abuelo Verdulería | Frutas, Verduras y más — Rosario de Lerma',
  description:
    'Tienda online de El Abuelo Verdulería. Frutas, verduras frescas y productos artesanales en Rosario de Lerma, Salta. Armá tu pedido y recibilo en tu casa o pasá a retirarlo.',
  keywords: 'verdulería, frutas, verduras, Rosario de Lerma, Salta, delivery, almacén',
  openGraph: {
    title: 'El Abuelo Verdulería',
    description: 'Frutas, verduras frescas y productos artesanales. Delivery y retiro en local.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/logo.jpeg" />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
