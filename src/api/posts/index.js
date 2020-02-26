const Router=require('koa-router');
const postsCtrl=require('./posts.crtl');
const posts =new Router();
const checkLoggedIn=require('../../lib/checkLoggedIn');

posts.get('/',postsCtrl.list);
posts.post('/',checkLoggedIn,postsCtrl.write);


const post =new Router();
post.get('/',postsCtrl.read);
post.delete('/',checkLoggedIn,postsCtrl.checkOwnPost,postsCtrl.remove);
post.patch('/',checkLoggedIn,postsCtrl.checkOwnPost,postsCtrl.update);

posts.use('/:id',postsCtrl.getPostById,post.routes());

module.exports=posts;