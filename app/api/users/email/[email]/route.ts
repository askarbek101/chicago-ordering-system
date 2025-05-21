import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '../../../db/database';

// GET user by email
export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email;
    
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