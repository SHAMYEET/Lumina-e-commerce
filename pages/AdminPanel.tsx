
import React, { useState } from 'react';
import { getState, api } from '../store';
import { Product, OrderStatus } from '../types';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const state = getState();
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const revenue = state.orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your catalog, orders, and business metrics.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Revenue</p>
            <p className="text-2xl font-black">${revenue.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Orders</p>
            <p className="text-2xl font-black">{state.orders.length}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        {['products', 'orders', 'categories'].map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === t ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'products' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Product Catalog</h2>
              <button 
                onClick={() => setEditingProduct({ name: '', price: 0, stock: 0, images: ['https://picsum.photos/800'], attributes: [] })}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
              >
                + Add Product
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Product</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Price</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Stock</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.products.map(p => (
                    <tr key={p.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-bold text-slate-900">{p.name}</span>
                      </td>
                      <td className="p-4 font-bold text-blue-600">${p.price}</td>
                      <td className="p-4 text-slate-600 font-medium">{p.stock}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock > 0 ? 'Active' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => setEditingProduct(p)} className="text-blue-600 font-bold text-sm">Edit</button>
                        <button onClick={() => api.products.delete(p.id)} className="text-red-500 font-bold text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-8">Recent Orders</h2>
            <div className="space-y-4">
              {state.orders.map(o => (
                <div key={o.id} className="flex flex-wrap items-center justify-between p-6 bg-slate-50 rounded-2xl gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {o.id}</p>
                    <p className="font-bold text-slate-900">{o.shippingAddress.fullName}</p>
                  </div>
                  <div className="flex-grow flex justify-center">
                    <div className="flex gap-2">
                      {Object.values(OrderStatus).map(status => (
                        <button 
                          key={status}
                          onClick={() => api.orders.updateStatus(o.id, status as any)}
                          className={`text-[8px] font-bold px-2 py-1 rounded transition-all ${o.status === status ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="font-black text-blue-600 text-lg">${o.totalAmount}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal Simulation */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 space-y-6 shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full p-3 border rounded-xl" 
                value={editingProduct.name}
                onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Price" 
                  className="w-full p-3 border rounded-xl" 
                  value={editingProduct.price}
                  onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                />
                <input 
                  type="number" 
                  placeholder="Stock" 
                  className="w-full p-3 border rounded-xl" 
                  value={editingProduct.stock}
                  onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setEditingProduct(null)}
                className="flex-grow bg-slate-100 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (editingProduct.id) api.products.update(editingProduct.id, editingProduct);
                  else api.products.add(editingProduct as any);
                  setEditingProduct(null);
                }}
                className="flex-grow bg-blue-600 text-white py-3 rounded-xl font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
