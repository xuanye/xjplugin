
exports.xjtree = function(req, res){
  res.render('xjtree', { title: 'xjplugin-xjTree示例程序',view:"sample" });
};
exports.bigxjtree = function(req, res){
  res.render('bigdata_xjtree', { title: 'xjplugin-xjTree 大数据示例程序',view:"sample" });
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