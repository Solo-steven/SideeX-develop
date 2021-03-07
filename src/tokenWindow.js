import React from 'react';
import './asset/form.css';
import axios from 'axios';
import { User} from './user.js';
import { LoadingWindow } from './loadingWindow.js'


function getCookie(){
   let cookie_array =document.cookie.split(';');
   for(let cookie of cookie_array){
       cookie = cookie.split('=');
       if(cookie[0]==='github_token');
         return cookie[1];
   }
}
function DFS_Treetify(root, list, count){
    while(count.num<list.length){
        if( (list[count.num].path).indexOf(root.path) === -1 )     // current file not belong to root
          return;
        else if((list[count.num].path).indexOf(root.path) !== -1){ // current file  belong to root
              if(list[count.num].type !== 'dir'){
                  root.child.push(list[count.num]);
                  ++count.num;  
              }else{
                  root.child.push(list[count.num]);
                  count.num++;
                  DFS_Treetify(list[count.num-1],list,count);   
              }
        } 
    }
}

async function Treetify(root){
    let list=root.child;
    root.child=[];
    DFS_Treetify(root,list, {num:0});
}

async function requestGitTree(name, token, repo_name, root_path , tree_sha , branch){
  await axios({
      method:'get',
      url: `https://api.github.com/repos/${name}/${repo_name}/git/trees/${tree_sha}`,
      headers:{
          Authorization: `token ${token}`
      },
      params: {
          recursive: '1'
      }
  }).then(response=>{
      for(let data of response.data.tree){
          branch.child.push({
              path  : root_path+'/'+data.path,
              sha   : data.sha,
              type  : (data.type==='tree'?'dir':'file'),
              child : []
          });
      }
      console.log(`Access git tree of branch(${branch.name}) in repo(${repo_name}).`);
  }).catch(error=>{
      console.log(error, 'Error when get git tree .');
  })
}

async function requestSingleBranchContent(name, token, repo_name, branch_name, branch){
    await axios({
        method : 'get',
        url : `https://api.github.com/repos/${name}/${repo_name}/contents`,
        headers : {
            Authorization: `token  ${token}` 
        },
        params : {
            ref : branch_name
        }
    }).then(async (response)=>{
        for(let data of response.data){
            branch.child.push({
                path : data.path,
                sha  : data.sha,
                type : data.type
            });
            if(data.type ==='dir'){
                branch.child[branch.child.length-1].child=[]
                await requestGitTree(name, token, repo_name, data.path, data.sha ,branch)
            }
        }
        console.log(`Access get content of branch(${branch.name}) in repo(${repo_name}) .`);
    }).catch(error=>{
        console.log(error, 'Error when get repo info .');
    })
}

async function requestSingleRepoBranch(name, token , repo_name ,repo){
    console.log(token);
     await axios({
        method: 'get',
        url : `https://api.github.com/repos/${name}/${repo_name}/branches`,
        headers:{
            Authorization: `token ${token}`
        }
    }).then(response=>{
        for(let data of response.data){
            repo.branch.push({
                name: data.name,
                path: '',
                child:[] 
            })  
        }
        console.log(`Success get all branch name of repo(${repo_name}).`)
    }).catch(response=>{
        console.log(response, `error when get branch name of repo(${repo_name})`);
    })

}


/**
 * 
 * @param {*} token 
 * @param {*} user 
 */

async function requestUserName(token, user){
    await axios({
        method : 'get',
        url : 'https://api.github.com/user',
        headers : {
            Authorization: `token ${token} `,
        }
    }).then(response=>{
        user.name = response.data.login;
        console.log('Access user name.');
  
    }).catch(error=>{
        console.log(error, 'Error when get user name.');
    })
} 
  
async function requestAllRepoName(name, token, user){
    await axios({
        method:'get',
        url:`https://api.github.com/search/repositories`,
        headers : {
            Authorization: `token ${token}`,
        },
        params:{
            q : `user:${name}`
        }
    }).then((response)=>{
        for(let data of response.data.items){
            user.repo.push({ 
                name:data.name ,
                path:'',
                branch:[]
            });
        }
        console.log('Access all repos name')
    }).catch(error=>{
        console.log(error, 'Error when get user repo name.');
    })
}

async function requestAllRepoInfo(user){
    for(let i=0;i<user.repo.length;++i){
         await requestSingleRepoBranch(user.name, user.token, user.repo[i].name, user.repo[i]);
         for(let j=0;j<user.repo[i].branch.length;++j){
             await requestSingleBranchContent(user.name, user.token , user.repo[i].name, user.repo[i].branch[j].name, user.repo[i].branch[j]);
             Treetify(user.repo[i].branch[j]);
         }
    } 
}

export class TokenWindow extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user : new User(),
            onFetchData : false,
        }
        this.fetchData   = this.fetchData.bind(this);
        this.checkInput  = this.checkInput.bind(this);
        this.clearBuffer = this.clearBuffer.bind(this);
        this.handleTokenInput = this.handleTokenInput.bind(this);
        this.onLoginToken = this.onLoginToken.bind(this);
        
        let cookie=getCookie();
        if(cookie){
            this.state={
                user : new User('',cookie),
                onFetchData : true,
            };
            this.fetchData(this.state.user)
        }
    }

    async fetchData(user){
        await requestUserName(user.token, user);
        await requestAllRepoName(user.name , user.token, user);
        await requestAllRepoInfo(user);
        console.log('Get all user info we need.' ,user);
        this.props.FlipToUploadsWindow(user);
    }

    checkInput(){
        if(this.state.user.token)
            return true;
        return false;    
    }

    clearBuffer(){
        this.setState({
            user: new User()
        })
    }

    handleTokenInput(event){
        this.setState({
            user : new User(null,event.target.value)
        }, ()=>{
            console.log('User change token : ',this.state.user.token);
        })
    }

    onLoginToken(event){
        event.preventDefault();
        if(!this.checkInput())
            return;
        let user=this.state.user;
        document.cookie='github_token='+user.token+' ;max-age=2592000;';
        this.setState({
            onFetchData: true
        });
        this.clearBuffer();
        this.fetchData(user);
    }

    render(){
        if(this.state.onFetchData){
            return <LoadingWindow></LoadingWindow>
        }
        return (
                <form className='custom-form custom-form-white_border' onSubmit={this.onLoginToken}>
                    <div className='input-box'>
                        <label>Personal Token</label>
                        <input type='text' value={this.state.user.token} onChange={this.handleTokenInput} placeholder='github token' required>    
                        </input>
                    </div>
                    <div className='input-box'>
                        <input type='submit' value='Ok'></input>
                    </div>
                </form>
        );
    }
}