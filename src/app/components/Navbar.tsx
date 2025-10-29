
function Navbar() {

    return (
            <div id="pixel" className="grid grid-cols-3 place-items-center h-20 rounded-xl bg-gradient-to-r from-[#7b84ff]/40 via-[#63e5fc]/40 to-[#aeff6f]/40">
                <a href="/"><p className="text-2xl">GRAPH</p></a>
                <a href="Add"><p className="text-2xl">ADD</p></a>
                <a href="Login"><p className="text-2xl">LOGIN</p></a>
            </div>
    )

}

export default Navbar