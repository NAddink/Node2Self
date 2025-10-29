'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ForceGraph from './components/Graph';
import Navbar from './components/Navbar';

// Dynamically import ForceGraph2D only on the client
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {
    


    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <Navbar />
                
                <ForceGraph userName="Noah Addink"/>

            </div>
        </div>
    );
}
