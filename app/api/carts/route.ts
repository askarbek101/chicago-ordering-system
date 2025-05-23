import { NextRequest, NextResponse } from 'next/server';
import { cartDb } from '../db/database';

// Create a new cart
export async function POST(request: NextRequest) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    const currentDate = new Date().toISOString();
    
    const cart = await cartDb.createCart(
      userEmail,
      'active',
      currentDate,
      currentDate
    );
    
    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    console.error('Error creating cart:', error);
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    );
  }
}

// Get the last non-completed cart for the current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    const cart = await cartDb.getLastNonCompletedCartByUserEmail(userEmail);
    
    if (!cart) {
      return NextResponse.json(
        { message: 'No active cart found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}
