// src/pages/AdminContactMessages.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: any;
}

const AdminContactMessages = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'contacts'));
      const data: Contact[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Contact);
      });
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'contacts', id), {
        status: 'read',
      });
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === id ? { ...contact, status: 'read' } : contact
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-600 text-white py-6">
        <div className="container mx-auto px-4 flex items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="hover:text-amber-600 text-white border-white hover:bg-white mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : contacts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No contact messages found.</div>
        ) : (
          contacts.map((contact) => (
            <Card key={contact.id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{contact.subject}</CardTitle>
                <p className="text-sm text-gray-500">{formatDate(contact.createdAt)}</p>
              </CardHeader>
              <CardContent>
                <p><strong>Name:</strong> {contact.name}</p>
                <p><strong>Email:</strong> {contact.email}</p>
                <p><strong>Phone:</strong> {contact.phone}</p>
                <p><strong>Message:</strong> {contact.message}</p>
                <p><strong>Status:</strong> <span className={contact.status === 'unread' ? 'text-red-600' : 'text-green-600'}>{contact.status}</span></p>
                {contact.status === 'unread' && (
                  <Button
                    onClick={() => markAsRead(contact.id)}
                    className="mt-4 bg-amber-600 hover:bg-amber-700 text-white w-full"
                  >
                    Mark as Read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminContactMessages;
