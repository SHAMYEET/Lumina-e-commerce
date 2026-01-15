
import React, { useState } from 'react';
import { getState, api } from '../store';
import { OrderStatus, Address } from '../types';

interface CheckoutProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const state = getState();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    id: 'temp',
    fullName: 'Jane Doe',
    label: 'Home',
    street: '123 Pixel Blvd',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    isDefault: true
  });
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'COD'>('CARD');

  const cartItems = state.cart.map(item => {
    const p = state.products.find(prod => prod.id === item.productId)!;
    return {
      ...item,
      name: p.name,
      price: p.discountPrice || p.price
    };
  });

  const total = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  const handlePlaceOrder = () => {
    const order = api.orders.create({
      userId: state.currentUser?.id || 'guest',
      items: cartItems,
      totalAmount: total,
      status: OrderStatus.PLACED,
      shippingAddress: address,
      paymentMethod
    });
    onNavigate('profile', { orderId: order.id, tab: 'orders' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex gap-4 mb-12">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-grow flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {s}
            </div>
            <span className={`text-sm font-bold ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
              {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
            </span>
            {s < 3 && <div className="flex-grow h-[2px] bg-slate-200 ml-2"></div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold">Shipping Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="col-span-2 p-3 border rounded-xl" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
                <input type="text" placeholder="Street Address" className="col-span-2 p-3 border rounded-xl" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                <input type="text" placeholder="City" className="p-3 border rounded-xl" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                <input type="text" placeholder="State" className="p-3 border rounded-xl" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                <input type="text" placeholder="ZIP Code" className="p-3 border rounded-xl" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} />
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl">Next: Payment</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold">Payment Method</h2>
              <div className="space-y-3">
                {['CARD', 'UPI', 'COD'].map((m) => (
                  <label key={m} className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === m ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" checked={paymentMethod === m} onChange={() => setPaymentMethod(m as any)} className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-800">{m === 'CARD' ? 'Credit/Debit Card' : m === 'UPI' ? 'Digital Wallet (UPI)' : 'Cash on Delivery'}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-grow bg-slate-100 font-bold py-4 rounded-xl">Back</button>
                <button onClick={() => setStep(3)} className="flex-grow bg-slate-900 text-white font-bold py-4 rounded-xl">Next: Review</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold">Review Order</h2>
              <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Shipping to:</h3>
                    <p className="font-medium text-slate-900">{address.fullName}<br/>{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Payment:</h3>
                    <p className="font-medium text-slate-900">{paymentMethod}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-grow bg-slate-100 font-bold py-4 rounded-xl">Back</button>
                <button onClick={handlePlaceOrder} className="flex-grow bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">Place Order</button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.quantity}x {item.name}</span>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between font-black">
              <span>Total</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
