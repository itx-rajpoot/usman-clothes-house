
import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import ChatWidget from '../components/ChatWidget';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-amber-600 text-white py-12 px-4 lg:py-16">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">About Usman Clothes House</h1>
          <p className="text-base sm:text-xl leading-relaxed">
            Your trusted destination for premium quality unstitched fabrics since 1995.
            We bring you the finest collection of fabrics from across Pakistan.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 px-4 lg:py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
                Established in 2015, Usman Clothes House has been serving the community with
                premium quality unstitched fabrics for over 10 years. What started as a small
                family business has grown into one of the most trusted names in the textile industry.
              </p>
              <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
                We specialize in a wide range of fabrics including Lawn, Cotton, Silk, Chiffon,
                and Linen, sourced directly from the finest mills across Pakistan. Our commitment
                to quality and customer satisfaction has made us the preferred choice for thousands
                of satisfied customers.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Today, we continue to uphold our tradition of excellence while embracing modern
                technology to serve you better through our online platform.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-5 text-center">Why Choose Us?</h3>
              <div className="space-y-3 sm:space-y-4">
                {['Premium Quality', 'Competitive Prices', 'Expert Guidance', 'Fast Delivery'].map((title, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">{title}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {{
                          'Premium Quality': 'Finest fabrics sourced directly from mills',
                          'Competitive Prices': 'Best value for your money',
                          'Expert Guidance': 'Professional advice and support',
                          'Fast Delivery': 'Quick and reliable shipping',
                        }[title]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Information */}
      <section className="py-12 px-4 bg-white lg:py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
            Visit Our Store
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Store Details */}
            <div className="space-y-5 sm:space-y-6">
              {[{
                icon: MapPin,
                title: 'Our Location',
                content: (
                  <>
                    main street, Chak no. 60 RB, Balochani, District FSD, Punjab, Pakistan<br />
                    Postal Code: 37631
                  </>
                )
              }, {
                icon: Clock,
                title: 'Store Hours',
                content: (
                  <>
                    <p>All Week: 9:00 AM - 7:00 PM</p>
                    <p>Friday: 9:00 AM - 12:00 PM then 3:00 PM - 7:00 PM</p>
                    <p className="text-sm text-amber-600 mt-2">
                      *Closed on major public holidays
                    </p>
                  </>
                )
              }, {
                icon: Phone,
                title: 'Contact Information',
                content: (
                  <>
                    Phone: +92 344 0694754<br />
                    WhatsApp: <a href="https://wa.me/923046713045" target="_blank" rel="noreferrer" className="underline text-amber-600">+92 304 6713045</a>
                  </>
                )
              }, {
                icon: Mail,
                title: 'Email & Social',
                content: (
                  <>
                    Email: <a href="mailto:ranasaab6210@gmail.com" className="underline text-amber-600">ranasaab6210@gmail.com</a><br />
                    Facebook: <a href="https://www.facebook.com/profile.php?id=100055046491936" target="_blank" rel="noreferrer" className="underline text-amber-600">@UsmanClothesHouse</a><br />
                    Instagram: <a href="https://www.instagram.com/usmanrana616" target="_blank" rel="noreferrer" className="underline text-amber-600">@usman_clothes_house</a>
                  </>
                )
              }].map(({ icon: Icon, title, content }, i) => (
                <Card key={i}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-4">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-1">{title}</h3>
                        <div className="text-gray-600 text-xs sm:text-sm leading-relaxed">{content}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-64 sm:h-80 lg:h-96 flex items-center justify-center relative">
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
              <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm bg-gray-200 bg-opacity-90 px-2 py-1 rounded max-w-xs text-center">
                <span className="font-semibold">Store Location Map:</span> main street, Chak no. 60 RB, Balochani
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offline Shopping Benefits */}
      <section className="py-12 px-4 bg-amber-50">
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
            Benefits of Visiting Our Physical Store
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-base sm:text-lg mb-2">Feel the Quality</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Touch and feel the fabric quality before making your purchase decision.
              </p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-base sm:text-lg mb-2">Expert Consultation</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Get personalized advice from our experienced staff on fabric selection.
              </p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-base sm:text-lg mb-2">Immediate Purchase</h3>
              <p className="text-gray-600 text-sm sm:text-base">
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
