'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCartIcon, 
  Bars3Icon, 
  XMarkIcon,
  HeartIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '@/components/search/SearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, isLoading, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  // Safe user display name
  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Safe user email display
  const getUserEmail = () => {
    return user?.email || '';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-2xl font-bold text-gray-900">ShopEasy</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition duration-200">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-gray-900 font-medium transition duration-200">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900 font-medium transition duration-200">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium transition duration-200">
              About
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Icon */}
            {/* {user && (
              <Link 
                href="/wishlist" 
                className="p-2 text-gray-700 hover:text-blue-600 transition duration-200 relative"
                title="Wishlist"
              >
                <HeartIcon className="h-6 w-6" />
              </Link>
            )} */}

            {/* Cart Icon */}
            <Link 
              href="/cart" 
              className="p-2 text-gray-700 hover:text-blue-600 transition duration-200 relative"
              title="Shopping Cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-medium">
                  {cart.itemCount > 99 ? '99+' : cart.itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {isLoading ? (
                // Loading skeleton
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="hidden lg:block">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              ) : user ? (
                // Authenticated user
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">
                        {getInitials(user.name, user.email)}
                      </span>
                    </div>
                    <div className="hidden lg:flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                        {getUserDisplayName()}
                      </span>
                      <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {getUserEmail()}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircleIcon className="h-4 w-4 mr-3" />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HeartIcon className="h-4 w-4 mr-3" />
                          My Wishlist
                        </Link>
                      </div>

                      {/* Admin Section */}
                      {user.role === 'admin' && (
                        <div className="py-2 border-t border-gray-100">
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin Dashboard
                          </Link>
                        </div>
                      )}

                      {/* Sign Out */}
                      <div className="py-2 border-t border-gray-100">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                        >
                          <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Not authenticated - Sign In/Sign Up buttons
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-gray-900 font-medium transition duration-200 hidden sm:block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-sm hidden sm:block"
                  >
                    Sign Up
                  </Link>
                  
                  {/* Mobile auth button */}
                  <Link
                    href="/auth/signin"
                    className="sm:hidden p-2 text-gray-700 hover:text-gray-900"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4 border-t border-gray-200 pt-4">
          <SearchBar />
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Mobile Auth Links */}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <>
                    <div className="px-2 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {getUserEmail()}
                      </p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Wishlist
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="block text-purple-700 hover:text-purple-600 font-medium py-2 transition duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-red-600 hover:text-red-500 font-medium py-2 transition duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth/signin" 
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="block text-blue-600 hover:text-blue-700 font-medium py-2 transition duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}