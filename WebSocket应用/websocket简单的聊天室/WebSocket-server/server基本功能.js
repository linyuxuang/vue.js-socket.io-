 // 引入WebSocket模块
const ws = require("nodejs-websocket");
//设置端口号
const PORT = 8081
let count=0;
//创建一个server
    const server = ws.createServer(function(conn){
        count++;
        console.log('有用户连接上来了');
        conn.uesrName=`用户${count}`;
        broadcast(`${conn.uesrName}进入聊天室`);
       //每当拿到用户传递过来的数据，这个text事件会被触发 
       conn.on("text", function (data) {
         //给用户发送消息
         broadcast(data)
         })
        conn.on('close',function(){
            count--;
            broadcast(`${conn.uesrName}离开聊天室`)
            console.log("连接断开了")
        })
        conn.on('error',function(){
        console.log('发生异常')
       })
    })
   //server.connections给到所有客户端用户发送消息（广播）
    function broadcast(msg) {
        server.connections.forEach(function (item) {
            item.sendText(msg)
        })
    }
    //监听端口号
    server.listen(PORT,function(){
        console.log("websocket服务启动成功了，端口"+ PORT)
    })
 