var express = require('express');
var router = express.Router();

// 载入mongodb模块，并创建MongoClient对象
const mongodb = require("mongodb").MongoClient;
// 指明服务器地址和要连接的数据库名
const url = "mongodb://localhost:27017/blogs";

/* GET home page. */
router.get('/', function(req,res,next){
	// 连接数据库
	console.info(1);
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const category = db.collection("category");
		// 找到里面的所有数据
		category.find().toArray((err,result1)=>{
			if(err) throw err;
			// 获取要操作的集合
			const article = db.collection("article");
			// 找到里面的所有数据
			// article.find().sort({time:-1}).toArray((err,result2)=>{
				// if(err) throw err;
				// 找到前7条数据按照浏览量排序
				article.find().sort({count:-1}).limit(7).toArray((err,result3)=>{
					if(err) throw err;
					res.render('home/index',{category:result1,hot:result3});
				});
			});
		});
	// });
});

// ajax请求
router.get('/ajax',(req,res,next) =>{
	// 获取请求信息中的页码
	let page = req.query.page || 1;
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 设置一页加载几条数据
		let pagesize = 1;
		// 获取要操作的集合
		const article = db.collection("article");
		// 找到里面的所有数据
		article.find().sort({time:-1}).toArray((err,result)=>{
			if(err) throw err;
			// 一共多少条记录
			let num = result.length;
			// // 共几页
			let pagenum = Math.ceil(num / pagesize);
			// 起始数
			let start = (page-1)*pagesize;
			// 结束数
			let end = start + pagesize;
			let data = result.slice(start,end);
			res.json({article:data});
		});
	});
});

module.exports = router;
