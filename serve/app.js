module.exports=(app)=>{
    app.validator.addRule("username",(rule,value)=>{
        let reg=/^1[356789]\d{9}$/
        if(!reg.test(value)){
            return "请输入正确定手机号"
        }
    })
}