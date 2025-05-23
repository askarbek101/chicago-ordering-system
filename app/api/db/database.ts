import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// CRUD functions for food
export const foodDb = {
  // Create a new food item
  createFood: async (name: string, description: string, image: string, price: number, categoryId: string) => {
    const result = await pool.query(
      'INSERT INTO food (name, description, image, price, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, image, price, categoryId]
    );  
    return result.rows[0];
  },
  // Get all food items
  getAllFood: async () => {
    const result = await pool.query('SELECT * FROM food');
    return result.rows;
  },
  // Get a food item by ID
  getFoodById: async (id: string) => {
    const result = await pool.query('SELECT * FROM food WHERE id = $1', [id]);
    return result.rows[0];
  },
  // Update a food item
  updateFood: async (id: string, name: string, description: string, image: string, price: number, categoryId: string) => {
    const result = await pool.query(
      'UPDATE food SET name = $1, description = $2, image = $3, price = $4, category_id = $5 WHERE id = $6 RETURNING *',
      [name, description, image, price, categoryId, id]
    );
    return result.rows[0];
  },
  // Delete a food item
  deleteFood: async (id: string) => {
    await pool.query('DELETE FROM food WHERE id = $1', [id]);
  },

  // Search food items with flexible filtering
  searchFood: async (filters: {
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    name?: string
  }) => {
    let query = 'SELECT * FROM food WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (filters.categoryId) {
      query += ` AND category_id = $${paramIndex}`;
      params.push(filters.categoryId);
      paramIndex++;
    }
    
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      query += ` AND price BETWEEN $${paramIndex}`;
      params.push(filters.minPrice, filters.maxPrice);
      paramIndex += 2;
    } else if (filters.minPrice !== undefined) {
      query += ` AND price >= $${paramIndex}`;
      params.push(filters.minPrice);
      paramIndex++;
    } else if (filters.maxPrice !== undefined) {
      query += ` AND price <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }
    
    if (filters.name) {
      query += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${filters.name}%`);
      paramIndex++;
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  }
};

// CRUD functions for categories
export const categoryDb = {
  // Create a new category
  createCategory: async (name: string, description: string) => {
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );  
    return result.rows[0];
  },
  // Get all categories
  getAllCategories: async () => {
    const result = await pool.query('SELECT * FROM categories');
    return result.rows;
  },
  // Delete a category
  deleteCategory: async (id: string) => {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
  },
  // Update a category
  updateCategory: async (id: string, name: string, description: string) => {
    const result = await pool.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0];
  }
};

// CRUD functions for users
export const userDb = {
  // Create a new user
  createUser: async (email: string, firstName: string, lastName: string, image: string, role: string, createdAt: string, updatedAt: string) => {
    const result = await pool.query(
      'INSERT INTO users (email, first_name, last_name, image, role, phone, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [email, firstName, lastName, image, role, "", createdAt, updatedAt]
    );
    return result.rows[0];
  },
  // Get all users
  getAllUsers: async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  },
  // Get users by role
  getUsersByRole: async (role: string) => {
    const result = await pool.query('SELECT * FROM users WHERE role = $1', [role]);
    return result.rows;
  },
  // Delete a user
  deleteUser: async (id: string) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },
  // Update a user
  updateUser: async (email: string, firstName: string | null, lastName: string | null, image: string | null, role: string | null) => {
    let updateFields: string[] = [];
    let values: any[] = [];
    let paramCount = 1;

    if (firstName !== null) {
      updateFields.push(`first_name = $${paramCount}`);
      values.push(firstName);
      paramCount++;
    }
    if (lastName !== null) {
      updateFields.push(`last_name = $${paramCount}`);
      values.push(lastName);
      paramCount++;
    }
    if (image !== null) {
      updateFields.push(`image = $${paramCount}`);
      values.push(image);
      paramCount++;
    }
    if (role !== null) {
      updateFields.push(`role = $${paramCount}`);
      values.push(role);
      paramCount++;
    }

    const now = new Date().toISOString();
    updateFields.push(`updated_at = $${paramCount}`);
    values.push(now);
    paramCount++;

    // Add email to values array for WHERE clause
    values.push(email);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE email = $${paramCount} 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },
  // Get a user by email
  getUserByEmail: async (email: string) => {
    console.log(email);
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },
};

// CRUD functions for orders
export const orderDb = {
  // Create a new order with delivery address and payment method and cartid and userid and status and total price and createdat and updatedat
  createOrder: async (deliveryAddress: string, paymentMethod: string, cartId: string, userEmail: string, status: string, totalPrice: number, createdAt: string, updatedAt: string) => {
    const result = await pool.query(
      'INSERT INTO orders (delivery_address, payment_method, cart_id, user_email, status, total_price, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [deliveryAddress, paymentMethod, cartId, userEmail, status, totalPrice, createdAt, updatedAt]
    );
    return result.rows[0];
  },
  // get all orders by user email
  getAllOrdersByUserEmail: async (userEmail: string) => {
    const result = await pool.query('SELECT * FROM orders WHERE user_email = $1', [userEmail]);
    return result.rows;
  },
  // get all orders by status and user email
  getAllOrdersByStatusAndUserEmail: async (status: string, userEmail: string) => {
    const result = await pool.query('SELECT * FROM orders WHERE status = $1 AND user_email = $2', [status, userEmail]);
    return result.rows;
  },
  // update order status
  updateOrderStatus: async (id: string, status: string) => {
    const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    return result.rows[0];
  },
  // update order delivery address
  updateOrderDeliveryAddress: async (id: string, deliveryAddress: string) => {
    const result = await pool.query('UPDATE orders SET delivery_address = $1 WHERE id = $2', [deliveryAddress, id]);
    return result.rows[0];
  },
  // update order payment method
  updateOrderPaymentMethod: async (id: string, paymentMethod: string) => {
    const result = await pool.query('UPDATE orders SET payment_method = $1 WHERE id = $2', [paymentMethod, id]);
    return result.rows[0];
  },  
};


