import React from 'react';
import {connect} from 'react-redux';

import './../../asset/UI/form.css';

import * as APIActionGenerator from '../../state/actions/APIactions';
import * as UIActionGenerator from '../../state/actions/UIactions';

async function parserInputFile(type ,file){
    return new Promise((resolve , reject)=>{
        let reader = new FileReader();
        reader.onload = ()=>{
            resolve(reader.result);
        }
        reader.onerror = ()=>{
            reject(reader.error);
        } 
        if(type === 'github')
            reader.readAsDataURL(file);
        else if(type === 'gitlab')    
            reader.readAsText(file)
    }).then((result)=>{
        if(type === 'github'){
            return result.split(',')[1];
        }
        return result;
    }).catch((error)=>{
        console.log(error);
        throw error;
    })
}


class Push extends React.Component {
    constructor(props){
        super(props);
        this.fileRef = React.createRef();
        this.state = { current_commit:""}
        this.handleRepo   = this.handleRepo.bind(this);
        this.handleBranch = this.handleBranch.bind(this);
        this.handleRoot   = this.handleRoot.bind(this);
        this.handleCommitMessage = this.handleCommitMessage.bind(this);
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
    handleCommitMessage(e){
        this.setState({
            current_commit : e.target.value
        })
    }
    async handleSubmit(e){
        e.preventDefault();
        let UIState = this.props.UIState;
        let file     = this.fileRef.current.files[0];
        let filePath = !UIState.currentRoot.path ? file.name: UIState.currentRoot.path+"/"+file.name ; 
        let fileContent ;
        try{
            fileContent = await parserInputFile(this.props.match.params.remote, file);
        }catch(error){
            return error;
        }    
        this.props.push_File( 
            filePath,
            this.state.current_commit, 
            fileContent )
    }
    render(){
        return (
            <form onSubmit={(e)=>{this.handleSubmit(e)}}>
                <div className="inputBlock">
                    <label>Repo:</label>
                    <select value={this.props.UIState.currentRepo.name} onChange={(e)=>{ this.handleRepo(e)}} required>
                        <option value=""/>
                        {this.props.UIState.repoList.map((repo, index)=> 
                            <option value={repo} key={index}>{repo}</option> 
                        )}
                    </select>
                </div>
                <div className="inputBlock">
                    <label >Branch:</label>
                    <select value={this.props.UIState.currentBranch.name} onChange={(e)=>{this.handleBranch(e)}} required>
                          <option value=""></option>
                          {
                              this.props.UIState.branchList.map( (branch,index)=>
                                  <option value={branch} key={index}>{branch}</option>
                              )
                          }      
                    </select>
                </div>
                <div className="inputBlock">
                    <label >Directory:</label>
                    <select value={this.props.UIState.currentRoot.path} onChange={(e)=>{this.handleRoot(e)}} >
                          <option value="current root">{this.props.UIState.currentRoot.path}</option> 
                          {
                              !this.props.UIState.currentRoot.path ? 
                                null : <option value="">back to pervious root</option>
                          }
                          {
                              this.props.UIState.rootList.map( (file,index)=>
                                  file.type === "blob"? null : <option value={file.path} key={index}>{file.path }</option>
                              )
                          }
                    </select>
                </div>
                <div className="inputBlock">
                    <label>Commit Message:</label>
                    <textarea cols="20" rows="5" onChange={(e)=>{this.handleCommitMessage(e)}} required/>
                </div>
                <div className="inputBlock">
                    <label>File:</label>
                    <input type="file" ref={this.fileRef}/>      
                </div>
                <div className="inputBlock">
                     <input type="submit" value="push"/>     
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state)=>{
    return { 
        UIState : state.UIState
    }
}

const mapDispatchToProps = {
    change_Current_Repo : UIActionGenerator.change_Current_Repo, 
    change_Current_Branch : UIActionGenerator.change_Current_Branch, 
    change_Current_Root   : UIActionGenerator.change_Current_Root,
    push_File : APIActionGenerator.push_File
}

export default connect(mapStateToProps, mapDispatchToProps)(Push);