import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Order, Product } from '../types/product';

interface OrdersContextType {
  orders: Order[];
  currentCartOrderId: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItems: () => Order | null;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getAllOrders: () => Order[];
  getOrdersByStatus: (status: Order['status']) => Order[];
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentCartOrderId, setCurrentCartOrderId] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    const savedCartOrderId = localStorage.getItem('current-cart-order-id');
    
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Convert date strings back to Date objects
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        }));
        setOrders(ordersWithDates);
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
    
    if (savedCartOrderId) {
      setCurrentCartOrderId(savedCartOrderId);
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders]);

  // Save current cart order ID to localStorage
  useEffect(() => {
    if (currentCartOrderId) {
      localStorage.setItem('current-cart-order-id', currentCartOrderId);
    } else {
      localStorage.removeItem('current-cart-order-id');
    }
  }, [currentCartOrderId]);

  // Generate unique order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Get or create cart order
  const getOrCreateCartOrder = (): Order => {
    if (currentCartOrderId) {
      const existingCart = orders.find(order => order.id === currentCartOrderId && order.status === 'in cart');
      if (existingCart) {
        return existingCart;
      }
    }

    // Create new cart order
    const newOrderId = generateOrderId();
    const newCartOrder: Order = {
      id: newOrderId,
      items: [],
      total: 0,
      status: 'in cart',
      createdAt: new Date()
    };

    setOrders(prev => [...prev, newCartOrder]);
    setCurrentCartOrderId(newOrderId);
    return newCartOrder;
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const cartOrder = getOrCreateCartOrder();
    
    setOrders(prev => prev.map(order => {
      if (order.id === cartOrder.id) {
        const existingItem = order.items.find(item => item.product.id === product.id);
        
        let newItems;
        if (existingItem) {
          newItems = order.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...order.items, { product, quantity }];
        }
        
        const newTotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        return { ...order, items: newItems, total: newTotal };
      }
      return order;
    }));
  };

  const removeFromCart = (productId: string) => {
    if (!currentCartOrderId) return;

    setOrders(prev => prev.map(order => {
      if (order.id === currentCartOrderId && order.status === 'in cart') {
        const newItems = order.items.filter(item => item.product.id !== productId);
        const newTotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        return { ...order, items: newItems, total: newTotal };
      }
      return order;
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (!currentCartOrderId) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setOrders(prev => prev.map(order => {
      if (order.id === currentCartOrderId && order.status === 'in cart') {
        const newItems = order.items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        );
        const newTotal = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        return { ...order, items: newItems, total: newTotal };
      }
      return order;
    }));
  };

  const clearCart = () => {
    if (!currentCartOrderId) return;

    setOrders(prev => prev.filter(order => order.id !== currentCartOrderId));
    setCurrentCartOrderId(null);
  };

  const getCartItems = (): Order | null => {
    console.log('🛒 getCartItems called, currentCartOrderId:', currentCartOrderId);
    console.log('📋 Available orders:', orders.map(o => ({ id: o.id, status: o.status })));
    
    // Always check for 'in cart' status, regardless of currentCartOrderId
    const cartOrder = orders.find(order => order.status === 'in cart');
    console.log('🔍 Found cart order:', cartOrder ? `${cartOrder.id} with ${cartOrder.items.length} items` : 'None');
    
    // If we found a cart order but currentCartOrderId is null or different, sync it
    if (cartOrder && currentCartOrderId !== cartOrder.id) {
      console.log('🔄 Syncing cart ID:', cartOrder.id);
      setCurrentCartOrderId(cartOrder.id);
    }
    
    // If currentCartOrderId exists but no cart order found, clear it
    if (currentCartOrderId && !cartOrder) {
      console.log('🧹 Clearing stale cart ID');
      setCurrentCartOrderId(null);
    }
    
    return cartOrder || null;
  };

  const getOrderById = (id: string) => {
    console.log("Searching for order:", id);
    console.log("Orders in context:", orders.length);
    
    // First try to find in context
    let order = orders.find(order => order.id === id);
    
    // If not found in context, try localStorage
    if (!order) {
      console.log("Not found in context, checking localStorage...");
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          order = parsedOrders.find((o: any) => o.id === id);
          console.log("Found in localStorage:", !!order);
          
          // If found in localStorage but not in context, sync the context
          if (order) {
            console.log("Syncing context with localStorage...");
            const ordersWithDates = parsedOrders.map((order: any) => ({
              ...order,
              createdAt: new Date(order.createdAt)
            }));
            setOrders(ordersWithDates);
          }
        } catch (error) {
          console.error('Error reading from localStorage:', error);
        }
      }
    }
    
    return order;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    console.log('🔧 updateOrderStatus called:', { orderId, status });
    console.log('🔍 Current cart order ID:', currentCartOrderId);
    
    setOrders(prevOrders => {
      console.log('📋 Previous orders:', prevOrders.length);
      const orderIndex = prevOrders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        console.log('❌ Order not found:', orderId);
        return prevOrders;
      }
      
      const orderToUpdate = prevOrders[orderIndex];
      console.log('✅ Found order:', orderToUpdate.id, 'current status:', orderToUpdate.status);
      
      // Create completely new orders array with updated order
      const updatedOrders = prevOrders.map((order, index) => {
        if (index === orderIndex) {
          return {
            ...order,
            status: status,
            // Force object recreation to trigger React re-render
            id: order.id,
            items: [...order.items],
            total: order.total,
            createdAt: order.createdAt
          };
        }
        return { ...order }; // Also clone other orders to force update
      });
      
      console.log('📊 Updated orders array:', updatedOrders.length);
      console.log('🎯 Updated order status:', updatedOrders[orderIndex].status);
      
      // Force update to trigger localStorage save
      setForceUpdate(prev => prev + 1);
      
      return updatedOrders;
    });
    
    // Clear cart reference AFTER updating orders
    if (status !== 'in cart' && orderId === currentCartOrderId) {
      console.log('🧹 Clearing cart reference for:', orderId);
      console.log('🧹 Before clear - currentCartOrderId:', currentCartOrderId);
      
      // Use setTimeout to ensure this happens after React has processed the order update
      setTimeout(() => {
        setCurrentCartOrderId(null);
        
        // Force another update to trigger re-render of cart components
        setForceUpdate(prev => prev + 1);
        
        // Also directly clear from localStorage
        localStorage.removeItem('current-cart-order-id');
        console.log('🧹 Cart ID removed from localStorage');
        
        const storedCartId = localStorage.getItem('current-cart-order-id');
        console.log('✅ Verification - Cart ID after clear:', storedCartId);
      }, 50);
    }
    
    // Also save directly to localStorage after state update
    setTimeout(() => {
      const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = currentOrders.map((order: any) => {
        if (order.id === orderId) {
          return { ...order, status: status };
        }
        return order;
      });
      
      console.log('🔄 Direct localStorage update...');
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      console.log('💾 Direct save complete');
      
      // Verify save
      const saved = localStorage.getItem('orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        const targetOrder = parsed.find((o: any) => o.id === orderId);
        console.log('✅ Final verification:', targetOrder ? `${targetOrder.id} (${targetOrder.status})` : 'NOT FOUND');
      }
    }, 200);
  };

  const getAllOrders = () => {
    return orders.filter(order => order.status !== 'in cart');
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      currentCartOrderId,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartItems,
      getOrderById,
      updateOrderStatus,
      getAllOrders,
      getOrdersByStatus
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}

// Legacy compatibility - provide cart-like interface
export function useCart() {
  const { getCartItems, addToCart, removeFromCart, updateCartQuantity, clearCart, orders, currentCartOrderId } = useOrders();
  
  const cartOrder = getCartItems();
  
  return {
    cart: {
      items: cartOrder?.items || [],
      total: cartOrder?.total || 0
    },
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    // Add these to force re-render when cart changes
    orders,
    currentCartOrderId
  };
}
