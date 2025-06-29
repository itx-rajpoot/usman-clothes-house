
import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import ChatWidget from '../components/ChatWidget';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Usman Clothes House</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your trusted destination for premium quality unstitched fabrics since 1995.
            We bring you the finest collection of fabrics from across Pakistan.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Established in 2015, Usman Clothes House has been serving the community with
                premium quality unstitched fabrics for over 10 years. What started as a small
                family business has grown into one of the most trusted names in the textile industry.
              </p>
              <p className="text-gray-600 mb-4">
                We specialize in a wide range of fabrics including Lawn, Cotton, Silk, Chiffon,
                and Linen, sourced directly from the finest mills across Pakistan. Our commitment
                to quality and customer satisfaction has made us the preferred choice for thousands
                of satisfied customers.
              </p>
              <p className="text-gray-600">
                Today, we continue to uphold our tradition of excellence while embracing modern
                technology to serve you better through our online platform.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-center">Why Choose Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Premium Quality</h4>
                    <p className="text-sm text-gray-600">Finest fabrics sourced directly from mills</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Competitive Prices</h4>
                    <p className="text-sm text-gray-600">Best value for your money</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Expert Guidance</h4>
                    <p className="text-sm text-gray-600">Professional advice and support</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <h4 className="font-semibold">Fast Delivery</h4>
                    <p className="text-sm text-gray-600">Quick and reliable shipping</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Visit Our Store</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Store Details */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Our Location</h3>
                      <p className="text-gray-600">
                        main street, Chak no. 60 RB, Balochani, District FSD, Punjab, Pakistan<br />
                        Postal Code: 37631
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Store Hours</h3>
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

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-amber-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Phone: +92 344 0694754</p>
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
                      <h3 className="font-semibold text-lg mb-2">Email & Social</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Email: <a href="mailto:ranasaab6210@gmail.com">ranasaab6210@gmail.com</a></p>
                        <p>Facebook: <a href="https://www.facebook.com/profile.php?id=100055046491936" target="_blank">@UsmanClothesHouse</a></p>
                        <p>Instagram: <a href="https://www.instagram.com/usmanrana616" target="_blank">@usman_clothes_house</a></p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500 w-full h-full relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d268.0244741648558!2d73.42481015663381!3d31.554742474746355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2s!4v1751211624100!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title="Store Location"
                ></iframe>
                <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm bg-gray-200 bg-opacity-90 px-2 py-1 rounded">
                  <span className="font-semibold">Store Location Map:</span> main street, Chak no. 60 RB, Balochani
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Offline Shopping Benefits */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Benefits of Visiting Our Physical Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-3">Feel the Quality</h3>
              <p className="text-gray-600">
                Touch and feel the fabric quality before making your purchase decision.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-3">Expert Consultation</h3>
              <p className="text-gray-600">
                Get personalized advice from our experienced staff on fabric selection.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-3">Immediate Purchase</h3>
              <p className="text-gray-600">
                Take your favorite fabrics home immediately without waiting for delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
};

export default About;
