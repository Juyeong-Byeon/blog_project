require('dotenv').config();
const Koa=require('koa');
const Router=require('koa-router');
const bodyparser=require('koa-bodyparser');

const{PORT}=process.env;
console.log(PORT);
const api=require('./api');


const app=new Koa();
const router=new Router();

router.use('/api',api.routes());
app.use(bodyparser());
app.use(router.routes()).use(router.allowedMethods());


const port=PORT||4000;

app.listen(port,()=>{
    console.log(`listening ${port}`);
});