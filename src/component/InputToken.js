import {useState} from 'react';
import './../asset/modal.css';

const InputToken = (props)=>{
    let [userName , setUserName]= useState('');
    let [userToken , setUserToken] = useState('');
    let [url , setUrl] = useState('')

    return (
        <div className='modal' onClick={props.history.goBack}>
           <div className='modal-dialog'>
                <div className='modal-card' onClick={(e)=>{e.stopPropagation()}}>
                    <div className='modal-header'>
                        <h1 className='modal-title'>Input Token</h1>
                    </div>
                    <form className='modal-body' 
                          onSubmit={e=>{  
                             e.preventDefault() ; 
                             props.changeUserNameAndToken(props.userState , userName , userToken , url)
                             setUserName('');
                             setUserToken('');
                             setUrl('');
                          }}>
                        {
                            !(props.userState === "gitLabUser") ? 
                             null : 
                            <div className='inputBox'>
                                <label>Personal Server's Domain </label>
                                <input type='text' placeholder="If you want to push to your personal gitlab server , input your server's domain "  onChange={(e)=>{setUrl(e.target.value)}} />
                            </div> 
                        }   
                        <div className='inputBox'>
                            <label>User Name</label>
                            <input  type='text' placeholde='user name' value={userName} onChange={(e)=>{setUserName(e.target.value)}} required/>
                        </div>
                        <div className='inputBox'>
                            <label>Personal Access Token</label>
                            <input type='text' placeholde='personal token' value={userToken} onChange={ (e)=>{setUserToken(e.target.value) }}  required/>
                        </div>
                        <div className='inputBox'>
                            <input type='submit'  value='ok'/>
                        </div>
                    </form>
                 </div>   
           </div>
        </div>
    )
} 

export default InputToken;
  