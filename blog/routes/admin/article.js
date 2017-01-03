var express = require('express');
var ObjectId = require('objectid');
var multiparty = require('multiparty');
var fs = require('fs');
var router = express.Router();

// 载入mongodb模块，并创建MongoClient对象
const mongodb = require("mongodb").MongoClient;
// 指明服务器地址和要连接的数据库名
const url = "mongodb://localhost:27017/blogs";

// 显示文章列表
router.get('/', (req,res,next) => {
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const article = db.collection("article");
		// 找到里面的所有数据
		article.find().toArray((err,result) =>{
			if(err) throw err;
			res.render('admin/article_list',{data:result});
		});
	});
});
// 处理添加文章的页面
router.get('/add', function(req,res,next){
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const table = db.collection("category");
		// 获取分类数据
		table.find().toArray((err,result) =>{
			if(err) throw err;
			res.render('admin/article_add',{data:result});
		});
	});
});
// 处理文章发布的页面,post方式提交
router.post('/insert',(req,res) =>{
// 实例化form对象 同时指定临时文件保存目录
	let form = new multiparty.Form({uploadDir:"public/tmp"});
	form.parse(req,(err,fields,files)=>{
		// 降临时目录的图片保存到项目目录public/upload
		fs.renameSync(files.cover[0].path,"public/upload/"+files.cover[0].originalFilename);
		// 获取插入数据库的对象
		let obj = {
			sort:fields.sort[0],
			title:fields.title[0],
			summary:fields.summary[0],
			content:fields.content[0],
			time:new Date().toLocaleString(),
			count:Math.ceil(Math.random() * 100),
			// 将文件路径保存到数据库
			cover:"upload/"+files.cover[0].originalFilename
		}
		// 连接数据库
		mongodb.connect(url,(err,db) =>{
			if(err) throw err;
			// 获取要操作的集合
			const article = db.collection("article");

			//将数据插入到数据库
			article.insert(obj,(err,result) =>{
				if(err){
					res.render('admin/msg',{msg:"添加失败！"});
					// res.redirect('/admin/article_list');
				}else{
					res.render('admin/msg',{msg:"添加成功！"});
					// res.redirect('/admin/article_list');
				}
			});
		});
	});
});
// 处理文章的编辑页面
router.get('/edit', (req,res,next) => {
	// 获取要编辑文档的id
	let id = req.query.id;
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const article = db.collection("article");
		const table = db.collection("category");
		// 找到里面指定id的数据
		article.find({_id:ObjectId(id)}).toArray((err,result1) =>{
			if(err) throw err;
			table.find().toArray((err,result) =>{
				if(err) throw err;
				res.render('admin/article_edit',{data:result,data1:result1[0]});
			});
			
		});
	});
});
// 处理文章修改操作
router.post('/update',(req,res,next)=>{
	// 实例化form对象 同时指定临时文件保存目录
	let form = new multiparty.Form({uploadDir:"public/tmp"});
	form.parse(req,(err,fields,files)=>{
		//降临时目录的图片保存到项目目录public/upload
		fs.renameSync(files.cover[0].path,"public/upload/"+files.cover[0].originalFilename);
		// 获取要更新的id
		let id = fields.id[0];
		//获取插入数据库的对象
		let obj = {
			sort:fields.sort[0],
			title:fields.title[0],
			summary:fields.summary[0],
			content:fields.content[0],
			time:new Date().toLocaleString(),
			count:Math.ceil(Math.random() * 100),
			// 将文件路径保存到数据库
			cover:"upload/"+files.cover[0].originalFilename
		};
		// 连接数据库
		mongodb.connect(url,(err,db) =>{
			if(err) throw err;
			// 获取要操作的集合
			const article = db.collection("article");
			// 找到里面的所有数据
			article.update({_id:ObjectId(id)},obj,(err,result) =>{
				if(err){
					res.render('admin/msg',{msg:"更新失败！"});
				}else{
					res.render('admin/msg',{msg:"更新成功！"});
				}
			});
		});
	});
});
// 处理删除文章操作
router.get('/remove', (req,res,next) => {
	// 获取要删除文档的id
	let id = req.query.id;
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const article = db.collection("article");
		// 找到里面的所有数据
		article.remove({_id:ObjectId(id)},(err,result) =>{
			if(err){
				res.render('admin/msg',{msg:"删除失败！"});
			}else{
				res.render('admin/msg',{msg:"删除成功！"});
			}
		});
		// 关闭连接
		// db.close();
	});
});
module.exports = router;
