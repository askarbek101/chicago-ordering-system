import { NextRequest, NextResponse } from 'next/server';
import { cartItemDb } from '../db/database';

// POST - Create a new cart item
export async function POST(request: NextRequest) {
  try {
    const { cartId, foodId, quantity } = await request.json();
    
    // Validate required fields
    if (!cartId || !foodId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: cartId, foodId, or quantity' },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    
    const newCartItem = await cartItemDb.createCartItem(
      cartId,
      foodId,
      quantity,
      createdAt,
      updatedAt
    );
    
    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    console.error('Error creating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to create cart item' },
      { status: 500 }
    );
  }
}

// GET - Get all cart items for a cart
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Missing required parameter: cartId' },
        { status: 400 }
      );
    }
    
    const cartItems = await cartItemDb.getAllCartItemsByCartId(cartId);
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

// PUT - Update a cart item
export async function PUT(request: NextRequest) {
  try {
    const { id, quantity } = await request.json();
    
    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: id or quantity' },
        { status: 400 }
      );
    }
    
    await cartItemDb.updateCartItem(id, quantity);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a cart item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }
    
    await cartItemDb.deleteCartItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart item' },
      { status: 500 }
    );
  }
}
