    // 引入WebSocket模块
    const ws = require("nodejs-websocket");
    const GetInto=0;   //进入聊天室为0
    const Chatting=1;  //正在聊天为1
    const leave=2;   //离开聊天室为2
    const PORT = 8081
    let count=0;
    const server = ws.createServer(function(conn){
        count++;
        conn.uesrName=`用户${count}`;
        broadcast({
            type:GetInto,
            msg:`${conn.uesrName}进入聊天室`,
            time:new Date().toLocaleTimeString()
        })
        conn.on("text", function (data) {
        broadcast({
            type:Chatting,
            msg:data,
            time:new Date().toLocaleTimeString()
        })
         })
        conn.on('close',function(){
            count--;
            broadcast({
                type:leave,
                msg:`${conn.uesrName}离开聊天室`,
                time:new Date().toLocaleTimeString()
            })
        })
        conn.on('error',function(){
        console.log('发生异常')
       })
    })
    function broadcast(msg) {
        let data_msg=JSON.stringify(msg)
        server.connections.forEach(function (item) {
            item.sendText(data_msg)
        })
    }
    //监听端口号
    server.listen(PORT,function(){
        console.log("websocket服务启动成功了，端口"+ PORT)
    })
 