import { NextRequest, NextResponse } from 'next/server';
import { addressDb } from '../db/database';

// GET endpoint to fetch all addresses for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const userEmail = req.nextUrl.searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    const addresses = await addressDb.getAllAddressesByUserEmail(userEmail);
    
    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST endpoint to create a new address
export async function POST(req: NextRequest) {
  try {
    const { userEmail, address } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }
    
    const now = new Date().toISOString();
    
    const newAddress = await addressDb.createAddress(userEmail, address, now, now);
    
    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}

// PUT endpoint to update an address
export async function PUT(req: NextRequest) {
  try {
    const { id, address } = await req.json();
    
    
    if (!id || !address) {
      return NextResponse.json({ error: 'ID and address are required' }, { status: 400 });
    }
    
    const updatedAddress = await addressDb.updateAddress(id, address);
    
    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE endpoint to delete an address
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await addressDb.deleteAddress(id);
    
    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
