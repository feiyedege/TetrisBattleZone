//引用模块
var express = require('express');
var session = require('express-session')
var mongoose = require("mongoose");
var path = require("path");
var mysocket =require("./socketAPI/socketAPI.js");

mongoose.connect('mongodb://localhost:27017/tetrisUser');

//路由
var router = require("./routers/router.js");

var app = express();

//使用一个中间件，就是session中间件。这个中间件必须排在第一个
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'kaola', //加密字符串，我们下发的随机乱码都是依靠这个字符串加密的
    resave: false,
    saveUninitialized: true
}));

app.use(express.static("public"));
app.use(express.static("dist"));

//路由清单
app.get("/", router.showIndex);
app.get("/isLogin", router.isLogin);
app.get("/exit", router.exit);
app.post("/logup", router.logup);
app.post("/checkLogin", router.checkLogin);
app.get("*",router.show404);

var http = require('http').Server(app);
//服务器端存在了一个io对象：
var io = require("socket.io")(http);

//增加了一个中间件：
io.on("connect", function(socket){
	mysocket(socket, io);
});

http.listen(3800, function(){
	console.log('监听80端口，看看吧！！');
});