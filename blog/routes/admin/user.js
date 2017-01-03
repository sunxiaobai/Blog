var express = require('express');
var router = express.Router();

// 载入mongodb模块，并创建MongoClient对象
const mongodb = require("mongodb").MongoClient;
// 指明服务器地址和要连接的数据库名
const url = "mongodb://localhost:27017/blogs";

/* 显示用户登录界面 */
router.get('/', function(req, res, next) {
	// 如果用户已经登录，则不能再次访问登录页
	if(req.session.isFlag){
		res.redirect('/admin');
	}else{
		res.render('admin/login');
	}
});

// 处理post提交登录
router.post('/login', function(req, res, next) {
	// 获取提交的用户名和密码
	let username = req.body.username;
	let password = req.body.password;
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const user = db.collection("user");
		// 判断在user集合中是否存在此用户
		user.find({username:username,password:password}).toArray((err,result)=>{
			// 不存在跳到登录页
			if(result.length==0){
				res.redirect("/user");
			}else{
				// 存在保存标志，让其进入后台主页
				req.session.isFlag = true;
				res.redirect("/admin");
			}
		});
		
		// 关闭连接
		db.close();
	});
  // res.render('admin/login',{ title: 'Express' });
});
// 处理注销登录
router.get('/logout',(req,res,next)=>{
	// 清除session的标志
	//跳转到登录页面
	req.session.destroy();
	res.redirect("/user");
});
module.exports = router;
