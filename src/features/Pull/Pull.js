import {useDispatch, useSelector} from 'react-redux';

import "./../../asset/UI/form.css";

import {pull_File} from "./PullAction.js"
import {change_Current_Repo , change_Current_Branch , change_Current_Root} from "./../../common/Modal/ModalSlice"

const Pull = (props)=>{
    const Modal = useSelector(state=>state.Modal);
    const dispatch = useDispatch() ;
    const handle_Submit = (e)=>{
        e.preventDefault();
        if (Modal.currentRoot.type === "tree")
            return;
        dispatch(pull_File(
            props.match.params.remote,
            Modal.currentRepo,
            Modal.currentBranch,
            Modal.currentRoot
        ))
    }
    return(
        <form onSubmit={(e)=>{handle_Submit(e)}}>
            <div className="inputBlock">
                <label>Repo:</label>
                <select value={Modal.currentRepo.name} 
                        onChange={(e)=>{dispatch(change_Current_Repo({newRepoName: e.target.value})) }} required>
                    <option value="current"/>
                    {Modal.repoList.map((repo, index)=> 
                        <option value={repo} key={index}>{repo}</option> 
                    )}
                </select>
            </div>
            <div className="inputBlock">
                <label >Branch:</label>
                <select value={Modal.currentBranch.name} 
                        onChange={(e)=>{dispatch(change_Current_Branch({newBranchName : e.target.value}))}} required>
                    <option value="current"></option>
                    {
                        Modal.branchList.map( (branch,index)=>
                            <option value={branch} key={index}>{branch}</option>
                        )
                    }      
                </select>
            </div>
            <div className="inputBlock">
                <label >Directory:</label>
                <select value={Modal.currentRoot.path} 
                        onChange={(e)=>{dispatch(change_Current_Root({newRootPath:e.target.value}))}}>
                    <option value="current">{Modal.currentRoot.path}</option> 
                    {
                        !Modal.currentRoot.path ? 
                            null : <option value="">back to pervious root</option>
                    }
                    {
                        Modal.rootList.map( (file,index)=>
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