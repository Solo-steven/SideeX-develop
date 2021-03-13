import {requestGithubUserName, requestGithubRepoOfUser , requestGithubBranchOfRepo , 
        requestGithubContent , requestGitTree,  requestPushFile , requestPullFile } from './fetch';
import  {Treetify} from './treetify'        

class GithubFile{
    constructor(path , sha , type){
        this.path = path;
        this.sha = sha;
        this.type = ( ((type === 'tree') || (type === 'dir')) ? 'dir' : 'file') ;
        if(this.type ==='dir')
            this.child =[];
    }
    searchFile(targetFilePath){
        if(this.type === 'dir'){
            for(let file of this.child){
                if(file.path === targetFilePath)
                    return file;
            }
        }
        return null;
    }
    async getGitTreeInfo(userName, userToken, repoName){
        console.log(this.sha)
        let file_of_tree = await requestGitTree(userName ,userToken , repoName , this.sha);
        for(let file of file_of_tree){
            this.child.push(new GithubFile(`${this.path}/${file.path}`, file.sha, file.type));
        } 
        Treetify(this)
    }
}

class GithubBranch{
     constructor( name){
         this.name= name;
         this.path = '';
         this.type='dir';
         this.child=[];
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
     async getBranchInfo(userName, userToken , repoName){
         let content_info = await requestGithubContent(userName, userToken, repoName, this.name);
         for(let content of content_info){
            this.child.push(new GithubFile(content.path, content.sha , content.type));
         }
         for(let dir of this.child){
             if(dir.type === 'dir')
                await dir.getGitTreeInfo(userName, userToken , repoName );
         }
     }
}

class GithubRepo{
    constructor(name){
        this.name =name;
        this.branch =[];
    }
    searchBranch(targetBarnchName){
        for(let branch of this.branch){
            if(branch.name === targetBarnchName)
                return branch;
        }
        return null;
    }
    async getRepoInfo(userName , userToken){
        let branch_info = await requestGithubBranchOfRepo(userName, userToken, this.name);
        for(let branch of branch_info){
            this.branch.push(new GithubBranch(branch.name));
        }
        for(let branch of this.branch){
            await branch.getBranchInfo(userName, userToken, this.name);
        }
    }
}
export default class GithubUser{
    constructor(name, token){
        this.name = name ;
        this.token = token;
        this.repo = [] ;
    }
    async changeToken(token){
        this.token = token;
        this.name = await requestGithubUserName(this.token);
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
        if(!repo)
            return null;
        return repo.searchBranch(targetBranchName);    
    }
    searchDir(targetRepoName , targetBranchName , targetDirPath){
        let branch =this.searchBranch(targetRepoName , targetBranchName);
        if(!branch)
            return null;
        return branch.searchDir(targetDirPath);    
    }
    searchFile(targetRepoName , targetBranchName , targetDirPath ,targetFilePath){
        let dir = this.searchDir(targetRepoName , targetBranchName , targetDirPath);
        if(!dir)
            return null;
        if(dir instanceof GithubBranch){
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
        return [];
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
        let repo_info = await requestGithubRepoOfUser(this.name , this.token);
        for(let repo of repo_info){
            this.repo.push(new GithubRepo(repo.name));
        }
        for(let repo of this.repo){
            await repo.getRepoInfo(this.name, this.token);
        }
    }
    async pushFile(repoName , branchName , dirPath ,commitMessage ,fileName , fileContent){
        let path = ( !dirPath ? '' : dirPath+'/') + fileName;
        let file = this.searchFile(repoName, branchName, dirPath, path);
        let response =  await requestPushFile(this.token, this.name, repoName, branchName, path ,commitMessage ,fileContent, ( !file ?'':file.sha));
        let dir = this.searchDir(repoName, branchName , dirPath );
        dir.child.push(new GithubFile(response.path ,response.sha, response.type));
        console.log(response);
    }
    async pullFile(repoName , branchName , dirPath ,filePath){
        let file = this.searchFile(repoName , branchName , dirPath ,filePath);
        if(!file)
            return;      
        let githubBlob = await requestPullFile(this.token, this.name , repoName , file.sha);
        console.log(githubBlob)
    }
}