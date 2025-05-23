import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '../../db/database';

// GET user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Note: You'll need to add a getUserById function to your userDb
    // This is just a placeholder assuming you'll add that function
    const user = await userDb.getUserByEmail(id); // Replace with getUserById when available
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return NextResponse.json({ error: 'Failed to fetch user by ID' }, { status: 500 });
  }
}
// DELETE a specific user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    await userDb.deleteUser(id);
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 