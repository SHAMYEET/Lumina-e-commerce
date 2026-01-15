
import React from 'react';

export const INITIAL_CATEGORIES = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics', image: 'https://picsum.photos/seed/elec/800/600' },
  { id: 'cat2', name: 'Fashion', slug: 'fashion', image: 'https://picsum.photos/seed/fashion/800/600' },
  { id: 'cat3', name: 'Home & Living', slug: 'home-living', image: 'https://picsum.photos/seed/home/800/600' },
];

export const INITIAL_SUBCATEGORIES = [
  { id: 'sub1', categoryId: 'cat1', name: 'Smartphones', slug: 'smartphones', attributes: ['RAM', 'Storage', 'Battery', 'Camera'] },
  { id: 'sub2', categoryId: 'cat1', name: 'Laptops', slug: 'laptops', attributes: ['Processor', 'RAM', 'Storage', 'Screen Size'] },
  { id: 'sub3', categoryId: 'cat2', name: 'Men\'s Wear', slug: 'mens-wear', attributes: ['Material', 'Size', 'Color'] },
];

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    subCategoryId: 'sub1',
    name: 'Lumina X Pro',
    description: 'The ultimate flagship smartphone with breakthrough performance.',
    price: 999,
    discountPrice: 899,
    stock: 25,
    images: ['https://picsum.photos/seed/ph1/800/800', 'https://picsum.photos/seed/ph2/800/800'],
    attributes: [
      { key: 'RAM', value: '12GB' },
      { key: 'Storage', value: '256GB' },
      { key: 'Battery', value: '5000mAh' }
    ],
    rating: 4.8,
    reviewCount: 120,
    isFeatured: true
  },
  {
    id: 'p2',
    subCategoryId: 'sub1',
    name: 'Galaxy Nano',
    description: 'Compact power in your pocket.',
    price: 699,
    stock: 50,
    images: ['https://picsum.photos/seed/ph3/800/800'],
    attributes: [
      { key: 'RAM', value: '8GB' },
      { key: 'Storage', value: '128GB' },
      { key: 'Battery', value: '4200mAh' }
    ],
    rating: 4.5,
    reviewCount: 85,
    isFeatured: true
  },
  {
    id: 'p3',
    subCategoryId: 'sub2',
    name: 'SwiftBook Air',
    description: 'Thinner, lighter, faster than ever before.',
    price: 1299,
    discountPrice: 1199,
    stock: 12,
    images: ['https://picsum.photos/seed/lp1/800/800'],
    attributes: [
      { key: 'Processor', value: 'M2 Ultra' },
      { key: 'RAM', value: '16GB' },
      { key: 'Storage', value: '512GB SSD' }
    ],
    rating: 4.9,
    reviewCount: 45,
    isFeatured: true
  }
];

export const Icons = {
  Cart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  )
};
