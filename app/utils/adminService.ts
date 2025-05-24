// API functions for admin operations
export const adminService = {
  // Food APIs
  getAllFood: async () => {
    const response = await fetch('/api/food');
    if (!response.ok) throw new Error('Failed to fetch food items');
    return response.json();
  },

  createFood: async (foodData: any) => {
    const response = await fetch('/api/food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodData),
    });
    if (!response.ok) throw new Error('Failed to create food item');
    return response.json();
  },

  updateFood: async (id: string, foodData: any) => {
    const response = await fetch(`/api/food/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodData),
    });
    console.log(response);
    if (!response.ok) throw new Error('Failed to update food item');
    return response.json();
  },

  deleteFood: async (id: string) => {
    const response = await fetch(`/api/food/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete food item');
    return response.json();
  },

  // Category APIs
  getAllCategories: async () => {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  createCategory: async (categoryData: any) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  updateCategory: async (id: string, categoryData: any) => {
    const response = await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...categoryData }),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  deleteCategory: async (id: string) => {
    const response = await fetch(`/api/categories?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
  },

  // User APIs
  getAllUsers: async () => {
    const response = await fetch('/api/users/role/client');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  updateUser: async (email: string, userData: any) => {
    const response = await fetch(`/api/users/email/${email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  // Order APIs
  getAllOrders: async () => {
    const response = await fetch('/api/orders/all');
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  // Payment APIs
  getAllPayments: async () => {
    const response = await fetch('/api/payments/all');
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
  },
}; 