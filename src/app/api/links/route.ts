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


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { source, target, added_by } = body;
        if (!source || !target || !added_by) {
            return NextResponse.json({ error: 'Missing required link fields' }, { status: 400 });
        }

        const pool = getPool();
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            

            const existingRes = await client.query(
                `SELECT id FROM links WHERE (source = $1 AND target = $2) OR (source = $2 AND target = $1)`,
                [source, target]
            );

            const numrows : number | null = existingRes.rowCount;
            
            if (numrows !== null && numrows > 0) {
                await client.query('ROLLBACK');
                return NextResponse.json(
                { error: 'Link already exists', id: existingRes.rows[0].id },
                { status: 409 } // 409 Conflict
                );
            }

            const linkRes = await client.query(
                `INSERT INTO links (source, target, added_by)
         VALUES ($1, $2, $3) RETURNING id`,
                [source, target, added_by]
            );

            const linkId: number = linkRes.rows[0].id;



            await client.query('COMMIT');
            return NextResponse.json({ id: linkId }, { status: 201 });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('POST /api/links transaction error:', err);
            return NextResponse.json({ error: 'Error creating node' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('POST /api/links parse error:', error);
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    try {


        const pool = getPool();
        const client = await pool.connect();
        const url = new URL(request.url);
        const linkIdParam = url.searchParams.get('id');

        if (!linkIdParam) {
            return NextResponse.json({ error: 'Missing required link fields' }, { status: 400 });
        }


        try {
            await client.query('BEGIN');
            const linkRes = await client.query(
                `DELETE FROM links WHERE id = ($1)`,
                [linkIdParam]
            );



            await client.query('COMMIT');
            return new NextResponse(null, { status: 204 });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('DELETE /api/links transaction error:', err);
            return NextResponse.json({ error: 'Error deleting link' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('DELETE /api/links parse error:', error);
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}