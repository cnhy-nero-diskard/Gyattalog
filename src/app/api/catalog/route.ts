import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Catalog, APIResponse } from '@/types';
import { createEmptyCatalog, validateCatalog } from '@/lib/catalog';

const CATALOG_FILE_PATH = path.join(process.cwd(), 'data', 'catalog.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(CATALOG_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read catalog from file
async function readCatalog(): Promise<Catalog> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(CATALOG_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    
    if (validateCatalog(parsed)) {
      return parsed;
    } else {
      console.warn('Invalid catalog data found, creating new catalog');
      return createEmptyCatalog();
    }
  } catch (error) {
    // File doesn't exist or is invalid, return empty catalog
    console.log('Creating new catalog file');
    return createEmptyCatalog();
  }
}

// Write catalog to file
async function writeCatalog(catalog: Catalog): Promise<void> {
  try {
    await ensureDataDirectory();
    const updatedCatalog = {
      ...catalog,
      lastUpdated: new Date().toISOString(),
    };
    await fs.writeFile(CATALOG_FILE_PATH, JSON.stringify(updatedCatalog, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing catalog:', error);
    throw new Error('Failed to save catalog');
  }
}

// GET - Read catalog
export async function GET(): Promise<NextResponse<APIResponse<Catalog>>> {
  try {
    const catalog = await readCatalog();
    return NextResponse.json({
      success: true,
      data: catalog,
    });
  } catch (error) {
    console.error('Error reading catalog:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read catalog',
      },
      { status: 500 }
    );
  }
}

// POST - Write catalog
export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<Catalog>>> {
  try {
    const catalog: Catalog = await request.json();
    
    if (!validateCatalog(catalog)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid catalog data',
        },
        { status: 400 }
      );
    }
    
    await writeCatalog(catalog);
    
    return NextResponse.json({
      success: true,
      data: catalog,
    });
  } catch (error) {
    console.error('Error writing catalog:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save catalog',
      },
      { status: 500 }
    );
  }
}

// OPTIONS - Handle CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
