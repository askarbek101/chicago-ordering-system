import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "ChicagoGO - Chicago's Finest Fast Food",
  description:
    "Authentic Chicago-style burgers, hot dogs, and Italian beef sandwiches. Order online for pickup or delivery.",
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
          variables: { colorPrimary: "#DC2626" }, // Red-600 for Chicago theme
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
        <body className="font-sans min-h-screen flex flex-col antialiased">
          {children}
          <Toaster position="bottom-center" />
        </body>
      </ClerkProvider>
    </html>
  );
}
