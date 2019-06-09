


var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000,function(){
    console.log("服务启动成功")
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(3000);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
// connection监听用户连接的事件
// socket表示用户的连接
// socket.emit 表示触发某个事件，如果给浏览器发数据，需要触发浏览器注册的某个事件
// socket.on 表示注册某个事件，如果要获取浏览器的数据，需要注册一个事件
io.on('connection', function (socket) {
   // socket.emit方法表示给浏览器发送数据  
  socket.emit('haha', { name: '张三',age:12 });
  //监听客户端名为goods的事件和数据
  socket.on('goods',function(data){
    console.log(data)
  })
});