import axios from 'axios';
import * as queryString from "./graphql.js";

const gitHubConfig = axios.create({
    baseURL: 'https://api.github.com/graphql'
})

function genereateConfig(userToken){
    return { 
        headers :{ Authorization : `token ${userToken}`}
    }
}

async function getRepoCount(userName, userToken){
        let totalCount;
        await gitHubConfig.post("", queryString.queryRepoCount(userName),genereateConfig(userToken))
                .then((response)=>{ 
                    if(response.data.error){
                        throw new Error("graphql is fail");
                    }
                    console.log("Success get github repo count.")
                    totalCount = response.data.data.user.repositories.totalCount
                })
                .catch((error) => {
                    console.log(error)
                    throw error;
                });
        return totalCount;        
}

async function getRepoList(userName, userToken, totalCount){
    let repoList;
    await gitHubConfig.post("",queryString.queryRepoList(userName, totalCount), genereateConfig(userToken))
            .then((response)=>{
                if(response.data.error){
                    throw new Error("graphql is fail");
                }
                console.log("Success get github repo list.")
                repoList = response.data.data.repositoryOwner.repositories.edges.map((node)=>{ return {name:node.node.name} });
            })
            .catch((error)=>{
                console.log(error)
                throw error;
            })
    return repoList;          
}

async function getBranchCount(userName, userToken, repoName){
    let totalCount;
    await gitHubConfig.post("",queryString.queryBranchCount(userName, repoName), genereateConfig(userToken))
            .then(response=>{
                if(response.data.error){
                    throw new Error("graphql is fail");
                }
                console.log(`Success get  branch count.(repo:${repoName})`)
                totalCount = response.data.data.repository.refs.totalCount;
            })
            .catch(error=>{
                console.log(error)
                throw error;    
            })
    return totalCount;        
}

async function getBranchList(userName, userToken, repoName, totalCount){
    let branchList ;
    await gitHubConfig.post("", queryString.queryBranchList(userName, repoName, totalCount), genereateConfig(userToken))
            .then(response=>{
                if(response.data.error){
                    throw new Error("graphql is fail");
                }
                console.log(`Success get  branch list.(repo:${repoName})`)
                branchList= response.data.data.repository.refs.edges.map( node=>{ 
                    return { 
                        name: node.node.name.substring(6),
                        path : '',
                        child : null
                    } 
                })
            })
            .catch(error=>{
                console.log(error)
                throw error;
            })
    return branchList;           
}

async function getBranchContent(userName, userToken, repoName, branchName){
    let fileList ;
    await gitHubConfig.post("", queryString.queryBranchCotent(userName, repoName, branchName), genereateConfig(userToken))
            .then(response=>{
                if(response.data.error){
                    throw new Error("graphql is fail");
                }
                console.log(`Suceess get branch content.(repo:${repoName}, branch:${branchName})`)
                fileList = response.data.data.repository.object.entries.map(entry=>{
                    return {
                        ...entry,
                        path : entry.name,
                    }
                })
            })
            .catch(error=>{
                console.log(error)
                throw error;
            })
    return fileList;        
}

async function getGitTree(userName, userToken, repoName, rootTree){
    let fileList ;
    for (let tree of rootTree.child){
        if(tree.type === "tree"){
            await gitHubConfig.post("",queryString.queryGitTree(userName,repoName, tree.oid), genereateConfig(userToken))
                    .then(response=>{
                        if(response.data.error){
                            throw new Error("graphql is fail");
                        }
                        fileList = response.data.data.repository.object.entries.map(entry=>{
                            return {
                                ...entry,
                                path : tree.path+"/"+entry.name,
                                child : entry.type === "tree" ? [] :null,
                                parent : tree,
                            }
                        })
                        tree.child= fileList;
                        getGitTree(userName, userToken, repoName,tree);
                    })
                    .catch(error=>{
                        console.log(error)
                        throw error;
                    })
        }
    }
}


export async function getUserData(userName, userToken){
    let repoCount, repoList, branchCount , branchList, fileList , userData= [];
    repoCount = await getRepoCount(userName, userToken);
    repoList  = await getRepoList(userName, userToken, repoCount);

    for ( let repo of repoList ){    
            branchCount = await getBranchCount(userName, userToken, repo.name);
            branchList  = await getBranchList(userName, userToken,repo.name, branchCount);
        for(let branch of branchList){
            fileList = await getBranchContent(userName, userToken, repo.name, branch.name);
            branch.child = fileList.map(file=>{return {...file, parent: branch}});
            await getGitTree(userName, userToken, repo.name, branch);
        }   
        userData.push({
            name : repo.name,
            branch : branchList
        })
    } 
    return userData;   
}

export async function  pullGitBlob(userName, userToken, repoName, branchName, fileConfig){
   let fileBlob ; 
   await gitHubConfig.post("",queryString.queryPullFile(userName, repoName, branchName, fileConfig.oid), genereateConfig(userToken))
        .then(response=>{
            if(response.data.error){
                throw new Error("graphql is fail");
            }
            console.log(`Success pull file to github.(repo:${repoName},branch:${branchName}),file:${fileConfig.name}`)
            fileBlob = response.data.data.repository.object
        }) 
        .catch(error=>{
            console.log(error)
            throw error;
        })
    return fileBlob;    
}

export async function pushFile(userName, userToken ,repoName, branchName , filePath, commitMessage, fileContent ,fileSha){
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
        data = {
            name : response.data.content.name,
            path : response.data.content.path,
            oid : response.data.content.sha 
        }
        console.log(`Success push file to github.(repo:${repoName},branch:${branchName}),path:${filePath}`); 
    }).catch((error)=>{
        console.log(error);
        throw error;
    })
    return data;
}