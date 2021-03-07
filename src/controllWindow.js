import React from 'react';
import './asset/form.css'
import './asset/tab.css'
import axios from 'axios'
/**
 *   ========================================================================================================
 * 
 *   ========================================================================================================
 */

/**
 * function 功用 ： 在指定的user資訊中，找尋指定repo名稱的repo，並回傳那個repo。
 * @param {*} repo_name : 要找尋的repo名稱。
 * @param {*} user : user物件，為user的data。
 */
function searchRepoOfUser(repo_name, user){
    for(let repo of user.repo){
        if(repo.name===repo_name)
            return repo;
    }
}
/**
 * function 功用 ： 在指定的repo資訊中，找尋指定barnch名稱的branch，並回傳那個branch。
 * @param {*} branch_name : 要尋找的branch。 
 * @param {*} repo  : repo物件，為單一repo的物件。
 */
function searchBranchOfRepo(branch_name, repo){
    for(let branch of repo.branch){
        if(branch_name === branch.name)
            return branch;
    }
}
/**
 * function 功用 ： 在指定的檔案樹root中，尋找指定路徑的dir。
 * @param {*} path  : 指定路徑。
 * @param {*} root  : 檔案樹的root。
 */
function searchDirectoryOfRoot(path, root){
    if(root.path===path)
        return root;
    for(let blob of root.child){
        if(blob.type==='dir'){
            let dir = searchDirectoryOfRoot(path, blob);
            if(dir) return dir;
        }    
    }    
    return null;
}

function searchFileOfDirectory(path, dir){
    for(let blob of dir.child){
        if(blob.path === path)
            return blob
    }
}
function listAllDirBlobOfRoot(root){
    let list = root.child.filter(blob => blob.type ==='dir' );
    return list;

}
function listAllFileBlobOfRoot(root){
    let list = root.child.filter(blob => blob.type ==='file') ;
    return list;
}

/**
 *   ========================================================================================================
 * 
 *   ========================================================================================================
 */

/**
 * function 功用 ： 在指定的dir中，依照上傳檔案的資訊，找尋是否存在檔案，並且回傳sha值。
 * @param {*} dir : 指定的路徑。
 * @param {*} upload_info : 上傳檔案的資訊，此時必須有path，注意，此path包含檔案名。
 */
function searchFileSha(dir, upload_info){
    for(let i=0;i<dir.child.length;++i){
        if(dir.child[i].path === upload_info.path){
            upload_info.sha = dir.child[i].sha;
        }
    }
}

/**
 * 
 * function 功用 ： 將file blob的資訊讀取出來，並擷取需要的部分。
 *                 (根據github api的需求，從blob中提取出content和file name)。
 *                 (api : https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents) 
 * @param {*} file  : blob 物件，為輸入的file blob。
 * @param {*} upload_info : 包含用於發出update file or create file 的資訊。  
 */

async function readFile(file , upload_info){
    upload_info.file_name=file.name;
    console.log(file);
    return new Promise( (resolve,reject)=>{
        let reader = new FileReader();
        reader.onload = ()=>{
            upload_info.file_content=reader.result.split(',')[1];
            if(upload_info.path){
               upload_info.path = `${upload_info.path}/${file.name}`
            }else{
                upload_info.path = file.name;
            }
            resolve();
        }
        reader.onerror= ()=>{
            reject(reader.error);
        }
        reader.readAsDataURL(file);
    }).then(()=>{
        console.log('Success read a file .');
    }).catch((err)=>{
        console.log(err, 'Error when read file.');
    })
}

/**
 * function 功用 ： 發出github api的請求，若成功，則回傳respone，供更新現有的檔案樹。
 * @param {*} upload_info : 包含所有需要上傳檔案的相關資訊。
 */

async function requestPushFile(upload_info){
    let response={};
    await axios({
        method : "put",
        url : `https://api.github.com/repos/${upload_info.owner}/${upload_info.repo}/contents/${upload_info.path}`,
        headers: {
            Authorization: `token  ${upload_info.token}`
        },
        data : {
            message : upload_info.commit,
            content : upload_info.file_content, 
            sha : upload_info.sha,
            branch : upload_info.branch
        }
    }).then((resp)=>{
        console.log('Success push file .');
        response = resp;
    }).catch(err=>{
        console.log(err, 'Error when push file.');
        throw err;
    })
    return response;
}

