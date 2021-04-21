import axios from 'axios';


function DFS_Treetify(rootNode, data){
    for(let dir of rootNode.child){
        if(dir.type === 'tree'){
            if(data.path.indexOf(dir.path)!== -1){
                DFS_Treetify(dir , data);
                return;
            }
        }
    }
    rootNode.child.push(data);
}

async function Treetify(rootNode){
    let list=rootNode.child;
    rootNode.child=[];
    for(let data of list){
        DFS_Treetify(rootNode , data);
    }
}

 async function getRepoList(url, userName , userToken){
    let project ;
    await axios({
        method : 'get',
        url : `https://${url}/api/v4/users/${userName}/projects`,
        headers: {
            'PRIVATE-TOKEN' :  `${userToken}`
        }
    }).then(response=>{
        project = response;
        console.log('Success get user Project.');
    }).catch((error)=>{
        console.log(error);
        throw error;
    })
    return project.data; 
}

async function getBranchList(url, userToken , projectId){
    let branch ;
    await axios({
        method : 'get',
        url : `https://${url}/api/v4/projects/${projectId}/repository/branches`,
        headers :{
            'PRIVATE-TOKEN' : userToken
        }
    }).then(response=>{
        branch = response
        console.log('Success get user branch.');
    }).catch((error)=>{
        console.log(error)
        throw error;
    })
    return branch.data;

}

async function getBranchContent(url, userToken , projectId , branchName){
    let content ; 
    await axios({
        method : 'get',
        url : `https://${url}/api/v4/projects/${projectId}/repository/tree`,
        headers:{
            'PRIVATE-TOKEN' : userToken
        },
        params:{
            path : '/',
            ref : branchName,
            recursive : true,
            per_page : 1000
        }
    }).then(response=>{
        content = response;
        console.log('Success get branch info.')
    }).catch((error)=>{
        console.log(error, branchName);
        throw error;
    })
    return content.data;
}
export async function getUserData(url, userName, userToken){
    let repolist , branchlist, branchContent, userData =[];
    repolist = await getRepoList(url, userName,userToken);
    for(let repo of repolist){
        branchlist = await getBranchList(url, userToken, repo.id);
        for ( let index in branchlist){
            branchlist[index] = {name : branchlist[index].name, type: "tree", path:""}
            branchContent = await getBranchContent(url, userToken, repo.id, branchlist[index].name);
            branchlist[index].child = branchContent.map(file=>{
                if(file.type==="tree")
                    return {...file, child:[]}
                return file    
            });
            Treetify(branchlist[index]);
        }
        userData.push({
            name : repo.name , 
            id : repo.id, 
            branch : branchlist
        })
    }
    return userData;
}

export async function pullFile(url, userToken, projectId, branchName ,fileConfig){
    let file ;
    await axios({
        method : 'get',
        url : `https://${url}/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(fileConfig.path)}/raw`,
        headers:{
            'PRIVATE-TOKEN' : userToken
        },
        params:{
            ref : branchName
        }
    }).then((response)=>{
        file= response;
    }).catch((error)=>{
        console.log(error , "Pull info : " , userToken , projectId, branchName , `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(fileConfig.path)}/raw`);
        throw error;
    })
    return file.data;
}


export async function pushFile(url, userToken, projectId , branchName, filePath  ,commitMessage ,fileContent , isExist){
    let data ;
    await axios({
        method : (isExist ? 'put' : 'post'),
        url : `https://${url}/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
        headers :{
            'PRIVATE-TOKEN' : userToken
        },
        params:{
            branch : branchName,
            commit_message :commitMessage,
            content : fileContent
        }
    }).then((response)=>{
        console.log('Success push file to gilab');
        let name = response.data.file_path.split("/");
        name = name[name.length-1]
        data = {
            name : name ,
            path : response.data.file_path ,
            sha: null 
        }
    }).catch((error)=>{
        throw error;
    })
    return data;
}


export async function createBranch(url ,userToken, repoId, newBranchName , branchRef ){
    let data;
    await axios({
        method : 'post',
        url : `https://${url}/api/v4/projects/${repoId}/repository/branches`,
        headers:{
            'PRIVATE-TOKEN' : userToken
        },
        params:{
            branch : newBranchName, 
            ref : branchRef
        }
    }).then((response)=>{
        data = response;
        console.log('Success new a branch');
    }).catch((error)=>{
        console.log(error);
    })
    return data;
}