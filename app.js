var express = require('express');
var app = express();


app.set('port', process.env.PORT || 4000);

// 设置handlebars视图引擎
var handlebars = require('express3-handlebars');

app.engine('handlebars',handlebars({
  //layoutsDir: 'views',      // 设置布局模板文件的目录为views文件夹
  defaultLayout: 'main',  // 设置默认的页面布局模板为main.handlebars
  extname: '.handlebars'   // 后缀名为handlebars的文件
}));

app.set('view engine','handlebars');
function getData(){
  return {
    locations: [
      {
        name:'kongzhi',
        href:'http://baidu.com',
        iconUrl:'http://m.tongbanjie.com',
        alt:'tips'
      },
      {
        name:'kongzhi2',
        href:'http://baidu.com',
        iconUrl:'http://m.tongbanjie.com',
        alt:'tips'
      },
      {
        name:'kongzhi3',
        href:'http://baidu.com',
        iconUrl:'http://m.tongbanjie.com',
        alt:'tips'
      }
    ]
  }
}

// 简单的创建一个中间件obj对象添加这些数据
app.use(function(req,res,next){
  if(!res.locals.obj) {
    res.locals.obj = {};
  }
  res.locals.obj.data = getData();
  next();
})

app.get('/',function(req,res){
  res.render('home',{layout:'main2'});
});
app.get('/about',function(req,res){
  res.render('about');
});
// 404 中间件
app.use(function(req,res,next){
  res.status(404);
  res.render('404');
});

app.listen(app.get('port'),function(){
  console.log('Express started on http://localhost:'+app.get('port'));
}); 