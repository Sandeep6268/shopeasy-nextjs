import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Toaster from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopEasy - Your Favorite Online Store',
  description: 'Discover amazing products at great prices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </div>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}