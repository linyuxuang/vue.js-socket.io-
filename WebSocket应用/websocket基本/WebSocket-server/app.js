
// 引入WebSocket模块
const ws = require("nodejs-websocket");
//设置端口号
const PORT = 8082

//创建一个server
    const server = ws.createServer(function(conn){
        console.log('有用户连接上来了')
       //每当拿到用户传递过来的数据，这个text事件会被触发 
       conn.on("text", function (data) {
        console.log("客户端发过来的数据 "+data)
        //WebSocket给客户端发送数据  
		conn.sendText(data.toUpperCase()+"!!!")
         })
        conn.on('close',function(){
            console.log("连接断开了")
        })
        conn.on('error',function(){
        console.log('发生异常')
       })
    })

    //监听端口号
    server.listen(PORT,function(){
        console.log("websocket服务启动成功了，端口"+ PORT)
    })
 

