'use client';

import { useCart } from '../context/CartContext';

export default function CartCount() {
  const { itemCount } = useCart();
  
  return (
    <a href="/cart" className="text-gray-600 hover:text-gray-900 relative">
      Cart
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </a>
  );
} 