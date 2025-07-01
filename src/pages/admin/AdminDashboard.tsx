
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Package, ShoppingCart, Users, MessageSquare, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
    unreadChats: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products count
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const totalProducts = productsSnapshot.size;

      // Fetch orders count
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const totalOrders = ordersSnapshot.size;

      // Fetch pending orders count
      const pendingOrdersSnapshot = await getDocs(
        query(collection(db, 'orders'), where('status', '==', 'pending'))
      );
      const pendingOrders = pendingOrdersSnapshot.size;

      // Fetch users count
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Fetch unread chats count
      const chatsSnapshot = await getDocs(collection(db, 'chats'));
      const unreadChats = chatsSnapshot.size;

      setStats({
        totalProducts,
        totalOrders,
        pendingOrders,
        totalUsers,
        unreadChats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
      {/* Header */}
      <div className="bg-amber-600 text-white py-6 px-4 sm:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Admin Dashboard</h1>
          <Link to="/">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-amber-600 transition-colors flex items-center justify-center w-full sm:w-auto px-4 py-2"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {[ /* repeated cards here */].map((card) => (
            <Card key={card.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  {card.icon}
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{card.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Each quick action card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Package className="h-5 w-5 mr-2 text-amber-600" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Manage your product inventory
              </p>
              <Link to="/admin/products">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 py-2 sm:py-3 text-sm sm:text-base">
                  Manage Products
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Repeat similar for Orders, Chats, Sliders with proper icons and colors */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">View and manage orders</p>
              <Link to="/admin/orders">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 py-2 sm:py-3 text-sm sm:text-base">
                  Manage Orders
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                Chats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Customer communications</p>
              <Link to="/admin/chats">
                <Button className="w-full bg-green-600 hover:bg-green-700 py-2 sm:py-3 text-sm sm:text-base">
                  View Chats
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Eye className="h-5 w-5 mr-2 text-purple-600" />
                Sliders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">Manage homepage sliders</p>
              <Link to="/admin/sliders">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 py-2 sm:py-3 text-sm sm:text-base">
                  Manage Sliders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

};

export default AdminDashboard;
