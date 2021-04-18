import * as ActionTypes from "./../actions/actionTypes";

export function APIReducer(state, action){
    if(action.type === ActionTypes.START_FETCH_DATA){
        return {
            ...state,  
            UIState:{
                ...state.UIState,
                apiState: {state: "Connecting", remote:action.payload.remote==="github"? "GitHub" : "GitLab"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_FETCH_DATA){
        let userData= (action.payload.remote==="github" ?  {githubUserData: action.payload.userData}  :  {gitlabUserData: action.payload.userData})
        return {
            ...state,
            ...userData,
            UIState :{
                ...state.UIState,
                currentRemoteName: action.payload.remote,
                apiState: "",
                repoList : action.payload.userData.map(repo=> repo.name),
            }
        }
    }
    if(action.type ===ActionTypes.START_PULL_FILE){
        return {
            ...state,
            UIState : {
                 ...state.UIState,
                 apiState: {state: "Pulling File", remote:action.payload.remote==="github"? "GitHub" : "GitLab"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_PULL_FILE){
        return { 
            ...state,
            UIState:{
                ...state.UIState,
                apiState: "",
                currentRepoInfo   : {name:"", id:""},
                currentBranchName : "",
                currentRootInfo   : {path:"", oid:"", type:""},
                branchList    : [],
                rootList      : [],
            }
        }
    }
    if(action.type === ActionTypes.START_PUSH_FILE){
        return {
            ...state,
            UIState : {
                 ...state.UIState,
                 apiState: {state: "Pushing File", remote:action.payload.remote==="github"? "GitHub" : "GitLab"}
            }
        }
    }
    if (action.type === ActionTypes.FINISH_PUSH_FILE){
        let userData = (action.payload.remote==="github" ?  state.githubUserData :  state.gitlabUserData);
        if (action.payload.newData){
            userData = userData.map(repo=>{ 
                if (repo.name === state.UIState.currentRepoInfo.name)
                    return addFileInfoToRepo(repo, state.UIState ,action.payload.newData)
                return repo
            })
        }    
        userData= (action.payload.remote==="github" ?  {githubUserData: userData}  :  {gittLabUserData: userData})
        return{
            test: "string",
            ...state ,
            ...userData, 
            UIState:{
                ...state.UIState,
                apiState : "",
                currentRepoInfo   : {name:"", id:""},
                currentBranchName : "",
                currentRootInfo   : {path:"", oid:"", type:""},
                branchList    : [],
                rootList      : [],
            }
        }
    }

    if(action.type === ActionTypes.START_CREATE_BRANCH){
        return {
            ...state,
            UIState : {
                 ...state.UIState,
                 apiState: {state: "Creating Branch", remote:action.payload.remote==="github"? "GitHub" : "GitLab"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_CREATE_BRANCH){
        let userData = (action.payload.remote==="github" ?  state.githubUserData :  state.gitlabUserData);
        userData = userData.map(repo=>{
            if(repo.name === state.UIState.currentRepoInfo.name){
                return addBranchToRepo(repo, state.UIState.currentBranchName ,action.payload.newBranchName);
            }
            return repo ;
        })
        userData= (action.payload.remote==="github" ?  {githubUserData: userData}  :  {gittLabUserData: userData})
        return{
            ...state ,
            ...userData, 
            UIState:{
                ...state.UIState,
                apiState : "",
                currentRepoInfo   : {name:"", id:""},
                currentBranchName : "",
                currentRootInfo   : {path:"", oid:"", type:""},
                branchList    : [],
                rootList      : [],
            }
        }
    }
    return state ;
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

function addBranchToRepo(repo, refBranchName,newBranchName){
    let newBranch ;
    for(let branch of repo.branch){
        if(branch.name === refBranchName){
            newBranch = branch;
            break;
        }
    }
    repo.branch.push({
        ...newBranch,
        name : newBranchName
    })
}