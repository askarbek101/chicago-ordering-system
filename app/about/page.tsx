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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Наша История</h1>
            <p className="text-xl max-w-2xl mx-auto">
              От скромного фургончика с едой до любимого заведения быстрого питания в Чикаго
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
                  alt="Майк Романо - Основатель ChicagoGO"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Познакомьтесь с нашим основателем</h2>
                <p className="text-gray-600 mb-4">
                  Майк Романо, ресторатор из Чикаго в третьем поколении, основал ChicagoGO с целью познакомить широкую аудиторию с аутентичной уличной едой Чикаго, сохраняя качество и традиции, которыми его семья славится с 1952 года.
                </p>
                <p className="text-gray-600">
                  "За каждым рецептом, который мы готовим, стоит история, передаваемая из поколения в поколение и совершенствуемая с течением времени. Мы не просто подаем еду - мы делимся частичкой кулинарного наследия Чикаго." - Майк Романо
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
                <h2 className="text-3xl font-bold mb-6">Как всё начиналось</h2>
                <p className="text-gray-600 mb-4">
                  Основанный в 2010 году, ChicagoGO начинался как один фургончик с едой на оживленных улицах центра Чикаго. У нашего основателя, Майка Романо, было простое видение: подавать аутентичную уличную еду в стиле Чикаго с современным подходом.
                </p>
                <p className="text-gray-600 mb-4">
                  То, что начиналось как проект по зову сердца, быстро обрело преданных поклонников. Наши фирменные Deep Dish бургеры и аутентичные хот-доги по-чикагски привлекали длинные очереди голодных клиентов в любую погоду.
                </p>
                <p className="text-gray-600">
                  Сегодня, имея несколько точек по всему Городу Ветров, мы продолжаем подавать еду того же качества с тем же стремлением к аутентичности и инновациям, которые сделали нас знаменитыми.
                </p>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={historyImage}
                  alt="История ChicagoGO"
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
            <h2 className="text-4xl font-bold text-center mb-12">Растём вместе с Чикаго</h2>
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden mb-12">
              <Image
                src={storeImage}
                alt="Фасад магазина ChicagoGO"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-xl max-w-4xl mx-auto mb-8">
                От нашего флагманского магазина в Линкольн-Парке до нашего новейшего заведения в Вест-Луп, каждый ресторан ChicagoGO спроектирован как гостеприимное пространство, где оживает дух кулинарной культуры Чикаго.
              </p>
              <Link 
                href="/locations" 
                className="inline-block px-10 py-4 bg-red-600 text-white text-lg font-bold rounded-full hover:bg-red-700 transition-colors"
              >
                Найти ближайшее заведение
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
                  alt="Команда ChicagoGO"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Наша команда</h2>
                <p className="text-gray-600 mb-4">
                  За каждым великолепным блюдом стоит преданная команда любителей еды. Наши сотрудники, от опытных поваров до приветливого обслуживающего персонала, разделяют страсть к кулинарным традициям Чикаго и исключительному обслуживанию клиентов.
                </p>
                <p className="text-gray-600 mb-4">
                  Мы инвестируем в нашу команду через комплексные программы обучения и возможности карьерного роста, гарантируя, что каждый член семьи ChicagoGO может расти и добиваться успеха вместе с нами.
                </p>
                <Link 
                  href="/careers" 
                  className="inline-block px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors"
                >
                  Присоединиться к команде
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-red-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Присоединяйтесь к семье ChicagoGO</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Откройте для себя аутентичные вкусы Чикаго и станьте частью нашей истории.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/menu" 
                className="px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
              >
                Посмотреть меню
              </Link>
              <Link 
                href="/locations" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-red-600 transition-colors"
              >
                Найти заведение
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
