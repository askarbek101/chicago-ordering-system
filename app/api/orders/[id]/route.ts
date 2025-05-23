import { NextRequest, NextResponse } from 'next/server';
import { orderDb } from '../../db/database';

// Update order status
export async function PATCH(request: NextRequest) {
  try {
    const id = request.url.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const { status, deliveryAddress, paymentMethod } = await request.json();
    
    // At least one field must be provided for update
    if (!status && !deliveryAddress && !paymentMethod) {
      return NextResponse.json(
        { error: 'At least one field must be provided for update' },
        { status: 400 }
      );
    }

    let updatedOrder;
    
    if (status) {
      updatedOrder = await orderDb.updateOrderStatus(id, status);
    }
    
    if (deliveryAddress) {
      updatedOrder = await orderDb.updateOrderDeliveryAddress(id, deliveryAddress);
    }
    
    if (paymentMethod) {
      updatedOrder = await orderDb.updateOrderPaymentMethod(id, paymentMethod);
    }

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
} 