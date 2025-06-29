
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  timestamp: any;
  isAdmin: boolean;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentUser, isAdmin } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        console.log('Old chat messages deleted');
      } catch (error) {
        console.error('Error deleting old messages:', error);
      }
    };

    // Run cleanup every hour
    const interval = setInterval(deleteOldMessages, 60 * 60 * 1000);
    deleteOldMessages(); // Run once immediately

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const messagesRef = collection(db, 'chats');
      let q;
      
      if (isAdmin) {
        q = query(messagesRef, orderBy('timestamp', 'asc'));
      } else {
        q = query(
          messagesRef,
          where('participants', 'array-contains', currentUser.uid),
          orderBy('timestamp', 'asc')
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageList: Message[] = [];
        snapshot.forEach((doc) => {
          messageList.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(messageList);
      });

      return unsubscribe;
    }
  }, [currentUser, isAdmin]);

  const sendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'chats'), {
        text: message,
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        timestamp: new Date(),
        isAdmin: isAdmin,
        participants: [currentUser.uid, 'admin']
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 shadow-lg z-50 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50 ${isMinimized ? 'h-12' : 'h-96'} transition-all duration-300`}>
          <div className="flex items-center justify-between p-3 bg-amber-600 text-white rounded-t-lg">
            <h3 className="font-semibold">
              {isAdmin ? 'Customer Support' : 'Chat with Admin'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-amber-700 p-1 rounded"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-amber-700 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-64 overflow-y-auto p-3 space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-2 rounded-lg ${
                        msg.senderId === currentUser.uid
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {isAdmin && msg.senderId !== currentUser.uid && (
                        <p className="text-xs text-gray-500 mb-1">{msg.senderEmail}</p>
                      )}
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
