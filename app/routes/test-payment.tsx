import { useState } from 'react';
import { Link } from 'react-router';
import { Layout } from '../components/Layout';
import { useOrders } from '../contexts/OrdersContext';

export default function TestPayment() {
  const { getAllOrders, getOrderById, updateOrderStatus, addToCart } = useOrders();
  const [testResults, setTestResults] = useState<string[]>([]);

  const log = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setTestResults([]);
    console.clear();
  };

  const testAddProduct = () => {
    log('🛒 Adding test product to cart...');
    const testProduct = {
      id: 'test-product-1',
      name: 'Test Product',
      price: 50000,
      image: '/test-image.jpg',
      description: 'Test product for payment flow',
      category: 'Electronics',
      stock: 10,
      rating: 4.5,
      reviews: 5
    };
    
    addToCart(testProduct, 2);
    log('✅ Product added to cart');
    
    setTimeout(() => {
      const orders = getAllOrders();
      log(`📊 Total orders in context: ${orders.length}`);
      const localStorage_orders = localStorage.getItem('orders');
      if (localStorage_orders) {
        const parsed = JSON.parse(localStorage_orders);
        log(`💾 Total orders in localStorage: ${parsed.length}`);
      }
    }, 500);
  };

  const simulatePaymentSuccess = () => {
    log('💳 Simulating payment success...');
    
    // Get the cart order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const cartOrder = orders.find((o: any) => o.status === 'in cart');
    
    if (cartOrder) {
      log(`📦 Found cart order: ${cartOrder.id}`);
      
      // Simulate the redirect URL parameters
      const mockParams = {
        orderNo: cartOrder.id,
        amount: cartOrder.total.toString(),
        linkCode: 'MOCK123',
        description: 'Test payment'
      };
      
      log(`🔄 Simulating order status update...`);
      updateOrderStatus(cartOrder.id, 'delivered');
      
      setTimeout(() => {
        const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrder = updatedOrders.find((o: any) => o.id === cartOrder.id);
        if (updatedOrder) {
          log(`✅ Order status updated: ${updatedOrder.status}`);
        } else {
          log('❌ Order not found after update');
        }
      }, 1000);
      
      // Redirect to order success page
      setTimeout(() => {
        const url = `/order-success/test?orderNo=${mockParams.orderNo}&amount=${mockParams.amount}&linkCode=${mockParams.linkCode}&description=${encodeURIComponent(mockParams.description)}`;
        log(`🔗 Redirecting to: ${url}`);
        window.location.href = url;
      }, 2000);
      
    } else {
      log('❌ No cart order found');
    }
  };

  const checkLocalStorage = () => {
    log('🔍 Checking localStorage...');
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      log(`📊 Found ${orders.length} orders in localStorage:`);
      orders.forEach((order: any, index: number) => {
        log(`  ${index + 1}. ID: ${order.id}, Status: ${order.status}, Items: ${order.items?.length || 0}`);
      });
    } else {
      log('❌ No orders found in localStorage');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Flow Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={testAddProduct}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                1. Add Test Product to Cart
              </button>
              
              <button
                onClick={simulatePaymentSuccess}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                2. Simulate Payment Success
              </button>
              
              <button
                onClick={checkLocalStorage}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Check localStorage
              </button>
              
              <button
                onClick={clearLogs}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear Logs
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/products"
                  className="block text-blue-600 hover:underline"
                >
                  → Products Page
                </Link>
                <Link
                  to="/cart"
                  className="block text-blue-600 hover:underline"
                >
                  → Cart Page
                </Link>
                <Link
                  to="/orders"
                  className="block text-blue-600 hover:underline"
                >
                  → Orders Page
                </Link>
              </div>
            </div>
          </div>
          
          {/* Test Results */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            <div className="bg-black text-green-400 p-4 rounded text-sm font-mono max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-gray-500">No test results yet...</div>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Current State Display */}
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Orders in Context: {getAllOrders().length}</h3>
              {getAllOrders().map((order, index) => (
                <div key={index} className="bg-white p-2 rounded mb-2">
                  <div>ID: {order.id}</div>
                  <div>Status: <span className={`font-semibold ${order.status === 'delivered' ? 'text-green-600' : order.status === 'in cart' ? 'text-blue-600' : 'text-gray-600'}`}>{order.status}</span></div>
                  <div>Items: {order.items.length}</div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-medium mb-2">localStorage Info</h3>
              <div className="bg-white p-2 rounded">
                {(() => {
                  const stored = localStorage.getItem('orders');
                  if (stored) {
                    const orders = JSON.parse(stored);
                    return `${orders.length} orders stored`;
                  }
                  return 'No orders in localStorage';
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
