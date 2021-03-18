import {requestGitLabRepoOfUser , requestGitLabBranchOfRepo ,requestGitLabBrancContent , 
        requestPushFile         , requestPullFile           ,
        requestNewBranch
       } from './fetch'
import {Treetify }from './treetify';

class GitLabFile{
    constructor(path , id ,type){
        this.path = path;
        this.id =id ;
        this.type = (type === 'tree' ? 'dir' : 'file');
        if(this.type === 'dir')
          this.child=[]
    }
    searchFile(targetFilePath){
        if(this.type === 'file')
            return null;
        for(let file of this.child){
            if(file.path === targetFilePath)
                return file;
        }
        return null;
    }
}

class GitLabBranch{
    constructor(name){
        this.name = name ;
        this.path = '';
        this.type='dir';
        this.child =[];
    }
    searchDir(targetDirPath , rootDir=this){
         if(targetDirPath === rootDir.path){
            return rootDir;
         }
         for(let dir of rootDir.child){
            if(dir.type === 'dir' && (targetDirPath.indexOf(dir.path)!== -1) ){
               let tmp = this.searchDir(targetDirPath , dir);
               if(tmp) return tmp;
            }
         }
         return null;
    }
    async getBranchInfo(url, userName , userToken, repoId){
        let data = await requestGitLabBrancContent(url, userName, userToken , repoId , this.name);
        for(let file of data){
            this.child.push(new GitLabFile(file.path, file.id , file.type))
        }
        Treetify(this);
    }
}

class GitlabRepo{
    constructor(name, id){
        this.name=name;
        this.id =id;
        this.branch=[];
    }
    searchBranch(targetBranchName){
        for(let branch of this.branch){
            if(branch.name === targetBranchName)
                return branch;
        }
        return null;
    }
    async getRepoInfo(url, userName , userToken){
        let data =await requestGitLabBranchOfRepo(url, userName, userToken , this.id);
        for(let branch of data){
            this.branch.push(new GitLabBranch(branch.name));
        }
        for(let branch of this.branch){
            await branch.getBranchInfo(url, userName, userToken , this.id);
        }
    }
}

export default class GitlabUser{
    constructor(name , token, url){
        this.url = ( !url ? "gitlab.com" : url );
        this.name = name ;
        this.token = token;
        this.repo=[]
    }
    searchRepo(targetRepoName){
        for(let repo of this.repo){
            if(repo.name === targetRepoName)
                return repo;
        }
        return null;    
    }
    searchBranch(targetRepoName , targetBranchName){
        let repo = this.searchRepo(targetRepoName);
        if(repo){
            return  repo.searchBranch(targetBranchName);
        }
        return null;
    }
    searchDir(targetRepoName , targetBranchName , targetDirPath){
        let branch = this.searchBranch(targetRepoName , targetBranchName);
        if(branch){
            return branch.searchDir(targetDirPath);
        }
        return null;
    }
    searchFile(targetRepoName , targetBranchName ,targetDirPath , targetFilePath){
        let dir  = this.searchDir(targetRepoName ,targetBranchName ,targetDirPath);
        if(dir instanceof GitLabBranch){
            for(let file of dir.child){
                if(file.path === targetFilePath)
                    return file;
            }
            return null;
        }
        return dir.searchFile(targetFilePath);
    }
    listRepoOfUser(){
        let repo_data = this.repo.map(repo =>{ return {name : repo.name}});
        return repo_data;
    }
    listBranchOfRepo(targetRepoName){
        let repo = this.searchRepo(targetRepoName);
        if(repo){
            return  repo.branch.map(branch => { return { name : branch.name} } );
        }
        return [];
    }
    listDirOfBranch(targetRepoName , targetBranchName , targetDirPath){
        let dir = this.searchDir(targetRepoName, targetBranchName ,targetDirPath);
        if(dir){
            return dir=dir.child.filter(dir => dir.type === 'dir').map(dir=>{
                    return { path : dir.path}  
            })
        }
        return []
    }
    listFileOfDir(targetRepoName , targetBranchName , targetDirPath){
        let dir = this.searchDir(targetRepoName, targetBranchName ,targetDirPath);
        if(!dir){
            return [];
        }
        return dir.child.filter(file => file.type === 'file').map(file =>{
            return {path:file.path}
        } )    

    }
    async getUserInfo(){
        let data = await requestGitLabRepoOfUser(this.url,  this.name , this.token);
        for(let repo of data){
            this.repo.push(new GitlabRepo(repo.name,repo.id));
        }
        for(let repo of this.repo){
            await repo.getRepoInfo(this.url, this.name ,this.token);
        }
    }
    async pushFile(repoName , branchName, dirPath  ,commitMessage , fileName, fileContent){
        let repoId = this.searchRepo(repoName).id;
        let path = ( !dirPath ? '': dirPath+'/')+fileName; 
        let file = this.searchFile(repoName , branchName, dirPath ,path);
        await requestPushFile(this.url, this.token , repoId , branchName, path ,commitMessage, fileContent , (!file ? false : true))
        if(!file){
            let dir = this.searchDir(repoName , branchName, dirPath);
            dir.child.push(new GitLabFile(path, '', 'file'));
        }
    }
    async pullFile(repoName , branchName , dirPath ,filePath){
        let repoId = this.searchRepo(repoName).id;
        let data = await requestPullFile(this.url, this.token, repoId, branchName, filePath);
        console.log(data);       
    }
    async createBranch(repoName , newBranchName , branchRef){
        let targetRepo = this.searchRepo(repoName);
        await requestNewBranch(this.url, this.token, targetRepo.id, newBranchName, branchRef);
        let newGitlabBranch = new GitLabBranch(newBranchName);
        await newGitlabBranch.getBranchInfo(this.url, this.name, this.token, targetRepo.id);
        targetRepo.branch.push(newGitlabBranch);
    }

}