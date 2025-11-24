import { Link } from 'react-router';
import { Layout } from '../components/Layout';
import { CartList } from '../components/CartList';
import { useCart, useOrders } from '../contexts/OrdersContext';
import { formatPriceSimple } from '../utils/currency';
import { useState } from 'react';
import axios from 'axios';
import { Buffer } from "buffer";

// Configuration for payment API
const BASE_URL = "https://payment-gateway.phajay.co"; // Replace with your actual API URL
const KEY = "$2a$10$7pBgohWIIovcMxeAr7ItX.W1TkCkSIFZeRIjkTb3ZPvooztM8Kl0S"; // Replace with your actual API key

export default function Cart() {
  const { cart } = useCart();
  const { currentCartOrderId } = useOrders();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!currentCartOrderId) {
      alert('No items in cart');
      return;
    }

  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <CartList />
          </div>
          
          {/* Order Summary */}
          {cart.items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-800">
                    <span>Subtotal:</span>
                    <span>{formatPriceSimple(cart.total)}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        {formatPriceSimple(cart.total)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleBuyNow}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors text-center block disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Buy Now'}
                </button>
                
                <Link
                  to="/products"
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {cart.items.length === 0 && (
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
