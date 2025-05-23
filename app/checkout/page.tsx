"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Link from "next/link";

// Define types
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type PaymentMethod = "credit_card" | "paypal" | "cash_on_delivery";

export default function CheckoutPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  // State for cart items, delivery address, payment method, and order processing
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Fetch cart items from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        
        // Calculate total price
        const total = parsedCart.reduce(
          (sum: number, item: CartItem) => sum + item.price * item.quantity,
          0
        );
        setTotalPrice(total);
      }
    }
    
    // Redirect if not logged in
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.emailAddresses[0].emailAddress) {
      setError("User email is required");
      return;
    }
    
    if (!deliveryAddress) {
      setError("Delivery address is required");
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      // 1. Create or get active cart
      const cartResponse = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0].emailAddress,
        }),
      });
      
      if (!cartResponse.ok) {
        throw new Error("Failed to create cart");
      }
      
      const cartData = await cartResponse.json();
      
      // 2. Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0].emailAddress,
          deliveryAddress,
          paymentMethod,
          cartId: cartData.id,
          status: "pending",
          totalPrice,
        }),
      });
      
      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }
      
      const orderData = await orderResponse.json();
      setOrderId(orderData.id);
      
      // 3. Process payment
      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderData.id,
          amount: totalPrice,
          paymentMethod,
        }),
      });
      
      if (!paymentResponse.ok) {
        throw new Error("Payment processing failed");
      }
      
      // 4. Update order status to paid
      const updateOrderResponse = await fetch(`/api/orders/${orderData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "paid",
        }),
      });
      
      if (!updateOrderResponse.ok) {
        throw new Error("Failed to update order status");
      }
      
      // Clear cart from localStorage
      localStorage.removeItem("cart");
      
      // Show success message
      setOrderComplete(true);
      
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format card expiry date (MM/YY)
  const formatCardExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  if (orderComplete) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your order. Your order number is <span className="font-bold">{orderId}</span>.
              </p>
              <p className="text-gray-600 mb-8">
                We've sent a confirmation email to your inbox with all the details.
              </p>
              <div className="flex justify-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
                >
                  View My Orders
                </Link>
                <Link 
                  href="/menu" 
                  className="px-6 py-3 bg-transparent border-2 border-red-600 text-red-600 font-bold rounded-full hover:bg-red-50 transition-colors"
                >
                  Back to Menu
                </Link>
              </div>
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
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Order Summary */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                {cartItems.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty</p>
                ) : (
                  <>
                    <div className="divide-y">
                      {cartItems.map((item) => (
                        <div key={item.id} className="py-4 flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between mb-2">
                        <p>Subtotal</p>
                        <p>${totalPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p>Delivery Fee</p>
                        <p>$3.99</p>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-4">
                        <p>Total</p>
                        <p>${(totalPrice + 3.99).toFixed(2)}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Payment Form */}
            <div className="md:w-1/2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
                
                <div className="mb-6">
                  <label htmlFor="address" className="block text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    id="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  />
                </div>
                
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <input
                      type="radio"
                      id="credit_card"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={() => setPaymentMethod("credit_card")}
                      className="mr-2"
                    />
                    <label htmlFor="credit_card" className="flex items-center">
                      <span className="mr-2">Credit Card</span>
                      <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <path d="M22 10H2"></path>
                      </svg>
                    </label>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="mr-2"
                    />
                    <label htmlFor="paypal" className="flex items-center">
                      <span className="mr-2">PayPal</span>
                      <svg className="h-6 w-6 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .632-.546h6.013c2.068 0 3.722.559 4.911 1.663 1.118 1.04 1.678 2.368 1.676 3.951-.008 5.8-4.57 8.676-9.099 8.676h-.467c-.35 0-.65.245-.724.587l-.859 3.832a.64.64 0 0 1-.631.454zm8.277-16.484c-.82-.777-2.004-1.172-3.513-1.172H6.169L3.447 20.18h4.59l.859-3.832a1.17 1.17 0 0 1 1.142-.921h.467c3.747 0 7.514-2.344 7.522-7.607.004-1.193-.39-2.181-1.147-2.967h-.527z"></path>
                      </svg>
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cash_on_delivery"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={() => setPaymentMethod("cash_on_delivery")}
                      className="mr-2"
                    />
                    <label htmlFor="cash_on_delivery" className="flex items-center">
                      <span className="mr-2">Cash on Delivery</span>
                      <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3-7h5.5a.5.5 0 0 0 0-1H9a.5.5 0 0 0 0 1zm0 2h3.5a.5.5 0 0 0 0-1H9a.5.5 0 0 0 0 1z"></path>
                      </svg>
                    </label>
                  </div>
                </div>
                
                {paymentMethod === "credit_card" && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        required={paymentMethod === "credit_card"}
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label htmlFor="cardExpiry" className="block text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                          maxLength={5}
                          required={paymentMethod === "credit_card"}
                        />
                      </div>
                      
                      <div className="w-1/2">
                        <label htmlFor="cardCvc" className="block text-gray-700 mb-2">CVC</label>
                        <input
                          type="text"
                          id="cardCvc"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                          maxLength={3}
                          required={paymentMethod === "credit_card"}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-400"
                  disabled={isProcessing || cartItems.length === 0}
                >
                  {isProcessing ? "Processing..." : `Pay $${(totalPrice + 3.99).toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
