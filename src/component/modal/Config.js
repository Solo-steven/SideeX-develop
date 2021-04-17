import {useState} from 'react'
import {useDispatch} from 'react-redux';

import * as APIActionGenerator from '../../state/actions/APIactions'
import "./../../asset/UI/form.css"

// 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
// KgaU9aDz9zzP8XnH_gVi
const Config = (props)=>{
    const  dispatch = useDispatch();
    const  [userName, setUserName ] = useState("");
    const  [userToken , setUserToken] = useState("");
    const  [url , setUrl] = useState("");

    const handleSubmit = (e)=>{
        e.preventDefault();
        let remote = props.match.params.remote;
        if(remote === "github"){
            sessionStorage.setItem("github_user_name", userName);
            sessionStorage.setItem("github_user_token", userToken);
        }else if(remote === "gitlab"){
            sessionStorage.setItem("gitlab_url", url)
            sessionStorage.setItem("gitlab_user_name", userName);
            sessionStorage.setItem("gitlab_user_token", userToken);
        }
        setUserName("")
        setUserToken("")
        setUrl("")
        dispatch(APIActionGenerator.change_User_Config(props.match.params.remote))
    }
    return (
        <form className="form" onSubmit={(e)=>{handleSubmit(e)}}>
            {
                props.match.params.remote === "gitlab" ? (
                    <div className="inputBlock">
                        <label>Personal Domain</label>
                        <input placeholder="personal server" type="text" value={url} onChange={(e)=>{setUrl(e.target.value)}}/>
                    </div>
                ) : null
            }
            <div className="inputBlock">  
                <label>Name</label>
                <input placeholder="user name" type="text" value={userName} onChange={(e)=>{setUserName(e.target.value)}} required/>
            </div>
            <div className="inputBlock">  
                <label>Token</label>
                <input placeholder="user token" type="text" value={userToken} onChange={(e)=>{setUserToken(e.target.value)}} required/>
            </div>
            <div className="inputBlock">
                <input type="submit" value="connect"/>
            </div>
        </form>
    )
}

export default Config;