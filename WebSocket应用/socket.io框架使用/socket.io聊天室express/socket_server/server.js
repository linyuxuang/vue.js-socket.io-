 var app = require('express')();
 var server = require('http').Server(app);
 var io = require('socket.io')(server);
 //存储用户登录信息
 let user_arr=[]; 
 server.listen(8000,function(){
    console.log("启动服务成功")
 });
 //express处理静态资源
 //把public目录设置为静态资源目录
app.use(require('express').static('public'))
app.get('/', function (req, res) {
  //定向到index.html
  res.redirect('/index.html');
});

// 只要用户连接上这个服务就会触发 connection (是内置的事件，下面除了连接断开事件disconnect，其他都是自定义事件)
io.on('connection', function (socket) {
  socket.on('login',(data)=>{
    //用户是否已存在
    let user_obj=user_arr.some(function(key,index,arr){
          return key.username==data.username;
     })
    if(user_obj){
       socket.emit('loginErr',{msg:'用户名已存在'})
     }else{
       user_arr.push(data)
       socket.emit('loginSuccess',{data,msg:'登录成功'})
       // io.emit 给所有的用户广播消息
       io.emit('addUser',data);
       io.emit('userList',user_arr);

       socket.name=data.username;
       socket.avatar=data.avatar;
    }
  })
  // 用户断开连接的功能
  // 监听用户断开连接
  socket.on('disconnect', () => {
    console.log("断开")
    //退出登录 删除当前用户
     let index=user_arr.findIndex(function(index){
        return index.username===socket.name
     })
    // 删除断掉连接的用户信息
    user_arr.splice(index,1);
    //1. 告诉所有人，有人离开了聊天室
    io.emit('delUser',{name:socket.name,avatar:socket.avatar})

     // 2. 告诉所有人，userList发生更新
    io.emit('userList',user_arr)
   });
 
   //监听聊天内容
   socket.on('sendMessage',data=>{
     console.log(data)
     // 广播给所有用户文字信息
     io.emit('receiveMessage',data)
   })

   //接收图片信息
   socket.on('sendImg',data=>{
      // 广播给所有用户图片信息
     io.emit('receiveImage',data)
   })

});
 