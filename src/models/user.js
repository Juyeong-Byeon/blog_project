const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {Schema}=mongoose;

const UserSchema=new Schema({
    username:String,
    hashedPassword:String,
    
});

UserSchema.methods.generateToken=function(){
    const token=jwt.sign(
        {
            _id:this.id,
            username:this.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'7d'
        }
    );
    console.log('generated');
    return token
};

UserSchema.methods.setPassword=async function(password){//인스턴스 메서드 this가 인스턴스를 가리킨다
    const hash =await bcrypt.hash(password,10);
    this.hashedPassword=hash;
}//this를 이용하기 위해 function 을 사용하였다. 

UserSchema.methods.checkPassword=async function(password){//인스턴스 메서드 this가 인스턴스를 가리킨다
    const result=await bcrypt.compare(password,this.hashedPassword);
    return result;
}//들어온 패스워드와 이전 패스워드와 같은지 확인해준다. this를 이용하기 위해 function 을 사용하였다. 


UserSchema.methods.serialize=function(){
    const data=this.toJSON();
    delete data.hashedPassword;
    return data;
};

UserSchema.statics.findByUsername=function(username){ // 스테틱 메서드 this가 모델을 가리킨다.
    return this.findOne({username});
}



const User=mongoose.model('User',UserSchema);
module.exports=User;
