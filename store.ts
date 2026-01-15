
import { AppState, User, Category, Subcategory, Product, Order, Review, CartItem, OrderStatus, Address } from './types';
import { INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_PRODUCTS } from './constants';

const STORAGE_KEY = 'lumina_app_data';

const getInitialData = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  return {
    users: [
      { id: 'u1', email: 'admin@lumina.com', name: 'Admin User', role: 'ADMIN', addresses: [], wishlist: [] },
      { id: 'u2', email: 'user@lumina.com', name: 'John Doe', role: 'USER', addresses: [], wishlist: [] }
    ],
    currentUser: null,
    categories: INITIAL_CATEGORIES,
    subcategories: INITIAL_SUBCATEGORIES,
    products: INITIAL_PRODUCTS,
    orders: [],
    reviews: [],
    cart: [],
    comparisonList: []
  };
};

// Global state singleton for logic
let state: AppState = getInitialData();

export const saveState = (newState: AppState) => {
  state = newState;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getState = () => state;

// Simplified API Simulation
export const api = {
  auth: {
    login: async (email: string): Promise<User | null> => {
      const user = state.users.find(u => u.email === email);
      if (user) {
        saveState({ ...state, currentUser: user });
        return user;
      }
      return null;
    },
    logout: async () => {
      saveState({ ...state, currentUser: null, cart: [] });
    },
    updateProfile: async (updated: Partial<User>) => {
      if (!state.currentUser) return;
      const updatedUser = { ...state.currentUser, ...updated };
      const users = state.users.map(u => u.id === updatedUser.id ? updatedUser : u);
      saveState({ ...state, currentUser: updatedUser, users });
    }
  },
  products: {
    getAll: () => state.products,
    getById: (id: string) => state.products.find(p => p.id === id),
    search: (query: string) => state.products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())),
    add: (product: Omit<Product, 'id'>) => {
      const newProduct = { ...product, id: `p${Date.now()}` };
      saveState({ ...state, products: [...state.products, newProduct] });
      return newProduct;
    },
    update: (id: string, updated: Partial<Product>) => {
      const products = state.products.map(p => p.id === id ? { ...p, ...updated } : p);
      saveState({ ...state, products });
    },
    delete: (id: string) => {
      saveState({ ...state, products: state.products.filter(p => p.id !== id) });
    }
  },
  cart: {
    add: (productId: string, quantity: number = 1) => {
      const existing = state.cart.find(c => c.productId === productId);
      let newCart;
      if (existing) {
        newCart = state.cart.map(c => c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c);
      } else {
        newCart = [...state.cart, { productId, quantity }];
      }
      saveState({ ...state, cart: newCart });
    },
    remove: (productId: string) => {
      saveState({ ...state, cart: state.cart.filter(c => c.productId !== productId) });
    },
    updateQuantity: (productId: string, quantity: number) => {
      saveState({ ...state, cart: state.cart.map(c => c.productId === productId ? { ...c, quantity } : c) });
    }
  },
  orders: {
    create: (orderData: Omit<Order, 'id' | 'createdAt'>) => {
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date().toISOString()
      };
      saveState({ ...state, orders: [newOrder, ...state.orders], cart: [] });
      return newOrder;
    },
    updateStatus: (id: string, status: OrderStatus) => {
      const orders = state.orders.map(o => o.id === id ? { ...o, status } : o);
      saveState({ ...state, orders });
    },
    getByUser: (userId: string) => state.orders.filter(o => o.userId === userId)
  },
  comparison: {
    toggle: (id: string) => {
      let list = state.comparisonList;
      if (list.includes(id)) {
        list = list.filter(item => item !== id);
      } else if (list.length < 3) {
        list = [...list, id];
      }
      saveState({ ...state, comparisonList: list });
    },
    clear: () => saveState({ ...state, comparisonList: [] })
  }
};
