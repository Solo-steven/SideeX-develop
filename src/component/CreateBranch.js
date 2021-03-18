import React from 'react';
import './../asset/modal.css'

export default class CreateBranch extends React.Component{
    constructor(props){
        super(props);
        this.state={
            current_Repo : '',
            current_Repo_List :[],
            current_Branch : '',
            current_Branch_List : [],
            current_NewBranch_Name : ''
        }
        this.handleRepo  =  this.handleRepo.bind(this);
        this.handleBranch = this.handleBranch.bind(this);
        this.handleNewBranchName = this.handleNewBranchName.bind(this);
        this.handleSubmitForm    = this.handleSubmitForm.bind(this);
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
        })
    }
    handleBranch(e){
        this.setState({
            current_Branch : (e.target.value === 'empty' ?  '' : e.target.value)
        })
    }
    handleNewBranchName(e){
        this.setState({
            current_NewBranch_Name : e.target.value    
        })
    }
    async handleSubmitForm(e){
        e.preventDefault();
        await this.props[this.props.userState].createBranch(
            this.state.current_Repo , 
            this.state.current_NewBranch_Name,
            this.state.current_Branch);
        this.setState({
            current_Repo : '',
            current_Repo_List :[],
            current_Branch : '',
            current_Branch_List : [],
            current_NewBranch_Name : ''
        })    
    }
    render(){
        return(
            <div className='modal' onClick={()=>{this.props.history.goBack()}}>
              <div className='modal-dialog'>
                <div className='modal-card' onClick={e=>{e.stopPropagation()}}>
                    <div className='modal-header'>
                       <h1 className='modal-title'>Create Branch</h1>
                    </div>
                    <form className='modal-body' onSubmit={(e)=>{this.handleSubmitForm(e)}}>
                      <div className='inputBox'>
                         <label>Repo</label>
                         <select value={this.state.current_Repo} onChange={(e)=>{this.handleRepo(e)}} required>
                            <option value="empty"></option>
                            {this.state.current_Repo_List.map( (repo ,index)=> { return <option value={repo.name} key={index}>{repo.name}</option>})}
                         </select>
                      </div>
                      <div className='inputBox'>
                         <label>Branch Ref</label>
                         <select value={this.state.current_Branch} onChange={(e)=>{this.handleBranch(e)}} required>
                            <option value='empty'></option>  
                            {this.state.current_Branch_List.map( (branch ,index)=>{return <option value={branch.name} key={index}>{branch.name}</option>})}
                         </select>
                      </div>
                      <div className='inputBox'>
                          <label> New Branch Name</label>
                          <input type="text" value={this.state.current_NewBranch_Name} onChange={(e)=>{this.handleNewBranchName(e)}} required/>
                      </div>
                      <div className="inputBox">
                         <input type='submit' value='confirm'/>
                      </div>
                    </form>
                </div>
              </div>
            </div>
        )
    }

}