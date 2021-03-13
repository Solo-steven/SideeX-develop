import axios from 'axios';
 

export async function requestGithubUserName(userToken){
    let name ;
    await axios({
        method : 'get',
        url : 'https://api.github.com/user',
        headers:{
            Authorization: `token ${userToken}`
        }
    }).then((response)=>{
        name = response.data.login;
        console.log(`Success get user name : ${name}`)
    }).catch((error)=>{
        console.log(error);
    })
    return name;
}

export async function requestGithubRepoOfUser(userName, userToken){
    let repo ;
    await axios({
        method:'get',
        url:`https://api.github.com/search/repositories`,
        headers : {
            Authorization: `token ${userToken}`
        },
        params:{
            q : `user:${userName}`
          }
      }
    ).then( (response)=>{
        repo =response.data.items;
        console.log(`Success get user Repo ( user name : ${userName} ).`);
    }).catch(error=>{
        console.log(error);
    });
    return repo;
}

export async function requestGithubBranchOfRepo(userName , userToken , repoName){
    let branch ; 
    await axios({
        method : 'get',
        url : `https://api.github.com/repos/${userName}/${repoName}/branches`,
        headers:{
            Authorization : `token ${userToken}`
        }
    }).then((response)=>{
        branch = response.data;
        console.log(`Success get user Branch ( repo name: ${repoName} ).`);
    }).catch((error)=>{
        console.log(error);
    })
    return branch;
}

export async function requestGithubContent(userName ,userToken , repoName , branchName){
    let content ;
    await axios({
        method:'get',
        url : `https://api.github.com/repos/${userName}/${repoName}/contents`,
        headers:{
            Authorization : `token ${userToken}`
        },
        params : {
            ref : branchName
        }
    }).then((response)=>{
        content =response.data;
        console.log(`Success get user repo Branch content . (branch name : ${branchName}) `)
    }).catch((error)=>{
        console.log(error);
    })
    return content;
}


export async function requestGitTree(userName , userToken , repoName,  dirSha){
    let tree ;
    await axios({
        method:'get',
        url : `https://api.github.com/repos/${userName}/${repoName}/git/trees/${dirSha}`,
        headers:{
            Authorization : `token ${userToken}`
        },
        params:{
            recursive : 1
        }
    }).then(response=>{
        tree =response.data.tree;
        console.log(`Success get user repo git tree . ( repo name :${repoName})`)
    }).catch((error=>{
        console.log(error);
    }))
    return tree;
}

export async function requestPushFile(userToken, userName ,repoName, branchName , filePath, commitMessage, fileContent ,fileSha){
        let data; 
        await axios({
            method : 'put',
            url : `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`,
            headers:{
                Authorization : `token ${userToken}`
            },
            data : {
                branch : branchName,
                message : commitMessage,
                content : fileContent, 
                sha : fileSha
            }
        }).then((response)=>{
            data = response.data.content;
            console.log(`push file to ${repoName} of ${branchName} in ${filePath} is success.`); 
        }).catch((error)=>{
            console.log(error);
        })
        return data;
}
export async function requestPullFile(userToken , userName , repoName ,fileSha){
    let data ;
    await axios({
        method : 'get',
        url : `https://api.github.com/repos/${userName}/${repoName}/git/blobs/${fileSha}`,
        headers:{
            Authorization : `token ${userToken}`
        }
    }).then((response)=>{
        data = response;
        console.log(response);
    }).catch((error)=>{
        console.log(error);
    })
    return data;
}