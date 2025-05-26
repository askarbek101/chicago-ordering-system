"use client";

import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cartService } from "../utils/cartService";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any;
  category: string;
  vegetarian: boolean;
  glutenFree: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      const globalCart = cartService.getCart();
      setCartItems(globalCart);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const item = cartItems.find(item => item.id === itemId);
      if (item) {
        cartService.updateQuantity(itemId, newQuantity);
        setCartItems(cartService.getCart());
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update item quantity. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      cartService.removeFromCart(itemId);
      setCartItems(cartService.getCart());
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  const calculateSubtotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    return Number(subtotal.toFixed(2));
  };

  const calculateTax = () => {
    const tax = calculateSubtotal() * 0.0825; // 8.25% tax rate
    return Number(tax.toFixed(2));
  };

  const calculateTotal = () => {
    const total = calculateSubtotal() + calculateTax();
    return Number(total.toFixed(2));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push("/checkout");
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Ваша Корзина</h1>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Ваша Корзина</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error === "Failed to load cart. Please try again." ? "Не удалось загрузить корзину. Пожалуйста, попробуйте снова." :
               error === "Failed to update item quantity. Please try again." ? "Не удалось обновить количество товара. Пожалуйста, попробуйте снова." :
               error === "Failed to remove item. Please try again." ? "Не удалось удалить товар. Пожалуйста, попробуйте снова." : error}
            </div>
          )}
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Ваша корзина пуста</h2>
              <p className="text-gray-600 mb-6">
                Похоже, вы еще не добавили товары в корзину.
              </p>
              <Link 
                href="/menu" 
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors"
              >
                Просмотреть Меню
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Товары в заказе</h2>
                  </div>
                  
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        {item.image && (
                          <div className="w-24 h-24 relative flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 96px) 100vw, 96px"
                              priority
                              className="object-cover rounded-md"
                            />
                          </div>
                        )}
                        
                        <div className="flex-grow">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <p className="font-bold text-red-600">
                          ₸{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center border rounded-full overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
                            Удалить
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Сводка заказа</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Подытог</span>
                      <span>₸{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Налог</span>
                      <span>₸{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                      <span>Итого</span>
                      <span>₸{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Перейти к оформлению
                  </button>
                  
                  <div className="mt-4">
                    <Link 
                      href="/menu" 
                      className="text-red-600 hover:text-red-800 text-sm flex justify-center items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Продолжить покупки
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
