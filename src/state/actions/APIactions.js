import * as githubAPI from "./request/github/request";
import * as gitlabAPI from "./request/gitlab/request";
import * as ActionTypes from "./actionTypes";
import * as ErrorActionGenerator from "./Erroractions";

function start_Fetch_Data(remote){
    return {
        type : ActionTypes.START_FETCH_DATA,
        payload : {remote}
    }
}

function finish_Fetch_Data(userData, remote){
    return {
        type : ActionTypes.FINISH_FETCH_DATA,
        payload : { userData, remote}
    }
}

export function change_User_Config(remote){
   return  async (dispatch, getState, next)=>{
        next(start_Fetch_Data(remote));
        try {
            let userData ;
            if(remote==="github"){
                let userName = sessionStorage.getItem("github_user_name");
                let userToken = sessionStorage.getItem("github_user_token");
                userData = await githubAPI.getUserData(userName, userToken);
            }    
            else if(remote === "gitlab"){
                let url = sessionStorage.getItem("gitlab_url");
                let userName = sessionStorage.getItem("gitlab_user_name");
                let userToken = sessionStorage.getItem("gitlab_user_token");
                userData =await gitlabAPI.getUserData("gitlab.com",userName, userToken);
            }           
            console.log(`Finish fetch data from ${remote} . userData :`,userData);   
            dispatch(finish_Fetch_Data(userData,remote));      
        }catch(error){
            console.log(error);
            dispatch(ErrorActionGenerator.error_When_Use_APICall());
            return
        }                    
   }
}

function start_Pull_File(remote){
    return {
        type : ActionTypes.START_PULL_FILE,
        payload :  {remote}
    }
}
function finsh_Pull_File(remote){
    return {
        type : ActionTypes.FINISH_PULL_FILE,
        payload :  {remote}
    }
}

export function pull_File(remote){
    return  async (dispatch, getState, next)=>{
        next(start_Pull_File(remote));
        try{
            let fileBlob , currentRepoInfo = getState().UIState.currentRepoInfo, 
                currentBranchName = getState().UIState.currentBranchName, 
                currentRootInfo   = getState().UIState.currentRootInfo
            if(remote === "github"){
                let userName = sessionStorage.getItem("github_user_name");
                let userToken = sessionStorage.getItem("github_user_token");
                fileBlob  = await githubAPI.pullGitBlob(userName, userToken, currentRepoInfo.name, currentBranchName, currentRootInfo);
            }else if(remote === "gitlab"){
                let url = sessionStorage.getItem("gitlab_url");
                let userToken = sessionStorage.getItem("gitlab_user_token");
                fileBlob = await gitlabAPI.pullFile("gitlab.com", userToken, currentRepoInfo.id, currentBranchName, currentRootInfo)
            }
            console.log(fileBlob);
            dispatch(finsh_Pull_File(remote));
        }catch(error){
            dispatch(ErrorActionGenerator.error_When_Use_APICall());
            return;
        }    
    }
}

function start_Push_File(remote){
    return {
        type : ActionTypes.START_PUSH_FILE,
        payload :  {remote}
    }
}

function finsh_Push_File(remote, newData){
    return {
        type : ActionTypes.FINISH_PUSH_FILE,
        payload :  {remote, newData}
    }
}

export  function push_File(filePath, commitMessage, fileContent, remote) {
    return  async (dispatch, getState, next)=>{
        next(start_Push_File(remote));
        try{
            let currentRepoInfo =  getState().UIState.currentRepoInfo , 
                currentBranchName = getState().UIState.currentBranchName ,
                rootList   = getState().UIState.rootList;
            let newData, fileState;    
            if(remote==="github"){
                let userName  = sessionStorage.getItem("github_user_name");
                let userToken = sessionStorage.getItem("github_user_token");
                for(let file of rootList){
                    if(file.path === filePath)
                        fileState = file.oid;
                }
                newData = await githubAPI.pushFile(userName, userToken, currentRepoInfo.name, currentBranchName, filePath, commitMessage, fileContent, fileState);
            }else if(remote ==="gitlab"){
                let url = sessionStorage.getItem("gitlab_url");
                let userToken = sessionStorage.getItem("gitlab_user_token");
                for(let file of rootList){
                    if(file.path === filePath)
                        fileState = true;
                }
                newData = await gitlabAPI.pushFile("gitlab.com" , userToken ,currentRepoInfo.id, currentBranchName, filePath,commitMessage,fileContent,fileState);
            }
            console.log(newData, fileState)  
            if(fileState)
               newData = false 
            dispatch(finsh_Push_File(remote, newData));
        }catch(error){
            console.log(error);
            dispatch(ErrorActionGenerator.error_When_Use_APICall());
            return ;
        }
    }
}

function start_Create_Branch(remote){
    return {
        type : ActionTypes.START_CREATE_BRANCH,
        payload: {remote}
    }
}

function finsh_Create_Branch(newBranchName,remote){
    return {
        type : ActionTypes.FINISH_CREATE_BRANCH,
        payload:{remote, newBranchName}
    }
}

export function create_Branch(newBranchName, remote){
    return async (dispatch , getState, next)=>{
        next(start_Create_Branch(remote))
        try{
            let currentRepoInfo =  getState().UIState.currentRepoInfo , currentBranchName = getState().UIState.currentBranchName ;
            if(remote === "github"){
                let userName  = sessionStorage.getItem("github_user_name");
                let userToken = sessionStorage.getItem("github_user_token");
            }else if (remote==="gitlab"){
                let url = sessionStorage.getItem("gitlab_url");
                let userToken = sessionStorage.getItem("gitlab_user_token");
                await gitlabAPI.createBranch("gitlab.com", userToken, currentRepoInfo.id, newBranchName, currentBranchName)   
            }    
            dispatch(finsh_Create_Branch(newBranchName, remote))
        }catch(error){
            console.error(error);
            dispatch(ErrorActionGenerator.error_When_Use_APICall());
            return 
        }
    }
}