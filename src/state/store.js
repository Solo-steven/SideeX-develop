import {createStore , applyMiddleware} from "redux";

import  {  initialState ,reducer} from "./reducer/reducer";
import  { request_Middleware } from "./middleware/middleware"

const store = createStore(reducer, initialState ,applyMiddleware(request_Middleware) );

store.subscribe(()=>{
    console.log("STORE CHANGE :", store.getState());
})
export default store;