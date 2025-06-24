"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { adminService } from "../utils/adminService";
import { toast } from "react-hot-toast";

// Mock data types based on database.ts
type Food = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
};

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  image: string;
};

type Order = {
  id: string;
  user_email: string;
  delivery_address: string;
  payment_method: string;
  status: string;
  total_price: number;
  created_at: string;
};

type Payment = {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  created_at: string;
};

// Add Modal types
type FoodModalData = {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
};

type CategoryModalData = {
  id?: string;
  name: string;
  description: string;
};

// Mock data
const mockFoods: Food[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Classic Italian pizza",
    price: 12.99,
    image: "/pizza.jpg",
    category_id: "1"
  },
  // Add more mock foods...
];

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Pizza",
    description: "Italian pizzas"
  },
  // Add more mock categories...
];

const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "client",
    phone: "1234567890",
    image: "/avatar.jpg"
  },
  // Add more mock users...
];

const mockOrders: Order[] = [
  {
    id: "1",
    user_email: "user@example.com",
    delivery_address: "123 Main St",
    payment_method: "credit_card",
    status: "pending",
    total_price: 25.99,
    created_at: "2024-03-20T10:00:00Z"
  },
  // Add more mock orders...
];

const mockPayments: Payment[] = [
  {
    id: "1",
    order_id: "1",
    amount: 25.99,
    payment_method: "credit_card",
    created_at: "2024-03-20T10:00:00Z"
  },
  // Add more mock payments...
];

