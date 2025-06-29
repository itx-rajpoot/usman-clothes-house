
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { currentUser, isAdmin } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        console.log('No such product!');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && currentUser && !isAdmin) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/products')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/products')} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="bg-amber-600 mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            </div>

            <div className="text-3xl font-bold text-amber-600">
              Rs. {product.price.toLocaleString()}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">
                Stock Available: {product.stock} pieces
              </span>
            </div>

            {currentUser && !isAdmin && product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="font-medium">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded px-3 py-1"
                  >
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}

            {product.stock === 0 && (
              <div className="text-red-600 font-medium">
                This product is currently out of stock.
              </div>
            )}

            {!currentUser && (
              <div className="text-gray-600">
                Please <a href="/login" className="text-amber-600 hover:underline">login</a> to add items to cart.
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
};

export default ProductDetail;
