
import React, { useState, useEffect } from 'react';
import { getState, api } from '../store';
import { Icons } from '../constants';
import { User, Category } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage }) => {
  const [user, setUser] = useState<User | null>(getState().currentUser);
  const [categories, setCategories] = useState<Category[]>(getState().categories);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const update = () => {
      const s = getState();
      setUser(s.currentUser);
      setCartCount(s.cart.reduce((acc, curr) => acc + curr.quantity, 0));
    };
    update();
    // In a real app we'd use a context/event emitter, here we poll or trigger manually
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('product-list', { query: searchQuery });
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => onNavigate('home')}
                className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                LUMINA
              </button>
              <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => onNavigate('product-list', { categoryId: cat.id })}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
                <button 
                  onClick={() => onNavigate('comparison')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  Compare
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Icons.Search />
                </button>
                {isSearchOpen && (
                  <form onSubmit={handleSearch} className="absolute right-0 top-12 w-64 bg-white p-2 shadow-xl border rounded-lg animate-fade-in">
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                )}
              </div>

              <button 
                onClick={() => onNavigate(user ? 'profile' : 'auth')}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Icons.User />
              </button>

              <button 
                onClick={() => onNavigate('cart')}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
              >
                <Icons.Cart />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {user?.role === 'ADMIN' && (
                <button 
                  onClick={() => onNavigate('admin')}
                  className="hidden md:block ml-2 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded hover:bg-slate-800"
                >
                  ADMIN PANEL
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Shop</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><button onClick={() => onNavigate('home')}>Home</button></li>
                <li><button onClick={() => onNavigate('product-list')}>All Products</button></li>
                <li><button onClick={() => onNavigate('comparison')}>Product Comparison</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Account</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><button onClick={() => onNavigate('profile')}>My Profile</button></li>
                <li><button onClick={() => onNavigate('profile', { tab: 'orders' })}>Orders</button></li>
                <li><button onClick={() => onNavigate('cart')}>My Cart</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><button>Help Center</button></li>
                <li><button>Shipping Policy</button></li>
                <li><button>Returns & Refunds</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Connect</h3>
              <p className="text-sm text-slate-600 mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-slate-100 px-3 py-2 text-sm rounded flex-grow" />
                <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded font-bold">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">&copy; 2024 Lumina E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
