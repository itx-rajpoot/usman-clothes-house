
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  senderId?: string; // optional for guests
  senderEmail: string;
  senderName?: string; // added name for guests
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

  // For guests (not logged in)
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestInfoSubmitted, setGuestInfoSubmitted] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-delete messages older than 2 days (same as before)
  useEffect(() => {
    const deleteOldMessages = async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      try {
        const q = query(collection(db, 'chats'), where('timestamp', '<', twoDaysAgo));
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map((docSnapshot) =>

          deleteDoc(doc(db, 'chats', docSnapshot.id))

        );
        await Promise.all(deletePromises);
        console.log('Old chat messages deleted');
      } catch (error) {
        console.error('Error deleting old messages:', error);
      }
    };


    const interval = setInterval(deleteOldMessages, 60 * 60 * 1000);
    deleteOldMessages();

    return () => clearInterval(interval);
  }, []);

  // Fetch messages based on user (admin or user or guest)
  useEffect(() => {
    // If user is logged in, normal behavior
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
    } else if (guestInfoSubmitted) {
      // For guests: fetch all messages with participants 'guest' and the guest email or something?
      // Since guests don't have uid, we'll just get all messages (or you can modify as needed)
      const messagesRef = collection(db, 'chats');
      const q = query(
        messagesRef,
        where('participants', 'array-contains', 'guest'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageList: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Message;

          // Only include messages for this guest email or admin replies
          if (data.senderEmail === guestEmail || data.isAdmin) {
            messageList.push({ id: doc.id, ...data });
          }
        });
        setMessages(messageList);
      });


      return unsubscribe;
    }
  }, [currentUser, isAdmin, guestInfoSubmitted]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (currentUser) {
        // logged-in user sending message
        await addDoc(collection(db, 'chats'), {
          text: message,
          senderId: currentUser.uid,
          senderEmail: currentUser.email,
          timestamp: new Date(),
          isAdmin: isAdmin,
          participants: [currentUser.uid, 'admin'],
        });
      } else if (guestInfoSubmitted) {
        // guest sending message
        await addDoc(collection(db, 'chats'), {
          text: message,
          senderEmail: guestEmail,
          senderName: guestName,
          timestamp: new Date(),
          isAdmin: false,
          participants: ['guest', 'admin'],
        });
      }
      setMessage('');
      setTimeout(scrollToBottom, 100); // Scroll to the latest message after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Guest info submit handler
  const handleGuestSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      guestName.trim() &&
      guestEmail.trim() &&
      emailRegex.test(guestEmail.trim())
    ) {
      setGuestInfoSubmitted(true);
    } else {
      alert('Please enter a valid name and email address.');
    }

  };



  if (!currentUser && !guestInfoSubmitted) {
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
          <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-amber-600">Enter your info</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-200 p-1 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Input
              placeholder="Your Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="mb-3"
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="mb-3"
            />
            <Button
              onClick={handleGuestSubmit}
              disabled={!guestName.trim() || !guestEmail.trim()}
              className="w-full"
            >
              Start Chat
            </Button>
          </div>
        )}
      </>
    );
  }

  // Default chat widget for logged in users or guests who submitted info
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
        <div
          className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl z-50 ${isMinimized ? 'h-12' : 'h-96'
            } transition-all duration-300`}
        >
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
                    className={`flex ${msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`max-w-xs p-2 rounded-lg ${msg.senderId === currentUser?.uid
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {/* Show email for admin messages */}
                      {isAdmin && msg.senderId !== currentUser?.uid && (
                        <p className="text-xs text-gray-500 mb-1">{msg.senderEmail}</p>
                      )}
                      {/* Show guest senderName if present */}
                      {!msg.senderId && msg.senderName && (
                        <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>
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
