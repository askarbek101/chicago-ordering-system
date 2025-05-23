import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "../components/footer"
import { Header } from "../components/header"

// Menu item images
import deepDishBurger from "../images/deep-dish-burger.jpg"
import chicagoDog from "../images/chicago-dog.jpg"
import italianBeef from "../images/italian-beef.jpg"
import cheeseFries from "../images/cheese-fries.jpg"
import pizzaPuff from "../images/pizza-puff.jpg"
import gyro from "../images/gyro.jpg"
import chicagoStylePizza from "../images/chicago-style-pizza.jpg"
import milkshake from "../images/milkshake.jpg"

// Menu item type definition
type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: any
  category: string
  popular?: boolean
  vegetarian?: boolean
  glutenFree?: boolean
}

// Menu data
const menuItems: MenuItem[] = [
  {
    id: "deep-dish-burger",
    name: "Deep Dish Burger",
    description: "Our signature burger inspired by Chicago's famous deep dish pizza. Loaded with cheese, tomato sauce, and Italian spices.",
    price: 12.99,
    image: deepDishBurger,
    category: "Burgers",
    popular: true
  },
  {
    id: "chicago-dog",
    name: "Chicago Dog",
    description: "All-beef hot dog with mustard, onions, relish, tomato, pickle, sport peppers, and celery salt on a poppy seed bun. Never ketchup!",
    price: 8.99,
    image: chicagoDog,
    category: "Hot Dogs",
    popular: true
  },
  {
    id: "italian-beef",
    name: "Italian Beef Sandwich",
    description: "Thinly sliced beef simmered in au jus and served on a French roll. Choose dry, wet, or dipped.",
    price: 10.99,
    image: italianBeef,
    category: "Sandwiches",
    popular: true
  },
  {
    id: "cheese-fries",
    name: "Loaded Cheese Fries",
    description: "Crispy fries topped with our special cheese sauce, bacon bits, and green onions.",
    price: 6.99,
    image: cheeseFries,
    category: "Sides",
    vegetarian: true
  },
  {
    id: "pizza-puff",
    name: "Pizza Puff",
    description: "A Chicago street food classic - pizza ingredients wrapped in a flaky pastry and deep-fried to perfection.",
    price: 7.99,
    image: pizzaPuff,
    category: "Specialties"
  },
  {
    id: "gyro",
    name: "Classic Gyro",
    description: "Seasoned beef and lamb slices with tzatziki sauce, tomatoes, and onions wrapped in warm pita bread.",
    price: 9.99,
    image: gyro,
    category: "Sandwiches"
  },
  {
    id: "chicago-style-pizza",
    name: "Mini Deep Dish Pizza",
    description: "Personal-sized Chicago-style deep dish pizza with cheese, chunky tomato sauce, and your choice of two toppings.",
    price: 11.99,
    image: chicagoStylePizza,
    category: "Specialties",
    vegetarian: true
  },
  {
    id: "milkshake",
    name: "Handcrafted Milkshake",
    description: "Thick and creamy milkshake made with premium ice cream. Available in chocolate, vanilla, or strawberry.",
    price: 5.99,
    image: milkshake,
    category: "Desserts",
    vegetarian: true,
    glutenFree: true
  }
]

// Get unique categories
const categories = ["All", ...Array.from(new Set(menuItems.map(item => item.category)))];

export default function MenuPage() {
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
            {/* Filter Controls */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {categories.map((category) => (
                  <button 
                    key={category}
                    className="px-4 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm2 3v1a1 1 0 102 0V5h6v1a1 1 0 102 0V5h1a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1h1z" clipRule="evenodd" />
                  </svg>
                  Popular Items
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Vegetarian
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Gluten Free
                </button>
              </div>
            </div>
            
            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="relative h-64">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {item.popular && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    {item.vegetarian && (
                      <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Vegetarian
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <span className="text-xl font-bold text-red-600">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {item.glutenFree && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Gluten Free
                          </span>
                        )}
                      </div>
                      <SignedIn>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                          Add to Cart
                        </button>
                      </SignedIn>
                      <SignedOut>
                        <SignInButton mode="modal">
                          <button className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                            Sign in to Order
                          </button>
                        </SignInButton>
                      </SignedOut>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Place Your Order?
            </h2>
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
