
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { collection, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartContextType extends CartState {
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const cartReducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        items: action.payload,
        total: action.payload.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
      };
    case 'ADD_ITEM':
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems;
      if (existingIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const unsubscribe = onSnapshot(cartRef, (doc) => {
        if (doc.exists()) {
          dispatch({ type: 'SET_CART', payload: doc.data().items || [] });
        }
      });
      return unsubscribe;
    }
  }, [currentUser]);

  const updateCartInFirestore = async (items: CartItem[]) => {
    if (currentUser) {
      await setDoc(doc(db, 'carts', currentUser.uid), { items });
    }
  };

  const addToCart = (product: any) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    const newItems = [...state.items];
    const existingIndex = newItems.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      newItems[existingIndex].quantity += 1;
    } else {
      newItems.push({ ...product, quantity: 1 });
    }
    updateCartInFirestore(newItems);
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    const newItems = state.items.filter(item => item.id !== productId);
    updateCartInFirestore(newItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    const newItems = state.items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    updateCartInFirestore(newItems);
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    updateCartInFirestore([]);
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
