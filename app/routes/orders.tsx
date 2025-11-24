import { Layout } from '../components/Layout';
import { useOrders } from '../contexts/OrdersContext';
import { formatPriceSimple } from '../utils/currency';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  'in cart': 'bg-gray-100 text-gray-800'
};

const statusText = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  'in cart': 'In Cart'
};

export default function Orders() {
  const { getAllOrders, updateOrderStatus } = useOrders();
  
  // Only show completed orders (not 'in cart')
  const orders = getAllOrders();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US');
  };

  const handleViewDetails = (orderId: string) => {
    alert(`View details for order #${orderId}`);
  };

  const handleTrackOrder = (orderId: string) => {
    alert(`Track order #${orderId}`);
  };

  const handleReorder = (orderId: string) => {
    alert(`Reorder #${orderId}`);
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to cancel order #${orderId}?`)) {
      updateOrderStatus(orderId, 'cancelled');
      alert(`Order #${orderId} has been cancelled`);
    }
  };

  const handleStartShopping = () => {
    window.location.href = '/products';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
        
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {statusText[order.status as keyof typeof statusText]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Ordered on {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-gray-800">
                        <div>
                          <span className="font-medium text-gray-800">{item.product.name}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium text-gray-800">{formatPriceSimple(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatPriceSimple(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Order Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => handleViewDetails(order.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                    
                    {order.status === 'shipped' && (
                      <button 
                        onClick={() => handleTrackOrder(order.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Track Package
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <button 
                        onClick={() => handleReorder(order.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Reorder
                      </button>
                    )}
                    
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-xl font-medium text-gray-600 mb-2">
              You have no orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              When you place an order, it will appear here
            </p>
            <button
              onClick={handleStartShopping}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
