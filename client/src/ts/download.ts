import fs from 'fs';
import Axios from 'axios';

export async function downloadImage(url:string, filepath:string = '../downloads') {
    const response = await Axios({
        url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-1GgzrHS7OSBl3a6nMDzluAw1/user-kJKxZnnpTg88pSHAGFEFNJ4O/img-NT9YPyhWH8vz5tiYQBDEEhwl.png?st=2022-11-14T22%3A55%3A01Z&se=2022-11-15T00%3A55%3A01Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-11-14T23%3A04%3A37Z&ske=2022-11-15T23%3A04%3A37Z&sks=b&skv=2021-08-06&sig=UnILuKdEm1NkthtMg7NbxP%2B5Xx2QMYzoZVCOqgGSO4A%3D",
        method: 'GET',
        headers: {"Access-Control-Allow-Origin": "*"} 
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath)); 
    });
}