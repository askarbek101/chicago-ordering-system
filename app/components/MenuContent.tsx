'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import type { MenuItem, Category } from "../types/menu";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { cartService } from "../utils/cartService";

interface MenuContentProps {
  foods: MenuItem[];
  categories: Category[];
}

export function MenuContent({ foods, categories }: MenuContentProps) {
  const { isSignedIn } = useUser();
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({});
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize cart quantities
    const currentCart = cartService.getCart();
    const quantities = currentCart.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {} as Record<string, number>);
    setCartItems(quantities);

    // Subscribe to cart changes
    const updateCartQuantities = () => {
      const cart = cartService.getCart();
      const newQuantities = cart.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {} as Record<string, number>);
      setCartItems(newQuantities);
    };

    cartService.addListener(updateCartQuantities);
    return () => cartService.removeListener(updateCartQuantities);
  }, []);

  const categoryOptions = [
    { id: "all", name: "Все" },
    ...categories
  ];

  const handleQuantityChange = (item: MenuItem, delta: number) => {
    if (!isSignedIn) {
      toast.error("Пожалуйста, войдите, чтобы изменить корзину");
      return;
    }

    const currentQuantity = cartItems[item.id] || 0;
    const newQuantity = currentQuantity + delta;

    if (newQuantity < 0) return;

    setIsAddingToCart(prev => ({ ...prev, [item.id]: true }));

    try {
      if (newQuantity === 0) {
        cartService.removeFromCart(item.id);
      } else if (currentQuantity === 0) {
        cartService.addToCart({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.image
        });
      } else {
        cartService.updateQuantity(item.id, newQuantity);
      }
      
      if (delta > 0) {
        toast.success("Обновлены количества в корзине!");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Не удалось обновить корзину");
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const filteredFoods = foods.filter(food => {
    if (selectedCategoryId === "all") return true;
    return food.category_id === selectedCategoryId;
  });

  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categoryOptions.map((category) => (
            <button 
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-4 py-2 rounded-full border border-red-600 
                ${selectedCategoryId === category.id 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-600 hover:bg-red-600 hover:text-white'} 
                transition-colors`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFoods.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
          >
            <div className="relative h-48">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-red-600">
                  ${formatPrice(item.price)}
                </span>
                <div className="flex items-center gap-2">
                  {cartItems[item.id] ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={isAddingToCart[item.id]}
                        className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{cartItems[item.id]}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        disabled={isAddingToCart[item.id]}
                        className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleQuantityChange(item, 1)}
                      disabled={isAddingToCart[item.id]}
                      className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                    >
                      {isAddingToCart[item.id] ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Добавляем...
                        </>
                      ) : (
                        'В Корзину'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 