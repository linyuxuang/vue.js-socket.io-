      /* 
        1. 连接socketio服务
      */
      var socket = io('http://localhost:8000')
      var username, avatar

      /* 
        2. 用户头像选择功能
          给用户头像注册点击事件
      */

    $("#login_avatar li").on('click',function(){
    console.log($(this))
    $(this).addClass("now").siblings().removeClass("now") 
    })   

    $("#loginBtn").on('click',function(){
      var username=$("#username").val();
      if(username==""){
        alert("用户名不能为空")
      return
      }
      var avatar=$("#login_avatar li.now img").attr("src");
      socket.emit('login',{username:username,avatar:avatar})
    })

    socket.on('loginErr',function(data){
      alert(data.msg)
    })
    socket.on('loginSuccess',function(data){
      console.log(data)
      username=data.data.username;
      avatar=data.data.avatar;
      $(".login_box").fadeOut();
      $(".container").fadeIn();
      $(".avatar .img").attr('src',data.data.avatar);
      $(".info .username").text(data.data.username);
    })

    //监听加入谁加入群聊信息
    socket.on('addUser',(data)=>{
      $(".box-bd").append(`
      <div class="system">
      <p class="message_system">
        <span class="content">${data.username}加入了群聊</span>
      </p>
    </div>
      `);
      scrollIntoView()
    })
  
    // 监听用户列表的消息
     socket.on('userList', data => {
      // 把userList中的数据动态渲染到左侧菜单
      $('.user-list ul').html('')
      data.forEach(item => {
        $('.user-list ul').append(`
          <li class="user">
            <div class="avatar"><img src="${item.avatar}" alt="" /></div>
            <div class="name">${item.username}</div>
          </li>      
        `)
      })
      $('#userCONT').text(data.length)
     })

    //广播给所有客户谁退出了群聊
    socket.on('delUser',function(data){
      $(".box-bd").append(`
      <div class="system">
      <p class="message_system">
        <span class="content">${data.name}退出了群聊</span>
      </p>
    </div>
      `)
      scrollIntoView()
    });

  // 聊天功能
    $("#btn-send").on('click',function(){
    var content= $('#content').html()
    $('#content').html("")
    if (!content) return alert('请输入内容')
    //给服务端发送当前用户聊天内容
      socket.emit('sendMessage',{
        username:username,
        avatar:avatar,
        val:content      
      });
    })

  // 监听聊天的消息
   socket.on('receiveMessage',data=>{
    console.log(data)
    //自己的聊天消息
    if(data.username===username){
      $(".box-bd").append(`
      <div class="message-box">
      <div class="my message">
        <img class="avatar" src="${data.avatar}" alt="" />
        <div class="content">
          <div class="bubble">
            <div class="bubble_cont">${data.val}</div>
          </div>
        </div>
      </div>
    </div>
      `)
    }else{
      //别人聊天消息
      $(".box-bd").append(`
      <div class="message-box">
      <div class="other message">
        <img class="avatar" src="${data.avatar}" alt="" />
        <div class="content">
          <div class="nickname">${data.username}</div>
          <div class="bubble">
            <div class="bubble_cont">${data.val}</div>
          </div>
          </div>
        </div>
      </div> 
      `)
    }
    scrollIntoView()
   })

// 发送图片功能
  $("#file").on('change',function(){
    //console.log(this.files[0])
    let file=this.files[0]
    // 需要把这个文件发送到服务器， 借助于H5新增的fileReader
    let fs=new FileReader()
    fs.readAsDataURL(file) 
    fs.onload=function(){
     console.log(fs.result)  
     socket.emit('sendImg',{
       username:username,
       avatar:avatar,
       img:fs.result
     })      
    }
  })

  // 监听图片聊天信息
 socket.on('receiveImage',data=>{
  //把接收到的消息显示到聊天窗口中
  //自己的聊天消息
  if(data.username==username){
   $(".box-bd").append(`
   <div class="message-box">
     <div class="my message">
     <img class="avatar" src="${data.avatar}" alt="" />
     <div class="content">
      <div class="bubble">
        <div class="bubble_cont"><img src="${data.img}"/></div>
      </div>
    </div>
  </div>
</div>
  `)
}else{
  //别人聊天消息
 $(".box-bd").append(`
  <div class="message-box">
  <div class="other message">
   <img class="avatar" src="${data.avatar}" alt="" />
    <div class="content">
     <div class="nickname">${data.username}</div>
     <div class="bubble">
       <div class="bubble_cont"><img src="${data.img}"/></div>
     </div>
     </div>
   </div>
   </div> 
 `)}
   // 注意这里一定要等到图片加载完,在滚动到底部
  $(".box-bd img:last").on('load',function(){
    scrollIntoView()
  })
 }) 

$(".face").on('click',function(){
  $("#content").emoji({
    // 设置触发表情的按钮
    button: '.face',
    showTab: false,
    animation: 'slide',
    position: 'topRight',
    icons: [
      {
        name: 'QQ表情',
        path: 'lib/jquery-emoji/img/qq/',
        maxNum: 91,
        excludeNums: [41, 45, 54],
        file: '.gif'
      }
    ]
    })
  }) 
function scrollIntoView() {
  // 当前元素的底部滚动到可视区
  $('.box-bd')
    .children(':last')
    .get(0)
    .scrollIntoView(false)
}



