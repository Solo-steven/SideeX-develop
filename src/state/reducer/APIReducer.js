import * as ActionTypes from "./../actions/actionTypes";

export function APIReducer(state, action){
    /**
     *   ===== 第一類：處理使用者改變config時，重新取得資料的步驟。 =====
     *    1. 第一個 if block  
     *       (1).使用時機 : 當fetch data的 action 在 middleware 時執行前發出。
     *       (2).功能 : 改變 UI State，使 message 元件出現。
     *   2. 第二個 if block : 
     *       (1).使用時機： 當fetch data的 action 在 middleware 時執行後，且沒有錯誤時發出。
     *                    (若API有throw error，會出發Error Action)。
     *       (2).功能： 改變 UI State，使 message 元件消失。並同時改變使用者資料。
     */
    if(action.type === ActionTypes.START_FETCH_DATA){
        console.log(` USER CAHGE CONFIG , FETCHING DATA .(${action.payload.remote})`)
        return {
            ...state,
            UIState:{
                ...state.UIState,
                apiState: {state: "Connecting", remote:action.payload.remote==="github"? "GitHub" : "GitLab"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_FETCH_DATA){
        console.log(`"USER FINISH FETCHING DATA.(${action.payload.remote})`)
        let userData= (action.payload.remote==="github" ?  {githubUserData: action.payload.userData}  :  {gitlabUserData: action.payload.userData})
        return {
            ...state,
            ...userData,
            UIState :{
                ...state.UIState,
                currentRemote: action.payload.remote,
                apiState: "",
                repoList : action.payload.userData.map(repo=> repo.name),
            }
        }
    }
    /**
     *   ===== 第三個和第四個 if block，處理使用者 pull file  ======
     *   1. 
     */
    if(action.type ===ActionTypes.START_PULL_FILE){
        console.log(`USER START PULL FILE.${action.payload.remote}`)
        return {
            ...state,
            UIState : {
                 ...state.UIState,
                 apiState: {state: "Pulling File", remote:action.payload.remote==="github"? "GitHub" : "GitLab"}
            }
        }
    }
    if(action.type === ActionTypes.FINISH_PULL_FILE){
        console.log(`USER FINSH PULL FILE.${action.payload.remote}`)
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
    /**
     *  ===== 
     */
    if(action.type === ActionTypes.START_PUSH_FILE){
        console.log(`USER START PUSH FILE.${action.payload.remote}`)
        return {
            ...state,
            UIState : {
                 ...state.UIState,
                 apiState: {state: "Pushing File", remote:action.payload.remote==="github"? "GitHub" : "GitLab"}
            }
        }
    }
    if (action.type === ActionTypes.FINISH_PUSH_FILE){
        console.log(`USER FINSH PUSH FILE TO GITLAB.${action.payload.remote}`)
        let userData = (action.payload.remote==="github" ?  state.githubUserData :  state.gitlabUserData);
        if (action.payload.newData){
            userData.map(repo=>{ 
                if (repo.name === state.UIState.currentRepo.name)
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
                currentRepo   : {name:"", path:""},
                currentBranch : {name:"", path:""},
                branchList   : [],
                currentRoot   : {name:"", path:""},
                rootList      : [],
            }
        }
    }

    if(action.type === ActionTypes.START_CREATE_BRANCH){
        console.log(`USER START CREATE BRANCH.${action.payload.remote}`)
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
        console.log(userData, action)
        userData = userData.map(repo=>{
            if(repo.name === state.UIState.currentRepo.name){
                return addBranchToRepo(repo, state.UIState.currentBranch.name ,action.payload.newBranch);
            }
            return repo ;
        })
        userData= (action.payload.remote==="github" ?  {githubUserData: userData}  :  {gittLabUserData: userData})
        return{
            test: "string",
            ...state ,
            ...userData, 
            UIState:{
                ...state.UIState,
                apiState : "",
                currentRepo   : {name:"", path:""},
                currentBranch : {name:"", path:""},
                branchList   : [],
                currentRoot   : {name:"", path:""},
                rootList      : [],
            }
        }
    }
    return state ;
}


function addFileInfoToRepo(repo, UIState, data){
    let target;
    for(let branch of repo.branch){
        if(branch.name === UIState.currentBranch.name)
            target = branch;
    }
    while(target.path!==UIState.currentRoot.path){
        for(let child of target.child){
            if (UIState.currentRoot.path.indexOf(child.path)){
                console.log("deeping", child.path)
                target = child;
            }
        }
    }
    target.child.push({
        type : "blob",
        oid : data.sha,
        name : data.name,
        path : data.path
    })   
    return repo
}

function addBranchToRepo(repo, refBranch,newBranch){
    for(let branch of repo.branch){
        if(branch.name === refBranch){
            refBranch = branch;
            break;
        }
    }
    refBranch.name = newBranch
    repo.branch.push(refBranch)
}