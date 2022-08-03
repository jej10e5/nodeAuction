//웹 서버 모듈 추출
const express= require('express')

//.env 파일의 내용을 메모리에 로드
const dotenv = require('dotenv')
dotenv.config()

//서버 설정
const app = express()
app.set('port',process.env.PORT)

//경로를 위한 모듈을 추출
const path = require('path')

//static파일의 경로 설정
//static파일 - 내용이 변하지 않는 파일
// html, css, js, 이미지, 동영상, 사운드 파일 등
//이 파일의 경로는 / 가 프로젝트 내의 public 과 매핑됨
app.use(express.static(path.join(__dirname,'public')))

//템플릿 엔진(서버의 데이터를 뷰 파일에 출력할 수 있도록 해주는 모듈)설정 - numjucks
const nunjucks = require('nunjucks')
//데이터를 출력하는 뷰 파일의 확장자는 html이고
//뷰 파일의 위치는 views 디렉토리로 설정
app.set('view engine','html')
nunjucks.configure('views',{
    express:app,
    watch:true
})

//파일에 읽고 쓰기 위한 모듈 추출
const fs = require('fs')
//로그를 기록하기 위한 모듈
const morgan = require('morgan')
//로그를 파일에 출력하기 위한 모듈
const FIleStreamRotator = require('file-stream-rotator')
const FileStreamRotator = require('file-stream-rotator')

//로그 파일을 위한 디렉토리 생성
const logDirectory = path.join(__dirname,'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

//로그 파일 옵션 설정
const accessLogStream = FileStreamRotator.getStream({
    data_format : 'YYYYMMDD',
    filename:path.join(logDirectory,'access-%DATE%.log'),
    frequency:'daily',
    verbose:false
})

//로그 설정
app.use(morgan('combined',{stream:accessLogStream}))

//출력하는 파일을 압축해서 전송
const compression = require('compression')
app.use(compression())

//post 방식의 파라미터 일기
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

//쿠키(서버와 클라이언트 사이에서 연결을 유지하도록 하기 위해서 
//클라이언트에 데이터를 저장하고 요청을 보낼때마다 쿠키를 전송) 설정
const cookieParser = require('cookie-parser')
app.use(cookieParser(process.env.COOKIE_SECRET))

//세션 - 서버에 저장
//세션은 기본적으로 서버의 메모리에 저장되는데
//세션의 개수가 많아지면 서버의 메모리에 부담이 생기고
//서버가 재부팅 되었을때 클라이언트의 모든 세션이 소멸됩니다.
//최근에는 세션을 파일이나 데이터베이스에 저장하는 경우가 종종 있습니다.
const session = require('express-session')
var option = {
    host:process.env.HOST,
    port:process.env.MYSQLPORT,
    user:process.env.USERID,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
}

const MySQLStore = require('express-mysql-session')(session)
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:true,
    store : new MySQLStore(option)
}))

const {sequelize}=require('./models')
sequelize.sync({force:false}) // force가 true이면 매번 다시 생성함 (지웠따 다시 생성)
.then(()=>{
    console.log('데이터베이스 연결 성공')
})
.catch((err)=>{
    console.err(err)
})

//passport설정
const passport = require('passport')
const passportConfig = require('./passport')
passportConfig()
app.use(passport.initialize())
app.use(passport.session())

const checkAuction = require('./checkAuction')
checkAuction()

//라우팅 처리
//클라이언트의 요청이 온 경우 처리 구문
const indexRouter = require('./routes')
app.use('/',indexRouter)

const authRouter = require('./routes/auth')
app.use('/auth',authRouter)


//라우팅 하다가 에러가 발생한 경우 처리- 그래서  404밖에 없음
app.use((req,res,next)=>{
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    err.status=404;
    next(err)

})

//라우팅이 아닌 처리를 하다가 에러 발생한 경우 처리
app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production'? err : {}
    res.status(err.status||500)
    res.render('error')
})


const sse = require('./sse')
const webSocket = require('./socket')

//서버 실행
const server=app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중')
})
 webSocket(server,app)
 sse(server)