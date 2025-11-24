import { Link, Outlet } from 'react-router';
import type { ReactNode } from 'react';
import { CartIcon } from './CartIcon';

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                🛍️ ShopCenter
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>
              <Link
                to="/orders"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Orders
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto min-h-screen px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ShopCenter</h3>
              <p className="text-gray-300">
                Online store with quality products and excellent service
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/products" className="hover:text-white">Products</Link></li>
                <li><Link to="/cart" className="hover:text-white">Shopping Cart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">
                Email: support@shopcenter.com<br />
                Tel: 02-123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-300">
            <p>&copy; 2025 ShopCenter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
