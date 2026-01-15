
import React from 'react';
import { getState, api } from '../store';
import { Product } from '../types';

interface ComparisonProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Comparison: React.FC<ComparisonProps> = ({ onNavigate }) => {
  const { comparisonList, products, subcategories } = getState();
  const comparingProducts = products.filter(p => comparisonList.includes(p.id));

  // Determine all unique attribute keys among comparing products
  const allAttributes = Array.from(new Set(comparingProducts.flatMap(p => p.attributes.map(a => a.key))));

  if (comparingProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-black mb-4">No Products Selected</h1>
        <p className="text-slate-500 mb-8">Select up to 3 products to compare their features side-by-side.</p>
        <button 
          onClick={() => onNavigate('product-list')}
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-12">
        <h1 className="text-4xl font-black">Compare Products</h1>
        <button 
          onClick={() => api.comparison.clear()}
          className="text-red-500 text-sm font-bold hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-8 w-1/4 bg-slate-50 font-bold text-slate-500 uppercase tracking-widest text-xs">Features</th>
              {comparingProducts.map(p => (
                <th key={p.id} className="p-8 w-1/4 align-top">
                  <div className="relative group">
                    <button 
                      onClick={() => api.comparison.toggle(p.id)}
                      className="absolute -top-4 -right-4 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xs"
                    >
                      &times;
                    </button>
                    <img src={p.images[0]} className="w-full h-40 object-cover rounded-xl mb-4" alt={p.name} />
                    <h3 className="font-bold text-lg leading-tight mb-2 truncate">{p.name}</h3>
                    <p className="text-blue-600 font-black text-xl mb-4">${p.discountPrice || p.price}</p>
                    <button 
                      onClick={() => api.cart.add(p.id, 1)}
                      className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-bold"
                    >
                      Add to Cart
                    </button>
                  </div>
                </th>
              ))}
              {/* Fill placeholders if less than 3 */}
              {[...Array(Math.max(0, 3 - comparingProducts.length))].map((_, i) => (
                <th key={i} className="p-8 w-1/4 opacity-30">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl h-40 flex items-center justify-center text-slate-400">
                    Add Product
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-6 font-bold text-slate-700 bg-slate-50">Rating</td>
              {comparingProducts.map(p => (
                <td key={p.id} className="p-6">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span className="font-bold text-slate-900">{p.rating}</span>
                    <span>★</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-6 font-bold text-slate-700 bg-slate-50">Stock</td>
              {comparingProducts.map(p => (
                <td key={p.id} className="p-6">
                  <span className={`text-sm font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {p.stock > 0 ? `${p.stock} Available` : 'Out of Stock'}
                  </span>
                </td>
              ))}
            </tr>
            {allAttributes.map(attr => (
              <tr key={attr} className="border-b">
                <td className="p-6 font-bold text-slate-700 bg-slate-50">{attr}</td>
                {comparingProducts.map(p => {
                  const val = p.attributes.find(a => a.key === attr)?.value || '-';
                  return <td key={p.id} className="p-6 text-slate-600">{val}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
