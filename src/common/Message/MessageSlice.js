import {createSlice} from "@reduxjs/toolkit";

import {start_Fetch_Data , finish_Fetch_Data} from "./../../features/Connect/ConnectAction";
import {start_Pull_File, finish_Pull_File} from "./../../features/Pull/PullAction"

const initialState = {
    apiState:{ 
        state : "",
    },
    error : {
        apiCall : "",
        resonse :"",
    }
}

const MessagesSlice = createSlice({
    name : "Message",
    initialState ,
    reducers : {
        error_When_API_Call:{
            reducer:(state, action)=>{
                state.error.apiCall = action.payload.apiCall;
                state.error.resonse = action.payload.resonse;
            },
            prepare:(apiCall, resonse)=>{
                   return {payload:{ apiCall, resonse}} 
            }
        },
        close_Error_Window(state, action){
            state.error.apiCall ="";
            state.error.resonse = "";
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(start_Fetch_Data, (state, action)=>{
            state.apiState.state = "Fetching Data";
        })
        builder.addCase(finish_Fetch_Data,(state, action)=>{
            state.apiState.state = initialState.apiState.state
        })
        builder.addCase(start_Pull_File, (state, action)=>{
            state.apiState.state = "Pulling File";
        })
        builder.addCase(finish_Pull_File,(state, action)=>{
            state.apiState.state = initialState.apiState.state
        })
    }
})

export const {error_When_API_Call, close_Error_Window} = MessagesSlice.actions;
export default MessagesSlice.reducer;