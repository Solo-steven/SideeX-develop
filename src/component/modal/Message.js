import React from 'react';
import { useSelector , useDispatch } from 'react-redux';
import * as Icon from 'react-bootstrap-icons';

import "./../../asset/UI/message.css"
import gitlab from "./../../asset/pic/gitlab.png";

import {close_Error_Message} from "./../../state/actions/Erroractions";

const Message = ()=> { 
    const apiState = useSelector(state => state.UIState.apiState);
    const dispatch = useDispatch();
    console.log(apiState)
    let icon;
    if (!apiState)
      return null;
    if (apiState.state ==="Error"){
        return (
        <div className="message">
            <div className="message-dialog">
                <div className="message-header">
                    <h2 className="message-title">Error!</h2>
                </div>
                <div className="message-body">
                    <h4 className="message-body-heading">Error happen when {"API call"}</h4>
                    <ul>
                        <li>確保您的網路連線正確</li>
                        <li>確保您的Token有足夠的權限</li>
                        <li>確保您的請求次數沒有超過github或gitlab的限制</li>
                    </ul>
                </div>
                <div className="message-footer">
                    <button onClick={()=>{dispatch(close_Error_Message())}}>Cancel</button>
                </div>
            </div>
        </div>
        )
    }
    if(apiState.remote==="GitHub"){
        icon =<Icon.Github size={16*15} style={{width:"100%"}} /> 
    }
    else if (apiState.remote==="GitLab"){
        icon = <img src={gitlab}/>
    }
    return (
        <div className="message">
            <div className="message-dialog">
                <div className="message-body">
                    <div className="icon">
                        {icon}
                        <p> {`${apiState.state} to ${apiState.remote}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message
