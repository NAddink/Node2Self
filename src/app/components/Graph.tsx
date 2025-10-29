'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Dynamically import ForceGraph2D only on the client
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

function Graph() {
    
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchData() {
        try {
            // Fetch nodes first
            const nodesRes = await axios.get('../api/nodes');
            setNodes(nodesRes.data);

            // Then fetch links
            const linksRes = await axios.get('../api/links');
            setLinks(linksRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const myData = { nodes, links };


    return (
        <div className="flex h-full w-full justify-center">
            {/* Force graph text2D from react-force-graph by vasturiano on github */}
            <ForceGraph2D
                graphData={myData}
                nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 4;
                ctx.font = `${fontSize}px Pixellari`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = (node as any).color;
                ctx.fillText(label, node.x ?? 0, node.y ?? 0);

                (node as any).__bckgDimensions = bckgDimensions; // store for pointer area
                }}
                nodePointerAreaPaint={(node, color, ctx) => {
                const bckgDimensions = (node as any).__bckgDimensions;
                if (bckgDimensions) {
                    ctx.fillStyle = color;
                    const [width, height] = bckgDimensions;
                    ctx.fillRect((node.x ?? 0) - width / 2, (node.y ?? 0) - height / 2, width, height);
                }
                }}
            />
        </div> 
    );
}

export default Graph;