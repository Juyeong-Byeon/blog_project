let postId=1;

const posts=[
    {
        id:1,
        title:'제목',
        body:'내용'
    }
];

exports.write=ctx=>{ //post 작성
    const {title,body}=ctx.request.body;
    postId++;
    const post={id: postId, title, body};
    posts.push(post);
    ctx.body=post
}

exports.list=ctx=>{//get 목록 조회 
    ctx.body=posts;
};

exports.read= ctx=>{//get 특정 포스트 조회
    const {id}=ctx.params;

    const post=posts.find(p=>p.id.toString()===id);
    if(!post){
        ctx.status=404;
        ctx.body={
            message:'post not found'
        }
        return;
    }
    ctx.body=post;

}

exports.remove=ctx=>{
    const {id}=ctx.params;
    const index=posts.findIndex(p=>p.id.toString()===id);
    if(index===-1){
        ctx.status=404;
        ctx.body={
            message:'post not found'
        };
    }

    posts.splice(index,1);
    ctx.status=204;
}

exports.replace=ctx=>{
    const {id}=ctx.params;
    const index=posts.findIndex(p=>p.id.toString()===id);
    if(index===-1){
        ctx.status=404;
        ctx.body={
            message:'포스트가 존재하지 않습니다.',
        }
        return;
    }
    posts[index]={
        id,
        ...ctx.request.body,
    };
    ctx.body=posts[index];   
};

exports.update=ctx=>{
    const {id}=ctx.params;
    const index=posts.findIndex(p=>p.id.toString()===id);

    if(index===-1){
        ctx.status=404;
        ctx.body={
            message:'post not found'
        }
        return;
    }

    posts[index]={
        ...posts[index],
        ...ctx.request.body,
    };
    ctx.body=posts[index];

}



