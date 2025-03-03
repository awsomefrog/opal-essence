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

let mockWishlist: WishlistItem[] = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    addedAt: new Date().toISOString(),
    product: {
      id: '1',
      name: 'Diamond Pendant Necklace',
      price: 1299,
      description: 'Elegant diamond pendant necklace in 18k white gold',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'
    }
  }
];

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

export async function GET(request: NextRequest) {
  const userId = getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // In a real app, this would filter from the database
  const userWishlist = mockWishlist.filter(item => item.userId === userId);

  return NextResponse.json({
    success: true,
    items: userWishlist
  });
} 