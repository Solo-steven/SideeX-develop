import {createStore , applyMiddleware} from "redux";

import  {  initialState ,reducer} from "./reducer/reducer";
import  { request_Middleware } from "./middleware/middleware";
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducer, initialState ,composeWithDevTools(applyMiddleware(request_Middleware)) );

store.subscribe(()=>{
    console.log("STORE CHANGE :", store.getState());
})
export default store;