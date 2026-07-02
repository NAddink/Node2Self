import { getPool } from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }

) {
    const { id: nodeId } = await context.params;
    try {

        let neighborIds: Array<number>;

        let nodesData: Node[];
        const pool = getPool();
        const nodesRes = await pool.query(
            'SELECT * FROM links WHERE target = $1 OR source = $1',
            [nodeId]
        );
        

        nodesData = nodesRes.rows;


        return NextResponse.json(nodesData);
    } catch (error) {
        console.error('GET /api/node error:', error);
        return NextResponse.json({ error: 'Failed to fetch node' }, { status: 500 });
    }
};
