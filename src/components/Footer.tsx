
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-400">Usman Clothes House</h3>
            <p className="text-gray-300 mb-4">
              Your trusted destination for premium unstitched clothes. Quality fabrics, competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/+923046713045" className="text-green-400 hover:text-green-300">
                WhatsApp
              </a>
              <a href="https://www.facebook.com/profile.php?id=100055046491936" className="text-blue-400 hover:text-blue-300">
                Facebook
              </a>
              <a href="https://www.instagram.com/usmanrana616/#" className="text-pink-400 hover:text-pink-300">
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-amber-400">Home</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-amber-400">Products</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-amber-400">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-amber-400">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-gray-300">+92 304 671 3045 </span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-amber-400 mt-1" />
                <span className="text-gray-300">main street, Chak no. 60 RB, Balochani</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Store Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-gray-300">All Week: 9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-gray-300">Friday: 9:00 AM - 12:00 PM then 3:00 PM - 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Usman Clothes House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
