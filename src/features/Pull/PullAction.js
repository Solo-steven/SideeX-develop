import {createAction} from "@reduxjs/toolkit";

import * as githubAPI from "./../../request/github/request";
import * as gitlabAPI from "./../../request/gitlab/request";

export const start_Pull_File = createAction("Start_Pull_File");
export const finish_Pull_File = createAction("Finish_Pull_File");

export const pull_File = (remote, currentRepo, currentBranch, currentRoot)=> async (dispatch)=>{
    dispatch(start_Pull_File());
    try{
        let fileBlob;
        if(remote === "github"){
            let userName = sessionStorage.getItem("github_user_name");
            let userToken = sessionStorage.getItem("github_user_token");
            fileBlob  = await githubAPI.pullGitBlob(userName, userToken, currentRepo.name, currentBranch.name, currentRoot);
        }else if(remote === "gitlab"){
            let url = sessionStorage.getItem("gitlab_url");
            let userToken = sessionStorage.getItem("gitlab_user_token");
            fileBlob = await gitlabAPI.pullFile("gitlab.com", userToken, currentRepo.id, currentBranch.name, currentRoot);
        }
        console.log(fileBlob);
        dispatch(finish_Pull_File());
    }catch(error){
        return;
    }    
}

