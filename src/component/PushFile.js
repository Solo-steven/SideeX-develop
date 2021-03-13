import React from 'react';
import './../asset/modal.css';


async function parserInputFile(type ,file){
    return new Promise((resolve , reject)=>{
        let reader = new FileReader();
        reader.onload = ()=>{
            resolve(reader.result);
        }
        reader.onerror = ()=>{
            reject(reader.error);
        } 
        if(type === 'gitHubUser')
            reader.readAsDataURL(file);
        else if(type === 'gitLabUser')    
            reader.readAsText(file)
    }).then((result)=>{
        if(type === 'gitHubUser'){
            return result.split(',')[1];
        }
        return result;
    }).catch((error)=>{
        console.log(error);
    })
}

export default class PushFile extends React.Component {
    constructor(props){
        super(props);
        this.fileRef = React.createRef();
        this.state={
            current_Repo : '',
            current_Repo_List : [],
            current_Branch : '',
            current_Branch_List :[],
            current_Path : '',
            current_Path_List :[],
            current_Commit_Message : '',
        }
        this.handleRepo   = this.handleRepo.bind(this);
        this.handleBranch = this.handleBranch.bind(this);
        this.handlePath   = this.handlePath.bind(this);
        this.handleCommitMessage  = this.handleCommitMessage.bind(this);
        this.handleSubmitFrom     = this.handleSubmitFrom.bind(this);
    }
    static getDerivedStateFromProps(props){
        return {
            current_Repo_List : props[props.userState].repo.map(repo => { return  {name :repo.name }})
        }
    }
    handleRepo(e){
        if(e.target.value === 'empty'){
            this.setState({
                current_Repo :'',
                current_Branch_List  : [],
                current_Branch : '',
                current_Path : '',
                current_Path_List :[],
            })
             return;
        }
        let branch_list = this.props[this.props.userState].listBranchOfRepo(e.target.value);
        this.setState({
            current_Repo : e.target.value,
            current_Branch_List  : branch_list,
            current_Branch : '',
            current_Path : '',
            current_Path_List :[],
        });
    }
    handleBranch(e){
        if(e.target.value=== 'empty'){
            this.setState({
                current_Branch : '',
                current_Path : '',
                current_Path_List :[],
            })
            return;
        }
        let dir_list = this.props[this.props.userState].listDirOfBranch(this.state.current_Repo , e.target.value, this.state.current_Path)
        this.setState({
            current_Branch: e.target.value,
            current_Path_List : dir_list,
            current_Path : '',
        });
    }
    handlePath(e){
        let dir_list = this.props[this.props.userState].listDirOfBranch(this.state.current_Repo , this.state.current_Branch, e.target.value)
        this.setState({
            current_Path : e.target.value,
            current_Path_List : dir_list,
        });
    }
    handleCommitMessage(e){
        this.setState({
            current_Commit_Message : e.target.value
        });
    }
    async handleSubmitFrom(e){
        e.preventDefault();
        let file = this.fileRef.current.files[0];
        let fileName = file.name;
        let fileContent = await parserInputFile(this.props.userState , file);
        await this.props[this.props.userState].pushFile(
            this.state.current_Repo   , 
            this.state.current_Branch ,
            this.state.current_Path , 
            this.state.current_Commit_Message ,
            fileName , 
            fileContent)
    }

    render(){
        return (
            <div className='modal' onClick={this.props.history.goBack}>
              <div className='modal-dialog'>
                <div className='modal-card' onClick={(e)=>{e.stopPropagation()}}>
                   <div className='modal-header'>
                     <h1 className ='modal-title'>Push File</h1>
                   </div>
                   <form className='modal-body' onSubmit={(e)=>{this.handleSubmitFrom(e)} }>
                     <div className='inputBox'>
                        <label>Repo</label>
                        <select value={this.state.current_Repo} onChange={(e)=>{this.handleRepo(e)}} required>
                            <option value='empty'></option>
                            {this.state.current_Repo_List.map( (repo, index) => { return <option value={repo.name} key={index}>{repo.name}</option>})}
                        </select>
                     </div>
                     <div className='inputBox'>
                        <label>Branch</label>
                        <select value={this.state.current_Branch} onChange={(e)=>{this.handleBranch(e)}} required>
                            <option value='empty'></option>
                            {this.state.current_Branch_List.map( (branch,index) => {return <option value={branch.name} key={index}>{branch.name}</option>})}
                        </select>
                     </div>
                     <div className='inputBox'>
                        <label>Dir path</label>
                        <select value={this.state.current_Path} onChange={(e)=>{this.handlePath(e)}}>
                             <option value={this.state.current_Path}>{this.state.current_Path}</option>
                             {this.state.current_Path_List.map((dir, index)=>{ return <option value={dir.path} key={index}>{dir.path}</option> })}
                        </select>
                     </div>
                     <div className='inputBox'>
                        <label>Commit messgae</label>
                        <textarea cols='10'rows='7' type='text' onChange={(e)=>{this.handleCommitMessage(e)}} required/>
                     </div>
                     <div className='inputBox'>
                       <label>File</label>
                       <label>
                            <input ref={this.fileRef} type='file'></input>
                        </label>    
                     </div>
                     <div className='inputBox'>
                         <input type='submit' value='push' />
                     </div>
                   </form>
                </div>
              </div>
            </div>
        )    
    }
}