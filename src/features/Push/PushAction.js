import {createAction} from '@reduxjs/toolkit';

import * as githubAPI from "./../../request/github/request";
import * as gitlabAPI from "./../../request/gitlab/request";

export const start_Push_File = createAction("Start_Push_File");
export const finish_Push_File = createAction("Finish_Push_File", function prepare(newData){
                                    return{payload:{
                                        newData
                            }}});


export const push_File = (remote, config) => async (dispatch)=>{
    dispatch(start_Push_File());
    try{
        let newData ;
        if(remote === "github"){
            let userName = sessionStorage.getItem("github_user_name");
            let userToken = sessionStorage.getItem("github_user_token");
            newData = await githubAPI.pushFile(userName, userToken,
                config.currentRepo.name, 
                config.currentBranch.name,
                config.filePath ,
                config.commitMessage, 
                config.fileContent ,
                config.sha );

        }else if(remote === "gitlab"){
            let url = sessionStorage.getItem("gitlab_url");
            let userToken = sessionStorage.getItem("gitlab_user_token");
            newData = await gitlabAPI.pushFile("gitlab.com", userToken,
                config.currentRepo.id, 
                config.currentBranch.name,
                config.filePath ,
                config.commitMessage, 
                config.fileContent ,
                Boolean(config.sha) );
        }
        dispatch(finish_Push_File(newData))
    }catch(error){
        console.log(error);
       // dispatch(error_When_API_Call("Push", error))
    }
}