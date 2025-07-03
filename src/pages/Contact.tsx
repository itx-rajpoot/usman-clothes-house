
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
      {/* Hero Section - Mobile optimized */}
      <section className="bg-amber-600 text-white py-8 px-4 sm:py-16 sm:px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold mb-3 sm:text-4xl sm:mb-4">Contact Us</h1>
          <p className="text-sm max-w-xl mx-auto sm:text-xl">
            Get in touch for questions or orders. We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-8 px-4 sm:py-16 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Contact Information - Mobile optimized */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 sm:text-3xl sm:mb-8">Get In Touch</h2>

              <Card className="sm:hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-base mb-1">Our Store</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Chak no. 60 RB, Balochani, Faisalabad
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hidden sm:block">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Visit Our Store</h3>
                      <p className="text-gray-600 text-base leading-relaxed">
                        main street, Chak no. 60 RB, Balochani,<br />
                        District Faisalabad, Pakistan<br />
                        Postal Code: 37631
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-base mb-1">Call Us</h3>
                      <div className="text-gray-600 text-xs space-y-0.5 leading-relaxed">
                        <p>+92 344 0694754</p>
                        <p>
                          <a href="https://wa.me/923046713045" target="_blank" rel="noreferrer" className="underline text-amber-600">
                            WhatsApp
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hidden sm:block">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                      <div className="text-gray-600 text-base space-y-0.5 leading-relaxed">
                        <p>Mobile: +92 344 0694754</p>
                        <p>
                          WhatsApp: <a href="https://wa.me/923046713045" target="_blank" rel="noreferrer" className="underline text-amber-600">+92 304 6713045</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Continue this pattern for other cards */}
              <Card className="sm:hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-base mb-1">Email</h3>
                      <div className="text-gray-600 text-xs leading-relaxed">
                        <p>ranasaab6210@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hidden sm:block">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                      <div className="text-gray-600 text-base leading-relaxed">
                        <p>General: ranasaab6210@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="sm:hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-base mb-1">Hours</h3>
                      <div className="text-gray-600 text-xs space-y-0.5 leading-relaxed">
                        <p>9 AM - 7 PM</p>
                        <p>Fri: 9-12 & 3-7 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hidden sm:block">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                      <div className="text-gray-600 text-base space-y-0.5 leading-relaxed">
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

              <Card className="bg-amber-50 sm:hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-base mb-1">Live Chat</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        Chat with us in the bottom right corner.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 hidden sm:block">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Live Chat</h3>
                      <p className="text-gray-600 mb-3 text-base leading-relaxed">
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

            {/* Contact Form - Mobile optimized */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-xl">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-xs sm:text-base">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs sm:text-base">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-xs sm:text-base">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-xs sm:text-base">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-xs sm:text-base">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-sm"
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

      {/* Social Media - Mobile optimized */}
      <section className="py-8 px-4 sm:py-16 sm:px-6 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 sm:text-3xl sm:mb-8">Follow Us</h2>
          <p className="text-xs text-gray-600 mb-6 max-w-xl mx-auto sm:text-lg sm:mb-8">
            Stay connected for updates and offers.
          </p>
          <div className="flex justify-center space-x-3 sm:space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=100055046491936"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-2 text-xs rounded-full sm:p-4 sm:text-base sm:font-semibold"
            >
              Facebook
            </a>

            <a
              href="https://www.instagram.com/usmanrana616"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 text-white p-2 text-xs rounded-full sm:p-4 sm:text-base sm:font-semibold"
            >
              Instagram
            </a>

            <a
              href="https://wa.me/923046713045"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white p-2 text-xs rounded-full sm:p-4 sm:text-base sm:font-semibold"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
};

export default Contact;
