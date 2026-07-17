/**
 * Format the cart contents into a WhatsApp message.
 * @param {Array} items - Cart items
 * @param {Object} info - Customer info { nombre, modalidad, direccion, observaciones }
 * @returns {string} Formatted WhatsApp URL
 */
export function buildWhatsAppURL(items, info) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '543815760508';

  const lines = [];
  lines.push('🛒 *Nuevo Pedido — El Abuelo Verdulería*');
  lines.push('');

  if (info.nombre) {
    lines.push(`👤 Cliente: ${info.nombre}`);
  }

  const modalIcon = info.modalidad === 'delivery' ? '🚚' : '🏪';
  const modalText = info.modalidad === 'delivery' ? 'Delivery' : 'Retiro en local';
  lines.push(`📋 Modalidad: ${modalIcon} ${modalText}`);

  if (info.modalidad === 'delivery' && info.direccion) {
    lines.push(`📍 Dirección: ${info.direccion}`);
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━');
  lines.push('📦 *Detalle del pedido:*');
  lines.push('');

  let total = 0;

  items.forEach((item) => {
    const qty = item.quantity;
    const unitPrice = item.precio || 0;
    const subtotal = unitPrice * qty;
    total += subtotal;

    // Build unit description
    let unitDesc = '';
    if (item.peso_kg) {
      unitDesc = `${item.peso_kg} kg`;
    } else if (item.cantidad) {
      unitDesc = `${item.cantidad} un.`;
    }

    const unitPart = unitDesc ? ` (${unitDesc})` : '';
    const obsPart = item.observacion ? ` — _${item.observacion}_` : '';
    const pricePart = unitPrice > 0 ? ` — $${subtotal.toLocaleString('es-AR')}` : ' — Consultar precio';

    lines.push(`• ${item.nombre}${unitPart} x${qty}${pricePart}${obsPart}`);
  });

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━');
  lines.push(`💰 *Total: $${total.toLocaleString('es-AR')}*`);

  if (info.observaciones) {
    lines.push('');
    lines.push(`📝 Observaciones: ${info.observaciones}`);
  }

  const message = encodeURIComponent(lines.join('\n'));
  return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
}
