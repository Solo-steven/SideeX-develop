import {useDispatch, useSelector} from "react-redux";

import "./../../asset/UI/message.css"

const PopWindow = ()=>{
    const Modal = useSelector(state=>state.Modal)
    const dispatch = useDispatch();
    return (
        <div className="message">
            <div className="message-dialog" style={{maxWidth:"600px"}}>
                <div className="message-header">
                    <h2 className="message-title">Select Repository You Want</h2>
                </div>
                <div className="message-body">
                    <from onSubmit={(e)=>{console.log(e)}}>
                        {
                            Modal.allRepoList.map((repo)=>{
                                <div>
                                    <input type="checkbox" name={repo.name} value={repo.name}/> 
                                    <label>{repo.name}</label>
                                </div>    
                           })
                        }
                    </from>
                </div>
            </div>
        </div>
    )
}

export default PopWindow;