require('dotenv').config();
const Koa=require('koa');
const Router=require('koa-router');
const bodyparser=require('koa-bodyparser');
const mongoose=require('mongoose');
const jwtMiddleware=require('./lib/jwtMiddleware');


const{PORT,MONGO_URI}=process.env;
console.log(PORT);
const api=require('./api');


const app=new Koa();
const router=new Router();

router.use('/api',api.routes());
app.use(bodyparser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());

const port=PORT||4000;

mongoose
    .connect(MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: false})
        .then(()=>{console.log('Connected to MongoDE');})
            .catch(e=>{console.error(e)});



app.listen(port,()=>{
    console.log(`listening ${port}`);
});