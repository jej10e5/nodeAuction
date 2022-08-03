const passport = require('passport')

const local = require('./localStrategy')
const User = require('../models/user')

module.exports=()=>{
    //User정보에 변화된 내용을 데이터베이스에 반영
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    //User정보 가져오기
    passport.deserializeUser((id,done)=>{
        User.findOne({where:{id}})
        .then(user=>done(null,user))
        .catch(err=>done(err))
    })
    local()
}