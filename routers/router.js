//本文件就是roter，是控制器
var path = require("path");
var formidable = require("formidable");
var User = require("../models/User.js")
// var fs = require("fs");


//显示首页
exports.showIndex = function(req,res){
    res.sendFile(path.join(__dirname , "../index.html"));
}

//是否已登录
exports.isLogin=function(req,res){
    res.json({"isLogin":req.session.isLogin,"nickname":req.session.isLogin?req.session.nickname:null});
}

//退出登录
exports.exit=function(req,res){
    req.session.isLogin=false;
    // 退出成功
    // res.redirect('http://google.com');
    res.json({"result":1});
}

//注册
exports.logup = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //得到用户输入的表单数据，用户名和密码：
        var nickname = fields.nickname;
        var password = fields.password;
        if(err){
            //-1表示数据库错误
            res.json({"result":-1});
            return;
        }
        if(!nickname || !password){
            //-4表示没有填写
            res.json({"result":-4});
            return;
        }

        User.isExist(nickname,function(r){
            if(r){
                //-2是用户名已经存在
                res.json({"result":-2});
            }else{
                User.addUser({"nickname":nickname,"password":password},function(r){
                    if(r){
                        //注册成功，下发session
                        req.session.isLogin=true;
                        req.session.nickname=nickname;
                        //1表示注册成功
                        res.json({"result":1});
                    }else{
                        //-1表示数据库错误
                        res.json({"result":-1});
                    }
                });
            }
        });
    });
}

//验证登录
exports.checkLogin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //得到用户输入的表单数据，用户名和密码：
        var nickname = fields.nickname;
        var password = fields.password;
        if(err){
            //-1表示数据库错误
            res.json({"result":-1});
            return;
        }
        if(!nickname || !password){
            console.log(-4);
            //-4表示没有填写
            res.json({"result":-4});
            return;
        }
        User.checkPassword(nickname,password,function(r){
            if(!r){
                //-2是用户名不存在或密码错误
                res.json({"result":-2});
            }else{
                //验证成功，下发session
                req.session.isLogin=true;
                req.session.nickname=nickname;
                //1就是登陆成功
                res.json({"result":1});
            }
        });
    });
}

//显示404
exports.show404 = function(req,res){
    res.status(404).send("没有这个页面，请检查网址！");
}