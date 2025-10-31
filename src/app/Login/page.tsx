"use client";
import { useEffect, useState } from "react";
import React, { ChangeEvent, MouseEvent } from 'react';
import Navbar from "../components/Navbar";
import {CreateNode, NodeExists}from "../components/db";
import { ConfirmMsg, SuccessMsg } from "../components/alerts";
 

export default function Login() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState(''); // Initialize state for input value
    const [loading, setLoading] = useState(true);

    const [errorMsg, setErrorMsg] = useState("");


    
    useEffect(() => {
        let fullNameStorage : string | null = localStorage.getItem('username');
        if(fullNameStorage !== '' && fullNameStorage != null){
            console.log("Full name found in storage var, full name is " + fullNameStorage)
            setUsername(fullNameStorage ?? "");
            console.log("Setting logged in to true");
            setLoggedIn(true);
        }
        else{
            console.log("No local variable found")
        }
        setLoading(false);
        
    }, [loggedIn]);
    
    const firstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value); // Update state on every input change
        console.log("DEBUG: Current first name " + firstName)
    };

    const lastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value); // Update state on every input change
        console.log("DEBUG: Current last name " + lastName)
    };

    const loginHandler = async (event: any) => {
        event.preventDefault(); 
        
        setErrorMsg("Loading...");
        let usernameInput = firstName.trim() + " " + lastName.trim();

        if(firstName.trim() === "" || lastName.trim() === ""){
            // set message to blank and return
            setErrorMsg("");
            return;
        }


        const exists = await NodeExists(usernameInput);
        
        if(exists){
            // name logging in already has a node
            console.log("Setting logged in username to " + usernameInput);
            localStorage.setItem('username', usernameInput);
            setLoggedIn(true);
            SuccessMsg.fire({
                icon: "success",
                title: "Signed in successfully!"
            });

        }

        if(!exists)
        {
            // if node does not already exist for user loggin in, create one.
            console.log("This name does not already have a node. Create one.")
            setErrorMsg("This name does not already exist in the graph. Creating it now...")
            
            ConfirmMsg.fire({
                title: `'${usernameInput}' does not exist, create?`
            })
            .then(async (result) => {
                
                // user confirmed creation of name, create it

                if (result.isConfirmed) {
                    
                    const result = await CreateNode(usernameInput, "new user");
                    if(result === 409){
                        console.log("Tried to add node but it already exists!")
                        setErrorMsg("Tried to add node but it already exists! (You should not be seeing this)")
                    }
                    else if(result === 201){
                        console.log("Node created successfully!")
                        console.log("Setting logged in username to " + firstName.trim() + " " + lastName.trim());
                        localStorage.setItem('username', firstName.trim() + " " + lastName.trim());
                        setLoggedIn(true);
        
                        // send login success message
                        SuccessMsg.fire({
                            icon: "success",
                            title: "Created name and signed in successfully!"
                        });
                        
                    }
                    else{
                        console.log("Some error occured: ", result);
                        setErrorMsg("ERROR: " + result);
                    }

                }
                else{
                    setErrorMsg(""); // create cancelled, clear message
                    console.log("Did not confim create new user")
                }
            });
            
        }

    }
    
    


    const logoutHandler = () => {
        console.log("logout")
        setLoggedIn(false);
        localStorage.setItem('username', '');
        setErrorMsg(""); // remove any existing error message
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
                            
                    <div className="grid w-full">
                        <form onSubmit={loginHandler} className="rounded pt-6 mb-8">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="username">
                                    Full Name
                                </label>
                                
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
                            </div>
                            
                            <div className="flex justify-center">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" type="submit" onClick={loginHandler}>
                                    Sign In
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-red-800 py-8">{errorMsg}</p>
                        <p className="text-center text-gray-700"><i>To properly add connections, please put your proper first and last name, not a nickname or username.</i></p>
                        <p className="text-center text-gray-700"><i>Your full name will be used to add connections to your node on the graph.</i></p>
                        
                    </div>
                )}

                {loggedIn && (
                            
                    <div className="grid w-full">
                        <form className="rounded pt-6 mb-8">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="username">
                                    You are logged in as {username}! 
                                </label>
                            </div>
                            
                            <div className="flex justify-center">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" type="button" onClick={logoutHandler}>
                                    Sign Out
                                </button>
                            </div>
                        </form>
                        
                    </div>
                )}

                

            </div>
        </div>
    );
}
