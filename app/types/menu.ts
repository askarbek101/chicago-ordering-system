export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image: string;
  category_id: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
} 