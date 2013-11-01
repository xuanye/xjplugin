
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'xjPlugin',view:"home"});
};
exports.sample = function(req, res){
  res.render('sample', { title: 'xjPlugin',view:"sample" });
};

exports.api = function(req, res){
  res.render('xjtree', { title: 'xjPlugin',view:"api" });
};

exports.download = function(req, res){
  res.render('download', { title: 'xjPlugin',view:"download" });
};

