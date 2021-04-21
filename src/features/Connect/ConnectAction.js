import {createAction} from "@reduxjs/toolkit";
import * as githubAPI from "./../../request/github/request";
import * as gitlabAPI from "./../../request/gitlab/request"
 
export const start_Fetch_Data = createAction("Start_Fetch_Data");
export const finish_Fetch_Data = createAction("Finsh_Fetch_Data");

export const fetch_Data =(remote)=> async (dispatch)=>{
    dispatch(start_Fetch_Data(remote));
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
        localStorage.setItem(`${remote}_user_data`, JSON.stringify(userData));
        console.log(localStorage.getItem(`${remote}_user_data`))
        dispatch(finish_Fetch_Data());      
    }catch(error){
        console.log(error);
        return
    }                    
}


/**
 *    Not Using 
 */

export const start_change_UserInfo = createAction("Start_Change_UserInfo");
export const finish_change_UserInfo = createAction(
                    "Finish_Change_UserInfo",
                    function prepare(newAllRepoList){
                        return {payload:{ 
                                newAllRepoList
                          }}  
                    });

export const change_UserInfo = (remote)=> async(dispatch)=>{
    dispatch(start_change_UserInfo());
    try {
        if(remote==="github"){
            let userName = sessionStorage.getItem("github_user_name");
            let userToken = sessionStorage.getItem("github_user_token");
            let newAllRepoList = await githubAPI.getUserInfo(userName, userToken)
            dispatch(finish_change_UserInfo(newAllRepoList))
            return
        }
        else if (remote === "gitlab"){
            let url = sessionStorage.getItem("gitlab_url");
            let userName = sessionStorage.getItem("gitlab_user_name");
            let userToken = sessionStorage.getItem("gitlab_user_token");
            let userData =await gitlabAPI.getUserData("gitlab.com",userName, userToken);
        }
    }catch(error){

    }
}


export const start_Fetch_UserData = createAction("Start_Fetch_UserData");
export const finish_Fetch_UserData = createAction("Finish_Fetch_Userdata");

export const fetch_UserData=(remote, repoLits)=>async(dispatch)=>{
    dispatch(start_Fetch_UserData());
    try{
        let userData ;
        if(remote==="github"){
            let userName = sessionStorage.getItem("github_user_name");
            let userToken = sessionStorage.getItem("github_user_token");
             
            dispatch(finish_Fetch_UserData())
        }
        else if (remote === "gitlab"){
            let url = sessionStorage.getItem("gitlab_url");
            let userName = sessionStorage.getItem("gitlab_user_name");
            let userToken = sessionStorage.getItem("gitlab_user_token");
            userData =await gitlabAPI.getUserData("gitlab.com",userName, userToken);
        }
        console.log(`Finish fetch data from ${remote} . userData :`,userData);   
        localStorage.setItem(`${remote}_user_data`, JSON.stringify(userData));
        console.log(localStorage.getItem(`${remote}_user_data`))
    }catch(error){

    }
}