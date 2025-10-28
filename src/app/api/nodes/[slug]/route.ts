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