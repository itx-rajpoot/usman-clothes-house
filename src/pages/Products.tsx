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
  category: string;
  description: string;
  stock: number;
}

const Products = () => {
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
    
    // Check if there's a category filter from URL
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const categoryList = ['all'];
      
      // Get categories from products
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productCategories = new Set<string>();
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        if (product.category) {
          productCategories.add(product.category);
        }
      });
      
      // Get custom categories
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
        productList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
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
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Products</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                  {product.stock === 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-600">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-amber-600">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {currentUser && !isAdmin && product.stock > 0 && (
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      <ChatWidget />
    </div>
  );
};

export default Products;
