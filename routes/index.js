
var core = smart.core
  log = smart.framework.log;
//var apis    = require('./apis')
//  , website = require('./website');



/*
 * GET home page.
 */

exports.guiding = function (app) {
//  apis.guiding(app);
//  website.guiding(app);
  app.get("/",function(req, res) {
    res.render("login", {"title": "login"});
  });

  app.get("/login",function(req, res) {
    res.render("login", {"title": "login"});
  });

  app.get("/diandian",function(req, res) {
    res.render("diandian", {"title": "diandian", user: req.session.user});
  });

  // 登陆
  app.get('/simplelogin', function (req, res) {
    log.audit("login");
    core.user.login(req, res, function(){}, "diandian");
  });

  // 注销
  app.get("/simplelogout", function (req, res) {
    log.audit("logout");
    core.user.logout(req, res);
  });

  //菜品
  app.get("/menu/item/list", function(req, res) {
    res.render("menu_item_list", {"title": "item", user: req.session.user});
  });

  //菜单
  app.get("/menu/menu/list", function(req, res) {
    res.render("menu_menu_list", {"title": "menu", user: req.session.user});
  });

  //菜品增加
  app.get("/menu/item/add", function(req, res) {
    res.render("menu_item_add", {"title": "新增菜品", user: req.session.user});
  });

  //菜单增加
  app.get("/menu/menu/add", function(req, res) {
    res.render("menu_menu_add", {"title": "新增菜单", user: req.session.user});
  });

};