function updateFileTree(root , response){
    console.log(response);
    if(response.status === 200)
     {   
         console.log('Update a file to github . file tree remain the same .');
         return;
     }   
     root.child.push({
         path : response.data.content.path,
         type : response.data.content.type,
         sha  : response.data.content.sha,

     })
    console.log('Create a file to github . file tree update to : ');
}
 
async function requestPullFile(get_info){
    let file;
    await axios({
        method : 'get',
        url : `https://api.github.com/repos/${get_info.owner}/${get_info.repo}/git/blobs/${get_info.sha}`,
        headers: {
            Authorization : `token ${get_info.token}`
        }
    }).then((response)=>{
        file= response;
        console.log(response);
    }).catch(err=>{
        console.log(err);
    })
    return file;
} 
/**
 *   ========================================================================================================
 * 
 *   ========================================================================================================
 */

export class ControllWindow extends React.Component{
    constructor(props){
        super(props);
        this.fileInput= React.createRef();
        this.state={
            isPull : true,
            commit_message:"",
            repoList: this.props.user.repo.map((repo,index)=>
                <option value={repo.name} key={index}>{repo.name}</option>
            ),
            current_repo:{name: ''},
            branchList:[],
            current_branch:{name:''},
            current_root:{path:''},
            pathList:[],
        }
        this.clearBuffer         = this.clearBuffer.bind(this); 
        this.hanleSelectTab     = this.hanleSelectTab.bind(this);
        this.handleSelectRepo   = this.handleSelectRepo.bind(this);
        this.handleSelectBranch = this.handleSelectBranch.bind(this);
        this.handleSelectPath   = this.handleSelectPath.bind(this);
        this.handleTextareaCommit        = this.handleTextareaCommit.bind(this);
        this.handlePushForm     = this.handlePushForm.bind(this);
        this.handlePullForm     = this.handlePullForm.bind(this);
    }
    clearBuffer(){
        this.setState({
            commit_message:"",
            repoList:  this.props.user.repo.map((repo,index)=>
                  <option value={repo.name} key={index}>{repo.name}</option>
            ),
            current_repo:{name:''},
            branchList:[],
            current_branch:{name:''},
            current_root:{path:''},
            pathList:[],
        })
    }
    hanleSelectTab(){
        this.setState({
            isPull : !this.state.isPull
        }, this.clearBuffer);
    }
    handleSelectRepo(event){
        if (!event.target.value)
            return;
        let new_repo = searchRepoOfUser(event.target.value ,this.props.user);
        let new_branchList = new_repo.branch.map((branch , index )=> branch = <option value={branch.name} key={index}>{branch.name}</option>)
        this.setState({
            current_repo : new_repo,
            branchList   : new_branchList ,
            current_branch:{name:''},
            current_root:{path:''},
            pathList:[],
        })

    }
    handleSelectBranch(event){
        if (!event.target.value)
            return; 
        let new_branch   = searchBranchOfRepo(event.target.value, this.state.current_repo);
        let new_pathList = listAllDirBlobOfRoot(new_branch)
        new_pathList = new_pathList.map((dir, index)=> <option value={dir.path} key={index}>{dir.path}</option>);
        if(this.state.isPull){
            let tmp_list = listAllFileBlobOfRoot(new_branch);
            let len = new_pathList.length;
            tmp_list = tmp_list.map((file, index)=> (<option value={file.path} key={index+len}>{file.path}</option>));
            new_pathList=new_pathList.concat(tmp_list);
        }
        this.setState({
            current_branch : new_branch,
            current_root   : new_branch,
            pathList       : new_pathList,
        })    

    }
    handleSelectPath(event){
        if(!event.target.value)
            return;  
        let new_root = searchDirectoryOfRoot(event.target.value, this.state.current_root);
        if(new_root === null){
            new_root =searchFileOfDirectory(event.target.value ,this.state.current_root);
            this.setState({
                current_root : new_root,
                pathList     : [],
            },()=>{
                console.log('cuurent root', this.state.current_root.path)
            })  
            return ;
        }
        let new_pathList = listAllDirBlobOfRoot(new_root);
        new_pathList = new_pathList.map((dir, index)=> <option value={dir.path} key={index}>{dir.path}</option>);
        if(this.state.isPull){
            let len = new_pathList.length;
            let tmp_list = listAllFileBlobOfRoot(new_root);
            tmp_list = tmp_list.map((file, index)=> <option value={file.path} key={len+index}>{file.path}</option>);
            new_pathList=new_pathList.concat(tmp_list);
        }
        this.setState({
            current_root : new_root,
            pathList     : new_pathList
        },()=>{
            console.log('cuurent root', this.state.current_root.path)
        })    
    }
    handleTextareaCommit(event){
        this.setState({
            commit_message : event.target.value
        })    
    }
    async handlePushForm(event){
        event.preventDefault();
        let upload_info={
            owner  : this.props.user.name,
            token  : this.props.user.token,
            repo   : this.state.current_repo.name,
            branch : this.state.current_branch.name,
            path   : this.state.current_root.path,
            commit : this.state.commit_message,
            file_name    : '',
            file_content : '',
            sha    : ''
        }
        await readFile(this.fileInput.current.files[0] , upload_info);
        searchFileSha(this.state.current_root , upload_info);
        let response = await requestPushFile(upload_info);
        updateFileTree(this.state.current_root , response);
        this.clearBuffer();
    }

