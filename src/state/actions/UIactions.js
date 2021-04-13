import * as ActionTypes from "./actionTypes"

/**
 * 
 * Github UI State
 * 
 */

export function reset_UI_Config(){
    return {
        type : ActionTypes.RESET_UI_COFIG
    }
}

export function change_Current_Repo(repoName){
    return { 
        type :ActionTypes.CHANGE_CURRENT_REPO,
        payload : {repoName}
    }
}

export function change_Current_Branch(branchName){
    return { 
        type: ActionTypes.CHANGE_CURRENT_BRANCH,
        payload : {branchName}
    }
}

export function change_Current_Root(newRootPath){
    return { 
        type: ActionTypes.CHANGE_CURRENT_ROOT,
        payload : { newRootPath}
    }
}