const mongoose=require('mongoose');


const {Schema}=mongoose;

const PostSchema=new Schema({
    title:String,
    body:String,
    tags:[String],
    publishedDate:{
        type:Date,
        default:Date.now,
    }
});

const Post=mongoose.model('Post',PostSchema);
module.exports=Post;