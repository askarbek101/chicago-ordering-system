type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

class CartService {
  private static instance: CartService;
  private listeners: (() => void)[] = [];

  private constructor() {
    // Initialize cart from localStorage if exists
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (!stored) {
        localStorage.setItem('cart', JSON.stringify([]));
      }
    }
  }

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: () => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  getCart(): CartItem[] {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(item: Omit<CartItem, 'quantity'>) {
    const cart = this.getCart();
    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.notifyListeners();
  }

  removeFromCart(itemId: string) {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    this.notifyListeners();
  }

  updateQuantity(itemId: string, quantity: number) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeFromCart(itemId);
        return;
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.notifyListeners();
  }

  getItemCount(): number {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    this.notifyListeners();
  }
}

export const cartService = CartService.getInstance(); 