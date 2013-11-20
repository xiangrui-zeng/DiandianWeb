"use strict";

var _         = require('underscore')
  , sync      = require('async')
  , smart     = require("smartcore")
  , error     = smart.core.errors
  , user      = smart.ctrl.user
  , auth      = smart.core.auth
  , item   = require('../modules/mod_item.js');

/**
 * 获取菜品一览
 * @param start_
 * @param limit_
 * @param callback
 */
exports.list = function(start_, limit_, keyword ,callback) {

  var start = start_ || 0
    , limit = limit_ || 20
    , condition = { valid:1 };

  if (keyword) {
    condition.$or = [{ "name": new RegExp(keyword.toLowerCase(), "i") }];
  }

  // 获取件数
  item.total(condition, function(err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }

    // 获取一览
    item.getList(condition, start, limit, function(err, result) {
      if (err) {
        return callback(new error.InternalServer(err));
      }

      return callback(err,  {totalItems: count, items:result});
    });
  });
};

exports.companyListWithDevice = function(start_, limit_, callback){
  exports.getList(start_, limit_, function(err, comps){
    var task_getDeviceCount = function(comp_,subCB){
      device.deviceTotalByComId(comp_._id.toString(),function(err,count){
        comp_._doc.deviceCount = count;
        user.userTotalByComId(comp_._id.toString(),function(err,ucount){
          comp_._doc.userCount = ucount;
          subCB(err);
        });

      });
    };
    sync.forEach(comps.items, task_getDeviceCount, function(err){
      callback(err, comps);
    });


  });
}

exports.searchOne = function( compid, callback_) {
  item.get(compid, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    return callback_(err, result);
  });

};

// 通过公司ID获取指定公司
exports.getByPath = function( path, callback_) {
  item.getByPath(path, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    return callback_(err, result);
  });

};
// 通过公司Code获取指定公司
exports.getByCode = function( code, callback_) {
  item.getByCode(code, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    return callback_(err, result);
  });

};

exports.add = function(code_, uid_, item_, callback_){
  var now = new Date();

  var newItem = {
      itemName      : item_.itemName
    , itemPrice   : item_.itemPrice
    , itemType    : item_.itemType
    , itemComment : item_.itemComment
    , itemMaterial: item_.itemMaterial
    , itemMethod  : item_.itemMethod
//    , bigimage    : item_.bigimage
//    , smallimage  : item_.smallimage
    , editat: now
    , editby: uid_
  };

  var id = item_.id;

  if (id) {

    item.update(code_, id, newItem, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });
  } else {
    newItem.createat = now;
    newItem.createby = uid_;

    item.add(code_, newItem, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });

  }
};
/**
 * 更新菜品
 * @param uid_
 * @param item_
 * @param callback_
 * @returns {*}
 */
exports.update = function(uid_, data_, callback_) {

  var item_ = data_.item;
  item_.editat = new Date();
  item_.editby = uid_;

  // path check
  var pathcheck = comp_.path  ? comp_.path : "";
  item.find({path:pathcheck}, function(err, coms){
    if (err) {
      return  callback_(new error.InternalServer(__("js.ctr.common.system.error")));
    }
    if (coms.length > 0) {
      return callback_(new error.BadRequest(__("js.ctr.check.company.path")));
    } else {
      item.update(comp_.id, comp_, function(err, result){
        if (err) {
          return callback_(new error.InternalServer(err));
        }
        return callback_(err, result);
      });
    }
  });

};