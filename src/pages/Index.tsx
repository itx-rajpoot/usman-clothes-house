
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';

import ChatWidget from '../components/ChatWidget';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface SliderImage {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

const Index = () => {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: Product }>({});
  const { addToCart } = useCart();
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    fetchSliderImages();
    fetchFeaturedProducts();
    fetchCategoryProducts();
  }, []);

  const fetchSliderImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'sliders'));
      const images: SliderImage[] = [];
      querySnapshot.forEach((doc) => {
        images.push({ id: doc.id, ...doc.data() } as SliderImage);
      });
      setSliderImages(images);
    } catch (error) {
      console.error('Error fetching slider images:', error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const q = query(collection(db, 'products'), limit(8));
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchCategoryProducts = async () => {
    const categories = ['Lawn', 'Cotton', 'Silk', 'Chiffon', 'Linen'];
    const categoryProds: { [key: string]: Product } = {};

    for (const category of categories) {
      try {
        const q = query(
          collection(db, 'products'),
          where('category', '==', category),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          categoryProds[category] = { id: doc.id, ...doc.data() } as Product;
        });
      } catch (error) {
        console.error(`Error fetching ${category} products:`, error);
      }
    }
    setCategoryProducts(categoryProds);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  useEffect(() => {
    if (sliderImages.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [sliderImages.length]);

  const handleAddToCart = (product: Product) => {
    if (currentUser && !isAdmin) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Slider */}
      {sliderImages.length > 0 && (
        <section className="relative h-[500px] overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderImages.map((slide, index) => (
              <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                    <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                    <Link to="/products">
                      <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(categoryProducts).map(([category, product]) => (
              <Card key={category} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={category}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Link
                        to={`/products?category=${category}`}
                        className="bg-white text-gray-800 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-amber-50"
                      >
                        View {category}
                      </Link>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                    <p className="text-sm text-gray-600">Premium Quality</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-amber-600">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <div className="flex space-x-2">
                        <Link to={`/product/${product.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        {currentUser && !isAdmin && (
                          <Button
                            onClick={() => handleAddToCart(product)}
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/products">
              <Button className='hover:bg-amber-100' size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Store Info */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Visit Our Store</h2>
              <p className="text-gray-600 mb-6">
                Experience the finest collection of unstitched clothes at our physical store.
                Our expert staff will help you choose the perfect fabric for your needs.
              </p>
              <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Address:</span>
                  main street, Chak no. 60 RB, Balochani, District Faisalabad
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Hours:</span>
                  All Week: 9:00 AM - 7:00 PM, Friday: 9:00 AM - 12:00 PM then 3:00 PM - 7:00 PM
                </p>
                <p className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Phone:</span>
                  +92 344 0694754
                </p>
              </div>
              <div className="mt-6">
                <Link to="/contact">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Get Directions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">Why Choose Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Star className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Premium Quality</h4>
                    <p className="text-sm text-gray-600">Finest fabrics sourced directly</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Competitive Prices</h4>
                    <p className="text-sm text-gray-600">Best value for your money</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Expert Service</h4>
                    <p className="text-sm text-gray-600">Professional guidance and support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
};

export default Index;
