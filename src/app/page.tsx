'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ForceGraph from './components/Graph';
import Navbar from './components/Navbar';

// Dynamically import ForceGraph2D only on the client
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {

    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    
    // runs on page load to get name from storage
    useEffect(() => {
            let fullNameStorage : string | null = localStorage.getItem('fullname');
            if(fullNameStorage !== '' && fullNameStorage != null){
                console.log(fullNameStorage);
                setUserName(fullNameStorage ?? null);
            }
            else{
                console.log("No local variable found")
                // no logged in user, show graph
                setLoading(false)
            }
            
            
    }, []);

    // runs once username is found in storage, then sets loading to false, rendering graph
    useEffect(() => {
    if (userName) {
        console.log(`Full name found in storage var, full name is '${userName}'`);
        setLoading(false)
    }
    }, [userName]);

    
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <Navbar />
                
                {!loading && <ForceGraph userName={userName}/>}

            </div>
        </div>
    );
    
}
