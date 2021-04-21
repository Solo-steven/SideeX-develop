import {configureStore} from "@reduxjs/toolkit";
import ModalReducer from "./../common/Modal/ModalSlice";
import MessageReducer from "./../common/Message/MessageSlice"

export default configureStore({
    reducer:{ 
        Modal :ModalReducer,
        Message :MessageReducer
    }
})