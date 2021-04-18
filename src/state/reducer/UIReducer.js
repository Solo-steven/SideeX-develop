import * as ActionTypes from "../actions/actionTypes"

export const UIState ={
    currentRemoteName: "",
    apiState : "",
    currentRepoInfo   : {name:"", id:""},
    repoList      : [],
    currentBranchName : "",
    branchList   : [],
    currentRootInfo   : {path:"", oid:"", type:""},
    rootList      : [],
}

export function UIStatereducer(state, action){
    if(!action)
        return state;
    if(action.type === ActionTypes.CHANGE_CURRENT_REMOTE){
        let newCurrentRemote = state.UIState.currentRemoteName === "github" ? state.githubUserData : state.gitlabUserData
        return { 
             ...state,
            UIState:{
            ...state.UIState,
            currentRemoteName: state.UIState.currentRemote === "github" ? "gitlab" : "github",
            currentRepoInfo   : {name:"", id:""},
            currentBranchName : "",
            repoList : newCurrentRemote.map(repo=>repo.name),
            branchList   : [],
            currentRootInfo   : {path:"", oid:"", type:""},
            rootList      : [],
            }
        }
    }
    
    if(action.type === ActionTypes.RESET_UI_COFIG ){
        let currentRemote = (state.UIState.currentRemoteName === "github" ? state.githubUserData : state.gitlabUserData);
        return { 
            ...state,
            UIState:{
                ...state.UIState,
                currentRepoInfo   : {name:"", id:""},
                currentBranchName : "",
                repoList : currentRemote.map(repo=>repo.name),
                branchList   : [],
                currentRootInfo   : {path:"", oid:"", type:""},
                rootList      : [],
            }
        }
    }
    if(action.type === ActionTypes.CHANGE_CURRENT_REPO){
        let currentRemote  = (state.UIState.currentRemoteName === "github" ? state.githubUserData : state.gitlabUserData)
        let newRepo = search_Repo(action.payload.newRepoName, currentRemote);
        return {
            ...state,
            UIState :{ 
                ...state.UIState,
                currentRepoInfo   : {name:newRepo.name, id:newRepo.id} ,
                currentBranchName : "",
                branchList        : newRepo.branch.map(branch=> branch.name),
                currentRootInfo   : {path:"", oid:"", type:""} ,
                rootList      : [],
            }
        }
    }
    if(action.type === ActionTypes.CHANGE_CURRENT_BRANCH){
        let currentRemote  = (state.UIState.currentRemoteName === "github" ? state.githubUserData : state.gitlabUserData)
        let newBranch = search_Branch(action.payload.newBranchName, state.UIState.currentRepoInfo.name, currentRemote)
        return {
            ...state ,
            UIState:{
                ...state.UIState ,
                currentBranchName : newBranch.name, 
                currentRootInfo   : {path:"", oid:"", type:""},
                rootList      : newBranch.child.map(file=>{return {path:file.path, type:file.type, oid:file.oid}}),
            }
        }
    }
    if(action.type === ActionTypes.CHANGE_CURRENT_ROOT){
        let currentRemote  = (state.UIState.currentRemoteName === "github" ? state.githubUserData : state.gitlabUserData)
        let newRoot =  !action.payload.newRootPath ? 
            search_Root_Parent( state.UIState.currentRootInfo.path, state.UIState.currentBranchName, state.UIState.currentRepoInfo.name, currentRemote ) : 
            search_Root( action.payload.newRootPath, state.UIState.currentBranchName, state.UIState.currentRepoInfo.name,currentRemote )  ;
        return {
            ...state,
            UIState:{
                ...state.UIState ,
                currentRootInfo   : { path:newRoot.path, oid:newRoot.oid ,type:newRoot.type},
                rootList      :  !newRoot.child ? []: newRoot.child.map(file=>{return {path:file.path, type:file.type, oid:file.oid}}),
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


function search_Repo(repoName, userData){
    for(let repo of userData){
        if(repo.name === repoName)
            return repo;
    }
    return null
}

function search_Branch(branchName,  repoName, userData){
    let repo = search_Repo(repoName, userData);
    for(let branch of repo.branch){
        if(branch.name === branchName){
            return branch ;
        }
    }
    return null;
}

function search_Root(rootPath, branchName, repoName, userData){
    let branch = search_Branch(branchName, repoName, userData);
    let state = branch
    while(state.path!==rootPath){  
        for(let child of state.child){
            if(rootPath.indexOf(child.path)===0){
                state = child ;
                break;
            }
        }
    }
    return state ;
}

function search_Root_Parent(rootPath, branchName, repoName, userData){
    let branch = search_Branch(branchName, repoName, userData);
    let parent =null ;
    let state = branch
    while(state.path!==rootPath){
        for(let child of state.child){
            if(rootPath.indexOf(child.path)===0){
                parent = state ;
                state = child ;
                break;
            }
        }
    }
    return parent ;
}