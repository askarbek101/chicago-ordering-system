"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cartService } from '../utils/cartService';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [suggestedItems, setSuggestedItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const cartItems = cartService.getCart();
      setItems(cartItems);
      fetchSuggestedItems(cartItems);
    }
  }, [isOpen]);

  const fetchSuggestedItems = async (currentCartItems: CartItem[]) => {
    try {
      const response = await fetch('/api/food');
      if (response.ok) {
        const allItems = await response.json();
        const cartItemIds = new Set(currentCartItems.map(item => item.id));
        
        const availableItems = allItems.filter((item: any) => !cartItemIds.has(item.id));
        
        const randomItems = availableItems
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((item: any) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            image: item.image
          }));

        setSuggestedItems(randomItems);
      }
    } catch (error) {
      console.error('Error fetching suggested items:', error);
      setSuggestedItems([]);
    }
  };

  const handleCheckout = async () => {
    onClose();
    router.push('/cart');
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleAddSuggested = (item: CartItem) => {
    cartService.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || ''
    });
    const updatedCart = cartService.getCart();
    setItems(updatedCart);
    
    // Remove the added item from suggestions
    setSuggestedItems(prev => prev.filter(suggestedItem => suggestedItem.id !== item.id));
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    
    if (newQuantity <= 0) {
      // Remove item from cart
      cartService.removeFromCart(itemId);
    } else {
      cartService.updateQuantity(itemId, newQuantity);
    }
    
    const updatedCart = cartService.getCart();
    setItems(updatedCart);
  };

  const handleRemoveItem = (itemId: string) => {
    cartService.removeFromCart(itemId);
    const updatedCart = cartService.getCart();
    setItems(updatedCart);
    
    // Fetch new suggestions since an item was removed
    fetchSuggestedItems(updatedCart);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-50 z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed right-4 top-16 w-96 z-50 bg-white rounded-lg shadow-xl">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Your cart is empty</p>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b">
                    {item.image && (
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="text-gray-500 hover:text-red-600 w-6 h-6 flex items-center justify-center border rounded"
                          >
                            -
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="text-gray-500 hover:text-red-600 w-6 h-6 flex items-center justify-center border rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors"
                >
                  Go to Checkout
                </button>
              </div>
            </>
          )}

          {/* Suggested Items */}
          {suggestedItems.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-sm mb-3">You Might Also Like</h3>
              <div className="space-y-3">
                {suggestedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.image && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleAddSuggested(item)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-full hover:bg-red-50"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 