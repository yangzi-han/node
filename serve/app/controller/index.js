const Controller=require('egg').Controller
class IndexController extends Controller{
async init(ctx,next){
    ctx.body="hello egg"
}
aa(){

}
}
module.exports= IndexController