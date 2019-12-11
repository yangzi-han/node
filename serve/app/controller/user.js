const Controller=require('egg').Controller
const uid=require("uid")
const jwt=require("jsonwebtoken")
const {findViews} =require('../../config/view.config')
module.exports=class extends Controller{

    //注册
    async index(ctx){ 
        let {request}=ctx
        await  this.app.mysql.insert("login",{
            ...request.body,
            id:uid(10)
        })
        ctx.body={
            code:1,
            msg:"注册成功"
        }
    }
    async getIndtity(){
        let data=await this.app.mysql.select("identity");
        this.ctx.body={
            msg:"success",
            code:1,
            data:[...data]
        }
    }
    //登入
    async login(ctx){
        const {password,username}=ctx.request.body;
        
        let data=await this.app.mysql.get("login",{
            username,password
        })
            if(data){
                delete data.password;
                ctx.body={
                    code:1,
                    msg:"登入成功",
                    data:{
                        token:jwt.sign({...data},this.app.config.keys,{expiresIn:'1h'})
                    }
                }
                return;
            }
            ctx.body={
                code:0,
                msg:"登入失败"
            }
        }
        //登入解密
        async local(){
            let token=this.ctx.get("token");
            try{
                let local=jwt.verify(token,this.app.config.keys)
                this.ctx.body=local
                let title=await this.app.mysql.get("identity",{
                    id:local.check
                })
              local.viewList = findViews(title.title)
                local.userIdentityTitle=title.title
                
            }catch(error){
                console.log(error)
                    this.ctx.status=401;
                    this.ctx.body={
                        code:0,
                        msg:'用户信息错误'
                    }
                
                
            }
        }
        
       
    }
