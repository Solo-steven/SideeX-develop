function DFS_Treetify(root, data){
    for(let dir of root.child){
        if(dir.type === 'dir'){
            //console.log(dir , data ,data.path.indexOf(dir.path) )
            if(data.path.indexOf(dir.path)!== -1){
                DFS_Treetify(dir , data);
                return;
            }
        }
    }
    root.child.push(data);
}

export async function Treetify(root){
    let list=root.child;
    root.child=[];
    for(let data of list){
        DFS_Treetify(root , data);
    }
}