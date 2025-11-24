import { useCart } from '../contexts/OrdersContext';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const { cart, orders, currentCartOrderId } = useCart();
  const [itemCount, setItemCount] = useState(0);

  // Calculate item count and force re-render when dependencies change
  useEffect(() => {
    const newItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    console.log('🛒 CartIcon update - itemCount:', newItemCount, 'cartOrderId:', currentCartOrderId);
    setItemCount(newItemCount);
  }, [cart.items, orders, currentCartOrderId]);

  return (
    <Link to="/cart" className="relative">
      <div className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 7.52a1 1 0 001 1.48h9.36a1 1 0 001-1.48L15 13M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01"
          />
        </svg>
        <span>Cart</span>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  );
}
