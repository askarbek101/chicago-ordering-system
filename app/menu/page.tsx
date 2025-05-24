import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { foodDb, categoryDb } from "../api/db/database"
import { MenuContent } from "../components/MenuContent"

function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
}

// Добавляем этот экспорт для включения динамического рендеринга
export const dynamic = 'force-dynamic';

async function getMenuData() {
  try {
    const categories = await categoryDb.getAllCategories();
    const foods = await foodDb.getAllFood();
    return { categories, foods };
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return { categories: [], foods: [] };
  }
}

export default async function MenuPage() {
  const { categories, foods } = await getMenuData();
  
  // Получаем уникальные категории, включая "Все"
  const categoryNames = ["Все", ...categories.map(cat => cat.name)];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Баннер */}
        <section className="bg-red-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Наше Меню</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Аутентичные чикагские вкусы, приготовленные из премиальных ингредиентов и поданные с гордостью.
            </p>
          </div>
        </section>
        
        {/* Содержимое меню */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <MenuContent foods={foods} categories={categories} />
          </div>
        </section>
        
        {/* Призыв к действию */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Готовы сделать заказ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Войдите, чтобы начать оформление заказа на самовывоз или доставку.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors">
                    Войти для заказа
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/order" 
                  className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
                >
                  Начать заказ
                </Link>
              </SignedIn>
              <Link 
                href="/locations" 
                className="px-8 py-3 bg-transparent border-2 border-red-600 text-red-600 font-bold rounded-full hover:bg-red-50 transition-colors"
              >
                Найти ближайший ресторан
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
