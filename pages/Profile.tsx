
import React, { useState } from 'react';
import { getState, api } from '../store';
import { OrderStatus } from '../types';

interface ProfileProps {
  onNavigate: (page: string, params?: any) => void;
  activeTab?: string;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate, activeTab = 'profile' }) => {
  const state = getState();
  const user = state.currentUser;
  const orders = api.orders.getByUser(user?.id || 'guest');
  const [tab, setTab] = useState(activeTab);

  if (!user && tab !== 'orders') {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-black mb-8">Please log in to see your profile</h1>
        <button onClick={() => onNavigate('auth')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold">Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <button 
            onClick={() => setTab('profile')}
            className={`w-full text-left px-6 py-4 rounded-xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            Personal Info
          </button>
          <button 
            onClick={() => setTab('orders')}
            className={`w-full text-left px-6 py-4 rounded-xl font-bold transition-all ${tab === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            Order History
          </button>
          <button 
            onClick={() => setTab('wishlist')}
            className={`w-full text-left px-6 py-4 rounded-xl font-bold transition-all ${tab === 'wishlist' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            My Wishlist
          </button>
          <hr className="my-4"/>
          <button 
            onClick={() => { api.auth.logout(); onNavigate('home'); }}
            className="w-full text-left px-6 py-4 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-8">
          {tab === 'profile' && user && (
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
              <h2 className="text-2xl font-black mb-8">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <p className="text-lg font-bold text-slate-900 border-b pb-2">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                  <p className="text-lg font-bold text-slate-900 border-b pb-2">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Account Role</label>
                  <p className="text-sm font-bold bg-slate-100 w-fit px-3 py-1 rounded text-slate-600">{user.role}</p>
                </div>
              </div>
              <button className="mt-12 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Edit Profile</button>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-black">My Orders</h2>
              {orders.length === 0 ? (
                <p className="text-slate-500 italic">No orders found.</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Order ID</p>
                        <p className="font-black text-slate-900">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Date</p>
                        <p className="text-sm font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                        <p className="font-black text-blue-600">${order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-600">{item.quantity}x {item.name}</span>
                          <span className="font-bold text-slate-900">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="animate-fade-in text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed">
              <p className="text-slate-400 font-medium">Your wishlist is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
