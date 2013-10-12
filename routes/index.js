
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'xjplugin',view:"home"});
};
exports.sample = function(req, res){
  res.render('sample', { title: 'xjplugin',view:"sample" });
};

exports.api = function(req, res){
  res.render('xjtree', { title: 'xjplugin',view:"api" });
};

exports.download = function(req, res){
  res.render('download', { title: 'xjplugin',view:"download" });
};

