'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ForceGraph from './Graph';

// Dynamically import ForceGraph2D only on the client
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {
    


    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <div className="grid grid-cols-3 place-items-center h-20 rounded-xl bg-gradient-to-r from-[#7b84ff]/40 via-[#63e5fc]/40 to-[#aeff6f]/40">
                    <a href="/"><p className="font-martian text-xl">HOME</p></a>
                    <a href="Draw"><p className="font-martian text-xl">DRAW</p></a>
                    <a href="Results"><p className="font-martian text-xl">RESULTS</p></a>
                </div>
                
                <ForceGraph />

            </div>
        </div>
    );
}
