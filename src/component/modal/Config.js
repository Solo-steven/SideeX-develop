import React from 'react'
import {connect} from 'react-redux';

import * as APIActionGenerator from '../../state/actions/APIactions'
import "./../../asset/UI/form.css"

class Config extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            userName : "", 
            userToken : ""
        }
        this.handle_Submit      = this.handle_Submit.bind(this);
        this.handle_User_Name   = this.handle_User_Name.bind(this);
        this.handle_User_Token  = this.handle_User_Token.bind(this);

    }
    handle_User_Name(e){
        this.setState({userName : e.target.value})
    }
    handle_User_Token(e){
        this.setState({userToken : e.target.value})
    }
    handle_Submit(e){
        e.preventDefault();
        let remote = this.props.match.params.remote;
        if(remote === "github"){
            sessionStorage.setItem("github_user_name", this.state.userName);
            sessionStorage.setItem("github_user_token", this.state.userToken);
        }else if(remote === "gitlab"){
            sessionStorage.setItem("gitlab_user_name", this.state.userName);
            sessionStorage.setItem("gitlab_user_token", this.state.userToken);
        }
        this.setState({userName : "", userToken :""});
        this.props.change_User_Config(remote)
    }
   render() {
        return (
            <form className="form" onSubmit={(e)=>{this.handle_Submit(e)}}>
                <div className="inputBlock">  
                    <label>Name</label>
                    <input placeholder="user name" type="text" value={this.state.userName} onChange={(e)=>{this.handle_User_Name(e)}}/>
                </div>
                <div className="inputBlock">  
                    <label>Token</label>
                    <input placeholder="user token" type="text" value={this.state.userToken} onChange={(e)=>{this.handle_User_Token(e)}}/>
                </div>
                <div className="inputBlock">
                    <input type="submit" value="connect"/>
                </div>
            </form>
        )
    }  
}

const mapDispatchToProps = {
    change_User_Config : APIActionGenerator.change_User_Config
}

export default connect(null , mapDispatchToProps)(Config);