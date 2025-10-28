
function Navbar() {

    return (
            <div className="grid grid-cols-3 place-items-center h-20 rounded-xl bg-gradient-to-r from-[#7b84ff]/40 via-[#63e5fc]/40 to-[#aeff6f]/40">
                <a href="/"><p className="font-martian text-xl">GRAPH</p></a>
                <a href="Add"><p className="font-martian text-xl">ADD</p></a>
                <a href="Login"><p className="font-martian text-xl">LOGIN</p></a>
            </div>
    )

}

export default Navbar