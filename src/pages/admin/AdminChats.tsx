
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, addDoc, query, orderBy, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  timestamp: any;
  isAdmin: boolean;
  participants: string[];
}

interface ChatUser {
  email: string;
  userId: string;
  lastMessage?: string;
  lastMessageTime?: any;
  unreadCount?: number;
}

const AdminChats = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const messagesRef = collection(db, 'chats');
      const q = query(
        messagesRef,
        where('participants', 'array-contains', selectedUser.userId),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageList: Message[] = [];
        snapshot.forEach((doc) => {
          messageList.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(messageList);
      });

      return unsubscribe;
    }
  }, [selectedUser]);

  // Auto-delete messages older than 2 days
  useEffect(() => {
    const deleteOldMessages = async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      try {
        const q = query(
          collection(db, 'chats'),
          where('timestamp', '<', twoDaysAgo)
        );

        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map(docSnapshot =>
          deleteDoc(doc(db, 'chats', docSnapshot.id))
        );

        await Promise.all(deletePromises);
        console.log('Old messages deleted');
      } catch (error) {
        console.error('Error deleting old messages:', error);
      }
    };

    // Run cleanup every hour
    const interval = setInterval(deleteOldMessages, 60 * 60 * 1000);
    deleteOldMessages(); // Run once immediately

    return () => clearInterval(interval);
  }, []);

  const fetchChatUsers = async () => {
    try {
      const chatsSnapshot = await getDocs(collection(db, 'chats'));
      const userMap = new Map<string, ChatUser>();

      chatsSnapshot.forEach((doc) => {
        const message = doc.data() as Message;
        if (!message.isAdmin && message.senderEmail) {
          const existing = userMap.get(message.senderId);
          if (!existing || (message.timestamp && message.timestamp > existing.lastMessageTime)) {
            userMap.set(message.senderId, {
              email: message.senderEmail,
              userId: message.senderId,
              lastMessage: message.text,
              lastMessageTime: message.timestamp
            });
          }
        }
      });

      setUsers(Array.from(userMap.values()));
    } catch (error) {
      console.error('Error fetching chat users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUser) return;

    try {
      await addDoc(collection(db, 'chats'), {
        text: newMessage,
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        timestamp: new Date(),
        isAdmin: true,
        participants: [currentUser.uid, selectedUser.userId]
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
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
          <div className="flex items-center">
            <Link to="/admin" className="mr-4">
              <Button variant="outline" className="text-amber-600 border-white hover:bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Customer Chats</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Conversations</CardTitle>
            </CardHeader>
            <Link to="/admin/contact-messages">
              <Button className="ml-4 bg-amber-700 hover:bg-amber-800 text-white">
                View Contact Messages
              </Button>
            </Link>

            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                {users.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations found
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.userId}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedUser?.userId === user.userId ? 'bg-amber-50' : ''
                        }`}
                    >
                      <div className="font-semibold">{user.email}</div>
                      {user.lastMessage && (
                        <div className="text-sm text-gray-600 truncate">
                          {user.lastMessage}
                        </div>
                      )}
                      {user.lastMessageTime && (
                        <div className="text-xs text-gray-400">
                          {formatDate(user.lastMessageTime)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  {selectedUser ? `Chat with ${selectedUser.email}` : 'Select a conversation'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-[500px]">
                {selectedUser ? (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-2 border rounded p-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs p-3 rounded-lg ${message.isAdmin
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {formatDate(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} className="bg-amber-600 hover:bg-amber-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a customer to start chatting
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChats;
