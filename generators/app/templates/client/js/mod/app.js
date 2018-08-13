(function ($, global) {
    var render = require('./render.js');
    var data = require('./data.js');
    var Page = require('./page.js');
    var dataFunc = data.dataFunc; // 获取数据的一些方法
    var $$ = data.getData;
    var bus = data.bus; // 存储数据的公共位置
    var log = require('./util.js').loger.log;


    // // 初始所需ajax调用完执行
    dataFunc.done = function () {
         // render.renderPage(bus.teamRank.tScore.vRank, "best_strong", 5);
         // bus.page.pageBestStrong = new Page(bus.teamRank.tScore, "best_strong", "BestStrong", 5);

    };

    // 遍历执行程序初始需要的ajax
    dataFunc.initialData();

    App = {
        init: function () {

            window.performanceInfo.firstScreenTime = +new Date();

            <% if(isLogin == "yes") { %>
            TT.login.check(function (isLogin) {
                if (isLogin) { //   已登录，获取用户预定列表,并且渲染当天预定榜


                } else { // 未登录
                    render.renderNotLogin();
                }
            });
            <% } %>

            this.bindEvent();


        },
        bindEvent: function () {


            // 切换一级tab
            $('.tab1,.tab2').on('click', function () {
                var index = ($(this)[0].className.split('tab')[1]).replace(' on', '');
                
                $('.tab1,.tab2').removeClass('on');
                $(this).addClass('on');
                $('.panel_1,.panel_2').removeClass('on');
                $('.panel_' + index).addClass('on');

                if (index == 1) {
                    $('.text_tab1').attr('src', __uri("/img/text_tab1_active.png"));
                    $('.text_tab2').attr('src', __uri("/img/text_tab2.png"));
                } else {
                    $('.text_tab2').attr('src', __uri("/img/text_tab2_active.png"));
                    $('.text_tab1').attr('src', __uri("/img/text_tab1.png"));
                }

            });

            <% if( isSecondTab == "yes") { %>

                // 切换tab1里面的二级tab
                $('#sec_tab_1,#sec_tab_2').on('click', function () {
                    // var index = ($(this)[0].className.split('tab')[1]).replace(' on', '');

                    // if(index == 1){
                    //     alert('活动暂未开始~');
                    // }
                    // return;

                    // $('#live,#my_league').removeClass('on');

                    if ($(this).hasClass("left")) { // 点击左边tab
                        $('.sec_tab').removeClass('on_sec_tab_2').addClass('on_sec_tab_1');
                        $(this).addClass('on').next().removeClass('on');
                        $('.text_sec_tab_2').attr('src', __uri("/img/text_sec_tab_2.png"));
                        $('.text_sec_tab_1').attr('src', __uri("/img/text_sec_tab_1_active.png"));
                        $('.sec_panel_2').removeClass("on");
                        $('.sec_panel_1').addClass('on');
                    } else {
                        $('.sec_tab').removeClass('on_sec_tab_1').addClass('on_sec_tab_2.png');
                        $(this).addClass('on').prev().removeClass('on');
                        $('.text_sec_tab_2').attr('src', __uri("/img/text_sec_tab_2_active.png"));
                        $('.text_sec_tab_1').attr('src', __uri("/img/text_sec_tab_1.png"));
                        $('.sec_panel_2').addClass("on");
                        $('.sec_panel_1').removeClass('on');
                    }
                });
            <% } %>


            // 未登录时点击登陆
            $('body').on('click', '#login_btn,.login_btn', function () {
                TT.login.login();
            });


            <% if(isPop == "yes") { %>

                // 点击弹出确认框
                $('body').on('click', '.show_confirm_btn', function () {
                    render.renderPopConfirm();
                });

                // 点击弹出成功或者失败框
                $('body').on('click', '.show_success_or_fail_btn', function () {

                    if (1) { // 成功逻辑
                        render.renderPopSuccess();
                    } else { // 失败逻辑

                    }
                });
                // 关闭弹窗
                $('body').on('click', '.close_pop,.close,.cancel_btn,#ensure_btn', function () {
                    $('.info_wrap').removeClass('on');
                });
            <% } %>


            <% if(0) { %>
                // 快报加滚动
                var i = 0;
                var max = Math.floor($('.news_item').length / 4);
                $('.live_bottom_bottom').mousewheel(function (event, delta) {

                    if (delta == -1) {
                        if (!$('.news').is(':animated')) {
                            if (i < max) {
                                i++;
                            }
                            $('.news').animate({
                                top: -i * 255
                            }, 600)
                        }
                    } else {
                        if (!$('.news').is(':animated')) {
                            if (i > 0) {
                                i--;
                            }
                            $('.news').animate({
                                top: -i * 255
                            }, 600)
                        }
                    }
                    event.preventDefault()
                });
            <% } %>



            <% if(isHover == "yes") { %>
                // hover
                $('body').on('mouseenter', '.has_hover', function (e) {
                    // var x = e.clientX;
                    // var y = e.clientY;
                    // var $hover = $('.hover');
                    // var index = $(this).attr('class').split("??")[2]; // index位置按实际class来设置

                    // render.renderHover();
                    // $hover.css('left', x + 'px').css('top', y + 'px').addClass('on');
                    $(this).find(".hover").addClass('on');

                });

                // hover消失
                $('body').on('mouseleave', '.has_hover', function (e) {
                    $('.hover').removeClass('on');
                });


                $('.hover').on('mouseenter', function () {
                    $(this).addClass('on');
                });


                $('.hover').on('mouseleave', function () {
                    $(this).removeClass('on');
                })
            <% } %>



            // 头像加载错误时使用默认头像
            // $('.head_pic').error(function () {
            //     $(this).attr('src', "../../img/avatar_default1.png");
            // });
        },
        param: {}
    }

    App.init();
})(jQuery, window);