import React from 'react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Elegant Jewelry for Every Occasion
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our handcrafted collection of fine jewelry, perfect for making every moment special.
        </p>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Product 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"
                alt="Diamond Necklace"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Diamond Necklace</h3>
              <p className="text-gray-600 mt-2">Elegant 18k gold necklace with diamond pendant</p>
              <p className="text-xl font-bold text-gray-900 mt-4">$1,299</p>
              <button className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800">
                View Details
              </button>
            </div>
          </div>

          {/* Featured Product 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img
                src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9"
                alt="Sapphire Ring"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Sapphire Ring</h3>
              <p className="text-gray-600 mt-2">Classic white gold ring with natural sapphire</p>
              <p className="text-xl font-bold text-gray-900 mt-4">$899</p>
              <button className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800">
                View Details
              </button>
            </div>
          </div>

          {/* Featured Product 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908"
                alt="Pearl Earrings"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Pearl Earrings</h3>
              <p className="text-gray-600 mt-2">Freshwater pearl drop earrings in sterling silver</p>
              <p className="text-xl font-bold text-gray-900 mt-4">$299</p>
              <button className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Join Our Newsletter
        </h2>
        <p className="text-gray-600 mb-6">
          Subscribe to receive updates about new collections and special offers.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
} 