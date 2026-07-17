'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'elabuelo_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT_CART':
      return { ...state, items: action.payload, initialized: true };

    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return { ...state, items: newItems, lastAdded: action.payload.id };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((i) => i.id !== action.payload);
      return { ...state, items: newItems };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], lastAdded: null };

    case 'CLEAR_LAST_ADDED':
      return { ...state, lastAdded: null };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    initialized: false,
    lastAdded: null,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'INIT_CART', payload: parsed });
      } else {
        dispatch({ type: 'INIT_CART', payload: [] });
      }
    } catch {
      dispatch({ type: 'INIT_CART', payload: [] });
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (state.initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    }
  }, [state.items, state.initialized]);

  // Clear lastAdded after animation
  useEffect(() => {
    if (state.lastAdded) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_LAST_ADDED' });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [state.lastAdded]);

  const addItem = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = state.items.reduce(
    (sum, i) => sum + (i.precio || 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        lastAdded: state.lastAdded,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
