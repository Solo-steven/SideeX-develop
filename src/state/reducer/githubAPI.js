import * as ActionTypes from "./../actions/actionTypes"

export const githubUserData=[];

export function githubAPIreducer(state , action) {
    if(action.type === ActionTypes.CHANGE_CURRENT_REMOTE){
        if(action.payload.remote==="github"){
            let currentRemote = state.githubUserData;
            return { 
                ...state,
                UIState:{
                    ...state.UIState,
                    currentRemote: "github",
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
        console.log(" USER CAHGE GITHUB CONFIG , FETCHING DATA .(user change gihtub config , fetching data.)")
        return {
            ...state,
            UIState:{
                ...state.UIState,
                apiState: {state: "Connecting", remote:"GitHub"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_FETCH_DATA){
        console.log("USER FINISH FETCHING GITHUB DATA.(user finish fetching github data.)")
        return {
            ...state,
            githubUserData : action.payload.userData,
            UIState :{
                ...state.UIState,
                currentRemote: "github",
                apiState: "",
                repoList : action.payload.userData.map(repo=> repo.name),
            }
        }
    }
    if(action.type ===ActionTypes.START_PULL_FILE){
        console.log("USER START PULL FILE TO GITHUB.(user start pull file to github.)")
        return {
            ...state,
            UIState : {
                 ...state.UIState,
                 apiState: {state: "Pulling File", remote:"GitHub"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_PULL_FILE){
        console.log("USER FINSH PULL FILE TO GITHUB.(user finsh pull file to github.)")
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
        console.log("USER START PUSH FILE TO GITHUB.(user start push file to github.)")
        return state ;
    }
    if (action.type === ActionTypes.FINISH_PUSH_FILE){
        console.log("USER FINSH PUSH FILE TO GITHUB.(user finsh push file to github.)")
        return state ;
    }
    return state;
}    