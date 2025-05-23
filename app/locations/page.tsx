"use client";

import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

// Import store images
import storeImage from "../images/store-front.jpg";

interface Location {
  id: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  reviews: Review[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

const locations: Location[] = [
  // Локации в Казахстане
  {
    id: "almaty1",
    city: "Алматы",
    country: "Казахстан",
    address: "пр. Абая 123, Медеуский район",
    phone: "+7 (727) 123-4567",
    hours: "10:00 - 22:00",
    rating: 4.8,
    reviews: [
      {
        id: "rev1",
        userName: "Азамат К.",
        rating: 5,
        comment: "Лучшая чикагская еда в Алматы! Бургер Deep Dish просто потрясающий.",
        date: "2024-03-15"
      }
    ]
  },
  {
    id: "astana1",
    city: "Астана",
    country: "Казахстан",
    address: "пр. Туран 45, район Есиль",
    phone: "+7 (717) 234-5678",
    hours: "10:00 - 22:00",
    rating: 4.7,
    reviews: [
      {
        id: "rev2",
        userName: "Дана С.",
        rating: 5,
        comment: "Отличная атмосфера и аутентичные чикагские вкусы!",
        date: "2024-03-10"
      }
    ]
  },
  {
    id: "shymkent1",
    city: "Шымкент",
    country: "Казахстан",
    address: "пр. Тауке хана 78",
    phone: "+7 (725) 345-6789",
    hours: "10:00 - 22:00",
    rating: 4.6,
    reviews: [
      {
        id: "rev3",
        userName: "Ерлан М.",
        rating: 4,
        comment: "Обожаю их сэндвич с итальянской говядиной!",
        date: "2024-03-12"
      }
    ]
  },
  {
    id: "aktau1",
    city: "Актау",
    country: "Казахстан",
    address: "14 микрорайон, 15",
    phone: "+7 (729) 456-7890",
    hours: "10:00 - 22:00",
    rating: 4.5,
    reviews: [
      {
        id: "rev4",
        userName: "Айша Б.",
        rating: 5,
        comment: "Наконец-то, настоящие чикагские хот-доги в Актау!",
        date: "2024-03-08"
      }
    ]
  },
  // Локации в США
  {
    id: "chicago1",
    city: "Чикаго",
    country: "США",
    address: "1234 N Lincoln Ave, Chicago, IL 60614",
    phone: "(312) 555-0123",
    hours: "10:00 - 23:00",
    rating: 4.9,
    reviews: [
      {
        id: "rev5",
        userName: "Майк Р.",
        rating: 5,
        comment: "Оригинальное место - до сих пор лучшее!",
        date: "2024-03-14"
      }
    ]
  },
  {
    id: "chicago2",
    city: "Чикаго",
    country: "США",
    address: "789 W Madison St, Chicago, IL 60661",
    phone: "(312) 555-0124",
    hours: "10:00 - 23:00",
    rating: 4.8,
    reviews: [
      {
        id: "rev6",
        userName: "Сара Л.",
        rating: 5,
        comment: "Локация в West Loop просто фантастическая!",
        date: "2024-03-13"
      }
    ]
  }
];

export default function LocationsPage() {
  const { user } = useUser();
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const filteredLocations = selectedCountry === "all" 
    ? locations 
    : locations.filter(loc => loc.country === selectedCountry);

  const handleAddReview = (locationId: string) => {
    if (!user || !newReview.comment) return;

    // В реальном приложении здесь был бы API-запрос
    console.log("Добавление отзыва для локации:", locationId, newReview);
    // Сброс формы
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Секция Hero */}
        <section className="relative h-[40vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={storeImage}
              alt="Фасад ресторана ChicagoGO"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          
          <div className="container mx-auto px-4 z-10 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Наши рестораны
            </h1>
            <p className="text-xl max-w-2xl">
              Найдите ближайший ресторан ChicagoGO в Казахстане и США.
            </p>
          </div>
        </section>

        {/* Фильтр локаций */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setSelectedCountry("all")}
                className={`px-6 py-2 rounded-full ${
                  selectedCountry === "all"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Все рестораны
              </button>
              <button
                onClick={() => setSelectedCountry("Казахстан")}
                className={`px-6 py-2 rounded-full ${
                  selectedCountry === "Казахстан"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Казахстан
              </button>
              <button
                onClick={() => setSelectedCountry("США")}
                className={`px-6 py-2 rounded-full ${
                  selectedCountry === "США"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                США
              </button>
            </div>
          </div>
        </section>

        {/* Сетка локаций */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLocations.map((location) => (
                <div key={location.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{location.city}</h2>
                    <p className="text-gray-600 mb-4">{location.country}</p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {location.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {location.hours}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Отзывы</h3>
                      <div className="space-y-4">
                        {location.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.userName}</span>
                              <span className="text-yellow-400">{"★".repeat(review.rating)}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      <SignedIn>
                        <div className="mt-4">
                          <textarea
                            placeholder="Напишите ваш отзыв..."
                            className="w-full p-2 border rounded-md"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          />
                          <div className="flex justify-between items-center mt-2">
                            <select
                              value={newReview.rating}
                              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                              className="border rounded-md p-1"
                            >
                              {[5, 4, 3, 2, 1].map((num) => (
                                <option key={num} value={num}>
                                  {"★".repeat(num)} {num} звезд
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAddReview(location.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                              Добавить отзыв
                            </button>
                          </div>
                        </div>
                      </SignedIn>
                      <SignedOut>
                        <div className="mt-4 text-center">
                          <SignInButton mode="modal">
                            <button className="text-red-600 hover:underline">
                              Войдите, чтобы оставить отзыв
                            </button>
                          </SignInButton>
                        </div>
                      </SignedOut>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
