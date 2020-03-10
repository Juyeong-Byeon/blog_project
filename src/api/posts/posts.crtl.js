const Post=require('../../models/post');
const mongoose=require('mongoose');
const Joi=require('joi');
const sanitizeHtml=require('sanitize-html');
const {ObjectId}=mongoose.Types;

const sanitizeOption={
    allowedTags:[
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'u',
        'ol',
        'li',
        'a',
        'img',
    ],
    allowedAttributes:{
        a:['href','name','target'],
        img:['src'],
        li:['class'],
    },
    allowedSchemes:['data','http'],
}

const removeHtmlAndShorten=body=>{
    const filtered =sanitizeHtml(body,{
        allowedTags:[],
    });

    return filtered.length<200 ? filtered: `${filtered.slice(0,200)}...`
}

exports.getPostById= async(ctx,next)=>{
    const {id}=ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status=400;
        return;
    }
    try{
        const post=await Post.findById(id);
        if(!post){
            ctx.status=404;
            return;
        }
        ctx.state.post=post;
        return next();

    }catch(e){
        ctx.throw(500,e);
    }
    
};

exports.write=async(ctx)=>{ //post 작성
    const schema=Joi.object().keys({
        title:Joi.string().required(),
        body:Joi.string().required(),
        tags:Joi.array().items(Joi.string()).required()
    });

    const result=Joi.validate(ctx.request.body,schema);
    if(result.error){
        ctx.status=400;
        ctx.body=result.error;
        return;
    }

    const {title,body,tags}=ctx.request.body;
    const post=new Post({
        title,
        body:sanitizeHtml(body,sanitizeOption),
        tags,
        user:ctx.state.user,
    });
    console.log(post);
    try{
        await post.save().then(()=>{console.log})
        ctx.body=post;
       
    }catch(e){
        ctx.throw(500,e);
    }
};

exports.list= async (ctx)=>{//get 목록 조회 

    const page=parseInt(ctx.query.page||'1',10);

    if(page<1){
        ctx.status=400;
        return;
    }
    const {tag,usename}=ctx.query;
    const query={
        ...(usename?{'user.username':username}:{}),
        ...(tag?{tags:tag}:{}),
    }

   try{
       const posts=await Post
            .find(query)
                .sort({_id:-1})
                    .limit(5)
                        .skip((page-1)*5)
                            .exec();
        const postCount=await Post.countDocuments(query).exec();
        ctx.set('Laxt-Page',Math.ceil(postCount/5));
       ctx.body=posts.map(post=>post.toJSON()).map(post=>({
           ...post,
           body:removeHtmlAndShorten(post.body),
       }))

   }catch(e){
       ctx.throw(500,e);
   }
    
};

exports.read=async (ctx)=>{//get 특정 포스트 조회
//   const {id}=ctx.params;
//     try{

//         const post= await Post.findById(id).exec();
//         if(!post){
//             ctx.status=404;
//             return;
//         }
//         ctx.body=post;
//   }catch(e){
//         ctx.throw(500,e);
//   }
    ctx.body=ctx.state.post;
};

exports.remove=async ctx=>{
    const {id}=ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        if(!post){
            ctx.status=404;
            return;
        }
    ctx.status=204;
        
    }catch(e){
        ctx.throw(500,e);
    }
    
};

exports.update=async ctx=>{
    const nextData={...ctx.request.body};
    if(nextData.body){
        nextData.body=sanitizeHtml(nextData.body)
    };
    const schema=Joi.object().keys({
        title:Joi.string(),
        body:Joi.string(),
        tags:Joi.array().items(Joi.string())
    });
    const result=Joi.validate(ctx.request.body,schema);
    if(result.error){
        console.log(result.error);
        ctx.status=400;
        ctx.body=result.error;
        return;
    }
    const {id}=ctx.params;
    
    try{
        const post=await Post.findByIdAndUpdate(id,nextData,{
            new: true
        }).exec();
        if(!post){
            ctx.status=404;
            ctx.body='not found';
            return;
        }
        ctx.body=post;
    }catch(e){
        ctx.throw(500,e);
    }
    
};

exports.checkOwnPost=(ctx,next)=>{
    console.log(ctx.state);
    const{user,post}=ctx.state;
    
    if(post.user._id.toString()!==user._id){
        ctx.status=403;
        return;
    }
    return next();
}



