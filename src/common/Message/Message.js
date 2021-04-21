import { useSelector , useDispatch } from 'react-redux';
import * as Icon from 'react-bootstrap-icons';

import "./../../asset/UI/message.css"
import gitlab from "./../../asset/pic/gitlab.png";
import {close_Error_Window} from "./MessageSlice"


const Transitions = (props)=>{
    return (
        <div className="message">
            <div className="message-dialog">
                <div className="message-body">
                    <div className="icon">
                        {props.icon}
                        <p> {`${props.state} to ${props.remote}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Error =(props)=>{
    return (
        <div className="message">
            <div className="message-dialog">
                <div className="message-header">
                    <h2 className="message-title">Error!</h2>
                </div>
                <div className="message-body">
                    <h4 className="message-body-heading">Error happen when API call</h4>
                    <ul>
                        <li>確保您的網路連線正確</li>
                        <li>確保您的Token有足夠的權限</li>
                        <li>確保您的請求次數沒有超過github或gitlab的限制</li>
                    </ul>
                </div>
                <div className="message-footer">
                    <button onClick={()=>{props.dispatch(close_Error_Window())}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}


const Message = ()=> {
    const Message= useSelector(state => state.Message);
    const Modal = useSelector(state => state.Modal);
    const dispatch = useDispatch();
    if(Message.error.apiCall){
        return <Error dispatch={dispatch}/>;
    }
    if (Message.apiState.state){
        let icon, remote;
        if(Modal.currentRemoteName==="github"){
            icon =<Icon.Github size={16*15} style={{width:"100%"}} />
            remote = "GitHub"
        }    
        else{  
            icon = <img src={gitlab} alt="gitlab logo"/>
            remote = "GitLab"
        } 
        return <Transitions icon={icon} state={Message.apiState.state} remote={remote}/>      
    }
    return null ;
}

export default Message