import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '../../../db/database';

// GET user by email
export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = await params;
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }
    
    const user = await userDb.getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return NextResponse.json({ error: 'Failed to fetch user by email' }, { status: 500 });
  }
} 


// PUT update a specific user
export async function PUT(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = await params;
    const updateData = await request.json();
    
    if (!email) {
      console.error('Bad request: Missing email parameter');
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }
    
    // Extract only the allowed fields from the update data
    const { firstName, lastName, image, role } = updateData;
    
    const updatedUser = await userDb.updateUser(
      email,
      firstName ?? null,
      lastName ?? null,
      image ?? null,
      role ?? null
    );
    
    if (!updatedUser) {
      console.error('User not found for update:', email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
