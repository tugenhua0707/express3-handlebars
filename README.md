## Handlebars 模板引擎
### 1. 标识
#### 在模板中使用{{}}或{{{}}}
#### {{}} 会转译标签;{{{}}} 则直接替换
#### {{}}的含义是：比如如果上下文对象是{name:'kongzhi'}，模板是
    <div>hello,{name}</div>
则{{name}}会被替换成 kongzhi;
#### {{{}}}的含义是：如果上下文对象是html文本，比如 
    {name:'<b>kongzhi</b>'}
模板是
    <div>{name}</div>
如果还是使用{{}}的话，结果就是 
<pre><p>hello,&lt;div&gt;kongzhi&lt;div&gt;</p></pre>
但是这个时候我们可以使用三个大括号就可以了 {{{}}}；
### 2.注释
#### Handlebars的注释：{{! xxxx}}
#### HTML的注释：<!-- 注释 -->
#### 区别是： Handlebars的注释不会传递到浏览器，HTML的注释会被传递到浏览器，在浏览器可以看到注释，而
Handlebars的注释在浏览器中是看不到的；
### 3. 服务器端模板
#### 模板支持缓存：视图缓存在开发模式下会禁用，在生产模式下会启用，如果想启用视图缓存，
可以设置一下：app.set("view cache",true); 
### 4. 视图和布局
#### 默认情况下 Express会在views子目录中查找视图。
#### 比如现在项目的目录结构如下：
<pre>
|——demo                    # 项目名称 
├── app.js                 # 项目的入口文件 app.js
|—— package.json           # 依赖包
└── views                  # 视图文件目录
    ├── home.handlebars
    |—— about.handlebars
    |—— 404.handlebars
    └── layouts
        └── main.handlebars  # 基本的布局框架
</pre>
#### main.handlebars 代码如下：
    <!DOCTYPE html>
     <html>
      <head>
        <meta charset="utf-8">
        <meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
        <meta content="yes" name="apple-mobile-web-app-capable">
        <meta content="black" name="apple-mobile-web-app-status-bar-style">
        <meta content="telephone=no" name="format-detection">
        <meta content="email=no" name="format-detection">
        <title>标题</title>
        <link rel="shortcut icon" href="/favicon.ico">
      </head>
      <body>
          {{{body}}}
      </body>
    </html>
#### app.js代码如下：
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

    app.get('/',function(req,res){
      res.render('home');
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
#### 当用户访问 http://localhost:4000/ 时候 会把home视图页面的内容渲染出来，且把layout下的main.handlebars模板文件加载进去; 同理：用户访问 http://localhost:4000/about 的时候,会把about视图页面的内容渲染出来;
<pre>
app.engine('handlebars',handlebars({
  //layoutsDir: 'views',      // 设置布局模板文件的目录为views文件夹
  defaultLayout: 'main',  // 设置默认的页面布局模板为main.handlebars
  extname: '.handlebars'   // 后缀名为handlebars的文件
}));
</pre>
#### defaultLayout配置项是指创建视图引擎的时候，会指定一个默认的布局；默认情况下，Express会在views子目录中查找视图，在viewslayout下查找布局模板；如果我不想使用布局的话，可以在上下文中指定layout:null;比如如下代码：
<pre>
app.get('/',function(req,res){
  res.render('home',{layout:null});
});
</pre>
#### 访问home页面的时候，就不会把main中布局模板加载进来；如果我们想使用一个不同的模板，我们可以指定模板名称也是可以的；比如如下代码：
<pre>
app.get('/',function(req,res){
  res.render('home',{layout:'main2'});
});
</pre>
#### 我们可以指定在layouts目录下新建一个main2.handlebars模板；
### 5.局部文件
#### 有时候，有些组成html的模板部分的数据需要被重复使用，我们可以使用模板中的局部文件，它并不会渲染整个视图和整个网页，可以理解为把某一块文件插入到指定的模块内，比如我下面有一个局部文件，在views目录下新建一个目录partials目录，views/partials/pub.handlebars; 代码如下：
<pre>
    <div class="pub-cls">
      {{#each obj.data.locations}}
        <div class="obj-elem">
          <h3>{{name}}</h3>
          <a href="{{href}}">
            <img src="{{iconUrl}}" alt="{{alt}}"/>
          </a>
        </div>
        {{/each}}
    </div>
</pre>
#### 使用res.locals 可以对任何视图可以使用，但是我们并不会想个别的视图干扰指定的上下文，所以我们可以把所有的局部文件上下文都放在obj这个对象中；我们在App.js入口文件加入如下函数代码：
<pre>
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
</pre>
#### 现在我们可以在app.js中简单的创建一个中间件给res.locals.obj对象添加一些数据；代码如下：
<pre>
// 简单的创建一个中间件obj对象添加这些数据
app.use(function(req,res,next){
  if(!res.locals.obj) {
    res.locals.obj = {};
  }
  res.locals.obj.data = getData();
  next();
})
</pre>
#### 现在我们可以把我们的局部文件放在我们home页面去，进入views/home.handlebars文件；添加如下代码：
    <h1>welcome to home</h1>
    {{>pub}}
#### 语法 {{> partial_name}}可以让我们视图包含一个局部文件；express3-handlebars 会在views/partials中寻找一个叫做 partial_name.handle-bars的视图；



    
