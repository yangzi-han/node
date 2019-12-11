const jwt=require("jsonwebtoken")
const {findViews} =require('../config/view.config')
module.exports=app=>{
    let {router,controller}=app
        router.get("/",controller.index.init)
        router.post("/login",controller.user.index)
        router.get("/identity",controller.user.getIndtity)
        router.post("/list",controller.user.login)
        const local=async function local(ctx,next){
            let token=ctx.get("token");
            try{
                let local=jwt.verify(token,ctx.app.config.keys)
                let title=await ctx.app.mysql.get("identity",{
                    id:local.check
                })
              local.viewList = findViews(title.title)
                local.userIdentityTitle=title.title
                ctx.local=local
                await next();
            }catch(error){
                console.log(error)
                    ctx.status=401;
                   ctx.body={
                        code:0,
                        msg:'用户信息错误'
                    }
                
                
            }
        }
        router.get("/local",local,async ctx=>{
            ctx.body=ctx.local
        })
        router.post("/submitexam",local,controller.exam.submit)
}