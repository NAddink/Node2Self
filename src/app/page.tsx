'use client';

import dynamic from 'next/dynamic';
import axios, { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import ForceGraph from './components/Graph';
import Navbar from './components/Navbar';
import { ConfirmMsg, SuccessMsg } from './components/alerts';
import Swal from 'sweetalert2';

// Dynamically import ForceGraph2D only on the client
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function Home() {

    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    const [refreshKey, setRefreshKey] = useState(0); // key for making forcegraph re-render
    
    // runs on page load to get name from storage
    useEffect(() => {
            let fullNameStorage : string | null = localStorage.getItem('username');
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

    // on node click prompt to edit spelling
    const onNodeClick = async (oldName: string) => {
        
        const { value: newName } = await Swal.fire({
            title: `Edit ${oldName}?`,
            input: "text",
            inputLabel: "Change name spelling?",
            inputValue: oldName,
            showCancelButton: true,
            confirmButtonText: "Yes",
            
            });
            if (newName && newName !== oldName) { // if user inputs a name
                
                const nameData = {
                    name: newName
                }

                try{
                    await axios.put(`../api/nodes/${oldName}`, nameData);
                    
                    SuccessMsg.fire({
                        icon: "success",
                        title: `Updated name!`
                    });

                    setRefreshKey(refreshKey + 1); // force graph re-render to show updated name
                }
                catch(error){
                    if(isAxiosError(error)){
                        if(error.status == 409){
                            SuccessMsg.fire({
                                icon: "error",
                                title: `Name already exists!`
                            });
                        }
                    }
                    console.log("ERROR editing name: ", error);
                }

            }
    }

    
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <Navbar />
                
                {!loading && 
                <ForceGraph 
                    key={refreshKey}
                    userName={userName} 
                    onNodeClick={onNodeClick}
                />
                }

            </div>
        </div>
    );
    
}
