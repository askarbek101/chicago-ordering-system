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

async function getMenuData() {
  const categories = await categoryDb.getAllCategories();
  const foods = await foodDb.getAllFood();
  return { categories, foods };
}

export default async function MenuPage() {
  const { categories, foods } = await getMenuData();
  
  // Get unique categories including "All"
  const categoryNames = ["All", ...categories.map(cat => cat.name)];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <section className="bg-red-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Authentic Chicago flavors made with premium ingredients and served with pride.
            </p>
          </div>
        </section>
        
        {/* Menu Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <MenuContent foods={foods} categories={categories} />
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Place Your Order?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Sign in to start your order for pickup or delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors">
                    Sign In to Order
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link 
                  href="/order" 
                  className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
                >
                  Start Your Order
                </Link>
              </SignedIn>
              <Link 
                href="/locations" 
                className="px-8 py-3 bg-transparent border-2 border-red-600 text-red-600 font-bold rounded-full hover:bg-red-50 transition-colors"
              >
                Find Nearest Location
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
