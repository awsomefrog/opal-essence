import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Mock product database (in a real app, this would be in a database)
const mockProducts = [
  {
    id: '1',
    name: 'Diamond Pendant Necklace',
    price: 1299,
    description: 'Elegant diamond pendant necklace in 18k white gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'
  }
];

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
    
    // Check if product exists
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if item is already in wishlist
    const existingItem = mockWishlist.find(
      item => item.userId === userId && item.productId === productId
    );
    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Item already in wishlist' },
        { status: 400 }
      );
    }

    // Add to wishlist
    const wishlistItem: WishlistItem = {
      id: uuidv4(),
      productId,
      userId,
      addedAt: new Date().toISOString(),
      product
    };

    mockWishlist.push(wishlistItem);

    return NextResponse.json({ success: true, item: wishlistItem });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 