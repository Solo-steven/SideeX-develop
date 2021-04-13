import {githubUserData, githubAPIreducer} from "./githubAPI";
import {gitlabUserData, gitlabAPIreducer} from "./gitlabAPI"
import {UIState, UIStatereducer} from "./UIState";

export const initialState = {
     githubUserData ,
     gitlabUserData,
     UIState
}

export const reducer =(state, action)=>{ 
    if(!state) 
        return initialState;  
    if(action.payload){
        if(action.payload.remote==="github"){
            return githubAPIreducer(state, action); 
        }else if(action.payload.remote ==="gitlab"){
            return gitlabAPIreducer(state, action);
        }  
    }    
    return UIStatereducer(state, action); 
}