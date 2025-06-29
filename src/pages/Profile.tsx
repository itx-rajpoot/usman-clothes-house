import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { User, Package, Clock, X } from 'lucide-react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import ChatWidget from '../components/ChatWidget';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface Order {
  id: string;
  orderNumber: string;
  items: any[];
  total: number;
  status: string;
  createdAt: any;
  customerInfo: any;
  userId: string;
}

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
    }
  }, [currentUser]);

  const fetchUserOrders = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching orders for user:', currentUser.uid);

      const allOrdersSnapshot = await getDocs(collection(db, 'orders'));
      console.log('Total orders in database:', allOrdersSnapshot.size);

      const q = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const orderList: Order[] = [];

      querySnapshot.forEach((doc) => {
        const orderData = { id: doc.id, ...doc.data() } as Order;
        console.log('User order found:', orderData);
        orderList.push(orderData);
      });

      console.log('Total user orders found:', orderList.length);
      setOrders(orderList);
    } catch (error) {
      console.error('Error fetching orders:', error);

      try {
        console.log('Retrying without orderBy...');
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const orderList: Order[] = [];

        querySnapshot.forEach((doc) => {
          const orderData = { id: doc.id, ...doc.data() } as Order;
          orderList.push(orderData);
        });

        orderList.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        console.log('Orders fetched without orderBy:', orderList.length);
        setOrders(orderList);
      } catch (retryError) {
        console.error('Retry also failed:', retryError);
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again later.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(orders.filter(order => order.id !== orderId));
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'delivering': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const canCancelOrder = (status: string) => {
    return status === 'pending';
  };

  const handleResetPassword = async () => {
    if (!currentUser?.email) {
      toast({
        title: "Error",
        description: "No email associated with this account.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      toast({
        title: "Password Reset Email Sent",
        description: `An email has been sent to ${currentUser.email} with instructions to reset your password.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{currentUser?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-gray-800">
                    {currentUser?.metadata?.creationTime ?
                      new Date(currentUser.metadata.creationTime).toLocaleDateString() :
                      'N/A'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleResetPassword}
                    variant="secondary"
                    className="w-full bg-amber-400 hover:bg-amber-500 text-white"
                  >
                    Reset Password
                  </Button>

                  <Button
                    onClick={logout}
                    variant="outline"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order History ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No orders found</p>
                    <p className="text-sm text-gray-400 mt-2">Your orders will appear here after checkout</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-amber-600">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold">Order #{order.orderNumber}</p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.toUpperCase()}
                              </Badge>
                              {canCancelOrder(order.status) && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="h-6 px-2"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>

                          {order.customerInfo && (
                            <div className="text-xs text-gray-500 mb-3 p-2 bg-gray-50 rounded">
                              <p><strong>Name:</strong> {order.customerInfo.fullName}</p>
                              <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                              <p><strong>Address:</strong> {order.customerInfo.address}, {order.customerInfo.city}</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-amber-600">
                              Rs. {order.total?.toLocaleString() || 0}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
};

export default Profile;
