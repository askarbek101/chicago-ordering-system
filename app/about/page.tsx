import Image from "next/image";
import Link from "next/link";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

// Import images
import founderImage from "../images/founder.jpg";
import storeImage from "../images/store-front.jpg";
import teamImage from "../images/team.jpg";
import historyImage from "../images/history.jpg";

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
            <p className="text-xl max-w-2xl mx-auto">
              From a humble food truck to Chicago's favorite fast-food destination
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={founderImage}
                  alt="Mike Romano - Founder of ChicagoGO"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Meet Our Founder</h2>
                <p className="text-gray-600 mb-4">
                  Mike Romano, a third-generation Chicago restaurateur, founded ChicagoGO with a vision to bring authentic Chicago street food to a wider audience while maintaining the quality and tradition his family has been known for since 1952.
                </p>
                <p className="text-gray-600">
                  "Every recipe we serve has a story, passed down through generations and perfected over time. We're not just serving food; we're sharing a piece of Chicago's culinary heritage." - Mike Romano
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Where It All Began</h2>
                <p className="text-gray-600 mb-4">
                  Founded in 2010, ChicagoGO started as a single food truck parked in the bustling streets of downtown Chicago. Our founder, Mike Romano, had a simple vision: to serve authentic Chicago-style street food with a modern twist.
                </p>
                <p className="text-gray-600 mb-4">
                  What began as a passion project quickly gained a devoted following. Our signature Deep Dish Burger and authentic Chicago Dogs drew long lines of hungry customers, rain or shine.
                </p>
                <p className="text-gray-600">
                  Today, with multiple locations across the Windy City, we continue to serve the same quality food with the same dedication to authenticity and innovation that made us famous.
                </p>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={historyImage}
                  alt="ChicagoGO History"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Locations Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Growing Strong in Chicago</h2>
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden mb-12">
              <Image
                src={storeImage}
                alt="ChicagoGO Store Front"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-xl max-w-4xl mx-auto mb-8">
                From our flagship store in Lincoln Park to our newest location in the West Loop, each ChicagoGO restaurant is designed to be a welcoming space where the spirit of Chicago's food culture comes alive.
              </p>
              <Link 
                href="/locations" 
                className="inline-block px-10 py-4 bg-red-600 text-white text-lg font-bold rounded-full hover:bg-red-700 transition-colors"
              >
                Find Your Nearest Location
              </Link>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={teamImage}
                  alt="ChicagoGO Team"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Team</h2>
                <p className="text-gray-600 mb-4">
                  Behind every great meal is a dedicated team of food lovers. Our staff, from our experienced chefs to our friendly service team, shares a passion for Chicago's culinary traditions and exceptional customer service.
                </p>
                <p className="text-gray-600 mb-4">
                  We invest in our team through comprehensive training programs and career development opportunities, ensuring that every member of the ChicagoGO family can grow and succeed with us.
                </p>
                <Link 
                  href="/careers" 
                  className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
                >
                  Join Our Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-red-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join the ChicagoGO Family</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience authentic Chicago flavors and become part of our story.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/menu" 
                className="px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
              >
                View Our Menu
              </Link>
              <Link 
                href="/locations" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-red-600 transition-colors"
              >
                Find a Location
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
