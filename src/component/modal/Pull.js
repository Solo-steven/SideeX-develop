import React from 'react';
import {connect} from 'react-redux';
import * as Icon from 'react-bootstrap-icons';

import './../../asset/UI/form.css';

import * as APIActionGenerator from '../../state/actions/APIactions'
import * as UIActionGenerator from '../../state/actions/UIactions'

class Pull extends React.Component {
    constructor(props){
        super(props);
        this.handleRepo   = this.handleRepo.bind(this);
        this.handleBranch = this.handleBranch.bind(this);
        this.handleRoot   = this.handleRoot.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleRepo(e){
        this.props.change_Current_Repo(e.target.value);
    }
    handleBranch(e){
        this.props.change_Current_Branch(e.target.value);
    }
    handleRoot(e){
        if(e.target.value === "current root")
            return;
        this.props.change_Current_Root(e.target.value);
    }
    handleSubmit(e){
        e.preventDefault();
        if(this.props.UIstate.currentRoot.type === "tree")
            return;
        this.props.pull_File(this.props.match.params.remote)
    }
    render(){
        return (
            <form onSubmit={(e)=>{this.handleSubmit(e)}}>
                <div className="inputBlock">
                    <label>Repo:</label>
                    <select value={this.props.UIstate.currentRepo.name} onChange={(e)=>{ this.handleRepo(e)}} required>
                        <option value=""/>
                        {this.props.UIstate.repoList.map((repo, index)=> 
                            <option value={repo} key={index}>{repo}</option> 
                        )}
                    </select>
                </div>
                <div className="inputBlock">
                    <label >Branch:</label>
                    <select value={this.props.UIstate.currentBranch.name} onChange={(e)=>{this.handleBranch(e)}} required>
                          <option value=""></option>
                          {
                              this.props.UIstate.branchList.map( (branch,index)=>
                                  <option value={branch} key={index}>{branch}</option>
                              )
                          }      
                    </select>
                </div>
                <div className="inputBlock">
                    <label >Directory:</label>
                    <select value={this.props.UIstate.currentRoot.path} onChange={(e)=>{this.handleRoot(e)}}>
                          <option value="current root">{this.props.UIstate.currentRoot.path}</option> 
                          {
                              !this.props.UIstate.currentRoot.path ? 
                                null : <option value="">back to pervious root</option>
                          }
                          {
                              this.props.UIstate.rootList.map( (file,index)=>
                                 <option value={file.path} key={index}>{file.path }</option>
                              )
                          }
                    </select>
                </div>
                <div className="inputBlock">
                     <input type="submit" value="pull"/>     
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state)=>{
    return { 
        UIstate : state.UIState
    }
}

const mapDispatchToProps = {
    change_Current_Repo : UIActionGenerator.change_Current_Repo, 
    change_Current_Branch : UIActionGenerator.change_Current_Branch, 
    change_Current_Root   : UIActionGenerator.change_Current_Root,
    pull_File : APIActionGenerator.pull_File
}

export default connect(mapStateToProps, mapDispatchToProps)(Pull);