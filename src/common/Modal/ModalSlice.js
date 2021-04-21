import {createSlice} from "@reduxjs/toolkit";
import * as Search from "./searchFunction";

import {finish_Fetch_Data, finish_change_UserInfo} from "./../../features/Connect/ConnectAction"

const initialState = {
    currentRemoteName :  "" ,
    allRepoList : [],
    currentRepo : {name:"", id : ""},
    repoList : [],
    currentBranch : {name:""},
    branchList : [],
    currentRoot : {path : "", type : "", oid: ""},
    rootList :[],
}

const ModalSlice = createSlice({
    name: 'Modal',
    initialState, 
    reducers:{
        change_All_Repo_List(state, action){
            state.allRepoList = action.payload.allRepoList;
        },
        change_Current_Remote(state, action){
            state.currentRemoteName = action.payload.remote;
            let currentRemote = JSON.parse(localStorage.getItem(`${state.currentRemoteName}_user_data`));
            if (currentRemote)
                state.repoList = currentRemote.map(repo=>repo.name);
            else    
                state.repoList = initialState.repoList;

            state.currentRepo = initialState.currentRepo;
            state.currentBranch = initialState.currentBranch;
            state.branchList = initialState.branchList;
            state.currentRoot = initialState.currentRoot;
            state.rootList = initialState.rootList;
        },
        reset_UI(state ,action){
            if(!localStorage.getItem(`${state.currentRemoteName}_user_data`))
                return;
            let currentRemote = JSON.parse(localStorage.getItem(`${state.currentRemoteName}_user_data`));
            state.repoList = currentRemote.map(repo=>repo.name)
            state.currentRepo = initialState.currentRepo;
            state.currentBranch = initialState.currentBranch;
            state.branchList = initialState.branchList;
            state.currentRoot = initialState.currentRoot;
            state.rootList = initialState.rootList;
        },
        change_Current_Repo(state, action){
            if(!localStorage.getItem(`${state.currentRemoteName}_user_data`))
                return;
            let currentRemote = JSON.parse(localStorage.getItem(`${state.currentRemoteName}_user_data`));
            let newRepo = Search.search_Repo(action.payload.newRepoName, currentRemote);
            state.currentRepo = newRepo ;
            state.branchList = newRepo.branch.map(branch=> branch.name);

            state.currentBranch = initialState.currentBranch;
            state.currentRoot   = initialState.currentRoot;
            state.rootList      = initialState.rootList;
        },
        change_Current_Branch(state, action){
            if(!localStorage.getItem(`${state.currentRemoteName}_user_data`))
                return;
            if(action.payload.newBranchName === "current")
                return;
            let currentRemote = JSON.parse(localStorage.getItem(`${state.currentRemoteName}_user_data`));
            let newBranch = Search.search_Branch(action.payload.newBranchName, state.currentRepo.name ,currentRemote);

            state.currentBranch =newBranch ;
            state.rootList = newBranch.child.map(file=>{return {
                type : file.type,
                path : file.path,
                oid : file.oid
            }});
            state.currentRoot = initialState.currentRoot;
        },
        change_Current_Root(state, action){
            if(!localStorage.getItem(`${state.currentRemoteName}_user_data`))
                return;
            let currentRemote= JSON.parse(localStorage.getItem(`${state.currentRemoteName}_user_data`)) , newRoot;
            if(action.payload.newRootPath === "current")
                return
            else if(!action.payload.newRootPath)    
                newRoot = Search.search_Root_Parent(state.currentRoot.path, state.currentBranch.name, state.currentRepo.name , currentRemote)
            else     
                newRoot = Search.search_Root(action.payload.newRootPath, state.currentBranch.name, state.currentRepo.name , currentRemote);
            state.currentRoot = newRoot ;
            console.log("test", newRoot);
            state.rootList = !newRoot.child ? []: newRoot.child.map(file=>{return {
                type : file.type,
                path : file.path,
                oid : file.oid
            }});
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(finish_Fetch_Data,(state,action)=>{
            let currentRemote = JSON.parse(localStorage.getItem(`${state.currentRemoteName}_user_data`));
            state.repoList = currentRemote.map(repo=>repo.name);
            state.currentRepo = initialState.currentRepo;
            state.currentBranch = initialState.currentBranch;
            state.branchList = initialState.branchList;
            state.currentRoot = initialState.currentRoot;
            state.rootList = initialState.rootList;
        })
        builder.addCase(finish_change_UserInfo, (state, action) => {
            state.allRepoList  = action.payload.newAllRepoList;
            state.currentRepo = initialState.currentRepo;
            state.currentBranch = initialState.currentBranch;
            state.branchList = initialState.branchList;
            state.currentRoot = initialState.currentRoot;
            state.rootList = initialState.rootList;
        })
    }
})

export const {change_Current_Remote, reset_UI , change_Current_Repo , change_Current_Branch, change_Current_Root} = ModalSlice.actions;
export default ModalSlice.reducer;