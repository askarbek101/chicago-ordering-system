import { NextRequest, NextResponse } from 'next/server';
import { paymentDb } from '../../db/database';

export async function GET() {
  try {
    // Add a new database function to get all payments
    const payments = await paymentDb.getAllPayments();
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching all payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
} 