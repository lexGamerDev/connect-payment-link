import { Link, useSearchParams } from 'react-router';
import { Layout } from '../components/Layout';
import { useOrders } from '../contexts/OrdersContext';
import { formatPriceSimple } from '../utils/currency';
import { useEffect, useState, useCallback } from 'react';
import type { Order } from '../types/product';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const { getOrderById, updateOrderStatus, getAllOrders, currentCartOrderId } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);

  // Get parameters from URL
  const linkCode = searchParams.get('linkCode');
  const amount = searchParams.get('amount');
  const description = searchParams.get('description');
  const orderNo = searchParams.get('orderNo');

  // Process order update
  const processOrderUpdate = useCallback(() => {
    console.log("=== ORDER UPDATE PROCESS ===");
    console.log("orderNo:", orderNo, "amount:", amount, "isProcessed:", isProcessed);
    console.log("currentCartOrderId:", currentCartOrderId);
    
    if (!orderNo || !amount || isProcessed) {
      return;
    }
    
    // First try to get from context
    let existingOrder = getOrderById(orderNo);
    console.log("From context:", existingOrder);
    
    // If not found in context, check localStorage directly
    if (!existingOrder) {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        try {
          const orders = JSON.parse(storedOrders);
          existingOrder = orders.find((order: any) => order.id === orderNo);
          console.log("From localStorage:", existingOrder);
        } catch (error) {
          console.error('Error reading from localStorage:', error);
        }
      }
    }
    
    if (existingOrder) {
      if (existingOrder.status === 'in cart') {
        console.log("Updating order status to delivered");
        console.log("Before update - currentCartOrderId:", currentCartOrderId);
        
        // Update the order status to delivered
        updateOrderStatus(orderNo, 'delivered');
        setIsProcessed(true);
        
        // Verify localStorage update after some delay
        setTimeout(() => {
          const storedOrders = localStorage.getItem('orders');
          const storedCartId = localStorage.getItem('current-cart-order-id');
          console.log("After update - stored cart ID:", storedCartId);
          
          if (storedOrders) {
            const orders = JSON.parse(storedOrders);
            const updatedOrder = orders.find((o: any) => o.id === orderNo);
            console.log('🔍 Verification - Order in localStorage after update:', 
              updatedOrder ? `${updatedOrder.id} (${updatedOrder.status})` : 'NOT FOUND');
          }
        }, 1000);
        
        // Create updated order object for immediate UI update
        const updatedOrder: Order = {
          ...existingOrder,
          status: 'delivered',
          shippingAddress: {
            fullName: 'Customer',
            street: 'Payment completed via payment link',
            city: 'Online',
            state: 'Digital',
            zipCode: '00000',
            country: 'Laos',
            phone: '-'
          },
          paymentMethod: 'Payment Link'
        };
        
        setOrder(updatedOrder);
      } else {
        console.log("Order already processed:", existingOrder.status);
        setOrder(existingOrder);
        setIsProcessed(true);
      }
    } else {
      console.log("Order not found, creating fallback");
      // Create fallback order if not found
      const fallbackOrder: Order = {
        id: orderNo,
        items: [],
        total: parseFloat(amount),
        status: 'delivered',
        createdAt: new Date(),
        shippingAddress: {
          fullName: 'Customer',
          street: 'Payment completed via payment link',
          city: 'Online',
          state: 'Digital',
          zipCode: '00000',
          country: 'Laos',
          phone: '-'
        },
        paymentMethod: 'Payment Link'
      };
      
      setOrder(fallbackOrder);
      setIsProcessed(true);
    }
  }, [orderNo, amount, isProcessed, getOrderById, updateOrderStatus, currentCartOrderId]);

  // Initial processing
  useEffect(() => {
    processOrderUpdate();
  }, [processOrderUpdate]);

  // Listen for order changes from context
  useEffect(() => {
    if (orderNo && isProcessed) {
      const currentOrder = getOrderById(orderNo);
      if (currentOrder && currentOrder.status === 'delivered' && order?.status !== 'delivered') {
        setOrder(currentOrder);
      }
    }
  }, [getAllOrders(), orderNo, isProcessed, order?.status, getOrderById]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your order. Your order has been confirmed and delivered.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Order Number
          </h2>
          <p className="text-2xl font-bold text-blue-600">#{orderNo}</p>
          
          {linkCode && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Payment Link Code: {linkCode}</p>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">Amount: {formatPriceSimple(parseFloat(amount || '0'))}</p>
            <p className="text-sm text-gray-600">Description: {description}</p>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold text-green-600">Delivered</span></p>
          </div>
          
          {order && order.items.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Order Summary</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>{formatPriceSimple(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatPriceSimple(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4 text-left bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h3>
          
          <div className="space-y-2 text-gray-600">
            <p>• Your order has been processed and delivered digitally</p>
            <p>• You can view this order in your order history</p>
            <p>• Payment was completed successfully via payment link</p>
            <p>• If you have questions, contact us at 02-123-4567</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            View My Orders
          </Link>
          
          <Link
            to="/products"
            className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
}
