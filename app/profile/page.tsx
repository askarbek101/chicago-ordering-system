"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useRouter } from "next/navigation";

// Types
type Address = {
  id: string;
  address: string;
  created_at: string;
};

type Order = {
  id: string;
  delivery_address: string;
  payment_method: string;
  status: string;
  total_price: number;
  created_at: string;
};

type CartItem = {
  id: string;
  food: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
};

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeCart, setActiveCart] = useState<CartItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [isLoaded, isSignedIn, user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      if (!userEmail) return;

      // Fetch user data from users API
      const userResponse = await fetch(`/api/users/email/${userEmail}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        // Update user profile with data from database
        setUserProfile({
          firstName: userData.first_name || user?.firstName || "",
          lastName: userData.last_name || user?.lastName || "",
          phone: userData.phone || user?.phoneNumbers?.[0]?.phoneNumber || "",
        });
      }

      // Fetch addresses
      const addressesResponse = await fetch(`/api/addresses?userEmail=${encodeURIComponent(userEmail || '')}`);
      if (addressesResponse.ok) {
        const addressesData = await addressesResponse.json();
        setAddresses(Array.isArray(addressesData) ? addressesData : []);
      } else {
        setAddresses([]);
      }

      // Fetch orders
      const ordersResponse = await fetch(`/api/orders?userEmail=${encodeURIComponent(userEmail || '')}`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        setOrders([]);
      }

      // Fetch active cart
      const cartResponse = await fetch(`/api/carts?userEmail=${encodeURIComponent(userEmail || '')}`);
      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setActiveCart(Array.isArray(cartData?.items) ? cartData.items : []);
      } else {
        setActiveCart([]);
      }

    } catch (err) {
      setError("Failed to load user data");
      console.error(err);
      // Initialize empty arrays on error
      setAddresses([]);
      setOrders([]);
      setActiveCart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.primaryEmailAddress?.emailAddress,
          address: newAddress,
        }),
      });

      if (response.ok) {
        const newAddressData = await response.json();
        setAddresses([...addresses, newAddressData]);
        setNewAddress("");
      }
    } catch (err) {
      setError("Failed to add address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await fetch("/api/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (err) {
      setError("Failed to delete address");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail) return;

      // First update in Clerk
      await user?.update({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
      });

      // Then update in our database
      const response = await fetch(`/api/users/email/${userEmail}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          phone: userProfile.phone,
          image: user?.imageUrl || '', // Add user image from Clerk
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user in database');
      }

      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">Loading...</div>
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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-red-600 hover:text-red-700"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Имя</label>
                  <input
                    type="text"
                    value={userProfile.firstName}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Фамилия</label>
                  <input
                    type="text"
                    value={userProfile.lastName}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Сохранить изменения
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Имя:</span>{" "}
                  {userProfile.firstName} {userProfile.lastName}
                </p>
                <p>
                  <span className="font-semibold">Эл. почта:</span>{" "}
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <p>
                  <span className="font-semibold">Телефон:</span>{" "}
                  {userProfile.phone || "Не указан"}
                </p>
              </div>
            )}
          </div>

          {/* Addresses Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Адреса доставки</h2>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <p>{address.address}</p>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Добавить новый адрес"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <button
                  onClick={handleAddAddress}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">История заказов</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Заказ #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        ${Number(order.total_price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Статус: {order.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Cart Section */}
          {activeCart.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Текущая корзина</h2>
              <div className="space-y-4">
                {activeCart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <p className="font-semibold">{item.food.name}</p>
                      <p className="text-sm text-gray-600">
                        Количество: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-red-600">
                      ${(item.food.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="text-right">
                  <button
                    onClick={() => router.push("/cart")}
                    className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    Перейти в корзину
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 