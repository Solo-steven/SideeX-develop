import {createAction} from '@reduxjs/toolkit';

import * as githubAPI from "./../../request/github/request";
import * as gitlabAPI from "./../../request/gitlab/request";

export const start_Push_File = createAction("Start_Push_File");
export const finish_Push_File = createAction("Finish_Push_File");

export const push_File = (remote, config) => async (dispatch)=>{
    dispatch(start_Push_File());
    try{
        if(remote === "github"){
            let userName = sessionStorage.getItem("github_user_name");
            let userToken = sessionStorage.getItem("github_user_token");
            let newData = await githubAPI.pushFile(userName, userToken,
                config.currentRepo.name, 
                config.currentBranch.name,
                config.filePath ,
                config.commitMessage, 
                config.fileContent ,
                config.sha );

        }else if(remote === "gitlab"){
            await gitlabAPI.pushFile()
        }
        dispatch(finish_Push_File())
    }catch(error){
    }
}


function addFileInfoToRepo(repo, UIState, data){
    let target;
    for(let branch of repo.branch){
        if(branch.name === UIState.currentBranchName)
            target = branch;
    }
    while(target.path!==UIState.currentRootInfo.path){
        for(let child of target.child){
            if (UIState.currentRootInfo.path.indexOf(child.path)===0){
                console.log("deeping", child.path)
                target = child;
            }
        }
    }
    target.child.push({
        type : "blob",
        oid : data.oid,
        name : data.name,
        path : data.path
    })   
    return repo
}
