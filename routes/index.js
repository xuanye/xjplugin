
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'xjPlugin',view:"index"});
};
exports.sample = function(req, res){
  res.render('sample', { title: 'xjPlugin',view:"sample" });
};

exports.api = function(req, res){
  res.render('api', { title: 'xjPlugin',view:"api" });
};

exports.download = function(req, res){
  res.render('api', { title: 'xjPlugin',view:"download" });
};

