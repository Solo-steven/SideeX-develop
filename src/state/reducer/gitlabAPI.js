import * as ActionTypes from "./../actions/actionTypes"

export const gitlabUserData=[];

export function gitlabAPIreducer(state , action) {
    if(action.type === ActionTypes.CHANGE_CURRENT_REMOTE){
        if(action.payload.remote==="gitlab"){
            let currentRemote = state.gitlabUserData;
            return { 
                ...state,
                UIState:{
                    ...state.UIState,
                    currentRemote: "gitlab",
                    currentRepo   : {name:"", path:""},
                    currentBranch : {name:"", path:""},
                    repoList : currentRemote.map(repo=>repo.name),
                    branchList   : [],
                    currentRoot   : {name:"", path:""},
                    rootList      : [],
                }
            }
        }
    }
    if(action.type === ActionTypes.START_FETCH_DATA){
        console.log(" USER CAHGE GITLAB CONFIG , FETCHING DATA .(user change gihtub config , fetching data.)")
        return {
            ...state,
            UIState:{
                ...state.UIState,
                apiState: {state: "Connecting ", remote:"GitLab"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_FETCH_DATA){
        console.log("USER FINISH FETCHING GITLAB DATA.(user finish fetching GITLAB data.)")
        return {
            ...state,
            gitlabUserData : action.payload.userData,
            UIState :{
                ...state.UIState,
                currentRemote: "gitlab",
                apiState: "",
                repoList : action.payload.userData.map(repo=> repo.name),
            }
        }
    }
    if(action.type ===ActionTypes.START_PULL_FILE){
        console.log("USER START PULL FILE TO GITLAB.(user start pull file to GITLAB.)")
        return {
            ...state,
            UIState : {
                 ...state.UIState,
                 apiState: {state: "Pulling File ", remote:"GitLab"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_PULL_FILE){
        console.log("USER FINSH PULL FILE TO GITLAB.(user finsh pull file to GITLAB.)")
        return { 
            ...state,
            UIState:{
                ...state.UIState,
                apiState: "",
                currentRepo   : {name:"", path:""},
                currentBranch : {name:"", path:""},
                branchList   : [],
                currentRoot   : {name:"", path:""},
                rootList      : [],
            }
        }
    }

    if(action.type === ActionTypes.START_PUSH_FILE){
        console.log("USER START PUSH FILE TO GITLAB.(user start push file to GITLAB.)")
        return state ;
    }
    if (action.type === ActionTypes.FINISH_PUSH_FILE){
        console.log("USER FINSH PUSH FILE TO GITLAB.(user finsh push file to GITLAB.)")
        return state ;
    }
    return state;
}    