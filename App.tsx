
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Profile } from './pages/Profile';
import { AdminPanel } from './pages/AdminPanel';
import { Comparison } from './pages/Comparison';
import { api, getState } from './store';

const App: React.FC = () => {
  const [nav, setNav] = useState({ page: 'home', params: {} as any });

  const handleNavigate = (page: string, params: any = {}) => {
    setNav({ page, params });
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (nav.page) {
      case 'home': return <Home onNavigate={handleNavigate} />;
      case 'product-list': return <ProductListing {...nav.params} onNavigate={handleNavigate} />;
      case 'product-detail': return <ProductDetail id={nav.params.id} onNavigate={handleNavigate} />;
      case 'cart': return <Cart onNavigate={handleNavigate} />;
      case 'checkout': return <Checkout onNavigate={handleNavigate} />;
      case 'profile': return <Profile onNavigate={handleNavigate} activeTab={nav.params.tab} />;
      case 'comparison': return <Comparison onNavigate={handleNavigate} />;
      case 'admin': return <AdminPanel />;
      case 'auth': 
        return (
          <div className="max-w-md mx-auto py-20 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <h1 className="text-3xl font-black mb-6 text-center">Welcome Back</h1>
              <div className="space-y-4">
                <button 
                  onClick={() => { api.auth.login('user@lumina.com'); handleNavigate('home'); }}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl transition-all"
                >
                  Sign in as Guest User
                </button>
                <button 
                  onClick={() => { api.auth.login('admin@lumina.com'); handleNavigate('home'); }}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl transition-all"
                >
                  Sign in as Admin
                </button>
              </div>
            </div>
          </div>
        );
      default: return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout onNavigate={handleNavigate} currentPage={nav.page}>
      {renderPage()}
    </Layout>
  );
};

export default App;
