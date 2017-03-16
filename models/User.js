var mongoose = require("mongoose");
var crypto = require("crypto");

//创建schema
var userSchema = mongoose.Schema({
    "nickname" : String,
    "password" : String
});

// 在userSchema上面创建静态方法，
// 检查用户名是否存在
userSchema.statics.isExist = function(nickname,callback){
    //this就表示这个表
    this.find({"nickname" : nickname},function(err,results){
        if(results.length == 0){
            callback(false);
        }else{
            callback(true);
        }
    });
}

//创建用户
userSchema.statics.addUser = function(JSON,callback){
    //存入数据库的密码是用sha256加密之后的密码，绝对不能用明码存密码！
    var sha256 = crypto.createHash("sha256");
    JSON.password = sha256.update(JSON.password).digest("hex");

    this.create(JSON,function(err,results){
        if(err){
            callback(false);
        }else{
            callback(true);
        }
    });
}

//验证密码
userSchema.statics.checkPassword = function(nickname,password,callback){
    this.find({"nickname" : nickname},function(err,results){
        var theUser = results[0];
        if(!theUser){
            callback(false);
            return;
        }
        var pwd = theUser.password;  //数据库存储的加密之后的密码

        var sha256 = crypto.createHash("sha256");
        password = sha256.update(password).digest("hex");

        //验证密码是否相同
        if(password === pwd){
            callback(true);
        }else{
            callback(false);
        }
    });
}

//查询
userSchema.statics.findByNickname = function(nickname,callback){
    this.find({"nickname" : nickname},function(err,results){
       callback(results[0]);
    });
}

//更换昵称
userSchema.statics.changeName = function(nickname,newName,callback){
	var self=this;
    this.find({"nickname" : nickname},function(err,results){
        var user = results[0];
        self.isExist(newName,function(r){
        	if(r){//重名
        		callback(false);
        	}else{//修改
        		user.nickname=newName;
        		user.save();
        		callback(true);
        	}
        });
    });
}

//更改密码
userSchema.statics.changePassword = function(nickname,JSON,callback){
	var self=this;
	this.checkPassword(nickname,JSON.password,function(r){
		if(r){
			this.find({"nickname" : nickname},function(err,results){
				var user = results[0];
                var sha256 = crypto.createHash("sha256");
				user.password = sha256.update(JSON.newPassword).digest("hex");
				user.save();
				callback(true);
			});
		}else{
			callback(false);
		}
	});
}

//根据schema创建模型！
var User = mongoose.model("User",userSchema);

//这个模型向外暴露一个Mongoose对象
module.exports = User;