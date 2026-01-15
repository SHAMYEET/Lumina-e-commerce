
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
  // Use sessionStorage to persist the current page and parameters across refreshes.
  // This is vital for a smooth experience on GitHub Pages where URL routing is limited.
  const [nav, setNav] = useState(() => {
    try {
      const saved = sessionStorage.getItem('lumina_current_nav');
      return saved ? JSON.parse(saved) : { page: 'home', params: {} };
    } catch {
      return { page: 'home', params: {} };
    }
  });

  const handleNavigate = (page: string, params: any = {}) => {
    const newNav = { page, params };
    setNav(newNav);
    sessionStorage.setItem('lumina_current_nav', JSON.stringify(newNav));
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
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-fade-in">
              <h1 className="text-3xl font-black mb-2 text-center">Welcome Back</h1>
              <p className="text-slate-500 text-center mb-8 text-sm">Select an account to continue</p>
              <div className="space-y-4">
                <button 
                  onClick={() => { api.auth.login('user@lumina.com'); handleNavigate('home'); }}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-3"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">JD</div>
                  Sign in as John Doe (User)
                </button>
                <button 
                  onClick={() => { api.auth.login('admin@lumina.com'); handleNavigate('home'); }}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl transition-all hover:bg-slate-800 flex items-center justify-center gap-3"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs">AD</div>
                  Sign in as Admin
                </button>
              </div>
              <div className="mt-10 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[10px] leading-relaxed text-amber-700 font-medium text-center">
                  <strong>STATIC DEPLOYMENT NOTE:</strong> This application uses a simulated backend. Your data is stored locally in this browser and will persist between visits.
                </p>
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
