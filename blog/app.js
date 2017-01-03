// 加载所需模块
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// 载入路由模块
// 前台 主页
var index = require('./routes/home/index');
//前台 文章页
var book = require('./routes/home/book');
// 后台 主页
var admin = require('./routes/admin/admin');
// 后台 登录
var user = require('./routes/admin/user');
// 后台 文章管理
var article = require('./routes/admin/article');
// 后台 分类管理
var category = require('./routes/admin/category');

var app = express();

// 使用第三方模块
app.use(session({
	secret:'blog',
	resave:false,
	saveUninitialized:true,
	cookie:{}
}));
// 对于模板文件，本项目采用的是ejs模板进行操作，所有的html文件后缀改为.ejs
//为了做到前后台结构清晰，便于后期的维护和管理，本项目将前后台模板进行le分
//离，分别将其保存在home和admin文件夹里
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// 拓展：如果不想修改html后缀，可以采用以下代码，将模板引擎和后缀改为html
// 注意，后台模板中不要有index.html，(由于前台模板中存在index.html，后台如
// 若有// 会导致优先级高于（后台静态资源托管在在视图文件夹中）前台，无法访
// 问前台的index文件)
app.engine('html',require('ejs').__express);
app.set('view engine','html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 为了做到前后台结构清晰，便于后期的维护和管理，需要将前后台
// 静态资源进行分离，考虑到前台页面访问人多，将资源放在比较
// 深的目录中会影响性能，因而本项目将前台静态资源放于public文件夹下进行托管，
// 将后台静态资源放于视图文件夹下进行托管
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/admin')));

// 对于路由而言，为了做到前后台结构清晰，便于后期的维护和管理，也是将其分为
// 前后台路由进行管理，分别放于路由文件夹下的home和admin文件夹里
// 本项目的路由不是单一的，为了方便管理，设置了二级路由

//请求前台首页面
app.use('/', index);
// 请求前台文章页
app.use('/book', book);

// 进入后台页面 需要先进行判读是否登录
app.use('/admin',isLogin);
// 请求后台首页面
app.use('/admin', admin);
// 请求用户登录页面
app.use('/user', user);
// 请求后台页面的文章管理页面
app.use('/admin/article',article);
// 请求后台页面的分类管理页面
app.use('/admin/category',category);

// 设置session (isFlag)来标记是否登录

// 定义函数判断是否登录
function isLogin(req,res,next){
	// 未登录 让其跳转到登录页面
	if(!req.session.isFlag){
		res.redirect('/user');
		return;
	}else{
		// 若是已经登录了 
		next();
	}
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
