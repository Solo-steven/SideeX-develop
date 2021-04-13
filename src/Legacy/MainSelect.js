import React from 'react';
import './asset/main.css';
import {BrowserRouter , Route ,Switch , Link} from 'react-router-dom';

import GitHubUser from './RESTful/Github/Github'
import GitLabUser from './RESTful/Gitlab/Gitlab'
import InputToken from './InputToken';
import PushFile from './PushFile';
import PullFile from './PullFile';
import CreateBranch from './CreateBranch';


export default class  MainSelect extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            gitHubUser : new GitHubUser(),
            gitLabUser : new GitLabUser()
        }
        this.changeUserNameAndToken = this.changeUserNameAndToken.bind(this);
    }
    async changeUserNameAndToken(type , name , token , url){
        if(type === 'gitHubUser'){
            let newUser = new GitHubUser(name, token);
            await newUser.getUserInfo();
            this.setState({
                gitHubUser : newUser
            },()=>{console.log(this.state.gitHubUser)})
        }
        else if (type === 'gitLabUser'){
            let newUser = new GitLabUser(  name, token, !url ? null : url );
            await newUser.getUserInfo();
            this.setState({
                gitLabUser : newUser
            },()=>{console.log(this.state.gitLabUser)})
        }
    }
    render(){
        console.log('main page render');
        return (
            <BrowserRouter>
                <div className='select-container'>
                    <div className='select-card'>
                        <div className='select-header'>
                                <h1 className='select-title'>SideeX</h1>
                        </div>
                        <div className='select-body'>
                        <Switch>
                            <Route  
                                exact path='/'   
                                render={()=>{
                                    return(
                                        <React.Fragment>
                                            <Link to='/gitHubUser'>
                                                <button className='select-button'>GitHub</button>
                                            </Link> 
                                            <Link to='/gitLabUser'>
                                                <button className='select-button'>GitLab</button>
                                            </Link> 
                                        </React.Fragment>
                                )}} />
                            <Route  
                                path='/:userState?'
                                render={(props)=>{
                                    console.log(props)
                                    return (
                                        <React.Fragment>
                                            <Link to={`${props.match.url}/changeToken`}>
                                                <button className='select-button'>Change Token</button>
                                            </Link> 
                                            <Link to={`${props.match.url}/pushFile`}>   
                                                <button className='select-button'>Push File</button>
                                            </Link>  
                                            <Link to={`${props.match.url}/pullFile`}>
                                                <button className='select-button'>Pull File</button>
                                            </Link>
                                            <Link to={`${props.match.url}/createBranch`}>
                                                <button className='select-button'>Create Branch</button>
                                            </Link>
                                            <button className='select-button' onClick={()=>{props.history.goBack()}}>Back</button>
                                            <Switch> 
                                                    <Route exact path={`${props.match.path}/changeToken`}
                                                        render = {(props)=>{
                                                            return <InputToken  {...props}
                                                                    userState = {props.match.params.userState}
                                                                    changeUserNameAndToken={ this.changeUserNameAndToken}
                                                                />
                                                        }}
                                                    />
                                                    <Route exact path={`${props.match.path}/pushFile`}
                                                        render ={(props)=>{
                                                            return <PushFile 
                                                                        {...props}
                                                                        userState = { props.match.params.userState} 
                                                                        gitHubUser = {this.state.gitHubUser}
                                                                        gitLabUser = {this.state.gitLabUser}
                                                                    />
                                                        }}
                                                    />
                                                    <Route exact path={`${props.match.path}/pullFile`}
                                                        render = {(props)=>{
                                                            return <PullFile 
                                                                    {...props}
                                                                        userState = { props.match.params.userState} 
                                                                        gitHubUser = {this.state.gitHubUser}
                                                                        gitLabUser = {this.state.gitLabUser}   
                                                                    />
                                                        }}
                                                    />
                                                    <Route exact path={`${props.match.path}/createBranch`}
                                                        render = {(props)=>{
                                                            return <CreateBranch
                                                                    {...props}
                                                                        userState = { props.match.params.userState} 
                                                                        gitHubUser = {this.state.gitHubUser}
                                                                        gitLabUser = {this.state.gitLabUser}   
                                                                    />
                                                        }}
                                                    />
                                            </Switch>
                                        </React.Fragment>
                                    ) 

                                }}            
                            />
                         </Switch>   
                        </div>
                    </div>
                </div>
            </BrowserRouter> 
        )
    }
}