import type { Route } from "./+types/home";
import { Link } from 'react-router';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data/products';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ShopCenter - Online Store" },
    { name: "description", content: "Shop quality products at great prices" },
  ];
}

export default function Home() {
  // Featured products (first 4 items)
  // const featuredProducts = mockProducts.slice(0, 4);
  const featuredProducts = mockProducts;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to ShopCenter
          </h1>
          <p className="text-xl mb-6">
            Shop quality products at great prices with fast delivery to your doorstep
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Quick delivery to your doorstep</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Secure</h3>
          <p className="text-gray-600">Safe and trusted payment system</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-4xl mb-4">↩️</div>
          <h3 className="text-lg font-semibold mb-2">Returns</h3>
          <p className="text-gray-600">7-day return guarantee if not satisfied</p>
        </div>
      </section>
    </Layout>
  );
}
