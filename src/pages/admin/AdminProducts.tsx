
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft, Tag } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface Product {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  mainCategory: string;
  category: string;
  description: string;
  stock: number;
}

const AdminProducts = () => {

  const subCategoryOptions: { [key: string]: string[] } = {
    Men: ['Latha', 'Linen', 'Lawn', 'Wash and Wear', 'Others'],
    Women: ['Silk', 'Cotton', 'Chiffon', 'Lawn', 'Linen', 'Others'],
    'Home Essentials': ['Towels', 'Bedsheets', 'Others'],
  };



  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Lawn', 'Cotton', 'Silk', 'Chiffon', 'Linen', 'Others']);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    price: '',
    image: '',
    mainCategory: '',
    category: '',
    description: '',
    stock: ''
  });

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoryList: string[] = ['Lawn', 'Cotton', 'Silk', 'Chiffon', 'Linen', 'Others'];
      querySnapshot.forEach((doc) => {
        const categoryData = doc.data();
        if (categoryData.name && !categoryList.includes(categoryData.name)) {
          categoryList.push(categoryData.name);
        }
      });
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addCustomCategory = async () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      try {
        await setDoc(doc(db, 'categories', customCategory.trim().toLowerCase()), {
          name: customCategory.trim(),
          createdAt: new Date()
        });
        setCategories([...categories, customCategory.trim()]);
        setFormData({ ...formData, category: customCategory.trim() });
        setCustomCategory('');
        setShowCustomCategory(false);
        toast({
          title: "Category Added!",
          description: "New category has been added successfully.",
        });
      } catch (error) {
        console.error('Error adding category:', error);
        toast({
          title: "Error",
          description: "Failed to add category. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        productId: formData.productId,
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        mainCategory: formData.mainCategory, // ADD THIS
        category: formData.category,
        description: formData.description,
        stock: parseInt(formData.stock)
      };


      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        toast({
          title: "Product Updated!",
          description: "Product has been updated successfully.",
        });
      } else {
        await addDoc(collection(db, 'products'), productData);
        toast({
          title: "Product Added!",
          description: "New product has been added successfully.",
        });
      }

      setDialogOpen(false);
      setEditingProduct(null);
      setFormData({
        productId: '',
        name: '',
        price: '',
        image: '',
        mainCategory: '',
        category: '',
        description: '',
        stock: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: Product) => {
    const mainCategory = product.mainCategory || '';
    const defaultSubcategories =
      subCategoryOptions[mainCategory as keyof typeof subCategoryOptions] || [];

    setEditingProduct(product);
    setFormData({
      productId: product.productId || '',
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      mainCategory: mainCategory,
      category: product.category,
      description: product.description,
      stock: product.stock.toString()
    });

    if (product.category && !defaultSubcategories.includes(product.category)) {
      setShowCustomCategory(true);
      setCustomCategory(product.category);
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
    }

    setDialogOpen(true);
  };




  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        toast({
          title: "Product Deleted!",
          description: "Product has been deleted successfully.",
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      productId: '',
      name: '',
      price: '',
      image: '',
      category: '',
      mainCategory: '',
      description: '',
      stock: ''
    });
    setShowCustomCategory(false);
    setCustomCategory('');
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'Others') {
      setShowCustomCategory(true);
      setFormData({ ...formData, category: '' });
    } else {
      setShowCustomCategory(false);
      setFormData({ ...formData, category: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/admin" className="mr-4">
                <Button variant="outline" className="hover:text-amber-600 text-white border-white hover:bg-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Manage Products</h1>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:text-amber-600 text-white border-white hover:bg-white"
                  onClick={resetForm}
                >
                  <Plus className="h-4 w-4 mr-2 " />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="text-white max-w-full sm:max-w-2xl px-4">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="productId">Product ID *</Label>
                      <Input
                        className="text-black"
                        id="productId"
                        name="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., P001, SKU123"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        className="text-black"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="price">Price (Rs.) *</Label>
                      <Input
                        className="text-black"
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        className="text-black"
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL *</Label>
                    <Input
                      className="text-black"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mainCategory">Main Category *</Label>
                    <Select
                      value={formData.mainCategory}
                      onValueChange={(value) => {
                        setFormData({ ...formData, mainCategory: value, category: '' });
                        setShowCustomCategory(false); // reset custom
                      }} >
                      <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-amber-500">
                        <SelectValue placeholder="Select main category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md text-black">
                        {Object.keys(subCategoryOptions).map((main) => (
                          <SelectItem key={main} value={main}>
                            {main}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.mainCategory && (
                    <div className="mt-4">
                      <Label htmlFor="category">Subcategory *</Label>
                      <Select value={formData.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-black focus:ring-2 focus:ring-amber-500">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md text-black">
                          {subCategoryOptions[formData.mainCategory]?.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {showCustomCategory && (
                        <div className="mt-2 flex gap-2">
                          <Input
                            className="text-black"
                            placeholder="Enter custom category"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                          />
                          <Button
                            type="button"
                            onClick={addCustomCategory}
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}


                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      className="text-black"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-amber-600">
                    {product.category}
                  </Badge>
                  {product.productId && (
                    <Badge className="absolute top-2 right-2 bg-blue-600">
                      ID: {product.productId}
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge className="absolute bottom-2 right-2 bg-red-600">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <div className="p-3 sm:p-4">
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
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <Button
                      onClick={() => handleEdit(product)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found. Add your first product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
