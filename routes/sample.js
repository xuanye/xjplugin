var fs = require('fs');

/*******************试图和页面*******************/
exports.xjtree = function(req, res){
  res.render('sample/xjtree', { title: 'xjplugin-xjTree示例程序',view:"sample" });
};
exports.bigxjtree = function(req, res){
  res.render('sample/bigdata_xjtree', { title: 'xjplugin-xjTree 大数据示例程序',view:"sample" });
};

exports.dailog = function(req, res){
  res.render('sample/dailog', { title: 'xjplugin-xjIframeDailog示例程序',view:"sample" });
};
exports.dailog_i_1 = function(req, res){
  res.render('sample/dailog_i', { title: 'xjplugin-xjIframeDailog示例程序',type:1});
};
exports.dailog_i_2 = function(req, res){
  res.render('sample/dailog_i', { title: 'xjplugin-xjIframeDailog示例程序',type:2});
};

exports.xjdatepicker =  function(req, res){
  res.render('sample/datepicker', { title: 'xjplugin-datepicker示例程序',view:"sample"});
};

exports.xjtabpanel =  function(req, res){
  res.render('sample/xjtabpanel', { title: 'xjplugin-xjtabpanel示例程序',view:"sample"});
};

exports.desktop =  function(req, res){
  res.render('sample/desktop', { title: 'xjplugin-工作台示例程序'});
};

exports.xjgrid = function(req,res){
  res.render('sample/xjgrid', { title: 'xjplugin-xjgrid示例程序',view:"sample"});
}


/*******************请求响应*******************/
exports.doquerytree = function(req, res){
   var pid = req.body.id ;
   var ptext = decodeURIComponent(req.body.text);
   var nodes = [];  
   for (var i =0; i <10; i++) {
   	   var item = {id:pid+"_"+i,"text":pid+"子节点."+(i+1),"hasChildren":i==0,"classes":"","ChildNodes":[]};
   	   nodes.push(item);
   };
   res.json(nodes);
};

exports.doqueryproduct = function(req,res){
    var page = parseInt(req.body.page);  //第几页
    var rp = parseInt(req.body.rp); //每页多少条
    var key = req.body.colkey;
    var cols = req.body.colsinfo;

    var dfile = __dirname + '/../static/data/page'+page+'.json';
    fs.readFile(dfile,'utf-8', function(err,data){
      if(err){
        console.error(err);
        res.json({error:"发生意外错误"});
      }
      else
      {
        console.log(data);
        res.set('Content-Type', 'application/json');
        res.send(data);
      }
    })
   
}