import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/src/lib/db';
import { Node } from '@/src/lib/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const pool = getPool();
        const url = new URL(request.url);
        let nodesData: Node[];
        const nodeIdParam = url.searchParams.get('id');
        console.log("Node id param " + nodeIdParam);

        
        if(nodeIdParam){
            const res = await pool.query('SELECT * FROM nodes WHERE id = $1', [nodeIdParam]);
            nodesData = res.rows;
            return NextResponse.json(nodesData);
        }
        else{
            const res = await pool.query('SELECT * FROM nodes');
            nodesData = res.rows;
            return NextResponse.json(nodesData);
        }


    } catch (error) {
        console.error('GET /api/node error:', error);
        return NextResponse.json({ error: 'Failed to fetch node' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, added_by } = body;
        if (!name || !added_by) {
            return NextResponse.json({ error: 'Missing required node fields' }, { status: 400 });
        }

        const pool = getPool();
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const existingRes = await client.query(
                `SELECT id FROM nodes WHERE lower(name) = lower($1)`,
                [name]
            );

            const numrows : number | null = existingRes.rowCount;
            
            if (numrows !== null && numrows > 0) {
                await client.query('ROLLBACK');
                return NextResponse.json(
                { error: 'Node already exists', id: existingRes.rows[0].id },
                { status: 409 } // 409 Conflict
                );
            }
            
            
            const nodeRes = await client.query(
                `INSERT INTO nodes (name, added_by)
                VALUES ($1, $2) RETURNING id`,
                [name, added_by]
            );
            const nodeId: number = nodeRes.rows[0].id;



            await client.query('COMMIT');
            return NextResponse.json({ id: nodeId }, { status: 201 });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('POST /api/nodes transaction error:', err);
            return NextResponse.json({ error: 'Error creating node' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('POST /api/nodes parse error:', error);
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    try {


        const pool = getPool();
        const client = await pool.connect();
        const url = new URL(request.url);
        const nodeIdParam = url.searchParams.get('id');

        if (!nodeIdParam) {
            return NextResponse.json({ error: 'Missing required node fields' }, { status: 400 });
        }


        try {
            await client.query('BEGIN');

            await client.query(
                `DELETE FROM links WHERE source = ($1) OR target = ($1)`,
                [nodeIdParam]
            );
            await client.query(
                `DELETE FROM nodes WHERE id = ($1)`,
                [nodeIdParam]
            );


            
            await client.query('COMMIT');
            return new NextResponse(null, { status: 204 });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('DELETE /api/nodes transaction error:', err);
            return NextResponse.json({ error: 'Error deleting node' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('DELETE /api/nodes parse error:', error);
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}
