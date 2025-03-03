'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductsPage() {
  const { addItem } = useCart();
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 1, name: 'Necklaces', count: 12 },
    { id: 2, name: 'Rings', count: 18 },
    { id: 3, name: 'Earrings', count: 15 },
    { id: 4, name: 'Bracelets', count: 10 },
  ];

  const products = [
    {
      id: 1,
      name: 'Crystal Teardrop Pendant Necklace',
      price: 45,
      category: 'Necklaces',
      image: 'https://img.temu.com/o/8c6e9c0c7e39b0b8_1708379786801.jpg',
      description: '18K Gold Plated Cubic Zirconia Pendant',
      specifications: {
        material: '18K Gold Plated Brass, AAA Cubic Zirconia',
        chainLength: '18 inches + 2 inches extender',
        pendantSize: '0.8 x 0.4 inches',
        closure: 'Lobster Clasp',
        weight: '3.5 grams'
      },
      care: 'Store in a cool, dry place. Avoid contact with perfumes and chemicals. Clean with a soft, dry cloth.'
    },
    {
      id: 2,
      name: 'Butterfly Charm Bracelet',
      price: 36,
      category: 'Bracelets',
      image: 'https://img.temu.com/o/8b6e9c0c7e39b0b8_1708379786802.jpg',
      description: 'Sterling Silver Plated Adjustable Chain',
      specifications: {
        material: 'Sterling Silver Plated Brass',
        length: '6.5-8 inches adjustable',
        charmSize: '0.5 x 0.5 inches',
        closure: 'Toggle Clasp',
        weight: '4.2 grams'
      },
      care: 'Remove before swimming or showering. Store in jewelry box. Polish with silver cleaning cloth.'
    },
    {
      id: 3,
      name: 'Pearl Drop Earrings',
      price: 29,
      category: 'Earrings',
      image: 'https://img.temu.com/o/8a6e9c0c7e39b0b8_1708379786803.jpg',
      description: 'Freshwater Pearl with Crystal Accents',
      specifications: {
        material: 'Freshwater Pearls, Crystal Glass',
        pearlSize: '6-7mm',
        length: '1.2 inches',
        closure: 'Push Back',
        weight: '2.8 grams/pair'
      },
      care: 'Wipe with soft cloth after wearing. Avoid contact with water and cosmetics.'
    },
    {
      id: 4,
      name: 'Infinity Love Ring',
      price: 32,
      category: 'Rings',
      image: 'https://img.temu.com/o/896e9c0c7e39b0b8_1708379786804.jpg',
      description: '925 Sterling Silver Plated Adjustable',
      specifications: {
        material: '925 Sterling Silver Plated',
        size: 'Adjustable 6-8 US',
        width: '2mm',
        design: 'Infinity Symbol',
        weight: '2.1 grams'
      },
      care: 'Remove when washing hands. Store separately. Clean with jewelry cleaning cloth.'
    },
    {
      id: 5,
      name: 'Moonstone Pendant Set',
      price: 54,
      category: 'Necklaces',
      image: 'https://img.temu.com/o/886e9c0c7e39b0b8_1708379786805.jpg',
      description: 'Natural Moonstone with Chain',
      specifications: {
        material: 'Natural Moonstone, Sterling Silver Plated',
        chainLength: '20 inches',
        pendantSize: '0.9 x 0.6 inches',
        closure: 'Spring Ring',
        weight: '4.8 grams'
      },
      care: 'Keep away from harsh chemicals. Store in soft pouch. Clean with mild soap if needed.'
    },
    {
      id: 6,
      name: 'Rose Gold Tennis Bracelet',
      price: 49,
      category: 'Bracelets',
      image: 'https://img.temu.com/o/876e9c0c7e39b0b8_1708379786806.jpg',
      description: 'Crystal Tennis Bracelet in Rose Gold Finish',
      specifications: {
        material: 'Rose Gold Plated Brass, Crystal',
        length: '7 inches + safety chain',
        width: '3mm',
        closure: 'Box Clasp with Safety',
        weight: '8.5 grams'
      },
      care: 'Avoid water exposure. Store flat in jewelry box. Clean with soft brush.'
    },
    {
      id: 7,
      name: 'Vintage Style Ring Set',
      price: 39,
      category: 'Rings',
      image: 'https://img.temu.com/o/866e9c0c7e39b0b8_1708379786807.jpg',
      description: 'Set of 3 Stackable Rings',
      specifications: {
        material: 'Alloy with Antique Finish',
        size: '5-9 US Available',
        width: '1.5-2.5mm each',
        style: 'Victorian Inspired',
        weight: '4.5 grams total'
      },
      care: 'Keep dry. Store separately. Use jewelry polishing cloth to maintain shine.'
    },
    {
      id: 8,
      name: 'Crystal Chandelier Earrings',
      price: 42,
      category: 'Earrings',
      image: 'https://img.temu.com/o/856e9c0c7e39b0b8_1708379786808.jpg',
      description: 'Art Deco Style Drop Earrings',
      specifications: {
        material: 'Austrian Crystal, Rhodium Plated',
        length: '2.2 inches',
        width: '0.8 inches',
        closure: 'Lever Back',
        weight: '6.2 grams/pair'
      },
      care: 'Store in box when not wearing. Avoid sprays and lotions. Clean with soft brush.'
    },
    {
      id: 9,
      name: 'Heart Locket Necklace',
      price: 38,
      category: 'Necklaces',
      image: 'https://img.temu.com/o/846e9c0c7e39b0b8_1708379786809.jpg',
      description: 'Photo Locket with Crystal Detail',
      specifications: {
        material: 'Brass with Silver Plating',
        chainLength: '18 inches',
        locketSize: '0.8 x 0.8 inches',
        closure: 'Lobster Clasp',
        weight: '5.2 grams'
      },
      care: 'Keep locket dry. Clean with jewelry cloth. Store closed in soft pouch.'
    },
    {
      id: 10,
      name: 'Emerald Cut Ring',
      price: 44,
      category: 'Rings',
      image: 'https://img.temu.com/o/836e9c0c7e39b0b8_1708379786810.jpg',
      description: 'Emerald Cut Crystal Solitaire',
      specifications: {
        material: 'Platinum Plated, Cubic Zirconia',
        size: '5-10 US Available',
        stoneSize: '8 x 6mm',
        setting: 'Prong Setting',
        weight: '3.8 grams'
      },
      care: 'Remove when applying hand cream. Store separately. Clean with warm water and mild soap.'
    },
    {
      id: 11,
      name: 'Pearl Charm Bracelet',
      price: 35,
      category: 'Bracelets',
      image: 'https://img.temu.com/o/826e9c0c7e39b0b8_1708379786811.jpg',
      description: 'Freshwater Pearl and Chain Bracelet',
      specifications: {
        material: 'Freshwater Pearls, Sterling Silver Plated',
        length: '7-8.5 inches adjustable',
        pearlSize: '5-6mm',
        closure: 'Lobster Clasp',
        weight: '5.6 grams'
      },
      care: 'Avoid chemicals and perfumes. Store flat. Clean with soft, damp cloth.'
    },
    {
      id: 12,
      name: 'Geometric Stud Earrings',
      price: 28,
      category: 'Earrings',
      image: 'https://img.temu.com/o/816e9c0c7e39b0b8_1708379786812.jpg',
      description: 'Modern Geometric Design Studs',
      specifications: {
        material: '925 Sterling Silver Plated',
        size: '0.4 x 0.4 inches',
        backType: 'Push Back',
        style: 'Contemporary',
        weight: '1.8 grams/pair'
      },
      care: 'Store in jewelry box. Clean with silver polishing cloth. Avoid water exposure.'
    }
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const toggleProductDetails = (productId: number) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const filteredProducts = products.filter(product => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.specifications.material.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Collections</h1>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for jewelry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSearchQuery(category.name)}
            >
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} items</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-3 aspect-h-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold text-gray-900">${product.price}</p>
              
              <button
                onClick={() => toggleProductDetails(product.id)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {expandedProduct === product.id ? 'Hide Details' : 'Show Details'}
              </button>

              {expandedProduct === product.id && (
                <div className="mt-3 space-y-3 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900">Specifications:</h4>
                    <ul className="list-disc list-inside pl-2">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key} className="text-gray-600">
                          {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Care Instructions:</h4>
                    <p className="text-gray-600">{product.care}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found matching your search.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="mt-8 flex justify-end">
        <select className="bg-white border border-gray-300 rounded-md px-4 py-2">
          <option>Sort by Price: Low to High</option>
          <option>Sort by Price: High to Low</option>
          <option>Sort by Name</option>
        </select>
      </div>
    </div>
  );
} 