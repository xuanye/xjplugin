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