import { NextRequest, NextResponse } from 'next/server';
import { deliveryDb } from '../db/database';

// POST endpoint to create a new delivery
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, deliveryAddress, deliveryStatus } = body;

    if (!orderId || !deliveryAddress || !deliveryStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const delivery = await deliveryDb.createDelivery(
      orderId,
      deliveryAddress,
      deliveryStatus,
      now,
      now
    );

    return NextResponse.json(delivery, { status: 201 });
  } catch (error) {
    console.error('Error creating delivery:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a delivery
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, deliveryStatus } = body;

    if (!id || !deliveryStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedDelivery = await deliveryDb.updateDelivery(id, deliveryStatus);
    return NextResponse.json(updatedDelivery);
  } catch (error) {
    console.error('Error updating delivery:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a delivery
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Delivery ID is required' },
        { status: 400 }
      );
    }

    await deliveryDb.deleteDelivery(id);
    return NextResponse.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('Error deleting delivery:', error);
    return NextResponse.json(
      { error: 'Failed to delete delivery' },
      { status: 500 }
    );
  }
}
