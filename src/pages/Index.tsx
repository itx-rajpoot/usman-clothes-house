
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
  mainCategory: string;
  category: string;
  description: string;
  stock: number;
}

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: Product }>({});
  const { addToCart } = useCart();
  const { currentUser, isAdmin } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchSliderImages();
    fetchFeaturedProducts();
    fetchCategoryProducts();
    fetchAllProducts();
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

  const fetchAllProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products: Product[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          image: data.image,
          mainCategory: data.mainCategory,
          category: data.category,
          description: data.description,
          stock: data.stock,
        });
      });
      setAllProducts(products);
    } catch (error) {
      console.error('Error fetching all products:', error);
    } finally {
      setLoading(false); // ✅ Only set loading false when everything is done
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      {/* Hero Slider */}
      {sliderImages.length > 0 && (
        <section className="relative h-[200px] xs:h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderImages.map((slide) => (
              <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-2 xs:px-4">
                  <div className="text-center text-white max-w-3xl w-full px-2">
                    <h1 className="text-lg xs:text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 xs:mb-2 sm:mb-3 md:mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-[10px] xs:text-xs sm:text-sm md:text-lg lg:text-xl mb-2 xs:mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                      {slide.subtitle}
                    </p>
                    <Link to="/products">
                      <Button
                        size="xs"
                        className="bg-amber-600 hover:bg-amber-700 text-[10px] xs:text-xs sm:text-sm md:text-base h-6 xs:h-7 sm:h-8 md:h-9 lg:h-10"
                      >
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-1 xs:left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1 xs:p-1.5 sm:p-2 rounded-full"
          >
            <ChevronLeft className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1 xs:right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1 xs:p-1.5 sm:p-2 rounded-full"
          >
            <ChevronRight className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          </button>
        </section>
        
      )}

      {/* Dynamic Main Category Sections */}
      {['Men', 'Women', 'Home Essentials'].map((mainCategory) => {
        const subCategories = {
          Men: ['Latha', 'Linen', 'Lawn', 'Wash and Wear', 'Others'],
          Women: ['Silk', 'Cotton', 'Chiffon', 'Lawn', 'Linen', 'Others'],
          'Home Essentials': ['Towels', 'Bedsheets', 'Others'],
        }[mainCategory];

        const productsInMain = allProducts.filter((p) => p.mainCategory === mainCategory);

        const subCategorySamples = subCategories
          .map((sub) => productsInMain.find((p) => p.category === sub))
          .filter(Boolean);

        return subCategorySamples.length === 0 ? null : (
          <section key={mainCategory} className="py-6 xs:py-8 sm:py-12 md:py-16 bg-white w-full">
            <div className="container mx-auto px-2 xs:px-3 sm:px-4 w-full">
              <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 xs:mb-6 sm:mb-8 md:mb-12 text-gray-800">
                {mainCategory} Collection
              </h2>
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6 w-full">
                {subCategorySamples.map((product) => (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-shadow duration-300 group w-full max-w-[300px] mx-auto"
                  >
                    <CardContent className="p-0 w-full">
                      <div className="relative overflow-hidden w-full aspect-[3/4]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-1 left-1 xs:top-1.5 xs:left-1.5 sm:top-2 sm:left-2">
                          <Badge className="bg-amber-600 text-[8px] xs:text-[10px] sm:text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-1 xs:p-2 sm:p-3 md:p-4 text-center w-full">
                        <h3 className="text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-[8px] xs:text-[10px] sm:text-xs text-gray-600 mb-1 xs:mb-2 sm:mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] xs:text-xs sm:text-sm md:text-base font-bold text-amber-600 whitespace-nowrap">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          <div className="flex space-x-1 xs:space-x-1.5 sm:space-x-2">
                            <Link to={`/product/${product.id}`} className="w-full">
                              <Button
                                variant="outline"
                                size="xs"
                                className="text-[8px] xs:text-[10px] sm:text-xs h-5 xs:h-6 sm:h-7 md:h-8 px-1 xs:px-1.5 sm:px-2"
                              >
                                View
                              </Button>
                            </Link>
                            {currentUser && !isAdmin && (
                              <Button
                                onClick={() => handleAddToCart(product)}
                                size="xs"
                                className="bg-amber-600 hover:bg-amber-700 p-0 h-5 xs:h-6 sm:h-7 md:h-8 w-5 xs:w-6 sm:w-7 md:w-8"
                              >
                                <ShoppingCart className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-3 xs:mt-4 sm:mt-6 md:mt-8 w-full">
                <Link to={`/products?mainCategory=${mainCategory}`} className="inline-block">
                  <Button
                    size="xs"
                    variant="outline"
                    className="hover:bg-amber-100 text-[10px] xs:text-xs sm:text-sm h-7 xs:h-8 sm:h-9 md:h-10 px-3 xs:px-4 sm:px-5"
                  >
                    View All {mainCategory}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* Store Info Section */}
      <section className="py-6 xs:py-8 sm:py-12 md:py-16 bg-amber-50 w-full">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 md:gap-12 items-center w-full">
            <div className="w-full">
              <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-3 xs:mb-4 sm:mb-5 md:mb-6 text-gray-800">
                Visit Our Store
              </h2>
              <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                Experience the finest collection of unstitched clothes at our physical store.
                Our expert staff will help you choose the perfect fabric for your needs.
              </p>
              <div className="space-y-1 xs:space-y-2 sm:space-y-3 text-[10px] xs:text-xs sm:text-sm md:text-base">
                <p className="flex items-start text-gray-700">
                  <span className="font-semibold mr-1 xs:mr-1.5 sm:mr-2 min-w-[50px] xs:min-w-[60px] sm:min-w-[70px]">Address:</span>
                  main street, Chak no. 60 RB, Balochani, District Faisalabad
                </p>
                <p className="flex items-start text-gray-700">
                  <span className="font-semibold mr-1 xs:mr-1.5 sm:mr-2 min-w-[50px] xs:min-w-[60px] sm:min-w-[70px]">Hours:</span>
                  All Week: 9:00 AM - 7:00 PM, Friday: 9:00 AM - 12:00 PM then 3:00 PM - 7:00 PM
                </p>
                <p className="flex items-start text-gray-700">
                  <span className="font-semibold mr-1 xs:mr-1.5 sm:mr-2 min-w-[50px] xs:min-w-[60px] sm:min-w-[70px]">Phone:</span>
                  +92 344 0694754
                </p>
              </div>
              <div className="mt-3 xs:mt-4 sm:mt-5 md:mt-6">
                <Link to="/contact" className="inline-block">
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-[10px] xs:text-xs sm:text-sm h-7 xs:h-8 sm:h-9 md:h-10 px-3 xs:px-4 sm:px-5"
                  >
                    Get Directions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg shadow-lg mt-4 xs:mt-5 sm:mt-6 md:mt-0 w-full">
              <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mb-2 xs:mb-3 sm:mb-4 text-center">
                Why Choose Us?
              </h3>
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4 text-[10px] xs:text-xs sm:text-sm md:text-base">
                <div className="flex items-start">
                  <Star className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-amber-500 mr-1 xs:mr-1.5 sm:mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Premium Quality</h4>
                    <p>Finest fabrics sourced directly</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-amber-500 mr-1 xs:mr-1.5 sm:mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Competitive Prices</h4>
                    <p>Best value for your money</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-amber-500 mr-1 xs:mr-1.5 sm:mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Expert Service</h4>
                    <p>Professional guidance and support</p>
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
