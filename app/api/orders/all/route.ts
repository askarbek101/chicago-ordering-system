import { NextRequest, NextResponse } from 'next/server';
import { orderDb } from '../../db/database';

export async function GET() {
  try {
    // Add a new database function to get all orders
    const orders = await orderDb.getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
} 