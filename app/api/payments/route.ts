import { NextRequest, NextResponse } from 'next/server';
import { paymentDb } from '../db/database';

// POST endpoint to create a new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, paymentMethod } = body;
    
    // Validate required fields
    if (!orderId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount, paymentMethod' },
        { status: 400 }
      );
    }
    
    const now = new Date().toISOString();
    const payment = await paymentDb.createPayment(
      orderId,
      amount,
      paymentMethod,
      now,
      now
    );
    
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve payments by orderId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const payments = await paymentDb.getAllPaymentsByOrderId(orderId);
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error('Error retrieving payments:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payments' },
      { status: 500 }
    );
  }
}
