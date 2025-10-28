import axios from 'axios';


async function nodeExists (name : string) {
    
    if(name.trim() === "")
    {
        console.log("No node given as arg");
        return false;
    }

    const response = await axios.get(`../api/nodes/${name}`);
    console.log(response.data);

    const length = response.data.length;
    console.log(length);


    if(response.data.length === 0)
    {
        console.log("Node does not exist")
        return false;
    }

    if(response.data.length === 1)
    {
        console.log("Node exists")
        return true;
    }

    return false;

}

export default nodeExists;