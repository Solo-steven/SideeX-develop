import * as ActionTypes from "../actions/actionTypes"

export const UIState ={
    currentRemote: "",
    apiState : "",
    currentRepo   : {name:"", path:""},
    repoList      : [],
    currentBranch : {name:"", path:""},
    branchList   : [],
    currentRoot   : {name:"", path:""},
    rootList      : [],
}

function listBranchOfRepo(repoName, githubUserData){
    for (let repo of githubUserData){
        if(repo.name === repoName){
            return repo.branch.map(branch => branch.name) 
        }
    }
    return [];
}

function listFileOfBranch(branchName, currentRepo){
    for (let branch of currentRepo.branch){
        if(branch.name === branchName){
            return branch.child.map(file => { return { path:file.path, type : file.type} })
        }
    }
    return [];
}

function listFileOfNewRoot(newRootPath, currentRoot){
    for(let newRoot of currentRoot.child){
        if(newRoot.path === newRootPath){
            if(newRoot.type === "blob")
                return [];
            return newRoot.child.map(file => { return { path:file.path, type : file.type} })
        }
    }
    return [];
}

function listFileOfParentRoot(currentRoot){
    if(!currentRoot.parent ){
        return currentRoot.child.map(file => { return { path:file.path, type : file.type} });
    }
    return currentRoot.parent.child.map(file => { return { path:file.path, type : file.type} });
}

export function UIStatereducer(state, action){
    if(!action)
        return state;
    if(action.type === ActionTypes.RESET_UI_COFIG ){
        let currentRemote = (state.UIState.currentRemote === "github" ? state.githubUserData : state.gitlabUserData);
        return { 
            ...state,
            UIState:{
                ...state.UIState,
                currentRepo   : {name:"", path:""},
                currentBranch : {name:"", path:""},
                repoList : currentRemote.map(repo=>repo.name),
                branchList   : [],
                currentRoot   : {name:"", path:""},
                rootList      : [],
            }
        }
    }
    if(action.type === ActionTypes.CHANGE_CURRENT_REPO){
        console.log(ActionTypes.CHANGE_CURRENT_REPO);
        if(!action.payload.repoName){
            return { 
                ...state,
                UIState:{
                    ...state.UIState,
                    currentRepo   : {name:"", path:""},
                    currentBranch : {name:"", path:""},
                    branchList   : [],
                    currentRoot   : {name:"", path:""},
                    rootList      : [],
                }
            }
        }
        let currentRemote = state.UIState.currentRemote === "github" ? state.githubUserData : state.gitlabUserData;
        return {
            ...state,
            UIState :{ 
                ...state.UIState,
                currentRepo   : currentRemote.filter(repo=> repo.name === action.payload.repoName)[0],
                currentBranch : {name:"", path:""},
                branchList   : listBranchOfRepo(action.payload.repoName, currentRemote),
                currentRoot   : {name:"", path:""},
                rootList      : [],
            }
        }
    }
    if(action.type === ActionTypes.CHANGE_CURRENT_BRANCH){
        if(!action.payload.branchName){
            return{ 
                ...state,
                UIState:{
                    ...state.UIState,
                    currentBranch : {name:"", path:""},
                    currentRoot   : {name:"", path:""},
                    rootList      : [],
                }
            }
        }
        return {
            ...state ,
            UIState:{
                ...state.UIState ,
                currentBranch : state.UIState.currentRepo.branch.filter(branch => branch.name === action.payload.branchName)[0], 
                currentRoot   : {name:"", path:""},
                rootList      : listFileOfBranch(action.payload.branchName, state.UIState.currentRepo),
            }
        }
    }
    if(action.type === ActionTypes.CHANGE_CURRENT_ROOT){
        let  currentRoot = state.UIState.currentRoot ;   
        if(!state.UIState.currentRoot.name)
            currentRoot = state.UIState.currentBranch;   
        if(!action.payload.newRootPath){
            return{
                ...state,
                UIState:{
                    ...state.UIState ,
                    currentRoot   : !currentRoot.parent ? currentRoot : currentRoot.parent,
                    rootList      : listFileOfParentRoot(currentRoot)
                }    
            }
        }

        return {
            ...state,
            UIState:{
                ...state.UIState ,
                currentRoot   : currentRoot.child.filter(file=>file.path === action.payload.newRootPath)[0],
                rootList      : listFileOfNewRoot(action.payload.newRootPath, currentRoot),
            }
        }
    }
    if(action.type===ActionTypes.ERROR_WHEN_USE_API_CALL){
        return {
            ...state ,
            UIState:{
                ...state.UIState,
                apiState:{state:"Error", reason:"API call"}
            }
        }
    }
    if(action.type===ActionTypes.CLOSE_ERROR_MESSAGE){
        return {
            ...state ,
            UIState:{
                ...state.UIState,
                apiState:'',
            }
        }
    }
    return state;
}