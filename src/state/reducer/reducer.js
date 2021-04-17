import {UIState, UIStatereducer} from "./UIReducer";
import {APIReducer} from "./APIReducer"

export const initialState = {
     githubUserData : [],
     gitlabUserData: [],
     UIState
}

export const reducer =(state, action)=>{ 
    if(!state) 
        return initialState;  
    if(action.payload && action.payload.remote){
        return APIReducer(state, action)
    }    
    return UIStatereducer(state, action); 
}