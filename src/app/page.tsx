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

    const [neighbors, setNeighbors] = useState<Array<String>>()

    const [refreshKey, setRefreshKey] = useState(0); // key for making forcegraph re-render
    
    // runs on page load to get name from storage
    useEffect(() => {
            let fullNameStorage : string | null = localStorage.getItem('username');
            if(fullNameStorage !== '' && fullNameStorage != null){
                console.log(fullNameStorage);
                setUserName(fullNameStorage ?? null);
                GetNeighbors(fullNameStorage);
            }
            else{
                console.log("No local variable found")
                // no logged in user, show graph
                setNeighbors([]);   // Set neighbors to blank array
                setLoading(false)
            }
            
            console.log("Going to get user id 1");
            
            
            
    }, []);


    const GetNeighbors = async (fullName: string) => {
        if(fullName === null) return; // Don't attempt with no logged in user

        // Get user id
        try{
            const currentNode = await axios.get('../api/nodes/' + fullName);
            console.log(`Current logged user: ${fullName} + current user id: ${currentNode.data[0]?.id}`);
            let currentId = currentNode.data[0]?.id;

            const neighbors = await axios.get(`../api/links/neighbors/${currentId}`);
            console.log("NEIGHBORS" + neighbors);
            
            console.log("Total neighbors: " + neighbors.data.length);

            // let neighborNames: Array<string> = [];

            // for(let i = 0; i < neighbors.data.length; i++){
            //     const neighborSource = await axios.get(`../api/nodes?id=${neighbors.data[i]?.source}`)
            //     const neighborTarget = await axios.get(`../api/nodes?id=${neighbors.data[i]?.target}`)
            //     neighborNames.push(neighborSource.data[0]?.name.toLowerCase());
            //     neighborNames.push(neighborTarget.data[0]?.name.toLowerCase());
            // }

            const neighborNames = (
                await Promise.all(
                    neighbors.data.flatMap((n: any) => [
                    axios.get(`../api/nodes?id=${n.source}`),
                    axios.get(`../api/nodes?id=${n.target}`),
                    ])
                )
            ).map(res => res.data[0]?.name.toLowerCase());


            console.log(neighborNames);
            setNeighbors(neighborNames);
            setLoading(false)
        }
        catch (error){
            console.log("Error loading current id: " + error);
        }
    }

    // runs once username is found in storage, then sets loading to false, rendering graph
    useEffect(() => {
    if (userName) {
        console.log(`Full name found in storage var, full name is '${userName}'`);
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
                
                <div className="text-3xl text-[#d8a657] hover:text-[#8ec07c] transition-colors duration-500 absolute right-0 top-0 pr-4 py-1"><a href="https://noahadd.ink/">⌂</a></div>
                <Navbar />
                
                {loading && <div className="flex justify-center items-center h-screen">Loading...</div>}
                {!loading && neighbors && 
                <ForceGraph 
                    key={refreshKey}
                    userName={userName} 
                    onNodeClick={onNodeClick}
                    neighbors = {neighbors}
                />
                }

            </div>
        </div>
    );
    
}
