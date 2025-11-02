import axios from 'axios';
import { SuccessMsg } from './alerts';


export async function NodeExists (name : string) {
    
    if(name.trim() === "")
    {
        console.log("No node given as arg");
        return false;
    }

    console.log(`Checking if ${name.trim()} exists...`)

    try{
        const response = await axios.get(`../api/nodes/${name}`);
        console.log(response.data);
    
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
        
    } catch (error: any){
        if (axios.isAxiosError(error)){
            console.log("Axios error: ", error.response?.status, error.response?.data)
        } else{
            console.log("Unexpected error: ", error);
        }
    }

}

export async function CreateLink(source : string, target: string, addedBy: string){

    const sourceRes = await axios.get(`../api/nodes/${source}`);
    const targetRes = await axios.get(`../api/nodes/${target}`);

    // Get ids of source and target nodes
    const sourceId = sourceRes.data[0]?.id;
    const targetId = targetRes.data[0]?.id;

    console.log(`Adding links between nodes ${source} (${sourceId}) and ${target} (${targetId})`);

    if(targetId === sourceId)
    {
        console.log("Can't link to self!");
        return 409;
    }

    try{

        const response = await axios.post('../api/links', {
            source: sourceId,
            target: targetId,
            added_by: addedBy
        });

        console.log("response from db adding links:", response.status);
        console.log("Added link between nodes successfully!");

        // send success msg
        SuccessMsg.fire({
            icon: "success",
            title: `Successfully linked ${target} to you`
        });

        return 201;

    } catch(error: any) {
        if (axios.isAxiosError(error)){
            if(error.response?.status === 409){
                console.log("Link already exists! (409 Conflict) IN DB");
                // send error msg
                SuccessMsg.fire({
                    icon: "error",
                    title: `Link already exists!`
                });

                return 409;
            }
        }
        console.log("Error creating link between 2 nodes")
    }

}

export async function CreateNode(name: string, addedBy : string){

    try{

        const response = await axios.post('../api/nodes', {
            name: name,
            added_by: addedBy
        });

        console.log(response);
        console.log("Added node successfully!");
        return 201;

    } catch(error: any) {
        if (axios.isAxiosError(error)){
            if(error.response?.status === 409){
                console.log("Node already exists! (409 Conflict)");
                return 409;
            }
        }
        console.log("Error creating node between 2 nodes")
    }

}


export async function CreateNodeAndLink(fullname: string, userName: string){
    const result = await CreateNode(fullname, userName);
    if(result === 409){
        console.log("Tried to add node but it already exists!")
        return(409)
    }
    else if(result === 201){
        console.log("Node created successfully!")

        const result = await CreateLink(userName, fullname, userName)
        if(result === 409){
            console.log("Created node but link already exists! (Should not happen)")
            return(409)
        }
        // Successfully added new node and linked it to user
        else if(result === 201){
            console.log("Link created successfully!")
            
            // send success msg
            SuccessMsg.fire({
                icon: "success",
                title: `Successfully added ${fullname} and linked to you!`
            });

            return(201);
        }
        else{
            console.log("Some error occured: ", result);
            return(500);

        }
    }
    else{
        console.log("Some error occured: ", result);
        return(500);
    }
    
}


export async function GetAllNodesAsArray() {

    try{
        const response = await axios.get(`../api/nodes/`)
        const nameslist = response.data.map((node: { name: any; }) => node.name)
        
        return nameslist;
    }
    catch(error: any){
        console.log("Error: ", error);
    }


}