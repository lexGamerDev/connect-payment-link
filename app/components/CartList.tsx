import { useCart } from '../contexts/OrdersContext';
import type { CartItem } from '../types/product';
import { formatPriceSimple } from '../utils/currency';

interface CartItemComponentProps {
  item: CartItem;
}

function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateCartQuantity, removeFromCart } = useCart();

  const updateQuantity = (newQuantity: number) => {
    updateCartQuantity(item.product.id, newQuantity);
  };

  const removeItem = () => {
    removeFromCart(item.product.id);
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm border">
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{item.product.name}</h3>
        <p className="text-sm text-gray-600">{item.product.category}</p>
        <p className="text-lg font-semibold text-blue-600">
          {formatPriceSimple(item.product.price)}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        
        <span className="w-12 text-center font-medium text-gray-800">{item.quantity}</span>
        
        <button
          onClick={() => updateQuantity(item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          disabled={item.quantity >= item.product.stock}
        >
          +
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-gray-800">
          {formatPriceSimple(item.product.price * item.quantity)}
        </p>
        <button
          onClick={removeItem}
          className="text-red-500 hover:text-red-700 text-sm mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export function CartList() {
  const { cart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-medium text-gray-600 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500">Add items to your cart to continue</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <CartItemComponent key={item.product.id} item={item} />
        ))}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
          <span>Total:</span>
          <span className="text-blue-600">{formatPriceSimple(cart.total)}</span>
        </div>
      </div>
    </div>
  );
}
