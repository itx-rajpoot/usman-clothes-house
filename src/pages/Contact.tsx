
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import ChatWidget from '../components/ChatWidget';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: new Date(),
        status: 'unread'
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Get in touch with us for any questions, orders, or assistance.
            We're here to help you find the perfect fabrics.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Get In Touch</h2>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Visit Our Store</h3>
                      <p className="text-gray-600">
                        main street, Chak no. 60 RB, Balochani,<br />
                        District Faisalabad, Pakistan<br />
                        Postal Code: 37631
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Mobile: +92 344 0694754</p>
                        <p>WhatsApp: <a href="https://wa.me/923046713045" target="_blank">+92 304 6713045</a></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>General: ranasaab6210@gmail.com</p>

                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>All Week: 9:00 AM - 7:00 PM</p>
                        <p>Friday: 9:00 AM - 12:00 PM then 3:00 PM - 7:00 PM</p>
                        <p className="text-sm text-amber-600 mt-2">
                          *Closed on major public holidays
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
                      <p className="text-gray-600 mb-3">
                        Need immediate assistance? Use our live chat feature
                        available in the bottom right corner of the page.
                      </p>
                      <p className="text-sm text-amber-700">
                        Chat available during business hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Media & Additional Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Follow Us</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay connected with us on social media for the latest updates,
            new arrivals, and special offers.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=100055046491936"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-4 rounded-full"
            >
              <span className="font-semibold">Facebook</span>
            </a>

            <a
              href="https://www.instagram.com/usmanrana616"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 text-white p-4 rounded-full"
            >
              <span className="font-semibold">Instagram</span>
            </a>

            <a
              href="https://wa.me/923046713045"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white p-4 rounded-full"
            >
              <span className="font-semibold">WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      <ChatWidget />
    </div>
  );
};

export default Contact;
