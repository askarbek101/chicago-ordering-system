import { NextRequest, NextResponse } from 'next/server';
import { categoryDb } from '../db/database';

// GET all categories
export async function GET() {
  try {
    const categories = await categoryDb.getAllCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST create a new category
export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }
    
    const newCategory = await categoryDb.createCategory(name, description || '');
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

// PUT update a category
export async function PUT(request: NextRequest) {
  try {
    const { id, name, description } = await request.json();
    
    if (!id || !name) {
      return NextResponse.json({ error: 'Category ID and name are required' }, { status: 400 });
    }
    
    const updatedCategory = await categoryDb.updateCategory(id, name, description || '');
    
    if (!updatedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE a category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    
    await categoryDb.deleteCategory(id);
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
