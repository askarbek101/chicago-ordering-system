import { NextRequest, NextResponse } from 'next/server';
import { deliveryDb } from '../../../db/database';

// GET endpoint to fetch deliveries by user email
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userEmail = params.id;
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    const deliveries = await deliveryDb.getAllDeliveriesByUserEmail(userEmail);
    return NextResponse.json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries by user email:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
} 