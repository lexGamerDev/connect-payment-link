import type { Product } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest from Apple with A17 Pro chip and new camera system',
    price: 1,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
    category: 'Mobile Phones',
    stock: 15,
    rating: 4.8,
    reviews: 342
  },
  {
    id: '2',
    name: 'MacBook Pro 14"',
    description: 'Professional laptop with M3 Pro chip for creative professionals',
    price: 10,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
    category: 'Computers',
    stock: 8,
    rating: 4.9,
    reviews: 156
  },
  {
    id: '3',
    name: 'iPad Air',
    description: 'Powerful tablet for creative work and entertainment',
    price: 12,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    category: 'Tablets',
    stock: 12,
    rating: 4.7,
    reviews: 289
  },
  {
    id: '4',
    name: 'AirPods Pro 2',
    description: 'Wireless earbuds with advanced noise cancellation technology',
    price: 2,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop',
    category: 'Headphones',
    stock: 25,
    rating: 4.6,
    reviews: 478
  },
  {
    id: '5',
    name: 'Apple Watch Series 9',
    description: 'Smart watch that helps take care of your health',
    price: 12,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop',
    category: 'Watches',
    stock: 18,
    rating: 4.5,
    reviews: 367
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24',
    description: 'Flagship smartphone with cutting-edge AI technology',
    price: 22,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
    category: 'Mobile Phones',
    stock: 20,
    rating: 4.4,
    reviews: 234
  },
  {
    id: '7',
    name: 'Sony WH-1000XM5',
    description: 'Premium wireless headphones with industry-leading noise cancellation',
    price: 10,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop',
    category: 'Headphones',
    stock: 14,
    rating: 4.7,
    reviews: 198
  },
  {
    id: '8',
    name: 'Nintendo Switch OLED',
    description: 'Portable gaming console with vibrant OLED display',
    price: 21,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop',
    category: 'Gaming',
    stock: 22,
    rating: 4.6,
    reviews: 445
  }
];

export const categories = [
  'All',
  'Mobile Phones',
  'Computers',
  'Tablets',
  'Headphones',
  'Watches',
  'Gaming'
];
