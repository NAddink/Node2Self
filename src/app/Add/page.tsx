"use client";
import { useState, ChangeEvent, useEffect } from "react";
import {nodeExists, createLink, addNode } from "../components/db";
import Navbar from "../components/Navbar";

export default function Add() {

    const [firstName, setFirstName] = useState(''); // Initialize state for first name
    const [lastName, setLastName] = useState(''); // Initialize state for last name
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");


    useEffect(() => {
            let fullNameStorage : string | null = localStorage.getItem('fullname');
            if(fullNameStorage !== '' && fullNameStorage != null){
                console.log("Full name found in storage var, full name is " + fullNameStorage)
                setUserName(fullNameStorage ?? "");
                console.log("Setting logged in to true");
                setLoggedIn(true);
            }
            else{
                console.log("No local variable found")
            }
            setLoading(false);
            
    }, []);

    const firstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value); // Update state on every input change
        console.log("DEBUG: Current first name " + firstName)
    };

    const lastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value); // Update state on every input change
        console.log("DEBUG: Current last name " + lastName)
    };
    

    const addHandler = async () => {
        setErrorMsg("Loading...");

        const fullname = firstName.trim() + " " + lastName.trim();
        console.log(`DEBUG: Entered name is \'${fullname}\'`)

        // get storage variable and verify that it's a string
        
        const exists = await nodeExists(fullname);
        console.log(exists);
        if (exists){
            const result = await createLink(userName, fullname, userName)
            if(result === 409){
                console.log("Link already exists!")
                setErrorMsg("Link already exists!")
            }
            else if(result === 201){
                console.log("Link created successfully!")
                setErrorMsg(`Successfully linked ${fullname} to you`)
            }
            else{
                console.log("Some error occured: ", result);
                setErrorMsg("ERROR: " + result);

            }
        }
        else{
            // node does not exist, create it
            setErrorMsg("Node does not exist, adding...")
            const result = await addNode(fullname, userName);
            if(result === 409){
                console.log("Tried to add node but it already exists!")
                setErrorMsg("Tried to add node but it already exists! (You should not be seeing this)")
            }
            else if(result === 201){
                console.log("Node created successfully!")

                const result = await createLink(userName, fullname, userName)
                if(result === 409){
                    console.log("Created node but link already exists! (Should not happen)")
                    setErrorMsg("Created node but link already exists! (Should not happen)")
                }
                // Successfully added new node and linked it to user
                else if(result === 201){
                    console.log("Link created successfully!")
                    setErrorMsg(`Successfully added ${fullname} and linked to you!`)
                }
                else{
                    console.log("Some error occured: ", result);
                    setErrorMsg("ERROR: " + result);

                }
            }
            else{
                console.log("Some error occured: ", result);
                setErrorMsg("ERROR: " + result);
            }
        }
    }

    
    if (loading) {
        return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <Navbar />
            </div>
        </div>
    );
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <Navbar />
                
                {!loggedIn && (

                    <div className="flex flex-col items-center justify-center w-full h-screen">
                        <h1 className="text-center mb-4 text-red-800 text-2xl">Not logged in</h1>
                        <a className=" text-5xl" href="Login"><u>LOGIN</u></a>
                    </div>


                )}
                {loggedIn && (
                    <div className="pt-5">
                        <p className="text-center text-black">Currently logged in as {userName}!</p>
                        <label className="text-black">First Name</label>
                        <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center" 
                        type="text" 
                        placeholder="John" 
                        value={firstName} // Bind input value to state
                        onChange={firstNameChange} // Update state on change
                        />

                        <label className="text-black">Last Name</label>
                        <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center" 
                        type="text" 
                        placeholder="Deer" 
                        value={lastName} // Bind input value to state
                        onChange={lastNameChange} // Update state on change
                        />
                        <br /> <br />
                        
                        <div className="flex justify-center">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" type="button" onClick={addHandler}>
                                Add Connection
                            </button>
                        </div>
                        
                        <p className="text-center pt-8 text-red-800">{errorMsg}</p>
                    </div>
                )}

            </div>
        </div>
    );
}
