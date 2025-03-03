'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Crystal Teardrop Pendant',
      price: 45,
      image: 'https://img.temu.com/o/8c6e9c0c7e39b0b8_1708379786801.jpg',
      description: '18K Gold Plated Cubic Zirconia'
    },
    {
      id: 2,
      name: 'Pearl Drop Earrings',
      price: 29,
      image: 'https://img.temu.com/o/8a6e9c0c7e39b0b8_1708379786803.jpg',
      description: 'Freshwater Pearl with Crystal Accents'
    },
    {
      id: 3,
      name: 'Rose Gold Tennis Bracelet',
      price: 49,
      image: 'https://img.temu.com/o/876e9c0c7e39b0b8_1708379786806.jpg',
      description: 'Crystal Tennis Bracelet in Rose Gold Finish'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Opal Essence
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our handcrafted collection of fine jewelry, perfect for making every moment special.
        </p>
        <Link 
          href="/products" 
          className="inline-block mt-8 px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Shop Now
        </Link>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-xl font-bold text-gray-900 mt-4">${product.price}</p>
                <Link
                  href={`/products`}
                  className="mt-4 block w-full text-center bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Necklaces', 'Rings', 'Earrings', 'Bracelets'].map((category) => (
            <Link
              key={category}
              href={`/products?category=${category.toLowerCase()}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <h3 className="text-lg font-medium text-gray-900">{category}</h3>
            </Link>
          ))}
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
          <button className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
} 