import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In a real app, this would be in a database
interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
  };
}

let mockWishlist: WishlistItem[] = [];

function getUserIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { productId } = await request.json();

    // Find and remove item from wishlist
    const initialLength = mockWishlist.length;
    mockWishlist = mockWishlist.filter(
      item => !(item.userId === userId && item.productId === productId)
    );

    if (mockWishlist.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 