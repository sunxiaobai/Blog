var express = require('express');
var ObjectId = require('objectid');
var router = express.Router();

// 载入mongodb模块，并创建MongoClient对象
const mongodb = require("mongodb").MongoClient;
// 指明服务器地址和要连接的数据库名
const url = "mongodb://localhost:27017/blogs";

// 分类列表
router.get('/', function(req,res,next) {
	 // 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const table = db.collection("category");
		// 读取数据
		table.find().toArray((err,result) =>{
			if(err) throw err;
			res.render('admin/category_list',{data:result});
		});
	});
	// res.sendFile(path.join(__dirname,'admin/category_list.html'));
});
router
// 载入添加分类页面
router.get('/add', function(req,res,next) {
  res.render('admin/category_add', { title: 'Express' });
});

// 处理添加分类的表单提交
router.post('/insert', function(req,res,next) {
  // 获取输入的标题和分类
  let title = req.body.title;
  let sort = req.body.sort;
  // 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const table = db.collection("category");
		// 插入数据
		table.insert({title:title,sort:sort},(err,result) =>{
			if(err){
				res.render('admin/msg',{msg:"添加失败！"});
				// res.redirect('/admin/category_list');
			}else{
				res.render('admin/msg',{msg:"添加成功！"});
				// res.redirect('/admin/category_list');
			}
		});
		// 关闭连接
		db.close();
	});
});
// 处理删除操作
router.get('/remove',(req,res) =>{
	// 获取要删除的id
	let id = req.query.id;
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const table = db.collection("category");
		// 插入数据
		table.remove({_id:ObjectId(id)},(err,result) =>{
			if(err){
				res.render('admin/msg',{msg:"删除失败！"});
				// res.redirect('/admin/category_list');
			}else{
				res.render('admin/msg',{msg:"删除成功！"});
				// res.redirect('/admin/category_list');
			}
		});
		// 关闭连接
		db.close();
	});
});
// 载入分类编辑页面
router.get('/edit', function(req,res,next) {
	// 获取要删除的id
	let id = req.query.id;
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const table = db.collection("category");
		// 查找数据
		table.find({_id:ObjectId(id)}).toArray((err,result) =>{
			if(err) throw err;
			res.render('admin/category_edit',{data:result[0]});
		});
		// 关闭连接
		db.close();
	});
});
// 处理编辑后提交的操作
router.post('/update',(req,res)=>{
	// 获取要更新的id
	let id = req.body.id;
	// 获取要编辑的title
	let title = req.body.title;
	// 获取要编辑的sort
	let sort = req.body.sort;
	// 连接数据库
	mongodb.connect(url,(err,db) =>{
		if(err) throw err;
		// 获取要操作的集合
		const table = db.collection("category");
		// 更新数据
		table.update({_id:ObjectId(id)},{title:title,sort:sort},(err,result) =>{
			if(err){
				res.render('admin/msg',{msg:"更新失败！"});
				// res.redirect('/admin/category_list');
			}else{
				res.render('admin/msg',{msg:"更新成功！"});
				// res.redirect('/admin/category_list');
			}
		});
		// 关闭连接
		db.close();
	});
});
module.exports = router;