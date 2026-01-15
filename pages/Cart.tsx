
import React from 'react';
import { getState, api } from '../store';

interface CartProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { cart, products } = getState();

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)!
  })).filter(item => !!item.product);

  const subtotal = cartItems.reduce((acc, curr) => {
    const price = curr.product.discountPrice || curr.product.price;
    return acc + (price * curr.quantity);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
           <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h1 className="text-3xl font-black mb-4">Your Cart is Empty</h1>
        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => onNavigate('product-list')}
          className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-12">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <div key={item.productId} className="flex gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
              <img 
                src={item.product.images[0]} 
                className="w-32 h-32 object-cover rounded-xl border" 
                alt={item.product.name} 
              />
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-900">{item.product.name}</h3>
                  <button onClick={() => api.cart.remove(item.productId)} className="text-slate-400 hover:text-red-500">
                    Remove
                  </button>
                </div>
                <p className="text-blue-600 font-black mb-4">${item.product.discountPrice || item.product.price}</p>
                <div className="flex items-center border border-slate-200 rounded-lg w-fit">
                  <button onClick={() => api.cart.updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="px-3 py-1">-</button>
                  <span className="px-4 font-bold">{item.quantity}</span>
                  <button onClick={() => api.cart.updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit space-y-6">
          <h2 className="text-2xl font-bold">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-green-600 font-bold text-sm">FREE</span>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <span className="font-black text-xl text-slate-900">Total</span>
              <span className="font-black text-2xl text-blue-600">${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition-all"
          >
            Proceed to Checkout
          </button>
          <button 
            onClick={() => onNavigate('product-list')}
            className="w-full text-slate-500 font-bold hover:text-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
