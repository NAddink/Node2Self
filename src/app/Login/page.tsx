"use client";
import { useEffect, useState } from "react";
import React, { ChangeEvent, MouseEvent } from 'react';
import Navbar from "../components/Navbar";
import nodeExists from "../components/db";
 

export default function Login() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [fullName, setFullName] = useState(''); // Initialize state for input value
    const [loading, setLoading] = useState(true);

    const [errorMsg, setErrorMsg] = useState("");


    
    useEffect(() => {
        let fullNameStorage : string | null = localStorage.getItem('fullname');
        if(fullNameStorage !== '' && fullNameStorage != null){
            console.log("Full name found in storage var, full name is " + fullNameStorage)
            setFullName(fullNameStorage ?? "");
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

    const loginHandler = async () => {

        setErrorMsg("Loading...");

        const exists = await nodeExists(firstName.trim() + " " + lastName.trim());
        if(!exists)
        {
            // if node does not already exist for user loggin in, create one.
            console.log("This name does not already have a node. Create one.")
            setErrorMsg("This name does not already have a node. Create one.")
        }
        if(exists){
            // name logging in already has a node
            console.log("Setting full name to " + firstName.trim() + " " + lastName.trim());
            localStorage.setItem('fullname', firstName.trim() + " " + lastName.trim());
            setLoggedIn(true);

        }
        

    }
    
    


    const logoutHandler = () => {
        console.log("logout")
        setLoggedIn(false);
        localStorage.setItem('fullname', '');
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
                        <form className="rounded pt-6 mb-8">
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
                            
                            <div className="mb-6">
                            </div>
                            <div className="flex justify-center">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" type="button" onClick={loginHandler}>
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
                                    You are logged in! {firstName} {lastName} 
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
