import { NextRequest, NextResponse } from 'next/server';
import { foodDb } from '../../db/database';

// GET /api/food/[id] - Get a food item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const food = await foodDb.getFoodById(id);
    
    if (!food) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(food);
  } catch (error) {
    console.error('Error fetching food item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food item' },
      { status: 500 }
    );
  }
}

// PUT /api/food/[id] - Update a food item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { name, description, image, price, categoryId } = await request.json();
    
    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if food exists
    const existingFood = await foodDb.getFoodById(id);
    if (!existingFood) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      );
    }
    
    const updatedFood = await foodDb.updateFood(
      id,
      name,
      description,
      image || '',
      Number(price),
      categoryId
    );
    
    return NextResponse.json(updatedFood);
  } catch (error) {
    console.error('Error updating food item:', error);
    return NextResponse.json(
      { error: 'Failed to update food item' },
      { status: 500 }
    );
  }
}

// DELETE /api/food/[id] - Delete a food item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if food exists
    const existingFood = await foodDb.getFoodById(id);
    if (!existingFood) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      );
    }
    
    await foodDb.deleteFood(id);
    
    return NextResponse.json(
      { message: 'Food item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting food item:', error);
    return NextResponse.json(
      { error: 'Failed to delete food item' },
      { status: 500 }
    );
  }
}
