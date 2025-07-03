import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ShoppingCart, Search } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

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

const Products = () => {
  const mainCategoryOptions = ['All', 'Men', 'Women', 'Home Essentials'];

  const subCategoryOptions: { [key: string]: string[] } = {
    Men: ['Latha', 'Linen', 'Lawn', 'Wash and Wear', 'Others'],
    Women: ['Silk', 'Cotton', 'Chiffon', 'Lawn', 'Linen', 'Others'],
    'Home Essentials': ['Towels', 'Bedsheets', 'Others'],
  };

  const [mainCategory, setMainCategory] = useState('All');
  const [subCategory, setSubCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCategories();

    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, mainCategory, subCategory]);

  const fetchCategories = async () => {
    try {
      const categoryList = ['all'];
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productCategories = new Set<string>();
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        if (product.category) {
          productCategories.add(product.category);
        }
      });

      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      categoriesSnapshot.forEach((doc) => {
        const categoryData = doc.data();
        if (categoryData.name) {
          productCategories.add(categoryData.name);
        }
      });

      categoryList.push(...Array.from(productCategories).sort());
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'products'), orderBy('name')));
      const productList: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        productList.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          image: data.image,
          mainCategory: data.mainCategory || '',
          category: data.category,
          description: data.description,
          stock: data.stock,
        });
      });
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (mainCategory !== 'All') {
      filtered = filtered.filter(product => product.mainCategory === mainCategory);
    }

    if (subCategory !== 'All' && mainCategory !== 'All') {
      filtered = filtered.filter(product => product.category === subCategory);
    }

    if (searchTerm.trim() === '' && mainCategory === 'All' && subCategory === 'All') {
      const ordered: Product[] = [];
      const pushOrdered = (group: string) => {
        const groupProducts = filtered.filter(p => p.mainCategory === group);
        ordered.push(...groupProducts);
      };

      pushOrdered('Men');
      pushOrdered('Women');
      pushOrdered('Home Essentials');

      const others = filtered.filter(
        (p) => !['Men', 'Women', 'Home Essentials'].includes(p.mainCategory)
      );
      ordered.push(...others);

      setFilteredProducts(ordered);
    } else {
      setFilteredProducts(filtered);
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-gray-800">
          Our Products
        </h1>

        {/* Search and Filter */}
        <div className="bg-white p-2 sm:p-4 rounded-md shadow-sm">
          <div className="flex flex-col md:flex-row gap-2 sm:gap-4 mb-4 sm:mb-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-xs sm:text-sm md:text-base h-8 sm:h-10"
              />
            </div>

            {/* Main Category */}
            <Select
              value={mainCategory}
              onValueChange={(value) => {
                setMainCategory(value);
                setSubCategory('All');
              }}
            >
              <SelectTrigger className="w-full md:w-48 text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="Main Category" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md z-50">
                {mainCategoryOptions.map((main) => (
                  <SelectItem key={main} value={main} className="text-xs sm:text-sm">
                    {main}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subcategory (Only if applicable) */}
            {mainCategory !== 'All' && (
              <Select value={subCategory} onValueChange={setSubCategory}>
                <SelectTrigger className="w-full md:w-48 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md z-50">
                  <SelectItem value="All" className="text-xs sm:text-sm">
                    All
                  </SelectItem>
                  {subCategoryOptions[mainCategory]?.map((sub) => (
                    <SelectItem key={sub} value={sub} className="text-xs sm:text-sm">
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>


        {/* Products Grid */}
        {searchTerm.trim() === '' && mainCategory === 'All' && subCategory === 'All' ? (
          <>
            {['Men', 'Women', 'Home Essentials'].map((group) => {
              const groupProducts = filteredProducts.filter(p => p.mainCategory === group);
              if (groupProducts.length === 0) return null;
              return (
                <div key={group} className="mb-8 sm:mb-12">
                  <h2 className="text-xl sm:text-2xl font-bold my-2 sm:mb-4 text-gray-700">
                    {group}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                    {groupProducts.map((product) => (
                      <Card key={product.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative aspect-[3/4]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-amber-600 text-[8px] sm:text-xs">
                              {product.category}
                            </Badge>
                            {product.stock === 0 && (
                              <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-600 text-[8px] sm:text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <div className="p-2 sm:p-4">
                            <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-[10px] sm:text-xs mb-2 sm:mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <span className="text-xs sm:text-sm md:text-base font-bold text-amber-600">
                                Rs. {product.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] sm:text-xs text-gray-500">
                                Stock: {product.stock}
                              </span>
                            </div>
                            <div className="flex space-x-1 sm:space-x-2">
                              <Link to={`/product/${product.id}`} className="flex-1">
                                <Button
                                  variant="outline"
                                  className="w-full text-[10px] sm:text-xs h-6 sm:h-8 md:h-9 px-1 sm:px-2"
                                >
                                  View
                                </Button>
                              </Link>
                              {currentUser && !isAdmin && product.stock > 0 && (
                                <Button
                                  onClick={() => handleAddToCart(product)}
                                  className="bg-amber-600 hover:bg-amber-700 h-6 sm:h-8 md:h-9 w-6 sm:w-8 md:w-9 p-0"
                                >
                                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-amber-600 text-[8px] sm:text-xs">
                      {product.category}
                    </Badge>
                    {product.stock === 0 && (
                      <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-600 text-[8px] sm:text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <div className="p-2 sm:p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-[10px] sm:text-xs mb-2 sm:mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm md:text-base font-bold text-amber-600">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2">
                      <Link to={`/product/${product.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full text-[10px] sm:text-xs h-6 sm:h-8 md:h-9 px-1 sm:px-2"
                        >
                          View
                        </Button>
                      </Link>
                      {currentUser && !isAdmin && product.stock > 0 && (
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="bg-amber-600 hover:bg-amber-700 h-6 sm:h-8 md:h-9 w-6 sm:w-8 md:w-9 p-0"
                        >
                          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base md:text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <ChatWidget />
    </div>
  );
};

export default Products;





