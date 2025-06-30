
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Phone, Mail, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
  };
  items: any[];
  total: number;
  status: string;
  createdAt: any;
}

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'delivering', label: 'Delivering' },
    { value: 'delivered', label: 'Delivered' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const orderList: Order[] = [];
      querySnapshot.forEach((doc) => {
        orderList.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(orderList);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast({
        title: "Order Updated!",
        description: `Order status changed to ${newStatus}.`,
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        toast({
          title: "Order Deleted!",
          description: "Order has been deleted successfully.",
        });
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast({
          title: "Error",
          description: "Failed to delete order.",
          variant: "destructive"
        });
      }
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
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

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
                <Button variant="outline" className="border-white hover:bg-white hover:text-amber-600 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Manage Orders</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 bg-white border border-gray-300 shadow-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border border-gray-200">
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-amber-100 hover:text-amber-700 cursor-pointer pl-10 pr-4 py-2 rounded-md transition-colors duration-200"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-amber-600">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Placed on: {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.toUpperCase()}
                    </Badge>
                    <Button
                      onClick={() => deleteOrder(order.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div>
                    <h4 className="font-semibold mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {order.customerInfo.fullName}</p>
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {order.customerInfo.email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {order.customerInfo.phone}
                      </p>
                      <p><strong>Address:</strong> {order.customerInfo.address}</p>
                      <p><strong>City:</strong> {order.customerInfo.city}</p>
                      {order.customerInfo.postalCode && (
                        <p><strong>Postal Code:</strong> {order.customerInfo.postalCode}</p>
                      )}
                      {order.customerInfo.notes && (
                        <p><strong>Notes:</strong> {order.customerInfo.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-amber-600">Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="mt-6 flex space-x-2">
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="delivering">Delivering</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>

                  <a href={`https://wa.me/${order.customerInfo.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="text-green-600">
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filterStatus === 'all' ? 'No orders found.' : `No ${filterStatus} orders found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
