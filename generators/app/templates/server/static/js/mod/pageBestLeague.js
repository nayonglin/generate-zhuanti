define('pageBestLeague.js', function(require, exports, module) {

  var render = require('render.js');
  var data = require('data.js');
  var bus = data.bus;
  
  /**
   * 分页组件
   * @param {object} data  分页对象的数据
   * @param {string} name  分页对象名字
   * @param {string} type  分页对象类别，比如说总榜，时段榜,用于构造对应的render函数名，所以要传驼峰命名
   */
  var page = function (data, name, type) {
  
      var _that = this;
      this.count = $("#page_" + name).find('a').length - 2;
      this.active = 1;
      this.data = data;
      this.name = name;
      this.renderName = "render" + firUpper(type);
      //this.partIndex = name.replace("order_", "");// 分区下标
   
  
  
  
      // 上一页
      $('body').on('click', '#prev_' + name, function (e) {
          if (_that.active > 1) {
              $(this).siblings().eq(_that.active - 1).removeClass("page_active").prev().addClass("page_active");
              render[_that.renderName]((_that.active - 2) * 10, bus.bestLeague.data, false);
              _that.active--;
          }
      });
  
      // 下一页
      $('body').on('click', '#next_' + name, function () {
          if (_that.active < _that.count) {
              $(this).siblings().removeClass("page_active").eq(_that.active + 1).addClass("page_active");
              render[_that.renderName]( _that.active * 10, bus.bestLeague.data, false);
              _that.active++;
          }
      });
  
      // 切换页码
      $('body').on('click', '.page_' + name, function () {
          _that.active = parseInt($(this).text());
          render[_that.renderName]((_that.active - 1) * 10, bus.bestLeague.data, false);
          $(this).addClass('page_active').siblings().removeClass('page_active');
      })
  
  };
  
  function firUpper(str) {
      var pause = str.split("");
      pause[0] = pause[0].toUpperCase();
      pause = pause.join("");
      return pause;
  }
  
  
  
  
  module.exports = page;

});
