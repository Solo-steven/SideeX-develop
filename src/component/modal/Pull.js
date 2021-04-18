import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import './../../asset/UI/form.css';

import * as APIActionGenerator from '../../state/actions/APIactions'
import * as UIActionGenerator from '../../state/actions/UIactions'

const Pull = (props)=>{
    const UIState = useSelector(state=> state.UIState)
    const dispatch = useDispatch();
    const handle_Submit = (e)=>{
        e.preventDefault();
        if(UIState.currentRootInfo.type !== "blob" )
            return ;
        dispatch(APIActionGenerator.pull_File(props.match.params.remote)
    )}
    return(
        <form onSubmit={(e)=>{handle_Submit(e)}}>
            <div className="inputBlock">
                <label>Repo:</label>
                <select value={UIState.currentRepoInfo.name} 
                        onChange={(e)=>{ dispatch(UIActionGenerator.change_Current_Repo(e.target.value))}} required>
                    <option value=""/>
                    {UIState.repoList.map((repo, index)=> 
                        <option value={repo} key={index}>{repo}</option> 
                    )}
                </select>
            </div>
            <div className="inputBlock">
                <label >Branch:</label>
                <select value={UIState.currentBranchName} 
                        onChange={(e)=>{dispatch(UIActionGenerator.change_Current_Branch(e.target.value))}} required>
                    <option value=""></option>
                    {
                        UIState.branchList.map( (branch,index)=>
                            <option value={branch} key={index}>{branch}</option>
                        )
                    }      
                </select>
            </div>
            <div className="inputBlock">
                <label >Directory:</label>
                <select value={UIState.currentRootInfo.path} 
                        onChange={(e)=>{dispatch(UIActionGenerator.change_Current_Root(e.target.value))}}>
                    <option value="current root">{UIState.currentRootInfo.path}</option> 
                    {
                        !UIState.currentRootInfo.path ? 
                            null : <option value="">back to pervious root</option>
                    }
                    {
                        UIState.rootList.map( (file,index)=>
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

export default Pull;