    async handlePullForm(event){
        event.preventDefault();
        let get_info={
            owner  : this.props.user.name,
            token  : this.props.user.token,
            repo   : this.state.current_repo.name,
            path   : this.state.current_root.path,
            sha   : this.state.current_root.sha
        }
        let file=await requestPullFile(get_info);
        this.clearBuffer();
    }

    render(){
        let form;
        if(this.state.isPull === true){
            form = (
                <form className='formwrap' onSubmit={this.handlePullForm}>
                    <div className='input-box'>
                        <label>Repo</label>
                        <select onChange={this.handleSelectRepo} required>
                            <option value='' key={-1}></option>
                            {this.state.repoList}
                        </select>
                    </div>
                    <div className='input-box'>
                        <label>Branch</label>
                        <select value={this.state.current_branch.name} onChange={this.handleSelectBranch} required>
                            <option value='' key={-1}></option>
                            {this.state.branchList}
                        </select>
                    </div>
                    <div className="input-box">
                        <label>Path</label>
                        <select value={this.state.current_root.path} onChange={this.handleSelectPath} >
                            <option value={this.state.current_root.path} key={-1}>{this.state.current_root.path}</option>
                            {this.state.pathList}
                        </select>
                    </div>
                    <div className="input-box">
                        <input type="submit" value='get file'></input>
                    </div>
                </form>
            )

        }else{
            form =(
                <form className='formWrap' onSubmit={this.handlePushForm}>
                    <div className="input-box">
                        <label>Repo</label>
                        <select value={this.state.current_repo.name} onChange={this.handleSelectRepo} required>
                            <option value='' key={-1}></option>
                            {this.state.repoList}
                        </select>
                    </div>
                    <div className='input-box'>
                        <label>Branch</label>
                        <select value={this.state.current_branch.name} onChange={this.handleSelectBranch} required>
                            <option value='' key={-1}></option>
                            {this.state.branchList}
                        </select>
                    </div>
                    <div className="input-box">
                        <label>Path</label>
                        <select value={this.state.current_root.path} onChange={this.handleSelectPath}>
                            <option value={this.state.current_root.path} key={-1}>{this.state.current_root.path}</option>
                            {this.state.pathList}
                        </select>
                    </div>
                    <div className="input-box">
                        <label>Commit message</label>
                        <textarea rows='7' value={this.state.commit_message} onChange={this.handleTextareaCommit} required>
                        </textarea>
                    </div>
                    <div className='input-box'>
                        <label>File</label>
                        <label className='fileLabel'>
                            { 'Select File.' /*( (!this.fileInput.current) ? 'Select File': this.fileInput.current.files[0].name)*/}
                            <input type='file' ref={this.fileInput} required></input>
                        </label>
                    </div>
                    <div className="input-box">
                        <input type="submit" value='upload'></input>
                    </div>
                </form>
            )
        }
        return (
            <div className='tab-caotainer'>
                <div className='tab-navbar'>
                    <div className={'tab-item ' +  (this.state.isPull ? 'tab-item-active' : '')} onClick={this.hanleSelectTab}>
                        pull file
                    </div>
                    <div className={'tab-item ' + (!this.state.isPull ? 'tab-item-active' : '')} onClick={this.hanleSelectTab}>
                        push file
                    </div>
                </div>
                <div className='tab-body'>
                    {form}
                </div>
            </div>
        )
    }
}