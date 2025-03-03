'use client';

import { jwtDecode } from 'jwt-decode';
import { Product } from './productService';

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  addedAt: string;
  product: Product;
}

// In a real app, this would be stored in a database
let wishlistItems: WishlistItem[] = [];

export const addToWishlist = async (productId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const decoded = jwtDecode(token) as { userId: string };
    const userId = decoded.userId;

    // Check if item already exists in wishlist
    const existingItem = wishlistItems.find(
      item => item.productId === productId && item.userId === userId
    );

    if (existingItem) {
      return false;
    }

    // Add item to wishlist
    wishlistItems.push({
      productId,
      userId,
      addedAt: new Date().toISOString(),
      product: {} as Product
    });

    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
};

export const removeFromWishlist = async (productId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const decoded = jwtDecode(token) as { userId: string };
    const userId = decoded.userId;

    const initialLength = wishlistItems.length;
    wishlistItems = wishlistItems.filter(
      item => !(item.productId === productId && item.userId === userId)
    );

    return wishlistItems.length < initialLength;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
};

export const getWishlist = async (): Promise<WishlistItem[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const decoded = jwtDecode(token) as { userId: string };
    const userId = decoded.userId;

    return wishlistItems.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

export const isInWishlist = async (productId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const decoded = jwtDecode(token) as { userId: string };
    const userId = decoded.userId;

    return wishlistItems.some(
      item => item.productId === productId && item.userId === userId
    );
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}; 