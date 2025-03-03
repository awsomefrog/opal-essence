export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Elegant Jewelry</h1>
      
      {/* Story Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
        <div className="prose prose-lg">
          <p className="text-gray-600">
            Founded in 2010, Elegant Jewelry has been crafting exquisite pieces that celebrate life's most precious moments. 
            Our commitment to quality and attention to detail has made us a trusted name in fine jewelry.
          </p>
          <p className="text-gray-600 mt-4">
            Each piece in our collection is carefully designed and crafted by skilled artisans using only the finest materials. 
            We believe that jewelry is more than just an accessory – it's a way to express yourself and capture memories that last a lifetime.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality</h3>
          <p className="text-gray-600">
            We use only the finest materials and maintain strict quality control standards for all our pieces.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Craftsmanship</h3>
          <p className="text-gray-600">
            Our skilled artisans combine traditional techniques with modern innovation to create timeless pieces.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Service</h3>
          <p className="text-gray-600">
            We provide personalized service and expert guidance to help you find the perfect piece.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
              alt="Sarah Johnson"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
            <p className="text-gray-600">Founder & Lead Designer</p>
          </div>
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="David Chen"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900">David Chen</h3>
            <p className="text-gray-600">Master Craftsman</p>
          </div>
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"
              alt="Emily Williams"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900">Emily Williams</h3>
            <p className="text-gray-600">Customer Experience Manager</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visit Our Store</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Store Hours</h3>
            <p className="text-gray-600">Monday - Friday: 10:00 AM - 7:00 PM</p>
            <p className="text-gray-600">Saturday: 10:00 AM - 6:00 PM</p>
            <p className="text-gray-600">Sunday: 12:00 PM - 5:00 PM</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
            <p className="text-gray-600">123 Jewelry Lane</p>
            <p className="text-gray-600">New York, NY 10001</p>
            <p className="text-gray-600">Phone: (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
} 