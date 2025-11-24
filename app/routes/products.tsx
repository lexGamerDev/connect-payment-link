import { useState } from 'react';
import type { Route } from "./+types/products";
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { mockProducts, categories } from '../data/products';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "สินค้าทั้งหมด - ShopCenter" },
    { name: "description", content: "เลือกซื้อสินค้าคุณภาพดีจากหมวดหมู่ต่างๆ" },
  ];
}

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Found {filteredProducts.length} products
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            No products found
          </h2>
          <p className="text-gray-500">
            Try changing your search or selecting a different category
          </p>
        </div>
      )}
    </Layout>
  );
}
