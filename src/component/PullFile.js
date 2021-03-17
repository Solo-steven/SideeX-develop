import React from 'react';
import './../asset/modal.css';

export default class PullFile extends React.Component{
    constructor(props){
        super(props);
        this.state={
            current_Repo : '',
            current_Repo_List :[],
            current_Branch : '',
            current_Branch_List : [],
            current_DirPath : '',
            current_DirPath_List:[],
            current_FilePath : '',
            current_FilePath_List : []
        }
        this.handleRepo   = this.handleRepo.bind(this);
        this.handleBranch = this.handleBranch.bind(this);
        this.handleDirPath   = this.handleDirPath.bind(this);
        this.handleSubmitForm  = this.handleSubmitForm.bind(this);
    }
    static getDerivedStateFromProps(props){
        return {
            current_Repo_List : props[props.userState].repo.map(repo => { return  {name :repo.name }})
        }
    }
    handleRepo(e){
        this.setState({
            current_Repo :(e.target.value === 'empty' ? '': e.target.value),
            current_Branch_List  : (e.target.value === 'empty' ? [] : this.props[this.props.userState].listBranchOfRepo(e.target.value)),
            current_Branch : '',
            current_DirPath : '',
            current_DirPath_List :[],
            current_FilePath : '',
            current_FilePath_List : []
        })
    }
    handleBranch(e){
        this.setState({
            current_Branch : (e.target.value === 'empty' ?  '' : e.target.value),
            current_DirPath : '',
            current_DirPath_List :(e.target.value === 'empty' ? [] : this.props[this.props.userState].listDirOfBranch(this.state.current_Repo , e.target.value, this.state.current_DirPath) ),
            current_FilePath : '',
            current_FilePath_List : (e.target.value === 'empty' ? [] : this.props[this.props.userState].listFileOfDir(this.state.current_Repo ,e.target.value, this.state.current_DirPath) )
        })
    }
    handleDirPath(e){
        let  dir_list , file_list;
        this.state.current_DirPath_List.forEach(dir =>{
            if(dir.path === e.target.value){
                 dir_list = this.props[this.props.userState].listDirOfBranch(this.state.current_Repo , this.state.current_Branch, e.target.value);
                 file_list = this.props[this.props.userState].listFileOfDir(this.state.current_Repo ,this.state.current_Branch, e.target.value);
                 this.setState({
                    current_DirPath : e.target.value,
                    current_DirPath_List : dir_list,
                    current_FilePath : '',
                    current_FilePath_List : file_list,
                });
            }
        })
        this.state.current_FilePath_List.forEach(file=>{
            if(file.path === e.target.value){
                this.setState({
                    current_DirPath_List : [],
                    current_FilePath : e.target.value,
                    current_FilePath_List : [],
                })
            }
        })
    }
    async handleSubmitForm(e){
        e.preventDefault();
        await this.props[this.props.userState].pullFile(
                this.state.current_Repo, 
                this.state.current_Branch,
                this.state.current_DirPath,
                this.state.current_FilePath
            );
        this.setState({
            current_Repo : '',
            current_Repo_List :[],
            current_Branch : '',
            current_Branch_List : [],
            current_DirPath : '',
            current_DirPath_List:[],
            current_FilePath : '',
            current_FilePath_List : []
        });  
    }
    render(){
        return (
            <div className='modal' onClick={this.props.history.goBack}>
              <div className='modal-dialog'>
                <div className='modal-card' onClick={(e)=>{e.stopPropagation()}}>
                    <div className='modal-header'>
                       <h1 className='modal-title'>Pull File</h1>
                    </div>
                    <form className='modal-body' onSubmit={(e)=>{this.handleSubmitForm(e)}}>
                      <div className='inputBox'>
                         <label>Repo</label>
                         <select value={this.state.current_Repo} onChange={(e)=>{this.handleRepo(e)}} required>
                              <option value='empty'></option>  
                              {this.state.current_Repo_List.map( (repo,index)=>{return <option value={repo.name} key={index}>{repo.name}</option>})}
                         </select>
                      </div>
                      <div className='inputBox'>
                         <label>Branch</label>
                         <select value={this.state.current_Branch} onChange={(e)=>{this.handleBranch(e)}} required>
                            <option value='empty'></option>  
                            {this.state.current_Branch_List.map( (branch ,index)=>{return <option value={branch.name} key={index}>{branch.name}</option>})}
                         </select>
                      </div>
                      <div className='inputBox'>
                         <label>Path</label>
                         <select value={ !this.state.current_FilePath ? this.state.current_DirPath : this.state.current_FilePath} onChange={(e)=>{this.handleDirPath(e)}} required>
                            <option value={ !this.state.current_FilePath ? this.state.current_DirPath : this.state.current_FilePath} >{ !this.state.current_FilePath ? this.state.current_DirPath : this.state.current_FilePath} </option>
                            { this.state.current_DirPath_List.map( (file,index)=>{return <option value={file.path} key={index}>{"Directory :" +file.path}</option>})}
                            { this.state.current_FilePath_List.map( (file,index)=>{return <option value={file.path} key={index}>{file.path}</option>})}
                         </select>
                      </div>
                      <div className='inputBox'>
                         <input type='submit' value='pull'/>
                      </div>
                    </form>
                </div>
              </div>
            </div>
        )
    }
}