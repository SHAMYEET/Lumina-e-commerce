
import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { getState, api } from '../store';

interface ProductDetailProps {
  id: string;
  onNavigate: (page: string, params?: any) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ id, onNavigate }) => {
  const [product, setProduct] = useState<Product | undefined>(getState().products.find(p => p.id === id));
  const [activeImage, setActiveImage] = useState(product?.images[0] || '');
  const [quantity, setQuantity] = useState(1);
  const subcategory = getState().subcategories.find(s => s.id === product?.subCategoryId);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  const handleAddToCart = () => {
    api.cart.add(product.id, quantity);
    alert('Added to cart!');
  };

  const isComparing = getState().comparisonList.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border">
            <img src={activeImage} className="w-full h-full object-cover" alt={product.name} />
          </div>
          <div className="flex gap-4 no-scrollbar overflow-x-auto">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`${product.name} thumbnail ${i}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div>
            <nav className="text-sm text-slate-500 mb-4">
              <button onClick={() => onNavigate('home')}>Home</button> / {subcategory?.name}
            </nav>
            <h1 className="text-4xl font-black text-slate-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'}>★</span>
                ))}
              </div>
              <span className="text-sm text-slate-500 font-medium">({product.reviewCount} Reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-black text-blue-600">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xl text-slate-400 line-through">
                ${product.price}
              </span>
            )}
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900">Key Features</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.attributes.map((attr, i) => (
                <div key={i} className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">{attr.key}</span>
                  <span className="text-sm font-bold text-slate-900">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-xl px-2">-</button>
              <input type="number" readOnly className="w-12 text-center font-bold bg-transparent" value={quantity} />
              <button onClick={() => setQuantity(q => q + 1)} className="text-xl px-2">+</button>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-grow bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => api.comparison.toggle(product.id)}
              className={`p-4 border rounded-xl transition-all ${isComparing ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Related Products placeholder */}
      <section className="mt-24">
        <h2 className="text-2xl font-bold mb-8">You might also like</h2>
        <div className="grid grid-cols-4 gap-6 opacity-60 grayscale pointer-events-none">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </section>
    </div>
  );
};
