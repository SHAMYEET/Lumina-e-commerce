
import React from 'react';
import { Category, Product } from '../types';
import { getState, api } from '../store';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const state = getState();
  const featured = state.products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-slate-900">
        <img 
          src="https://picsum.photos/seed/hero/1920/1080" 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
          alt="Hero" 
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight max-w-2xl">
            Elegance in Every <span className="text-blue-400">Interaction.</span>
          </h1>
          <p className="text-xl text-slate-200 mb-10 max-w-xl">
            Experience premium curated products with seamless design and unparalleled performance.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('product-list')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Shop Collection
            </button>
            <button 
              onClick={() => onNavigate('comparison')}
              className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Compare Products
            </button>
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {state.categories.map(cat => (
            <div 
              key={cat.id}
              onClick={() => onNavigate('product-list', { categoryId: cat.id })}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
            >
              <img 
                src={cat.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={cat.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                <span className="text-white/80 text-sm font-medium">Explore Collection &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-slate-500">Selected for excellence and innovation.</p>
          </div>
          <button 
            onClick={() => onNavigate('product-list')}
            className="text-blue-600 font-bold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map(product => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
            >
              <div 
                className="relative h-64 overflow-hidden cursor-pointer"
                onClick={() => onNavigate('product-detail', { id: product.id })}
              >
                <img 
                  src={product.images[0]} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={product.name} 
                />
                {product.discountPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">
                  {state.subcategories.find(s => s.id === product.subCategoryId)?.name}
                </p>
                <h3 
                  className="font-bold text-lg mb-2 truncate cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onNavigate('product-detail', { id: product.id })}
                >
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-black text-slate-900">
                    ${product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${product.price}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => api.cart.add(product.id, 1)}
                  className="w-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-900 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-blue-600 py-20 text-center text-white px-4 rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <h2 className="text-4xl font-black mb-6">Stay Ahead of the Curve</h2>
        <p className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
          Join our premium community to receive exclusive early access, personalized recommendations, and curated industry news.
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-grow bg-white/10 border border-white/20 text-white placeholder-white/50 px-6 py-4 rounded-full outline-none focus:ring-2 focus:ring-white" 
          />
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};
