import React from "react"
import {Switch, Route, Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import * as Icon from 'react-bootstrap-icons';

import "./../../asset/UI/modal.css";
import gitlab from "./../../asset/pic/gitlab.png"
import * as UIActionGenerator from "./../../state/actions/UIactions"
import Message from './Message';
import Introduction from './Introduction'
import Config from './Config'
import Pull from './Pull';
import Push from './Push'

const Modal = (props)=>{
    const dispatch = useDispatch();
    return (
        <React.Fragment> 
            <div className="modal" onClick={()=>{ dispatch(UIActionGenerator.reset_UI_Config()); props.push('/')} }>
                <div className="modal-dialog" onClick={(e) => (e.stopPropagation())}>
                        <div className="modal-heading">
                            <div className="modal-option">
                                <Link to={`${props.match.url}/inputToken`} className="icon" onClick={()=>{dispatch(UIActionGenerator.reset_UI_Config())}} >
                                    <Icon.Lock size={16*2.4}/>
                                </Link>
                                <Link to={`${props.match.url}/pullFile`} className="icon" onClick={()=>{dispatch(UIActionGenerator.reset_UI_Config())}}>
                                    <Icon.ArrowDownSquare size={16*2.4}/>
                                </Link>           
                                <Link to={`${props.match.url}/pushFile`}  className="icon" onClick={()=>{dispatch(UIActionGenerator.reset_UI_Config())}}>
                                    <Icon.ArrowUpSquare size={16*2.4}/>
                                </Link>  
                                <Link to={`${props.match.url}/newBranch`}  className="icon" onClick={()=>{dispatch(UIActionGenerator.reset_UI_Config())}}>
                                    <Icon.Bezier2 size={16*2.4}/>
                                </Link>  
                            </div>
                            <div className="modal-title" onClick={()=>{dispatch(UIActionGenerator.reset_UI_Config());props.push("/")}}>
                                X
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body-header">
                                <h2 className="modal-body-title">
                                    { props.match.params.remote === "github" ? "Github" : "GitLab"}
                                </h2>
                                { props.match.params.remote === "github" ? <Icon.Github size={16*2.4}/>: <img src={gitlab}/>}
                            </div>
                            <Switch>
                                <Route path={`${props.match.path}/inputToken}`} render={()=>{console.log("test"); return <p>Test</p>}} />
                                <Route exact path={`${props.match.path}`} component={Introduction}/>
                                <Route path={`${props.match.path}/inputToken`} component={Config}/> 
                                <Route path={`${props.match.path}/pullFile`} component={Pull} />
                                <Route path={`${props.match.path}/pushFile`} component={Push} />
                            </Switch>
                        </div>
                </div>
            </div>
            <Message/>
        </React.Fragment>    
    )
}

export default Modal;