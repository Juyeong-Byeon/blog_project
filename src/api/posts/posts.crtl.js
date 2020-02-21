const Post=require('../../models/post');
const mongoose=require('mongoose');
const Joi=require('joi');
const {ObjectId}=mongoose.Types;

exports.checkObjectId=(ctx,next)=>{
    const {id}=ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status=400;
        return;
    }
    return next();
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
        body,
        tags,
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

   try{
       const posts=await Post
            .find()
                .sort({_id:-1})
                    .limit(10)
                        .skip((page-1)*10)
                            .exec();
        const postCount=await Post.countDocuments().exec();
        ctx.set('Laxt-Page',Math.ceil(postCount/10));
       ctx.body=posts.map(post=>post.toJSON()).map(post=>({
           ...post,
           body:post.body.length<200?post.body:`${post.body.slice(0,200)}...`,
       }))

   }catch(e){
       ctx.throw(500,e);
   }
    
};

exports.read=async (ctx)=>{//get 특정 포스트 조회
  const {id}=ctx.params;
    try{

        const post= await Post.findById(id).exec();
        if(!post){
            ctx.status=404;
            return;
        }
        ctx.body=post;
  }catch(e){
        ctx.throw(500,e);
  }

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
        const post=await Post.findByIdAndUpdate(id,ctx.request.body,{
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



