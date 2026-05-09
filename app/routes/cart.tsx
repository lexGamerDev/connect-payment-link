import { Link } from 'react-router';
import { Layout } from '../components/Layout';
import { CartList } from '../components/CartList';
import { useCart, useOrders } from '../contexts/OrdersContext';
import { formatPriceSimple } from '../utils/currency';
import { useState } from 'react';
import { PaymentCreditCard, PaymentLink, PaymentQR, PhaJayProvider } from 'react-phajay';

export default function Cart() {
  const { cart } = useCart();
  const { currentCartOrderId } = useOrders();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PhaJayProvider config={{ secretKey: "$2a$10$7pBgohWIIovcMxeAr7ItX.W1TkCkSIFZeRIjkTb3ZPvooztM8Kl0S" }}>
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

                  {/* Button Buy Now */}
                  <PaymentCreditCard 
                    amount={cart.total}  // Amount in USD
                    description="Premium Service"
                    onSuccess={(response) => {
                      // Auto redirects to card payment
                      console.log('Payment URL:', response.paymentUrl);
                    }}
                  >
                    Buy with Credit Card
                  </PaymentCreditCard>

                  <PaymentQR
                    amount={cart.total}
                    description="Coffee Payment"
                    bank="LDB"
                    onSuccess={(response) => {
                      console.log('response:', response);
                      console.log('QR Code:', response.qrCode);
                      // Display QR code in your UI
                      
                    }}
                    onPaymentSuccess={(data) => {
                      console.log('Payment completed!', data);
                    }}
                  >
                    Buy with QR Code
                  </PaymentQR>

                  <PaymentLink
                    amount={cart.total}
                    description="Order Payment"
                    onSuccess={(response) => {
                      // Auto redirects to payment page
                      console.log('Redirecting to:', response.redirectURL);
                    }}
                  >
                    Buy with Payment Link
                  </PaymentLink>

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
    </PhaJayProvider>
  );
}
