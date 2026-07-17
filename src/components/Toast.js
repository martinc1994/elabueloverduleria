'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  return null; // Toast notifications are handled via CSS classes
}

// Toast notification helper - to be used imperatively
export function showToast(message) {
  // Remove existing toast
  const existing = document.getElementById('app-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'app-toast';
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-hide
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}
