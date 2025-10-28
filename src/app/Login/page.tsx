"use client";
import { useEffect, useState } from "react";
import React, { ChangeEvent, MouseEvent } from 'react';
 

export default function Login() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [fullname, setFullName] = useState("");
    const [inputValue, setInputValue] = useState(''); // Initialize state for input value

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value); // Update state on every input change
        console.log("current input " + inputValue)
    };

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
    }, []);
    
    const loginHandler = () => {
        console.log("login")
        setLoggedIn(true);
        localStorage.setItem('fullname', inputValue);
    }


    const logoutHandler = () => {
        console.log("logout")
        setLoggedIn(false);
        localStorage.setItem('fullname', '');
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <div className="grid grid-cols-3 place-items-center h-20 rounded-xl bg-gradient-to-r from-[#7b84ff]/40 via-[#63e5fc]/40 to-[#aeff6f]/40">
                    <a href="/"><p className="font-martian text-xl">GRAPH</p></a>
                    <a href="Add"><p className="font-martian text-xl">ADD</p></a>
                    <a href="Login"><p className="font-martian text-xl">LOGIN</p></a>
                </div>

                {!loggedIn && (
                            
                    <div className="grid w-full">
                        <form className="rounded pt-6 mb-8" onSubmit={loginHandler}>
                            <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="username">
                                Full Name
                            </label>
                            
                            <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center" 
                            id="username" 
                            type="text" 
                            placeholder="John Smith" 
                            value={inputValue} // Bind input value to state
                            onChange={handleChange} // Update state on change
                            />
                            </div>
                            
                            <div className="mb-6">
                            </div>
                            <div className="flex justify-center">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" type="submit">
                                    Sign In
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-gray-700"><i>To properly add connections, please put your proper first and last name, not a nickname or username.</i></p>
                        <p className="text-center text-gray-700"><i>Your full name will be used to add connections to your node on the graph.</i></p>
                        
                    </div>
                )}

                {loggedIn && (
                            
                    <div className="grid w-full">
                        <form className="rounded pt-6 mb-8">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="username">
                                    You are logged in! {fullname} 
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
