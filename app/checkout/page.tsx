"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Link from "next/link";

// Определение типов
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type PaymentMethod = "credit_card" | "cash_on_delivery";

// Добавление новых типов для валидации формы
type PaymentFormData = {
  cardNumber: string; // номер карты
  cardExpiry: string; // срок действия карты
  cardCvc: string; // CVC-код
  deliveryAddress: string; // адрес доставки
  paymentMethod: "credit_card" | "cash_on_delivery"; // способ оплаты
};

type FormErrors = {
  cardNumber?: string; // ошибка номера карты
  cardExpiry?: string; // ошибка срока действия
  cardCvc?: string; // ошибка CVC
  deliveryAddress?: string; // ошибка адреса
  paymentMethod?: string; // ошибка способа оплаты
};

export default function CheckoutPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  // Состояния для товаров корзины, адреса доставки, способа оплаты и обработки заказа
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // товары в корзине
  const [totalPrice, setTotalPrice] = useState(0); // общая стоимость
  const [deliveryAddress, setDeliveryAddress] = useState(""); // адрес доставки
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card"); // способ оплаты
  const [isProcessing, setIsProcessing] = useState(false); // идет обработка
  const [error, setError] = useState(""); // ошибка
  const [cardNumber, setCardNumber] = useState(""); // номер карты
  const [cardExpiry, setCardExpiry] = useState(""); // срок действия карты
  const [cardCvc, setCardCvc] = useState(""); // CVC-код
  const [orderComplete, setOrderComplete] = useState(false); // заказ завершен
  const [orderId, setOrderId] = useState(""); // ID заказа

  // Добавление новых состояний
  const [savedAddresses, setSavedAddresses] = useState<Array<{ id: string, address: string }>>([]); // сохраненные адреса
  const [selectedAddressId, setSelectedAddressId] = useState<string>(""); // выбранный адрес
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false); // добавление нового адреса

  // Состояния для валидации формы
  const [formErrors, setFormErrors] = useState<FormErrors>({}); // ошибки формы
  const [isFormValid, setIsFormValid] = useState(false); // форма валидна

  // Отдельное состояние для ввода нового адреса
  const [newAddress, setNewAddress] = useState(""); // новый адрес

  // Получение товаров корзины из localStorage при загрузке компонента
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        
        // Подсчет общей стоимости
        const total = parsedCart.reduce(
          (sum: number, item: CartItem) => sum + item.price * item.quantity,
          0
        );
        setTotalPrice(total);
      }
    }
    
    // Перенаправление если пользователь не авторизован
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // Add new useEffect to fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user?.emailAddresses[0].emailAddress) {
        try {
          const response = await fetch(`/api/addresses?userEmail=${encodeURIComponent(user.emailAddresses[0].emailAddress)}`);
          if (response.ok) {
            const addresses = await response.json();
            setSavedAddresses(addresses);
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
    };

    if (isLoaded && user) {
      fetchAddresses();
    }
  }, [isLoaded, user]);

  // Modified handleAddNewAddress function
  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.emailAddresses[0].emailAddress || !newAddress) return;

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0].emailAddress,
          address: newAddress,
        }),
      });

      if (response.ok) {
        const newAddressData = await response.json();
        setSavedAddresses([...savedAddresses, newAddressData]);
        setSelectedAddressId(newAddressData.id);
        setIsAddingNewAddress(false);
        setNewAddress(""); // Clear the new address input
      }
    } catch (error) {
      console.error('Error creating address:', error);
    }
  };

  // Modify the validateForm function to check only required fields based on payment method
  const validateForm = () => {
    // Reset validation state
    setIsFormValid(false);
    
    // Check if we have a delivery address (either selected or new)
    if (!selectedAddressId && !deliveryAddress) {
      return false;
    }

    // For cash on delivery, we only need the address
    if (paymentMethod === "cash_on_delivery") {
      setIsFormValid(true);
      return true;
    }

    // For credit card, validate card details
    if (paymentMethod === "credit_card") {
      const isCardNumberValid = cardNumber.replace(/\s/g, "").length === 16;
      const isExpiryValid = cardExpiry.match(/^\d{2}\/\d{2}$/);
      const isCvcValid = cardCvc.match(/^\d{3}$/);

      const isValid = isCardNumberValid && isExpiryValid && isCvcValid;
      setIsFormValid(isValid as boolean);
      return isValid;
    }

    return false;
  };

  // Add useEffect to run validation whenever relevant fields change
  useEffect(() => {
    validateForm();
  }, [selectedAddressId, deliveryAddress, paymentMethod, cardNumber, cardExpiry, cardCvc]);

  // Update handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Validate only required fields based on payment method
      const errors: FormErrors = {};
      
      // Validate address selection
      if (!selectedAddressId && !deliveryAddress) {
        errors.deliveryAddress = "Delivery address is required";
      }

      // Only validate card details if credit card is selected
      if (paymentMethod === "credit_card") {
        if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
          errors.cardNumber = "Valid card number is required";
        }
        if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
          errors.cardExpiry = "Valid expiry date is required (MM/YY)";
        }
        if (!cardCvc || !cardCvc.match(/^\d{3}$/)) {
          errors.cardCvc = "Valid CVC is required";
        }
      }

      setFormErrors(errors);
      if (Object.keys(errors).length > 0) {
        return;
      }

      if (!user?.emailAddresses[0].emailAddress) {
        setError("User email is required");
        return;
      }

      // Get the final delivery address
      const finalDeliveryAddress = selectedAddressId ? 
        savedAddresses.find(addr => addr.id === selectedAddressId)?.address : 
        deliveryAddress;

      // Set initial order status based on payment method
      const initialStatus = paymentMethod === "credit_card" ? "pending" : "onDelivery";

      // Create order without cartId
      const orderPayload = {
        userEmail: user.emailAddresses[0].emailAddress,
        deliveryAddress: finalDeliveryAddress,
        paymentMethod,
        status: initialStatus,
        totalPrice: totalPrice + 3.99,
      };

      console.log('Sending order data:', orderPayload);

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      // 2. Process payment only for credit card
      if (paymentMethod === "credit_card") {
        const paymentResponse = await fetch("/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderData.id,
            amount: totalPrice + 3.99,
            paymentMethod,
          }),
        });

        console.log(paymentResponse);

        if (!paymentResponse.ok) {
          throw new Error("Payment processing failed");
        }

        // 3. Update order status after successful payment
        await fetch(`/api/orders/${orderData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "paid",
            updatedAt: new Date().toISOString()
          }),
        });
      }

      // Clear cart and show success
      localStorage.removeItem("cart");
      setOrderComplete(true);
      setOrderId(orderData.id);

    } catch (error) {
      console.error("Checkout error:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false); // Reset when done
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
            {/* Order Summary Card */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b border-gray-100 last:border-0">
                    {item.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-4">
                    <span>Delivery Fee</span>
                    <span>$3.99</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${(totalPrice + 3.99).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Form */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Delivery Information</h2>
                
                {user && (
                  <div className="mb-6">
                    {savedAddresses.length > 0 && !isAddingNewAddress && (
                      <div className="space-y-3 mb-4">
                        {savedAddresses.map((addr) => (
                          <div 
                            key={addr.id}
                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                              selectedAddressId === addr.id 
                                ? 'border-red-600 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setDeliveryAddress(addr.address);
                            }}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id={addr.id}
                                name="savedAddress"
                                value={addr.id}
                                checked={selectedAddressId === addr.id}
                                onChange={() => {}}
                                className="w-4 h-4 text-red-600 focus:ring-red-500"
                              />
                              <label htmlFor={addr.id} className="ml-3 text-gray-700">
                                {addr.address}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center transition-colors"
                    >
                      {isAddingNewAddress ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back to saved addresses
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add new address
                        </>
                      )}
                    </button>
                  </div>
                )}

                {(!user || isAddingNewAddress) && (
                  <div className="mb-6">
                    <textarea
                      placeholder="Enter your delivery address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      rows={3}
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      required
                    />
                    {isAddingNewAddress && (
                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className="mt-3 px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Save New Address
                      </button>
                    )}
                  </div>
                )}

                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                
                <div className="space-y-4 mb-6">
                  <div 
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      paymentMethod === "credit_card"
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod("credit_card")}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="credit_card"
                        name="paymentMethod"
                        checked={paymentMethod === "credit_card"}
                        onChange={() => {}}
                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="credit_card" className="ml-3 flex items-center">
                        <span className="font-medium text-gray-800">Credit Card</span>
                        <svg className="h-6 w-6 ml-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <path d="M22 10H2" />
                        </svg>
                      </label>
                    </div>
                  </div>

                  <div 
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      paymentMethod === "cash_on_delivery"
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod("cash_on_delivery")}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash_on_delivery"
                        name="paymentMethod"
                        checked={paymentMethod === "cash_on_delivery"}
                        onChange={() => {}}
                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="cash_on_delivery" className="ml-3 flex items-center">
                        <span className="font-medium text-gray-800">Cash on Delivery</span>
                        <svg className="h-6 w-6 ml-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
                          <path d="M9 13h6" />
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>

                {paymentMethod === "credit_card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                      />
                      {formErrors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                          maxLength={5}
                        />
                        {formErrors.cardExpiry && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.cardExpiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">CVC</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                          maxLength={3}
                        />
                        {formErrors.cardCvc && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.cardCvc}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isProcessing || !isFormValid}
                  className={`w-full mt-6 py-4 rounded-lg font-bold text-white transition-all
                    ${isProcessing || !isFormValid
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay $${(totalPrice + 3.99).toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
