import {useState} from "react";
import {useDispatch ,useSelector} from "react-redux";

import * as UIActionGenerator from "./../../state/actions/UIactions";
import * as APIActionGenerator from "./../../state/actions/APIactions";

import "./../../asset/UI/form.css"

const Branch= (props)=>{
    const UIState  = useSelector(state => state.UIState)
    const [newBranchName, setNewBranchName] = useState("")
    const dispatch = useDispatch();
    const handle_Submit = (e)=>{
        e.preventDefault()
        dispatch(APIActionGenerator.create_Branch(newBranchName, props.match.params.remote));
    }

    return (
        <form onSubmit={(e)=>{handle_Submit(e)}}>
            <div className="inputBlock">
                <label>Repo:</label>
                <select value={UIState.currentRepoName} 
                        onChange={(e)=>{ dispatch(UIActionGenerator.change_Current_Repo(e.target.value))}} required>
                    <option value=""/>
                    {UIState.repoList.map((repo, index)=> 
                        <option value={repo} key={index}>{repo}</option> 
                    )}
                </select>
            </div>
            <div className="inputBlock">
                <label >Ref Branch:</label>
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
                <label >New Branch Name:</label>
                <input type="text" value={newBranchName} onChange={(e)=>{setNewBranchName(e.target.value)}} required/>
            </div>
            <div className="inputBlock">
                <input type="submit" value="create"/>     
            </div>
        </form>
    )
}

export default Branch;