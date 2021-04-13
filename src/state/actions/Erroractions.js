import * as ActionTypes from "./actionTypes";

export function error_When_Use_APICall(){
    return { 
        type : ActionTypes.ERROR_WHEN_USE_API_CALL
    }    
}

export function close_Error_Message(){
    return { 
        type : ActionTypes.CLOSE_ERROR_MESSAGE
    }
}