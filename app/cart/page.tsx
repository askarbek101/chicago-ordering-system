"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define types
interface CartItem {
  id: string;
  cart_id: string;
  food_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  food?: MenuItem;
}

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

interface Cart {
  id: string;
  user_email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function CartPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if not signed in
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }

    if (isSignedIn && user) {
      fetchCart();
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Get active cart for user
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const cartResponse = await fetch(`/api/carts?userEmail=${encodeURIComponent(userEmail || '')}`);

      if (!cartResponse.ok) {
        if (cartResponse.status === 404) {
          // No active cart, create one
          const createCartResponse = await fetch("/api/carts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail: user?.primaryEmailAddress?.emailAddress,
            }),
          });

          if (createCartResponse.ok) {
            const newCart = await createCartResponse.json();
            setCart(newCart);
            setCartItems([]);
          } else {
            throw new Error("Failed to create cart");
          }
        } else {
          throw new Error("Failed to fetch cart");
        }
      } else {
        const cartData = await cartResponse.json();
        setCart(cartData);
        
        // Fetch cart items
        const itemsResponse = await fetch(`/api/cart_items?cartId=${cartData.id}`);
        if (itemsResponse.ok) {
          const items = await itemsResponse.json();
          setCartItems(items);
          
          // Fetch menu items to get details for each cart item
          const menuResponse = await fetch("/api/menu");
          if (menuResponse.ok) {
            const menu = await menuResponse.json();
            setMenuItems(menu);
            
            // Enrich cart items with menu item details
            const enrichedItems = items.map((item: CartItem) => {
              const menuItem = menu.find((m: MenuItem) => m.id === item.food_id);
              return { ...item, food: menuItem };
            });
            
            setCartItems(enrichedItems);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await fetch("/api/cart_items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemId,
          quantity: newQuantity,
        }),
      });
      
      if (response.ok) {
        // Update local state
        setCartItems(
          cartItems.map((item) => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update item quantity. Please try again.");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart_items?id=${itemId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Remove item from local state
        setCartItems(cartItems.filter((item) => item.id !== itemId));
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.food?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.0825; // 8.25% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = async () => {
    if (!cart || cartItems.length === 0) return;
    
    router.push("/checkout");
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link 
                href="/menu" 
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Order Items</h2>
                  </div>
                  
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        {item.food?.image && (
                          <div className="w-24 h-24 relative flex-shrink-0">
                            <Image
                              src={item.food.image}
                              alt={item.food.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        )}
                        
                        <div className="flex-grow">
                          <h3 className="font-medium text-lg">{item.food?.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.food?.description}</p>
                          <p className="font-bold text-red-600">${item.food?.price.toFixed(2)}</p>
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
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <div className="mt-4">
                    <Link 
                      href="/menu" 
                      className="text-red-600 hover:text-red-800 text-sm flex justify-center items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
