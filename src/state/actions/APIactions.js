import * as githubAPI from "./request/github/request";
import * as gitlabAPI from "./request/gitlab/request";
import * as ActionTypes from "./actionTypes";
import * as ErrorActionGenerator from "./Erroractions";

/**
 * Github Fetch Data 
 *   
 */
export function change_Current_Remote(remote){
    return{
        type : ActionTypes.CHANGE_CURRENT_REMOTE,
        payload: {remote}
    }
}

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
                userData =await gitlabAPI.getUserData(userName, userToken);
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
            let fileBlob , currentRepo = getState().UIState.currentRepo, 
                currentBranch = getState().UIState.currentBranch, 
                currentRoot   = getState().UIState.currentRoot
            if(remote === "github"){
                let userName = sessionStorage.getItem("github_user_name");
                let userToken = sessionStorage.getItem("github_user_token");
                fileBlob  = await githubAPI.pullGitBlob(userName, userToken, currentRepo.name, currentBranch.name, currentRoot);
            }else if(remote === "gitlab"){
                let url = "gitlab.com"
                let userToken = sessionStorage.getItem("gitlab_user_token");
                fileBlob = await gitlabAPI.pullFile(url, userToken, currentRepo.id, currentBranch.name, currentRoot.path)
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

function finsh_Push_File(remote){
    return {
        type : ActionTypes.FINISH_PUSH_FILE,
        payload :  {remote}
    }
}

export  function push_File(filePath, commitMessage, fileContent, remote) {
    return  async (dispatch, getState, next)=>{
        next(start_Push_File());
        try{
            let currentRepo = getState().UIState.currentRepo , currentBranch = getState().UIState.currentBranch ,
                currentRoot =  !getState().UIState.currentRoot.child ? currentBranch : getState().UIState.currentRoot;
            let newData ;    
            if(remote==="github"){
                let userName  = sessionStorage.getItem("github_user_name");
                let userToken = sessionStorage.getItem("github_user_token");
                let fileSha = "";
                for(let file of currentRoot.child){
                    if(file.path === filePath)
                        fileSha = file.oid;
                }
                newData = await githubAPI.pushFile(userName, userToken, currentRepo.name, currentBranch.name, filePath, commitMessage, fileContent, fileSha);
            }else if(remote ==="gitlab"){
                let url = "gitlab.com";
                let userToken = sessionStorage.getItem("gitlab_user_token");
                let isExist ;
                for(let file of currentRoot.child){
                    if(file.path === filePath)
                        isExist = true;
                }
                newData = await gitlabAPI.pushFile(url , userToken ,currentRepo.id, currentBranch, filePath,commitMessage,fileContent,isExist);
            }
            console.log(newData);
            dispatch(finsh_Push_File(remote));
        }catch(error){
            console.log(error);
            dispatch(ErrorActionGenerator.error_When_Use_APICall());
            return ;
        }
    }
}