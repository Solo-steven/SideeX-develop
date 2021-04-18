import * as ActionTypes from "./actionTypes"

/**
 * 
 * Github UI State
 * 
 */

export function change_Current_Remote(){
    return{
        type : ActionTypes.CHANGE_CURRENT_REMOTE,
    }
}

export function reset_UI_Config(){
    return {
        type : ActionTypes.RESET_UI_COFIG
    }
}

export function change_Current_Repo(newRepoName){
    return { 
        type :ActionTypes.CHANGE_CURRENT_REPO,
        payload : {newRepoName}
    }
}

export function change_Current_Branch(newBranchName){
    return { 
        type: ActionTypes.CHANGE_CURRENT_BRANCH,
        payload : {newBranchName}
    }
}

export function change_Current_Root(newRootPath){
    return { 
        type: ActionTypes.CHANGE_CURRENT_ROOT,
        payload : { newRootPath}
    }
}