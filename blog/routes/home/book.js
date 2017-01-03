var express = require('express');
// 引入处理大段文字的模块并实例化
var markdown = require('markdown').markdown;
var objectId = require('objectid');
var router = express.Router();

// 载入mongodb模块，并创建MongoClient对象
const mongodb = require("mongodb").MongoClient;
// 指明服务器地址和要连接的数据库名
const url = "mongodb://localhost:27017/blogs";

router.get('/', function(req,res,next) {
	// 获取文章id
	let id = req.query.id; 
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合article
		const article = db.collection("article");
		// 找到里面指定id对应的数据
		article.find({_id:objectId(id)}).toArray((err,result1) =>{
			if(err) throw err;
			// 获取要操作的集合category
			const category = db.collection("category");
			// 找到分类所有数据
			category.find().toArray((err,result2)=>{
				if(err) throw err;
				// 获取要操作的集合article
				const article = db.collection("article");
				// 找到前7条访问量最高的数据
				article.find().sort({count:-1}).limit(7).toArray((err,result3)=>{
					if(err) throw err;
					res.render('home/book',{data:result1[0],category:result2,hot:result3});
				});
			});
		});
		// 关闭连接
		// db.close();
	}); 
});

module.exports = router;