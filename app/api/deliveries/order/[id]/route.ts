import { NextRequest, NextResponse } from 'next/server';
import { deliveryDb } from '../../../db/database';

// GET endpoint to fetch deliveries by order ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const deliveries = await deliveryDb.getAllDeliveriesByOrderId(orderId);
    return NextResponse.json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries by order ID:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
} 