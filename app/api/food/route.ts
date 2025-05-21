import { NextRequest, NextResponse } from 'next/server';
import { foodDb } from '../db/database';

// GET /api/food - Get all food items
export async function GET() {
  try {
    const foods = await foodDb.getAllFood();
    return NextResponse.json(foods);
  } catch (error) {
    console.error('Error fetching food items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food items' },
      { status: 500 }
    );
  }
}

// POST /api/food - Create a new food item
export async function POST(request: NextRequest) {
  try {
    const { name, description, image, price, categoryId } = await request.json();
    
    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newFood = await foodDb.createFood(
      name,
      description,
      image || '',
      Number(price),
      categoryId
    );
    
    return NextResponse.json(newFood, { status: 201 });
  } catch (error) {
    console.error('Error creating food item:', error);
    return NextResponse.json(
      { error: 'Failed to create food item' },
      { status: 500 }
    );
  }
}
