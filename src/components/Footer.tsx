import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-0 sm:px-4 py-6 sm:py-12">
        {/* Mobile layout (no left margin) */}
        <div className="md:hidden pl-0">
          <div className="flex flex-col space-y-8 px-4">
            {/* Company Info */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3 text-amber-400">
                Usman Clothes House
              </h3>
              <p className="text-gray-300 mb-4">
                Premium unstitched clothes at great prices.
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://wa.me/+923046713045"
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  WhatsApp
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100055046491936"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/usmanrana616/#"
                  className="text-pink-400 hover:text-pink-300 text-sm"
                >
                  Instagram
                </a>
              </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-2 gap-4">
              {/* Quick Links */}
              <div>
                <h4 className="text-base font-semibold mb-3 pl-2">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-amber-400 block pl-2">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/products" className="text-gray-300 hover:text-amber-400 block pl-2">
                      Products
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-gray-300 hover:text-amber-400 block pl-2">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-300 hover:text-amber-400 block pl-2">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-base font-semibold mb-3 pl-2">
                  Contact
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start pl-2">
                    <Phone className="h-4 w-4 mr-2 mt-0.5 text-amber-400" />
                    <span className="text-gray-300">+92 304 671 3045</span>
                  </div>
                  <div className="flex items-start pl-2">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-amber-400" />
                    <span className="text-gray-300">
                      Chak 60 RB, Balochani
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div className="text-center">
              <h4 className="text-base font-semibold mb-3">Store Hours</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-center items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-400" />
                  <span className="text-gray-300">All Week: 9 AM – 7 PM</span>
                </div>
                <div className="flex justify-center items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-400" />
                  <span className="text-gray-300">Fri: 9–12 PM & 3–7 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Original desktop layout (completely unchanged) */}
        <div className="hidden md:grid grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-amber-400">
              Usman Clothes House
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-2 sm:mb-4">
              Your trusted destination for premium unstitched clothes. Quality fabrics, competitive prices.
            </p>
            <div className="flex flex-wrap gap-3 text-sm sm:text-base">
              <a
                href="https://wa.me/+923046713045"
                className="text-green-400 hover:text-green-300"
              >
                WhatsApp
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100055046491936"
                className="text-blue-400 hover:text-blue-300"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/usmanrana616/#"
                className="text-pink-400 hover:text-pink-300"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li>
                <a href="/" className="text-gray-300 hover:text-amber-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-amber-400">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-amber-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-amber-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">
              Contact Info
            </h4>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-gray-300">+92 304 671 3045</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-amber-400" />
                <span className="text-gray-300">
                  Chak 60 RB, Balochani
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Store Hours</h4>
            <div className="space-y-2 text-base">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-gray-300">All Week: 9 AM – 7 PM</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-gray-300">Fri: 9–12 PM & 3–7 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-8 text-center text-sm sm:text-base">
          <p className="text-gray-400">
            © 2025 Usman Clothes House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;