var render = require('./render.js');
var data = require('./data.js');
var bus = data.bus;

/**
 * 分页组件
 * @param {object} data  分页对象的数据
 * @param {string} name  分页对象名字
 * @param {string} type  分页对象类别，比如说总榜，时段榜,用于构造对应的render函数名，所以要传驼峰命名
 * @param {int} perCount  每页显示数目
 */
var Page = function (data, name, type, perCount) {

    var _that = this;
    this.count = $("#page_" + name).find('a').length - 2;
    this.active = 1;
    this.data = data;
    this.name = name;
    this.renderName = "render" + firUpper(type);
    //this.partIndex = name.replace("order_", "");// 分区下标


    // 移除之前添加的事件
    $('body').off('click', '#prev_' + name);
    $('body').off('click', '#next_' + name);
    $('body').off('click', '.page_' + name);

    // 上一页
    $('body').on('click', '#prev_' + name, prevPage);

    // 下一页
    $('body').on('click', '#next_' + name, nextPage);

    // 切换页码
    $('body').on('click', '.page_' + name, choosePage);


    // 上一页handler
    function prevPage() {
        if (_that.active > 1) {
            $(this).siblings().eq(_that.active - 1).removeClass("page_active").prev().addClass("page_active");
            render[_that.renderName]((_that.active - 2) * perCount, data, false);
            _that.active--;
        }
    }


    // 下一页handler
    function nextPage() {
        if (_that.active < _that.count) {
            $(this).siblings().removeClass("page_active").eq(_that.active + 1).addClass("page_active");
            render[_that.renderName](_that.active * perCount, data, false);
            _that.active++;
        }
    }


    // 选择一页handler
    function choosePage() {
        _that.active = parseInt($(this).text());
        render[_that.renderName]((_that.active - 1) * perCount, data, false);
        $(this).addClass('page_active').siblings().removeClass('page_active');
    }



};

function firUpper(str) {
    var pause = str.split("");
    pause[0] = pause[0].toUpperCase();
    pause = pause.join("");
    return pause;
}







module.exports = Page;