const Koa=require('koa');
const Router=require('koa-router');
const api=require('./api/index');


const app=new Koa();
const router=new Router();



app.use('/api',api.routes());
app.use(router.routes()).use(router.allowedMethods());
app.listen(4000,()=>{
    console.log('listening 4000');
});