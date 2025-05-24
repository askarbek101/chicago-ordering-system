import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { ClientLayout } from './components/ClientLayout';

export const metadata: Metadata = {
  title: "ChicagoGO - Лучший Фастфуд Чикаго",
  description:
    "Аутентичные бургеры, хот-доги и сэндвичи с итальянской говядиной в стиле Чикаго. Заказывайте онлайн с самовывозом или доставкой.",
  openGraph: { images: ["/og-image.jpg"] },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <ClerkProvider
        appearance={{
          variables: { colorPrimary: "#DC2626" },
          elements: {
            formButtonPrimary:
              "bg-red-600 border border-red-600 border-solid hover:bg-white hover:text-red-600",
            socialButtonsBlockButton:
              "bg-white border-gray-200 hover:bg-transparent hover:border-red-600 text-gray-600 hover:text-red-600",
            socialButtonsBlockButtonText: "font-semibold",
            formButtonReset:
              "bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-red-600 text-gray-500 hover:text-red-600",
            card: "bg-white shadow-md rounded-xl",
          },
        }}
      >
        <ClientLayout>
          {children}
          <Toaster position="bottom-center" />
        </ClientLayout>
      </ClerkProvider>
    </html>
  );
}
