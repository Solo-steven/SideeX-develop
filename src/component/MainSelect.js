import React from 'react';
import './../asset/main.css';
import {BrowserRouter , Route ,Switch , Link} from 'react-router-dom';

import GitHubUser from './../class/Github/Github'
import GitLabUser from './../class/Gitlab/Gitlab'
import InputToken from './InputToken';
import PushFile from './PushFile';
import PullFile from './PullFile';

/**
 *    github : bdda46d89c2596eed6419ab00b814e239968ff61 , 
 *     gitlab : eYo7pMLSfoC52X7UCxSu
 */

export default class  MainSelect extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            gitHubUser : new GitHubUser(),
            gitLabUser : new GitLabUser()
        }
        this.changeUserNameAndToken = this.changeUserNameAndToken.bind(this);
    }
    async changeUserNameAndToken(type , name , token){
        if(type === 'gitHubUser'){
            let newUser = new GitHubUser(name, token);
            await newUser.getUserInfo();
            this.setState({
                gitHubUser : newUser
            },()=>{console.log(this.state.gitHubUser)})
        }
        else if (type === 'gitLabUser'){
            let newUser = new GitLabUser(name, token);
            await newUser.getUserInfo();
            this.setState({
                gitLabUser : newUser
            },()=>{console.log(this.state.gitLabUser)})
        }
    }
    render(){
        let userState = 'gitLabUser';
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/'>
                        <div className='select-container'>
                            <div className='select-card'>
                                <div className='select-header'>
                                    <h1 className='select-title'>SideeX</h1>
                                </div>
                                <div className='select-body'>
                                <Link to='/changeToken'>
                                    <button className='select-button'>Change Token</button>
                                </Link> 
                                <Link to='/pushFile'>   
                                    <button className='select-button'>Push File</button>
                                </Link>  
                                <Link to='/pullFile'>
                                    <button className='select-button'>Pull File</button>
                                </Link>
                                </div>
                            </div>
                        </div>
                        <Route exact path='/changeToken'
                            render = {(props)=>{
                                return <InputToken  {...props}
                                        userState = {userState}
                                        changeUserNameAndToken={ this.changeUserNameAndToken}
                                       />
                            }}
                        />
                        <Route exact path='/pushFile'
                            render ={(props)=>{
                                return <PushFile 
                                            {...props}
                                            userState = {userState}
                                            gitHubUser = {this.state.gitHubUser}
                                            gitLabUser = {this.state.gitLabUser}
                                        />
                            }}
                        />
                        <Route exact path='/pullfile'
                            render = {(props)=>{
                                return <PullFile 
                                        {...props}
                                            userState = {userState}
                                            gitHubUser = {this.state.gitHubUser}
                                            gitLabUser = {this.state.gitLabUser}   
                                        />
                            }}
                        />
                    </Route>
                </Switch>    
            </BrowserRouter> 
        )
    }
}