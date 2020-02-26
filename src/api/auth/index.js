const Router=require('koa-router');
const authCtrl=require('./auth.ctrl');


const router=new Router();

router.post('/register',authCtrl.register);
router.post('/login',authCtrl.login);
router.get('/check',authCtrl.check);
router.post('/logout',authCtrl.logout);

module.exports=router;