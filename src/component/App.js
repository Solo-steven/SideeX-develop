import React from 'react';
import {useDispatch} from 'react-redux';
import {BrowserRouter , Switch, Route, Link} from 'react-router-dom';

import Modal from './modal/Modal'
import * as APIActionGenerator from "./../state/actions/APIactions"

import  "./../asset/UI/background.css";
import sideex from "./../asset/pic/sideex.png"
import github from  "./../asset/pic/github_PNG88.png";
import gitlab from "./../asset/pic/gitlab.png"

const App = ()=>{
    const dispatch = useDispatch()
    return (
        <BrowserRouter>
             <div className="background" >
                <div className="container">
                    <div className="container-heading">
                            <img className="container-heading-img" src={sideex} ></img>
                            <img className="container-heading-img" src={github} ></img>
                            <img className="container-heading-img" src={gitlab}></img>
                            <h2 className="container-heading-title">Connect To Remote</h2>
                    </div>
                    <div className="container-body">
                            <h2 className="container-body-title">
                                SideeX   
                            </h2>
                            <div className="container-body-wrapper">
                                <Link to="/modal/github" className="link" onClick={()=>{dispatch(APIActionGenerator.change_Current_Remote("github"))}}> Connect to GitHub  </Link>
                                <Link to="/modal/gitlab" className="link" onClick={()=>{dispatch(APIActionGenerator.change_Current_Remote("gitlab"))}}> Connect to GitLab  </Link>
                            </div>
                            <div className="container-body-prompt">
                                <a href="https://sideex.io/">SideeX Tutorial</a>
                                <a href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token">Registered Your Github Token</a>
                                <a  href="https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html">Registered Your Gitlab Token</a>
                            </div>
                        </div>
                </div>  
            </div>
            <Switch>
               <Route 
                   path= "/modal/:remote?"
                   render = {(props)=>{
                       console.log(props);
                       return <Modal 
                                 match = { {params : props.match.params, url : props.match.url, path : props.match.path}}  
                                 push   = {props.history.push}
                              />
                   }}
               />
            </Switch>
        </BrowserRouter>
    )
}

 export default App ;