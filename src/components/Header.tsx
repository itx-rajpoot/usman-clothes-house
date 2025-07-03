
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import logo from '../assets/logo.png';
import './header.css';

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
    <header className="bg-white shadow-md sticky top-0 z-50 w-full overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 w-full overflow-hidden">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-amber-800 transition duration-300 hover:scale-105 hover:text-amber-700 text-base sm:text-xl truncate"
          >
            <img src={logo} alt="Logo" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
            <span className="text-base sm:text-xl font-bold text-amber-800 whitespace-nowrap">
              Usman Clothes House
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4 text-md">
            {['Home', 'Products', 'About', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-gray-700 hover:text-amber-800"
              >
                {item}
              </Link>
            ))}
          </nav>


          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart */}
            {currentUser && !isAdmin && (
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 hover:text-amber-800" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Section */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {isAdmin ? (
                  <Link to="/admin">
                    <Button size="sm" variant="outline" className="text-xs sm:text-sm px-2">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/profile">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 hover:text-amber-800" />
                  </Link>
                )}
                <Button onClick={handleLogout} size="sm" variant="outline" className="text-xs sm:text-sm px-2">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-1">
                <Link to="/login">
                  <Button variant="outline" className="text-xs px-2 sm:text-sm text-amber-800 hover:bg-amber-100" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white px-2" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Hamburger Icon */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
            <nav className="flex flex-col p-4 space-y-3 text-sm">
              {['Home', 'Products', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-amber-800"
                >
                  {item}
                </Link>
              ))}

              {currentUser && !isAdmin && (
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-700 hover:text-amber-800">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart ({cartItemsCount})
                </Link>
              )}

              {/* Auth (mobile view) */}
              {currentUser ? (
                <div className="space-y-2">
                  {isAdmin ? (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full text-xs">Dashboard</Button>
                    </Link>
                  ) : (
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-700 hover:text-amber-800">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  )}
                  <Button onClick={handleLogout} variant="outline" className="w-full text-xs">Logout</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-amber-800 hover:bg-amber-100 text-xs">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
