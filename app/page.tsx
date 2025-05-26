import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { LearnMore } from "./components/learn-more"
import logo from "./images/logo.png"
import "./home.css"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "./components/footer"
import { Header } from "./components/header"

import heroImage from "./images/chicago-burger.jpg"
import menuItem1 from "./images/deep-dish-burger.jpg"
import menuItem2 from "./images/chicago-dog.jpg"
import menuItem3 from "./images/italian-beef.jpg"

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt="Чикагский бургер"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          
          <div className="container mx-auto px-4 z-10 text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Лучший Фастфуд<br />Чикаго
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Аутентичные вкусы Чикаго в современном исполнении. Наши бургеры готовятся из 100% премиальной говядины и свежих ингредиентов.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/menu" 
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
              >
                Посмотреть Меню
              </Link>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors">
                    Заказать Сейчас
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/menu" 
                  className="px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
                >
                  Заказать Сейчас
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>
        
        {/* Featured Menu Items */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Фавориты Чикаго
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Menu Item 1 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-64">
                  <Image
                    src={menuItem1}
                    alt="Бургер Дип Диш"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Бургер Дип Диш</h3>
                  <p className="text-gray-600 mb-4">
                    Наш фирменный бургер, вдохновленный знаменитой пиццей Дип Диш из Чикаго.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-red-600">$12.99</span>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                      В Корзину
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Menu Item 2 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-64">
                  <Image
                    src={menuItem2}
                    alt="Чикагский Хот-Дог"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Чикагский Хот-Дог</h3>
                  <p className="text-gray-600 mb-4">
                    Хот-дог из говядины со всеми добавками, как любят в Чикаго.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-red-600">$8.99</span>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                      В Корзину
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Menu Item 3 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-64">
                  <Image
                    src={menuItem3}
                    alt="Итальянский Биф-Сэндвич"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Итальянский Биф-Сэндвич</h3>
                  <p className="text-gray-600 mb-4">
                    Тонко нарезанная говядина, приготовленная в соусе и подающаяся на французском хлебе.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-red-600">$10.99</span>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                      В Корзину
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/menu" 
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors inline-block"
              >
                Посмотреть Полное Меню
              </Link>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  История ChicagoGO
                </h2>
                <p className="text-gray-600 mb-4">
                  Основанный в 2010 году, ChicagoGO начинался как небольшой фудтрак, подающий аутентичный фастфуд в стиле Чикаго местным жителям и туристам.
                </p>
                <p className="text-gray-600 mb-4">
                  Наша приверженность качественным ингредиентам, ярким вкусам и неповторимой культуре еды Чикаго сделала нас любимым заведением в Городе Ветров.
                </p>
                <p className="text-gray-600 mb-6">
                  Сегодня, имея несколько точек по всему Чикаго, мы продолжаем подавать лучшие бургеры, хот-доги и итальянские биф-сэндвичи с той же страстью и преданностью делу, как и в первый день.
                </p>
                <Link 
                  href="/about" 
                  className="text-red-600 font-bold hover:underline"
                >
                  Узнать больше о нашей истории →
                </Link>
              </div>
              <div className="md:w-1/2 bg-gray-100 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4">Почему выбирают ChicagoGO?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>100% премиальная говядина от местных фермеров</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Свежие ингредиенты, доставляемые ежедневно</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Аутентичные чикагские рецепты в современном исполнении</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Быстрое обслуживание без ущерба качеству</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Доступны вегетарианские и безглютеновые опции</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-red-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Проголодались? Закажите Онлайн Прямо Сейчас!
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Пропустите очередь и закажите ваши любимые блюда на вынос или с доставкой.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors">
                    Войти для Заказа
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/menu" 
                  className="px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
                >
                  Начать Заказ
                </Link>
              </SignedIn>
              <Link 
                href="/locations" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-red-600 transition-colors"
              >
                Найти Ближайшую Точку
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
