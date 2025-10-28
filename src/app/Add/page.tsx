export default function Add() {
    


    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className="h-[95vh] w-[95vw] bg-linear-45 from-[#fada61] via-[#ff9188] to-[#ff5acd] rounded-xl p-[2%] overflow-hidden">
                {/* Navbar */}
                <div className="grid grid-cols-3 place-items-center h-20 rounded-xl bg-gradient-to-r from-[#7b84ff]/40 via-[#63e5fc]/40 to-[#aeff6f]/40">
                    <a href="/"><p className="font-martian text-xl">GRAPH</p></a>
                    <a href="Add"><p className="font-martian text-xl">ADD</p></a>
                    <a href="Login"><p className="font-martian text-xl">LOGIN</p></a>
                </div>
                
                <h1>ADD</h1>

            </div>
        </div>
    );
}
