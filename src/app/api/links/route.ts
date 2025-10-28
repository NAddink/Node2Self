import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/src/lib/db';
import { Link } from '@/src/lib/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const pool = getPool();
    const url = new URL(request.url);
    let linksData: Link[];

    
    const res = await pool.query('SELECT * FROM links');
    linksData = res.rows;
    

    return NextResponse.json(linksData);
  } catch (error) {
    console.error('GET /api/links error:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}
