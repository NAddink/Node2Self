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

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const { slug: nodeName } = await context.params;
    const pool = getPool();

    try {
        const body = await request.json();
        const { name, added_by } = body;

        // Check if node exists
        const existingNode = await pool.query(
            'SELECT * FROM nodes WHERE LOWER(name) = LOWER($1)',
            [nodeName]
        );

        if (existingNode.rowCount === 0) {
            return NextResponse.json({ error: 'Node not found' }, { status: 404 });
        }

        const nodeId = existingNode.rows[0].id;

        // If user is trying to rename the node, check for duplicates
        if (name && name.toLowerCase() !== nodeName.toLowerCase()) {
            const duplicateCheck = await pool.query(
                'SELECT id FROM nodes WHERE LOWER(name) = LOWER($1)',
                [name]
            );

            if (duplicateCheck.rowCount !== null && duplicateCheck.rowCount > 0) {
                return NextResponse.json(
                    { error: 'A node with that name already exists' },
                    { status: 409 } // 409 Conflict
                );
            }
        }

        // Update node
        const updateRes = await pool.query(
            `
            UPDATE nodes
            SET
                name = COALESCE($1, name),
                added_by = COALESCE($2, added_by)
            WHERE id = $3
            RETURNING *;
            `,
            [name, added_by, nodeId]
        );

        return NextResponse.json(updateRes.rows[0], { status: 200 });
    } catch (error) {
        console.error('PUT /api/node error:', error);
        return NextResponse.json({ error: 'Failed to update node' }, { status: 500 });
    }
}