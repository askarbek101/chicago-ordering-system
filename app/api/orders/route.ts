import { NextRequest, NextResponse } from 'next/server';
import { orderDb } from '../db/database';

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const { 
      userEmail,
      deliveryAddress, 
      paymentMethod, 
      cartId, 
      status, 
      totalPrice 
    } = await request.json();

    // Validate required fields
    if (!deliveryAddress || !paymentMethod || !cartId || !totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date().toISOString();
    
    const order = await orderDb.createOrder(
      deliveryAddress,
      paymentMethod,
      cartId,
      userEmail,
      status || 'pending', // Default status if not provided
      totalPrice,
      now,
      now
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// Get all orders for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    let orders;
    if (status) {
      orders = await orderDb.getAllOrdersByStatusAndUserEmail(status, userEmail);
    } else {
      orders = await orderDb.getAllOrdersByUserEmail(userEmail);
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
