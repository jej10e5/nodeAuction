const SSE = require('sse')

module.exports=(server)=>{
    const sse = new SSE(server)
    //클라이언트가 웹 푸시에 연결하면
    sse.on('connection',(client)=>{
        //주기적인 작업
        setInterval(()=>{
            client.send(Date.now().toString())
        },1000) //1초마다 현재시간을 계속 send함
    })
}