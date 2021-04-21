export function search_Repo(repoName, userData){
    for(let repo of userData){
        if(repo.name === repoName)
            return repo;
    }
    return null
}


export function search_Branch(branchName,  repoName, userData){
    let repo = search_Repo(repoName, userData);
    for(let branch of repo.branch){
        if(branch.name === branchName){
            return branch ;
        }
    }
    return null;
}


export function search_Root(rootPath, branchName, repoName, userData){
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

export function search_Root_Parent(rootPath, branchName, repoName, userData){
    let branch = search_Branch(branchName, repoName, userData);
    if(rootPath === branch.path)
        return branch
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