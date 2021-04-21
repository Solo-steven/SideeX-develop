import {Switch, Route, Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import * as Icon from 'react-bootstrap-icons';

import "./../../asset/UI/modal.css";
import gitlab from "./../../asset/pic/gitlab.png"

import {reset_UI} from "./ModalSlice"

import Intro from "../../features/Intro/Intro";
import Connect from "../../features/Connect/Connect";
import Pull from "./../../features/Pull/Pull";
import Push from "./../../features/Push/Push";

const Modal = (props)=>{
    const dispatch = useDispatch()
    return (
            <div className="modal" onClick={()=>{props.push("/") } }>
                <div className="modal-dialog" onClick={(e) => (e.stopPropagation())}>
                        <div className="modal-heading">
                            <div className="modal-option">
                                <Link to={`${props.match.url}/inputToken`} className="icon" onClick={()=>{dispatch(reset_UI())}} >
                                    <Icon.Lock size={16*2.4}/>
                                </Link>
                                <Link to={`${props.match.url}/pullFile`} className="icon" onClick={()=>{dispatch(reset_UI())}}>
                                    <Icon.ArrowDownSquare size={16*2.4}/>
                                </Link>           
                                <Link to={`${props.match.url}/pushFile`}  className="icon" onClick={()=>{dispatch(reset_UI())}}>
                                    <Icon.ArrowUpSquare size={16*2.4}/>
                                </Link>  
                                <Link to={`${props.match.url}/newBranch`}  className="icon" onClick={()=>{dispatch(reset_UI())}}>
                                    <Icon.Bezier2 size={16*2.4}/>
                                </Link>  
                            </div>
                            <div className="modal-title" onClick={()=>{props.push("/")}}>
                                X
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="modal-body-header">
                                <h2 className="modal-body-title">
                                    { props.match.params.remote === "github" ? "Github" : "GitLab"}
                                </h2>
                                { props.match.params.remote === "github" ? <Icon.Github size={16*2.4}/>: <img src={gitlab} alt="gitlab logo"/>}
                            </div>
                            <Switch>
                                <Route path={`${props.match.path}/inputToken}`} render={()=>{console.log("test"); return <p>Test</p>}} />
                                <Route exact path={`${props.match.path}`} component={Intro}/>
                                <Route path={`${props.match.path}/inputToken`} component={Connect}/> 
                                <Route path={`${props.match.path}/pullFile`} component={Pull} />
                                <Route path={`${props.match.path}/pushFile`} component={Push} />
                            </Switch>
                        </div>
                </div>
            </div>
    )
}

export default Modal;

/**
        <Route path={`${props.match.path}/pushFile`} component={Push} />
        <Route path={`${props.match.path}/newBranch`} component={Branch} />
 */