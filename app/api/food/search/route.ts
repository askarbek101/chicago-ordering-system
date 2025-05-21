import { NextRequest, NextResponse } from 'next/server';
import { foodDb } from '../../db/database';

// GET /api/food/search - Search food items with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract filter parameters
    const filters = {
      categoryId: searchParams.get('categoryId') || undefined,
      name: searchParams.get('name') || undefined,
      minPrice: searchParams.has('minPrice') 
        ? Number(searchParams.get('minPrice')) 
        : undefined,
      maxPrice: searchParams.has('maxPrice') 
        ? Number(searchParams.get('maxPrice')) 
        : undefined
    };
    
    const foods = await foodDb.searchFood(filters);
    
    return NextResponse.json(foods);
  } catch (error) {
    console.error('Error searching food items:', error);
    return NextResponse.json(
      { error: 'Failed to search food items' },
      { status: 500 }
    );
  }
}
