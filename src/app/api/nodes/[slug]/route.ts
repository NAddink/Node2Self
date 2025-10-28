import { getPool } from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }

) {
    const { slug: nodeName } = await context.params;
    try {
        let nodesData: Node[];
        const pool = getPool();
        const nodesRes = await pool.query(
            'SELECT * FROM nodes WHERE LOWER(name) = LOWER($1)',
            [nodeName]
        );

        nodesData = nodesRes.rows;


        return NextResponse.json(nodesData);
    } catch (error) {
        console.error('GET /api/node error:', error);
        return NextResponse.json({ error: 'Failed to fetch node' }, { status: 500 });
    }
};

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> } 
) {
    const { slug: nodeName } = await context.params;
    const pool = getPool();
    const client = await pool.connect();
    
    try {
        // get nodes with name in slug
        const nodesRes = await pool.query(
            'SELECT * FROM nodes WHERE LOWER(name) = LOWER($1)',
            [nodeName]
        );

        // Only one row is returned (expected) 
        if (nodesRes.rowCount === 1) {
            const nodeId = nodesRes.rows[0]?.id; // get row id
        
            //start delete for node with that id
            try {
                    await client.query('BEGIN');

                    await client.query( // del links
                        `DELETE FROM links WHERE source = ($1) OR target = ($1)`,
                        [nodeId]
                    );
                    await client.query( // del node
                        `DELETE FROM nodes WHERE id = ($1)`,
                        [nodeId]
                    );

                    
                    await client.query('COMMIT');
                    return new NextResponse(null, { status: 204 });
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error('DELETE /api/nodes transaction error:', err);
                    return NextResponse.json({ error: 'Error deleting node' }, { status: 500 });
                }
        }

        

    } catch (error) {
        console.error('GET /api/node error:', error);
        return NextResponse.json({ error: 'Failed to fetch node' }, { status: 500 });
    }
        finally {
        client.release(); 
    }
};