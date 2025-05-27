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
          <h1 className="text-4xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
          <p className="text-gray-600">У вас нет прав для доступа к этой странице.</p>
          <a href="/" className="text-red-600 hover:text-red-700 mt-4 inline-block">
            Вернуться на главную ChicagoGO
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Панель администратора</h1>
          <a href="/" className="text-red-600 hover:text-red-700">
            Вернуться на главную ChicagoGO
          </a>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            ['food', 'Меню'],
            ['categories', 'Категории'],
            ['users', 'Пользователи'],
            ['orders', 'Заказы'],
            ['payments', 'Платежи']
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'food' && (
            <FoodSection 
              foods={foods} 
              categories={categories}
              onUpdate={fetchAllData}
            />
          )}
          {activeTab === 'categories' && (
            <CategoriesSection 
              categories={categories}
              onUpdate={fetchAllData}
            />
          )}
          {activeTab === 'users' && (
            <UsersSection 
              users={users}
              onUpdate={fetchAllData}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersSection 
              orders={orders}
              onUpdate={fetchAllData}
            />
          )}
          {activeTab === 'payments' && (
            <PaymentsSection payments={payments} />
          )}
        </div>
      </div>
    </div>
  );
}

// Component for Food section
function FoodSection({ foods, categories, onUpdate }: { foods: Food[], categories: Category[], onUpdate: () => Promise<void> }) {
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

  const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Меню</h2>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" 
          onClick={() => handleOpenModal()}
        >
          Добавить
        </button>
      </div>
      
      {/* Food Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div key={food.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <Image
              src={food.image || '/placeholder-food.jpg'}
              alt={food.name}
              width={200}
              height={200}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={() => setImagePreviewError(true)}
            />
            <h3 className="text-xl font-semibold mb-2">{food.name}</h3>
            <p className="text-gray-600 mb-2">{food.description}</p>
            <p className="text-red-600 font-bold mb-4">
              ₸{formatPrice(food.price)}
            </p>
            <div className="flex space-x-2">
              <button 
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => handleOpenModal(food)}
              >
                Изменить
              </button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={async () => {
                  if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
                    await adminService.deleteFood(food.id);
                    onUpdate();
                    toast.success('Блюдо удалено');
                  }
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Updated Modal with Image Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              {isEditing ? 'Редактировать блюдо' : 'Добавить новое блюдо'}
            </h3>
            
            {/* Image Preview */}
            <div className="mb-4">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-2">
                {modalData.image ? (
                  <Image
                    src={imagePreviewError ? '/placeholder-food.jpg' : modalData.image}
                    alt="Предпросмотр"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                    onError={() => setImagePreviewError(true)}
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Нет изображения
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Название</label>
                  <input
                    type="text"
                    value={modalData.name}
                    onChange={(e) => setModalData({...modalData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Описание</label>
                  <textarea
                    value={modalData.description}
                    onChange={(e) => setModalData({...modalData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Цена</label>
                  <input
                    type="number"
                    value={modalData.price}
                    onChange={(e) => setModalData({...modalData, price: Math.max(0, parseFloat(e.target.value) || 0)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL изображения</label>
                  <input
                    type="text"
                    value={modalData.image}
                    onChange={(e) => {
                      setImagePreviewError(false);
                      setModalData({...modalData, image: e.target.value});
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Категория</label>
                  <select
                    value={modalData.categoryId}
                    onChange={(e) => setModalData({...modalData, categoryId: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  {isEditing ? 'Сохранить' : 'Добавить'}
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
        <h2 className="text-2xl font-bold">Категории</h2>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={() => handleOpenModal()}
        >
          Добавить
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="flex space-x-2">
              <button 
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => handleOpenModal(category)}
              >
                Изменить
              </button>
              <button 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={async () => {
                  if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
                    await adminService.deleteCategory(category.id);
                    onUpdate();
                    toast.success('Категория удалена');
                  }
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              {isEditing ? 'Редактировать категорию' : 'Добавить новую категорию'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Название</label>
                  <input
                    type="text"
                    value={modalData.name}
                    onChange={(e) => setModalData({...modalData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Описание</label>
                  <textarea
                    value={modalData.description}
                    onChange={(e) => setModalData({...modalData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  {isEditing ? 'Сохранить' : 'Добавить'}
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
      <h2 className="text-2xl font-bold mb-6">Пользователи</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Имя</th>
              <th className="px-6 py-3 text-left">Почта</th>
              <th className="px-6 py-3 text-left">Роль</th>
              <th className="px-6 py-3 text-left">Телефон</th>
              <th className="px-6 py-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-6 py-4">{`${user.first_name} ${user.last_name}`}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role === 'admin' ? 'Администратор' : 'Клиент'}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Изменить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={onUpdate}>
          Обновить
        </button>
      </div>
    </div>
  );
}

// Component for Orders section
function OrdersSection({ orders, onUpdate }: { orders: Order[], onUpdate: () => Promise<void> }) {
  const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнен';
      case 'pending': return 'В обработке';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Заказы</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">ID Заказа</th>
              <th className="px-6 py-3 text-left">Пользователь</th>
              <th className="px-6 py-3 text-left">Статус</th>
              <th className="px-6 py-3 text-left">Сумма</th>
              <th className="px-6 py-3 text-left">Дата</th>
              <th className="px-6 py-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.user_email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4">${formatPrice(order.total_price)}</td>
                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                <td className="px-6 py-4">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Изменить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={onUpdate}>
          Обновить
        </button>
      </div>
    </div>
  );
}

// Component for Payments section
function PaymentsSection({ payments }: { payments: Payment[] }) {
  const formatPrice = (price: number | string | null | undefined): string => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Платежи</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">ID Платежа</th>
              <th className="px-6 py-3 text-left">ID Заказа</th>
              <th className="px-6 py-3 text-left">Сумма</th>
              <th className="px-6 py-3 text-left">Способ оплаты</th>
              <th className="px-6 py-3 text-left">Дата</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="px-6 py-4">{payment.id}</td>
                <td className="px-6 py-4">{payment.order_id}</td>
                <td className="px-6 py-4">${formatPrice(payment.amount)}</td>
                <td className="px-6 py-4">{payment.payment_method === 'credit_card' ? 'Банковская карта' : payment.payment_method}</td>
                <td className="px-6 py-4">{new Date(payment.created_at).toLocaleDateString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
