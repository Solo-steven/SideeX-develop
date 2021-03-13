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

export async function Treetify(root){
    let list=root.child;
    root.child=[];
    DFS_Treetify(root,list, {num:0});
}