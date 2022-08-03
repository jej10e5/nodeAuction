const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../models/user')

module.exports = () =>{
    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password'
    }, async(email,password,done)=>{
        console.log(email)
        console.log(password)
        try{
            //email에 해당하는 데이터 찾기
            const exUser = 
                await User.findOne({where:{email}})
           // console.log(exUser)
            if(exUser){
                //비밀번호 비교
                const result = await bcrypt.compare(password, exUser.password)
                if(result){
                    //로그인 성공한 경우- 회원정보를 전달
                    done(null,exUser) //session에 저장
                }else{
                    done(null,false,{message:"잘못된 비밀번호입니다."})
                }
            }else{
                done(null,false,{message:"가입하지 않은 이메일입니다."})
            }
        }catch(error){
            console.error(error)
            done(error)
        }
    }))
}