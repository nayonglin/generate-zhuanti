var bus = require('./data.js').bus;

module.exports = {
    renderPopConfirm: function (title, text, type) { // 确认框
        var template = __inline("../../widget/pop/popConfirm.tpl");
        var compiled = _.template(template);
        var html = compiled({
            'title': title,  // 弹框标题
            'text': textm,   // 弹框内容
            'type': type     // 绑定对应事件的class  
        });
        $('.info_wrap').html(html).addClass('on');
    },
    renderPopSuccess: function (text) { // 成功通用提示
        var templatePopSuccess = __inline("../../widget/pop/popSuccess.tpl");
        var compiled = _.template(templatePopSuccess);
        var html = compiled({
            'text': text // 提示内容
        });
        $('.info_wrap').html(html).addClass('on');
    },
    renderPopFail: function (text) { // 失败通用提示
        var templatePopFail = __inline("../../widget/pop/popFail.tpl");
        var compiled = _.template(templatePopFail);
        var html = compiled({
            'text': text // 提示内容
        });
        $('.info_wrap').html(html).addClass('on');
    },
    renderPage: function (data, type, perCount) { // 渲染页码
        var templatePage = __inline("../../widget/page/page.tpl");
        compiled = _.template(templatePage);
        html = compiled({
            'data': data,
            'type': type, //分页名字
            'perCount': perCount // 每页长度
        });
        $('#page_' + type).replaceWith(html);
    }
    // renderBestIdol: function (role, index, data, isFirst) { // 渲染最佳偶像
    //     var templateBestIdol = __inline("../../widget/bestIdol/bestIdol.tpl");
    //     compiled = _.template(templateBestIdol);
    //     html = compiled({
    //         'role': role,    // 渲染哪个类型的偶像排名
    //         'index': index,  // 从那条数据开始渲染
    //         'data': data,
    //         'isFirst': isFirst // 首次渲染true，切换页码false
    //     });
    //     if (isFirst) { // 不是第一次的话，就替换第一次的ul，避免把之前的分页弄没了
    //         $('#leaderboard_best_idol').html(html);
    //     } else {
    //         $('#leaderboard_best_idol_ul').replaceWith(html);
    //     }
    // },

    // renderGod: function (data) { // 渲染战神榜
    //     var templateGod = __inline("../../widget/god/god.tpl");
    //     compiled = _.template(templateGod);
    //     html = compiled({
    //         'data': data,
    //     });
    //     $('.fight_god').html(html);
    // },

}