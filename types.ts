
export type Role = 'USER' | 'ADMIN';

export enum OrderStatus {
  PLACED = 'PLACED',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  addresses: Address[];
  wishlist: string[]; // Product IDs
}

export interface Address {
  id: string;
  label: string; // Home, Office
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  attributes: string[]; // List of dynamic attribute keys allowed for this subcategory
}

export interface ProductAttribute {
  key: string;
  value: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Product {
  id: string;
  subCategoryId: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  attributes: ProductAttribute[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: (CartItem & { price: number; name: string })[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: 'CARD' | 'UPI' | 'COD';
  createdAt: string;
}

export interface AppState {
  users: User[];
  currentUser: User | null;
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  cart: CartItem[];
  comparisonList: string[]; // Product IDs
}
