'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { WishlistItem, getWishlist, removeFromWishlist } from '../utils/wishlistService';
import { addToCart } from '../utils/cartService';

// Add dynamic export for client-side features
export const dynamic = 'force-dynamic';

function WishlistContent() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const items = await getWishlist();
        setWishlist(items);
      } catch (err) {
        setError('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const success = await removeFromWishlist(productId);
      if (success) {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
      }
    } catch (err) {
      setError('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const success = await addToCart(productId, 1);
      if (success) {
        // Optionally remove from wishlist after adding to cart
        await handleRemove(productId);
        router.push('/cart');
      }
    } catch (err) {
      setError('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <div key={item.id} className="group relative">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href={`/products/${item.productId}`}>
                    {item.product.name}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                ${item.product.price.toLocaleString()}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleAddToCart(item.productId)}
                className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleRemove(item.productId)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    }>
      <WishlistContent />
    </Suspense>
  );
} 