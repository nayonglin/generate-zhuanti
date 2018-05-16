var bus = require('./data.js').bus;

module.exports = {
    renderNotAnchor: function () { // 不是主播
        var templateNotAnchor = __inline("../../widget/notAnchor/notAnchor.tpl");
        var compiled = _.template(templateNotAnchor);
        var html = compiled({});
        $('.my_league').html(html);
    },
    renderNotLogin: function () { // 未登录
        var templateNotLogin = __inline("../../widget/notLogin/notLogin.tpl");
        var compiled = _.template(templateNotLogin);
        var html = compiled({});
        $('.my_league').html(html);
    },
    renderNotAdd: function (data, role, selects, input) { // 未加入
        var templateNotAdd = __inline("../../widget/notAdd/notAdd.tpl");
        var compiled = _.template(templateNotAdd);
        var html = compiled({
            'data': data,
            'role': role,
            'selects': selects,
            'input': input // 保存用户之前输入的搜索内容
        });
        $('.my_league').html(html).find('.leaderboard_2').jScrollPane({
            hideFocus: true
        });
    },
    renderAdded: function (data) { // 已加入，非盟主
        var templateAdded = __inline("../../widget/added/added.tpl");
        var compiled = _.template(templateAdded);
        var html = compiled({
            'data': data
        });
        $('.my_league').html(html);
    },
    renderCreated: function (data) { // 盟主
        var templateCreated = __inline("../../widget/created/created.tpl");
        var compiled = _.template(templateCreated);
        var html = compiled({
            'data': data // 我的联盟数据
        });
        $('.my_league').html(html);
    },
    renderBestLeague: function (index, data, isFirst) { // 渲染最佳联盟
        var templateBestLeague = __inline("../../widget/bestLeague/bestLeague.tpl");
        compiled = _.template(templateBestLeague);
        html = compiled({
            'index': index, //从哪条数据开始渲染
            'data': data,
            'isFirst': isFirst // 首次渲染true，切换页码false
        });
        if (isFirst) { //不是第一次的话，就替换第一次的ul，避免把之前的分页弄没了
            $('#leaderboard_best_league').html(html);
        } else {
            $('#leaderboard_best_league_ul').replaceWith(html);
        }

    },
    renderBestIdol: function (role, index, data, isFirst) { // 渲染最佳偶像
        var templateBestIdol = __inline("../../widget/bestIdol/bestIdol.tpl");
        compiled = _.template(templateBestIdol);
        html = compiled({
            'role': role,    // 渲染哪个类型的偶像排名
            'index': index,  // 从那条数据开始渲染
            'data': data,
            'isFirst': isFirst // 首次渲染true，切换页码false
        });
        if (isFirst) { // 不是第一次的话，就替换第一次的ul，避免把之前的分页弄没了
            $('#leaderboard_best_idol').html(html);
        } else {
            $('#leaderboard_best_idol_ul').replaceWith(html);
        }
    },
    renderFightLive: function (data) { // 渲染对战实况
        var templateFightLive = __inline("../../widget/fightLive/fightLive.tpl");
        compiled = _.template(templateFightLive);
        html = compiled({
            'data': data,
        });
        $('.fight_live').html(html);
    },
    renderGod: function (data) { // 渲染战神榜
        var templateGod = __inline("../../widget/god/god.tpl");
        compiled = _.template(templateGod);
        html = compiled({
            'data': data,
        });
        $('.fight_god').html(html);
    },
    renderFightLiveHover: function (data, index, isAttack) { // 渲染对战实况的hover
        var templateFightLiveHover = __inline("../../widget/fightLiveHover/fightLiveHover.tpl");
        compiled = _.template(templateFightLiveHover);
        html = compiled({
            'index': index, // 要渲染的队伍的下标
            'data': data,
            'isAttack': isAttack // 是否是进攻方
        });
        $('.fight_live_hover').html(html);
    },
    renderPop1: function () { // 角色更改
        var templatePop1 = __inline("../../widget/pop/pop1.tpl");
        var compiled = _.template(templatePop1);
        var html = compiled({
            'role': bus.role, // 角色下标
            'iScore': bus.iScore // 主播分值
        });
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop2: function (roleName, myRoleName) { // 角色更改确认
        var templatePop2 = __inline("../../widget/pop/pop2.tpl");
        var compiled = _.template(templatePop2);
        var html = compiled({
            'roleName': roleName, // 当前选择更改角色名字
            'myRoleName': myRoleName // 用户当前角色名字
        });
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop3: function (leagueName) { // 创建联盟成功
        var templatePop3 = __inline("../../widget/pop/pop3.tpl");
        var compiled = _.template(templatePop3);
        var html = compiled({
            'leagueName': leagueName // 联盟名称
        });
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop4: function () { // 确认是否退出
        var templatePop4 = __inline("../../widget/pop/pop4.tpl");
        var compiled = _.template(templatePop4);
        var html = compiled({});
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop5: function () { // 创建联盟表单弹框
        var templatePop5 = __inline("../../widget/pop/pop5.tpl");
        var compiled = _.template(templatePop5);
        var html = compiled({});
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop6: function () { // 角色更改成功弹框
        var templatePop6 = __inline("../../widget/pop/pop6.tpl");
        var compiled = _.template(templatePop6);
        var html = compiled({});
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop8: function (data) { // 主播查看联盟详情
        var templatePop8 = __inline("../../widget/pop/pop8.tpl");
        var compiled = _.template(templatePop8);
        var html = compiled({
            'data': data, // 对应联盟信息
        });
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop9: function (data, union) { // 申请列表弹框
        var templatePop9 = __inline("../../widget/pop/pop9.tpl");
        var compiled = _.template(templatePop9);
        var html = compiled({
            'data': data, // 申请列表信息
            'union': union // 我的联盟信息 
        });
        $('.info_wrap').html(html).addClass('on');
        $('.info_wrap').find('.leaderboard_2').jScrollPane({
            hideFocus: true
        });
    },
    renderPop10: function () { // 确认是否解散联盟
        var templatePop10 = __inline("../../widget/pop/pop10.tpl");
        var compiled = _.template(templatePop10);
        var html = compiled({});
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop11: function () { // 确认是否踢出联盟
        var templatePop11 = __inline("../../widget/pop/pop11.tpl");
        var compiled = _.template(templatePop11);
        var html = compiled({});
        $('.info_wrap').html(html).addClass('on');
    },
    renderPop12: function (exitNumber, score) { // 确认是否退出联盟
        var templatePop12 = __inline("../../widget/pop/pop12.tpl");
        var compiled = _.template(templatePop12);
        var html = compiled({
            'exitNumber': exitNumber,  // 退出过的次数
            'score': score  // 用户知名度
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
            'type': type,         //分页名字
            'perCount': perCount  // 每页长度
        });
        $('#page_' + type).replaceWith(html);
    }
    // renderTotal: function (index, location, data, isFirst) { // 渲染总榜
    //     var templateTotal = __inline("../../widget/total/total.tpl");
    //     compiled = _.template(templateTotal);
    //     html = compiled({
    //         'index': index, //从那条数据开始渲染
    //         'location': location, //分区下标
    //         'data': data,
    //         'isFirst': isFirst // 首次渲染true，切换页码false
    //     });
    //     if (isFirst) {   //不是第一次的话，就替换第一次的ul，避免把之前的分页弄没了
    //         $('#total_board').html(html);
    //     } else {
    //         $('.leaderboard_2').replaceWith(html);
    //     }
    // }
    // renderTimeLine: function (tab, day) { // 渲染时段冠军
    //     var vListName = ["vAList", "vBList", "vCList", "vDList"];
    //     var templateTimeLine = __inline("../../widget/timeLine/timeLine.tpl");
    //     var compiled = _.template(templateTimeLine);
    //     var html = compiled({
    //         'data': bus.vTimeLine[vListName[tab]],
    //         'day': day
    //     });
    //     $('.swiper_container').html(html);
    // },

    // renderTotal: function (tab_index, page_index, data) { // 渲染总榜
    //     var templateTotal = __inline("../../widget/total/total.tpl");
    //     compiled = _.template(templateTotal);
    //     html = compiled({
    //         'tab': tab_index,
    //         'data': data,
    //         'index': page_index
    //     });
    //     $('.total').html(html);

    // },

}