// CRUD functions for cart
export const cartDb = {
  // create a new cart
  createCart: async (userEmail: string, status: string, createdAt: string, updatedAt: string) => {
    const result = await pool.query('INSERT INTO carts (user_email, status, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *', [userEmail, status, createdAt, updatedAt]);
    return result.rows[0];
  },
  // get last non completed cart by user email
  getLastNonCompletedCartByUserEmail: async (userEmail: string) => {
    const result = await pool.query('SELECT * FROM carts WHERE user_email = $1 AND status != $2 ORDER BY created_at DESC LIMIT 1', [userEmail, "completed"]);
    return result.rows[0];
  },
};

// CRUD functions for cart items
export const cartItemDb = {
  // create a new cart item
  createCartItem: async (cartId: string, foodId: string, quantity: number, createdAt: string, updatedAt: string) => {
    const result = await pool.query('INSERT INTO cart_items (cart_id, food_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [cartId, foodId, quantity, createdAt, updatedAt]);
    return result.rows[0];
  },
  // get all cart items by cart id
  getAllCartItemsByCartId: async (cartId: string) => {
    const result = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
    return result.rows;
  },
  // delete a cart item
  deleteCartItem: async (id: string) => {
    await pool.query('DELETE FROM cart_items WHERE id = $1', [id]);
  },
  // update a cart item
  updateCartItem: async (id: string, quantity: number) => {
    const result = await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [quantity, id]);
    return result.rows[0];
  },
};

// CRUD functions for payment
export const paymentDb = {
  // create a new payment
  createPayment: async (orderId: string, amount: number, paymentMethod: string, createdAt: string, updatedAt: string) => {
    const result = await pool.query('INSERT INTO payments (order_id, amount, payment_method, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [orderId, amount, paymentMethod, createdAt, updatedAt]);
    return result.rows[0];
  },
  // get all payments by order id
  getAllPaymentsByOrderId: async (orderId: string) => {
    const result = await pool.query('SELECT * FROM payments WHERE order_id = $1', [orderId]);
    return result.rows;
  },
};

// CRUD functions for addresses
export const addressDb = {
  // create a new address
  createAddress: async (userEmail: string, address: string, createdAt: string, updatedAt: string) => {
    const result = await pool.query('INSERT INTO addresses (user_email, address, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *', [userEmail, address, createdAt, updatedAt]);
    return result.rows[0];
  },
  // get all addresses by user email
  getAllAddressesByUserEmail: async (userEmail: string) => {
    const result = await pool.query('SELECT * FROM addresses WHERE user_email = $1', [userEmail]);
    return result.rows;
  },
  // delete an address
  deleteAddress: async (id: string) => {
    await pool.query('DELETE FROM addresses WHERE id = $1', [id]);
  },
  // update an address
  updateAddress: async (id: string, address: string) => {
    const result = await pool.query('UPDATE addresses SET address = $1 WHERE id = $2', [address, id]);
    return result.rows[0];
  },
};

// CRUD functions for delivery
export const deliveryDb = {
  // create a new delivery
  createDelivery: async (orderId: string, deliveryAddress: string, deliveryStatus: string, createdAt: string, updatedAt: string) => {
    const result = await pool.query('INSERT INTO deliveries (order_id, delivery_address, delivery_status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', [orderId, deliveryAddress, deliveryStatus, createdAt, updatedAt]);
    return result.rows[0];
  },
  // get all deliveries by order id
  getAllDeliveriesByOrderId: async (orderId: string) => {
    const result = await pool.query('SELECT * FROM deliveries WHERE order_id = $1', [orderId]);
    return result.rows;
  },
  // delete a delivery
  deleteDelivery: async (id: string) => {
    await pool.query('DELETE FROM deliveries WHERE id = $1', [id]);
  },
  // update a delivery
  updateDelivery: async (id: string, deliveryStatus: string) => {
    const result = await pool.query('UPDATE deliveries SET delivery_status = $1 WHERE id = $2', [deliveryStatus, id]);
    return result.rows[0];
  },
  // get all deliveries by user email
  getAllDeliveriesByUserEmail: async (userEmail: string) => {
    const result = await pool.query('SELECT * FROM deliveries WHERE user_email = $1', [userEmail]);
    return result.rows;
  },
};















// Export the pool for direct queries if needed
export default pool;
