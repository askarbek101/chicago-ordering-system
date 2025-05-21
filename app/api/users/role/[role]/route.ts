import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '../../../db/database';

// GET users by role
export async function GET(
  request: NextRequest,
  { params }: { params: { role: string } }
) {
  try {
    const role = params.role;
    
    if (!role) {
      return NextResponse.json({ error: 'Role parameter is required' }, { status: 400 });
    }
    
    const users = await userDb.getUsersByRole(role);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return NextResponse.json({ error: 'Failed to fetch users by role' }, { status: 500 });
  }
} 