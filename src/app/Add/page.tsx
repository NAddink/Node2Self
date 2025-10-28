"use client";
import { useState, ChangeEvent } from "react";
import nodeExists, { linkNames } from "../components/db";
import Navbar from "../components/Navbar";

export default function Add() {

    const [firstName, setFirstName] = useState(''); // Initialize state for first name
    const [lastName, setLastName] = useState(''); // Initialize state for last name

    const firstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value); // Update state on every input change
        console.log("DEBUG: Current first name " + firstName)
    };

    const lastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value); // Update state on every input change
        console.log("DEBUG: Current last name " + lastName)
    };
    

    const addHandler = () => {

        const fullname = firstName.trim() + " " + lastName.trim();
        console.log(`DEBUG: Entered name is \'${fullname}\'`)

        nodeExists(firstName.trim() + " " + lastName.trim())
        .then(result => {
            console.log(result);
            if(result) { // entered node already exists
                // only create connection to node
            }
            if(!result){ // entered node does not exist
                // create node and create connection from current
            }
            
        })
    }
    


    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <Navbar />
                
                <div className="pt-5">
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
                    

                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" type="button" onClick={addHandler}>
                        Add Connection
                    </button>
                </div>

            </div>
        </div>
    );
}
