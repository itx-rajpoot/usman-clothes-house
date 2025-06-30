
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-amber-800 transition duration-300 hover:scale-105 hover:text-amber-700">
            <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            <span>Usman Clothes House</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-amber-800 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-amber-800 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-amber-800 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-amber-800 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser && !isAdmin && (
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-amber-800" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-2">
                {isAdmin ? (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/profile">
                    <User className="h-6 w-6 text-gray-700 hover:text-amber-800" />
                  </Link>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-700 hover:text-amber-800 py-2">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-amber-800 py-2">
                Products
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-amber-800 py-2">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-amber-800 py-2">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