// Helper function for formatting prices
const formatPrice = (price: number | string | null | undefined): string => {
  if (price === null || price === undefined) return '0.00';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'food' | 'categories' | 'users' | 'orders' | 'payments'>('food');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Add state for data
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
      return;
    }

    checkAdminStatus();
  }, [isLoaded, user, router]);

  const checkAdminStatus = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      
      const response = await fetch(`/api/users/email/${user.primaryEmailAddress.emailAddress}`);
      const userData = await response.json();
      
      if (userData.role === 'admin') {
        setIsAdmin(true);
        fetchAllData();
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [foodData, categoryData, userData, orderData, paymentData] = await Promise.all([
        adminService.getAllFood(),
        adminService.getAllCategories(),
        adminService.getAllUsers(),
        adminService.getAllOrders(),
        adminService.getAllPayments(),
      ]);

      setFoods(foodData);
      setCategories(categoryData);
      setUsers(userData);
      setOrders(orderData);
      setPayments(paymentData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-gray-600">У вас нет прав администратора для доступа к этой странице.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('food')}
              className={`py-4 px-6 focus:outline-none ${
                activeTab === 'food'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Меню
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-6 focus:outline-none ${
                activeTab === 'categories'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Категории
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 focus:outline-none ${
                activeTab === 'users'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Пользователи
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-6 focus:outline-none ${
                activeTab === 'orders'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Заказы
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-6 focus:outline-none ${
                activeTab === 'payments'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Платежи
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'food' && <FoodSection foods={foods} categories={categories} onUpdate={fetchAllData} formatPrice={formatPrice} />}
        {activeTab === 'categories' && <CategoriesSection categories={categories} onUpdate={fetchAllData} />}
        {activeTab === 'users' && <UsersSection users={users} onUpdate={fetchAllData} />}
        {activeTab === 'orders' && <OrdersSection orders={orders} onUpdate={fetchAllData} formatPrice={formatPrice} />}
        {activeTab === 'payments' && <PaymentsSection payments={payments} formatPrice={formatPrice} />}
      </div>
    </div>
  );
}

// Component for Food section
function FoodSection({ foods, categories, onUpdate, formatPrice }: { 
  foods: Food[], 
  categories: Category[], 
  onUpdate: () => Promise<void>,
  formatPrice: (price: number | string | null | undefined) => string 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<FoodModalData>({
    name: '',
    description: '',
    price: 0,
    image: '',
    categoryId: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleOpenModal = (food?: Food) => {
    if (food) {
      setModalData({
        id: food.id,
        name: food.name,
        description: food.description,
        price: food.price,
        image: food.image,
        categoryId: food.category_id
      });
      setIsEditing(true);
    } else {
      setModalData({
        name: '',
        description: '',
        price: 0,
        image: '',
        categoryId: ''
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await adminService.updateFood(modalData.id!, modalData);
      } else {
        await adminService.createFood(modalData);
      }
      setIsModalOpen(false);
      onUpdate();
      toast.success(isEditing ? 'Блюдо обновлено' : 'Блюдо добавлено');
    } catch (error) {
      toast.error('Произошла ошибка');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление меню</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Добавить блюдо
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div key={food.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={food.image}
                alt={food.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{food.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{food.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">₸{formatPrice(food.price)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(food)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
                        try {
                          await adminService.deleteFood(food.id);
                          toast.success('Блюдо успешно удалено');
                          onUpdate();
                        } catch (error) {
                          console.error('Error deleting food:', error);
                          toast.error('Ошибка при удалении блюда');
                        }
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {modalData.id ? 'Изменить блюдо' : 'Добавить новое блюдо'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={modalData.description}
                  onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена
                </label>
                <input
                  type="number"
                  value={modalData.price}
                  onChange={(e) => setModalData({ ...modalData, price: parseFloat(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL изображения
                </label>
                <input
                  type="text"
                  value={modalData.image}
                  onChange={(e) => setModalData({ ...modalData, image: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  value={modalData.categoryId}
                  onChange={(e) => setModalData({ ...modalData, categoryId: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {modalData.id ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for Categories section
function CategoriesSection({ categories, onUpdate }: { categories: Category[], onUpdate: () => Promise<void> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CategoryModalData>({
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setModalData(category);
      setIsEditing(true);
    } else {
      setModalData({
        name: '',
        description: ''
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await adminService.updateCategory(modalData.id!, modalData);
      } else {
        await adminService.createCategory(modalData);
      }
      setIsModalOpen(false);
      onUpdate();
      toast.success(isEditing ? 'Категория обновлена' : 'Категория добавлена');
    } catch (error) {
      toast.error('Произошла ошибка');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление категориями</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Добавить категорию
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleOpenModal(category)}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                Изменить
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
                    try {
                      await adminService.deleteCategory(category.id);
                      toast.success('Категория успешно удалена');
                      onUpdate();
                    } catch (error) {
                      console.error('Error deleting category:', error);
                      toast.error('Ошибка при удалении категории');
                    }
                  }
                }}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {modalData.id ? 'Изменить категорию' : 'Добавить новую категорию'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={modalData.description}
                  onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {modalData.id ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for Users section
function UsersSection({ users, onUpdate }: { users: User[], onUpdate: () => Promise<void> }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Управление пользователями</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Телефон
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        src={user.image || '/default-avatar.png'}
                        alt={`${user.first_name} ${user.last_name}`}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'Администратор' : 'Клиент'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={async () => {
                      const newRole = user.role === 'admin' ? 'client' : 'admin';
                      if (window.confirm(`Изменить роль пользователя на ${newRole === 'admin' ? 'Администратор' : 'Клиент'}?`)) {
                        try {
                          await adminService.updateUserRole(user.id, newRole);
                          toast.success('Роль пользователя успешно обновлена');
                          onUpdate();
                        } catch (error) {
                          console.error('Error updating user role:', error);
                          toast.error('Ошибка при обновлении роли пользователя');
                        }
                      }
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Изменить роль
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Component for Orders section
function OrdersSection({ orders, onUpdate, formatPrice }: { 
  orders: Order[], 
  onUpdate: () => Promise<void>,
  formatPrice: (price: number | string | null | undefined) => string 
}) {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'В обработке';
      case 'confirmed':
        return 'Подтвержден';
      case 'preparing':
        return 'Готовится';
      case 'ready':
        return 'Готов';
      case 'delivering':
        return 'Доставляется';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivering':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Управление заказами</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID заказа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Клиент
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Адрес доставки
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.user_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.delivery_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₸{formatPrice(order.total_price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={order.status}
                    onChange={async (e) => {
                      try {
                        await adminService.updateOrderStatus(order.id, e.target.value);
                        toast.success('Статус заказа успешно обновлен');
                        onUpdate();
                      } catch (error) {
                        console.error('Error updating order status:', error);
                        toast.error('Ошибка при обновлении статуса заказа');
                      }
                    }}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="pending">В обработке</option>
                    <option value="confirmed">Подтвержден</option>
                    <option value="preparing">Готовится</option>
                    <option value="ready">Готов</option>
                    <option value="delivering">Доставляется</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Component for Payments section
function PaymentsSection({ payments, formatPrice }: { 
  payments: Payment[],
  formatPrice: (price: number | string | null | undefined) => string 
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">История платежей</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID платежа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID заказа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Способ оплаты
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{payment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{payment.order_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₸{formatPrice(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.payment_method === 'credit_card' ? 'Банковская карта' : 'Наличные'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(payment.created_at).toLocaleString('ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
