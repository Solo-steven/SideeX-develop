import axios from 'axios';

async function requestUserId(userName, userToken){
    let name ;
    await axios({
        method : 'get',
        url : 'https://gitlab.com/api/v4/user',
        header:{
            'PRIVATE-TOKEN' : userToken
        },
        params:{
            'username' : userName
        }
    }).then((response)=>{
        console.log(response);
    }).catch((error)=>{
        console.log(error);
    })
}

export async function requestGitLabRepoOfUser(userName , userToken){
    let project ;
    await axios({
        method : 'get',
        url : `https://gitlab.com/api/v4/users/${userName}/projects`,
        headers: {
            'PRIVATE-TOKEN' :  `${userToken}`
        }
    }).then(response=>{
        project = response;
        console.log('Success get user Project.');
    }).catch((error)=>{
        console.log(error);
    })
    return project.data; 
}

export async function requestGitLabBranchOfRepo(userName , userToken , projectId){
    let branch ;
    await axios({
        method : 'get',
        url : `https://gitlab.com/api/v4/projects/${projectId}/repository/branches`,
        headers :{
            'PRIVATE-TOKEN' : userToken
        }
    }).then(response=>{
        branch = response
        console.log('Success get user branch.');
    }).catch((error)=>{
        console.log(error)
    })
    return branch.data;

}

export async function requestGitLabBrancContent(userName , userToken , projectId , branchName){
    let content ; 
    await axios({
        method : 'get',
        url : `https://gitlab.com/api/v4/projects/${projectId}/repository/tree`,
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
    })
    return content.data;
}

export async function requestPushFile(userToken, projectId , branchName, filePath  ,commitMessage ,fileContent , isExist){
    await axios({
        method : (isExist ? 'put' : 'post'),
        url : `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}`,
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
        console.log(response);
    }).catch((error)=>{
        console.log(error);
    })
}

export async function requestPullFile(userToken, projectId, branchName ,filePath){
    let file ;
    await axios({
        method : 'get',
        url : `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(filePath)}/raw`,
        headers:{
            'PRIVATE-TOKEN' : userToken
        },
        params:{
            ref : branchName
        }
    }).then((response)=>{
        file= response;
    }).catch((error)=>{
        console.log(error);
    })
    return file.data;
}