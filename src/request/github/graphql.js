export const queryRepoCount = (userName)=>{
    return JSON.stringify({
     query : `query ($userName:String!) {
         user(login: $userName) {
           repositories {
             totalCount
           }
         }
     }`,
     variables : { userName }
   })
 }
 
 export const queryRepoList=(userName,totalCount )=>{
     return JSON.stringify({
       query: `query ($userName:String! , $totalCount:Int!){
         __typename
         repositoryOwner(login: $userName) {
           repositories(last: $totalCount) {
             edges {
               node {
                 name
               }
             }
           }
         }
       }`,
       variables: { userName ,  totalCount}
     })
 }
 
 export const queryBranchCount = (userName , repoName)=>{
     return JSON.stringify({
       query : `query ($userName:String! , $repoName:String!){
           __typename
           repository(name: $repoName, owner: $userName) {
             refs(refPrefix: "refs/") {
               totalCount
             }
           }
       }`,
       variables:{ userName , repoName}
     })
 }
 
 export const queryBranchList = (userName, repoName, totalCount) =>{
     return  JSON.stringify({
       query : `query ($userName:String! , $repoName:String! , $totalCount:Int!) {
           __typename
           repository(name: $repoName, owner: $userName) {
             refs(refPrefix: "refs/", last: $totalCount) {
               edges {
                 node {
                   name
                 }
               }
             }
           }
       }`,
       variables:{ userName , repoName , totalCount }
   })
 }
 
 export const queryBranchCotent = (userName, repoName, branchName)=>{
    return JSON.stringify({
         query : `query ($userName:String! , $repoName:String! , $branchName:String!){
             __typename
             repository(name: $repoName, owner: $userName) {
               object(expression: $branchName) {
                 ... on Tree {
                   entries {
                     type
                     oid
                     name
                   }
                 }
               }
             }
         }`,
         variables:{ userName, repoName , branchName: `${branchName}:`}
     })
 }

export  const queryGitTree=(userName, repoName, oid)=>{
    return JSON.stringify({
        query:`query ($userName :String! , $repoName:String!,$oid:GitObjectID!){
          __typename
          repository(name: $repoName, owner: $userName) {
            object(oid: $oid) {
              ... on Tree {
                entries {
                  type
                  name
                  oid
                }
              }
            }
          }
        }
        `,
        variables:{userName, repoName, oid}
    })
 }

 export const queryPullFile= (userName, repoName, branchName, oid) =>{
    return JSON.stringify({
      query :`query ($userName:String!, $repoName:String!, $branchName:String!, $oid:GitObjectID!){
        __typename
        repository(name: $repoName, owner: $userName) {
          object(oid: $oid, expression: $branchName) {
            ... on Blob {
              isBinary
              text
            }
          }
        }
      }`,
      variables:{userName, repoName, branchName, oid}
    })
 }