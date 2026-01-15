
import React, { useState, useMemo } from 'react';
import { getState, api } from '../store';
import { Product } from '../types';

interface ProductListingProps {
  categoryId?: string;
  query?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ProductListing: React.FC<ProductListingProps> = ({ categoryId, query, onNavigate }) => {
  const { products, subcategories, categories } = getState();
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categoryId) {
      const subs = subcategories.filter(s => s.categoryId === categoryId).map(s => s.id);
      list = list.filter(p => subs.includes(p.subCategoryId));
    }
    if (query) {
      list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    list = list.filter(p => p.price <= priceRange);
    
    return list.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return b.rating - a.rating;
    });
  }, [categoryId, query, priceRange, sort, products, subcategories]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Price Range</h3>
            <input 
              type="range" 
              min="0" max="2000" step="10"
              className="w-full accent-blue-600"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <div className="flex justify-between mt-2 text-sm font-bold text-slate-600">
              <span>$0</span>
              <span>${priceRange}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Sort By</h3>
            <select 
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none font-medium"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Categories</h3>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('product-list')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!categoryId ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => onNavigate('product-list', { categoryId: cat.id })}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${categoryId === cat.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black">
              {categoryId ? categories.find(c => c.id === categoryId)?.name : query ? `Search: "${query}"` : 'All Products'}
            </h1>
            <p className="text-slate-500 font-medium">{filteredProducts.length} items found</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">No products match your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 animate-fade-in"
                >
                  <div 
                    className="relative h-64 overflow-hidden cursor-pointer"
                    onClick={() => onNavigate('product-detail', { id: product.id })}
                  >
                    <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
                  </div>
                  <div className="p-6">
                    <h3 
                      className="font-bold text-lg mb-2 truncate cursor-pointer hover:text-blue-600"
                      onClick={() => onNavigate('product-detail', { id: product.id })}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-black text-slate-900">${product.discountPrice || product.price}</span>
                      {product.discountPrice && <span className="text-sm text-slate-400 line-through">${product.price}</span>}
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-yellow-500 font-bold">★ {product.rating}</span>
                      <span className="text-slate-400 text-xs">({product.reviewCount})</span>
                    </div>
                    <button 
                      onClick={() => api.cart.add(product.id, 1)}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
