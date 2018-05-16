define('app.js', function(require, exports, module) {

  (function ($, global) {
      var PageBestLeague = require('pageBestLeague.js');
      var PageBestIdol = require('pageBestIdol.js');
      var render = require('render.js');
      var data = require('data.js');
      var dataFunc = data.dataFunc; // 获取数据的一些方法
      var bus = data.bus; // 存储数据的公共位置
  
  
      // // 初始所需ajax调用完执行
      dataFunc.done = function () {
  
        
          render.renderPage(bus.bestLeague.data.vRank, "best_league", 10);
          bus.page.pageBestLeague = new PageBestLeague(bus.bestLeague.data.vRank, "best_league", "BestLeague");
  
          render.renderPage(bus.bestIdol.data.vRankList[1].vRank, "best_idol", 10);
          bus.page.pageBestIdol = new PageBestIdol(bus.bestIdol.data.vRankList[1].vRank, "best_idol", "BestIdol");
  
          //战神榜倒计时
          bus.god.data.iNextCountDown = parseInt(bus.god.data.iNextCountDown);
          setInterval(function () {
              if (bus.god.data.iNextCountDown > 0) {
                  var time = App.getCountDown(bus.god.data.iNextCountDown);
                  bus.god.data.iNextCountDown--;
                  $('#god_count_down').text(time);
              } else {
                  bus.god.data.iNextCountDown = 3599;
                  var time = App.getCountDown(3599);
                  $('#god_dount_down').text(time);
              }
          }, 1000)
      };
  
      App = {
          init: function () {
  
              window.performanceInfo.firstScreenTime = +new Date();
              //调节对决实况的胜负比例
              var $fightLiveUl = $('.fight_live_ul_bottom');
              var len = $fightLiveUl.length;
              for (var i = 0; i < len; i++) {
                  var left = parseInt($fightLiveUl.eq(i).find('.score_left').text());
                  var right = parseInt($fightLiveUl.eq(i).find('.score_right').text());
                  var total = left + right;
                  var leftPer = Math.floor((left / total) * 100);
                  var rightPer = 100 - leftPer;
  
                  if (total == 0) {
                      $fightLiveUl.eq(i).find('.ul_bottom_left').css('width', '50%');
                      $fightLiveUl.eq(i).find('.ul_bottom_right').css('width', '50%');
                  } else if (leftPer < 10) {
                      $fightLiveUl.eq(i).find('.ul_bottom_left').css('width', '10%');
                      $fightLiveUl.eq(i).find('.ul_bottom_right').css('width', '90%');
                  } else if (rightPer < 10) {
                      $fightLiveUl.eq(i).find('.ul_bottom_left').css('width', '90%');
                      $fightLiveUl.eq(i).find('.ul_bottom_right').css('width', '10%');
                  } else {
                      $fightLiveUl.eq(i).find('.ul_bottom_left').css('width', leftPer + '%');
                      $fightLiveUl.eq(i).find('.ul_bottom_right').css('width', rightPer + '%');
                  }
              }
  
              TT.login.check(function (isLogin) {
                  if (isLogin) { //已登录，获取用户预定列表,并且渲染当天预定榜
                      dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getUnionInfo", {}, function (res) {
                          if (res.status == 200) { // 主播
                              bus.union = res.data; // 保存联盟信息
                              bus.myUnionId = res.data.iUnionId; // 保存联盟id
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getIdolInfo", {}, function (res) {
                                  if (res.status == 200) {
                                      bus.myUid = res.data.lUid; // 保存用户uid
                                      bus.role = res.data.iRoleType; // 保存用户角色 
                                      var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
                                      bus.roleName = roles[res.data.iRoleType]; // 保存用户角色名字
                                      bus.iScore = res.data.iScore; // 保存用户知名度
                                      bus.iLeaveUNCnt = res.data.iLeaveUNCnt; // 保存用户退出次数
                                      // 如果已加入队伍  
                                      if (bus.myUnionId != 0) {
                                          // 如果是盟主则渲染盟主视角
                                          if (bus.myUid == bus.union.lCaptainUid) {
                                              render.renderCreated(bus.union);
                                          } else { // 如果不是盟主则渲染
                                              render.renderAdded(bus.union);
                                          }
                                      } else { // 如果未加入队伍                  
  
                                          selects = bus.selects.join("");
                                          dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getCanJoinUnion", {
                                              filter: "",
                                              lackType: selects
                                          }, function (res) {
                                              bus.searchUnionResult = res.data;
                                              render.renderNotAdd(res.data, bus.role, bus.selects, bus.searchInput);
                                          });
  
                                      }
                                  } else {
                                      console.log("获取用户信息失败");
                                  }
                              });
  
                          } else if (res.status == 402) { // 402非主播
                              render.renderNotAnchor();
                          }
                      }, "ajax2");
  
                      // //渲染登录态的战神榜
                      // dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getWarGodLive", {}, function (res) {
                      //     render.renderGod(res.data, 1);
                      // });
  
  
                  } else { // 未登录
  
                      render.renderNotLogin();
                  }
              });
  
              this.bindEvent();
  
  
          },
          bindEvent: function () {
  
  
              // 切换tab
              $('.tab1,.tab2').on('click', function () {
                  var index = ($(this)[0].className.split('tab')[1]).replace(' on', '');
  
                  if (index == 1) {
                      $('.text_tab1').attr('src', "/img/text_tab1_active.png");
                      $('.text_tab2').attr('src', "/img/text_tab2.png");
                  } else {
                      $('.text_tab2').attr('src', "/img/text_tab2_active.png");
                      $('.text_tab1').attr('src', "/img/text_tab1.png");
                  }
  
  
                  $('.tab1,.tab2').removeClass('on');
                  $(this).addClass('on');
                  $('.panel_1,.panel_2').removeClass('on');
                  $('.panel_' + index).addClass('on');
              });
  
  
              //切换我的联盟和对决实况
              $('#live,#my_league').on('click', function () {
                  // var index = ($(this)[0].className.split('tab')[1]).replace(' on', '');
  
                  // if(index == 1){
                  //     alert('活动暂未开始~');
                  // }
                  // return;
  
                  // $('#live,#my_league').removeClass('on');
  
                  if ($(this).hasClass("left")) { // 点击对决实况
                      $('.league_and_live').removeClass('on_my_league').addClass('on_live');
                      $(this).addClass('on').next().removeClass('on');
                      $('.text_my_league').attr('src', "/img/text_my_league.png");
                      $('.text_live').attr('src', "/img/text_live_active.png");
                      $('.my_league').removeClass("on");
                      $('.live').addClass('on');
                  } else {
                      $('.league_and_live').removeClass('on_live').addClass('on_my_league');
                      $(this).addClass('on').prev().removeClass('on');
                      $('.text_my_league').attr('src', "/img/text_my_league_active.png");
                      $('.text_live').attr('src', "/img/text_live.png");
                      $('.my_league').addClass("on");
                      $('.live').removeClass('on');
                      $('.my_league').find('.leaderboard_2').jScrollPane({
                          hideFocus: true
                      });
                  }
              });
  
              // 未登录时点击登陆
              $('body').on('click', '#login_btn,.login_btn', function () {
                  TT.login.login();
              });
  
              // 更改职业
              $('body').on('click', '.change_role_btn', function () {
                  render.renderPop1();
              });
  
  
              // 选择更改职业
              $('body').on('click', '.type', function () {
                  $(this).addClass("on").siblings().removeClass('on');
                  if ($('.type').index($('.type.on')) != $('.type').index($('.default'))) {
                      $('.default').addClass("default_on");
                  } else {
                      $('.default').removeClass("default_on");
                  }
              });
  
              // 确认更改职业,点击弹出确认框
              $('body').on('click', '.ensure_change_role_btn1', function () {
                  var roleName = $('.type.on').text();
                  $('body').data('changeRoleName', roleName);
                  if (roleName == '') {
                      render.renderPopFail("类型没有修改！");
                  } else {
                      render.renderPop2(roleName, bus.roleName);
                  }
              });
  
              // 真正更改职业
              $('body').on('click', '.ensure_change_role_btn2', function () {
                  var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
  
                  var changeRoleIndex = roles.indexOf($('body').data('changeRoleName'));
                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=changeRole", {
                      roleType: changeRoleIndex
                  }, function (res) {
                      if (res.status == 200) {
                          if (res.data.iRspCode == 0) {
                              render.renderPop6();
                              bus.roleName = $('body').data('changeRoleName');
  
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getIdolInfo", {}, function (res) {
                                  if (res.status == 200) {
                                      bus.role = res.data.iRoleType; // 保存用户角色 
                                      bus.iScore = res.data.iScore; // 保存用户知名度
                                      $('.search_btn').click();
                                  } else {
                                      console.log("获取用户信息失败");
                                  }
                              });
                          } else {
                              render.renderPopFail(res.data.sCodeDesc);
                          }
                      } else {
                          render.renderPopFail("更改失败！");
                      }
                  }, "ajax1");
              });
  
              // 关闭弹窗
              $('body').on('click', '.close_pop,.close,.cancel_btn', function () {
                  $('.info_wrap').removeClass('on');
              });
  
              // 创建联盟
              $('body').on('click', '.create_league_btn,.add_league_btn', function () {
                  render.renderPop5();
              });
  
              // 通过审批
              $('body').on('click', '.permit_btn', function () {
                  var uid = $(this).attr('uid');
                  var _that = $(this);
  
                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=approval", {
                      addPid: uid,
                      operType: 2,
                      unionId: bus.myUnionId
                  }, function (res) {
                      if (res.status == 200) {
                          if (res.data.iRspCode == 0) {
                              // 通过审批，把通过和拒绝按钮变为已通过
                              // _that.next().replaceWith("  <a href=\"javascript:void(0);\" class=\"permited_btn\">已通过</a>");
                              // _that.remove();
  
                              // 重新渲染盟主视角
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getUnionInfo", {}, function (res) {
                                  render.renderCreated(res.data)
                                  bus.union = res.data;
  
                                  //重新渲染审批列表
                                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getApplyList", {}, function (res) {
                                      render.renderPop9(res.data, bus.union);
                                  }, "ajax8");
                              })
  
  
                          } else {
  
                              render.renderPopSuccess(res.data.sCodeDesc);
                          }
                      } else {
                          render.renderPopFail("审批失败！");
                      }
                  });
              });
  
              // 拒绝审批
              $('body').on('click', '.refuse_btn', function () {
                  var uid = $(this).attr('uid');
                  var _that = $(this);
  
                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=approval", {
                      addPid: uid,
                      operType: 3,
                      unionId: bus.myUnionId
                  }, function (res) {
                      if (res.status == 200) {
                          if (res.data.iRspCode == 0) {
                              // 拒绝审批，把通过和拒绝按钮变为已拒绝
                              // _that.prev().remove();
                              // _that.replaceWith("<a href=\"javascript:void(0);\" class=\"refused_btn\">已拒绝</a>");
  
                              // 重新渲染盟主视角
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getUnionInfo", {}, function (res) {
                                  render.renderCreated(res.data)
                              })
  
                              // 重新渲染审批视角
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getApplyList", {}, function (res) {
                                  render.renderPop9(res.data, bus.union);
                              }, "ajax8");
                          } else {
                              render.renderPopFail(res.data.sCodeDesc);
                          }
                      } else {
                          render.renderPopFail("审批失败！");
                      }
                  });
              });
  
              // 真正创建联盟
              $('body').on('click', '.ensure_create_league_btn', function () {
                  var leagueName, leagueDecName, nameLength, decLength;
                  leagueName = $('<div />').text($('.league_name_input').val()).html();
                  leagueDecName = $('<div />').text($('.league_logo_name_input').val()).html();
                  nameLength = $('.league_name_input').val().length;
                  decLength = $('.league_logo_name_input').val().replace(/[\u4e00-\u9fa5]/gi, "aa").length;
                  $('.p1').removeClass('on');
                  $('.p2').removeClass('on');
                  if (nameLength == 0) {
                      $('.p1').text("请输入名称").addClass('on');
                  } else if (nameLength > 8) {
                      $('.p1').text("名称太长啦！").addClass('on');
                  } else if (decLength == 0) {
                      $('.p2').text("请输入名称").addClass('on');
                  } else if (decLength > 4) {
                      $('.p2').text("名称太长啦！").addClass('on');
                  } else {
                      dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=createUnion", {
                          unionName: leagueName,
                          decoName: leagueDecName
                      }, function (res) {
                          if (res.status == 200) {
                              if (res.data.iRspCode == 0) {
                                  render.renderPop3(leagueName);
  
                                  // 重新获取用户信息
                                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getIdolInfo", {}, function (res) {
                                      if (res.status == 200) {
                                          bus.myUid = res.data.lUid; // 保存用户uid
                                          bus.role = res.data.iRoleType; // 保存用户角色 
                                          var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
                                          bus.roleName = roles[res.data.iRoleType]; // 保存用户角色名字
                                          bus.iScore = res.data.iScore; // 保存用户知名度
                                          bus.iLeaveUNCnt = res.data.iLeaveUNCnt; // 保存用户退出次数                     
                                      } else {
                                          console.log("获取用户信息失败");
                                      }
                                  });
  
                                  // 重新渲染盟主视角
                                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getUnionInfo", {}, function (res) {
                                      render.renderCreated(res.data)
                                      bus.union = res.data; // 保存联盟信息
                                      bus.myUnionId = res.data.iUnionId; // 保存联盟id
                                  })
  
                              } else {
                                  if (res.data.sCodeDesc == "挂件名字已存在") {
                                      $('.p2').text(res.data.sCodeDesc).addClass('on');
                                  } else {
                                      $('.p2').text(res.data.sCodeDesc).addClass('on');
                                  }
                              }
                          } else {
                              render.renderPopFail("创建失败！");
                          }
                      }, "ajax3");
                  }
              });
  
              // 联盟搜索类型打钩
              $('body').on('click', '.select_btn', function () {
                  var _that = $(this);
  
                  // 已选中时
                  if (_that.hasClass('on')) {
                      _that.removeClass('on');
                      var index = _that.parents('ul').find('li').index(_that.parents('li'));
                      bus.selects[index] = 0;
                      var selects = bus.selects.join('');
  
  
                      dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getCanJoinUnion", {
                          filter: bus.searchInput,
                          lackType: selects
                      }, function (res) {
                          bus.searchUnionResult = res.data;
                          render.renderNotAdd(res.data, bus.role, bus.selects, bus.searchInput);
                      })
  
                  } else { // 未选中时
                      $(this).addClass('on');
                      var index = _that.parents('ul').find('li').index(_that.parents('li'));
                      bus.selects[index] = 1;
  
                      var selects = bus.selects.join('');
  
                      dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getCanJoinUnion", {
                          filter: bus.searchInput,
                          lackType: selects
                      }, function (res) {
                          bus.searchUnionResult = res.data
                          render.renderNotAdd(res.data, bus.role, bus.selects, bus.searchInput);
                      })
  
                  }
              });
  
              // 申请加入联盟
              $('body').on('click', '.add_please_btn', function () {
                  var unionID = $(this).attr('unionId');
                  var _that = $(this);
                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=applyJoin", {
                      unionId: unionID
                  }, function (res) {
                      if (res.status == 200) {
                          if (res.data.iRspCode == 0) {
                              render.renderPopSuccess("你的加入联盟申请已经提交，请耐心等待盟主审批");
                              _that.replaceWith("  <a href=\"javascript:void(0);\" class=\"applied_btn\">&nbsp;&nbsp;&nbsp;已申请</a>");
                          } else {
                              render.renderPopFail(res.data.sCodeDesc);
                          }
                      }
                  });
              });
  
              // 搜索联盟
              $('body').on('click', '.search_btn', function () {
                  var len = $('.search_input').val().length;
                  var filter = $('<div />').text($('.search_input').val()).html(); // 转意
                  var _that = $(this);
                  // 搜索框为空时，所有选择框不打勾，请求所有类型的联盟
                  if (len == 0) {
                      bus.searchInput = $('<div />').text($('.search_input').val()).html();
                      for (var i = 0; i < bus.selects.length; i++) {
                          bus.selects[i] = 0;
                      }
                      $('.select').addClass('on');
                      var selects = bus.selects.join("");
                      dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getCanJoinUnion", {
                          filter: "",
                          lackType: selects
                      }, function (res) {
                          bus.searchUnionResult = res.data;
                          render.renderNotAdd(res.data, bus.role, bus.selects, bus.searchInput);
                      });
  
                  } else { // 搜索框不为空时，所有选择框取消，请求的对应名字的联盟
  
                      for (var i = 0; i < bus.selects.length; i++) {
                          bus.selects[i] = 0;
                      }
                      $('.select').removeClass('on');
  
                      var selects = bus.selects.join("");
                      bus.searchInput = $('<div />').text($('.search_input').val()).html();
                      dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getCanJoinUnion", {
                          filter: filter,
                          lackType: selects
                      }, function (res) {
                          bus.searchUnionResult = res.data;
                          render.renderNotAdd(res.data, bus.role, bus.selects, bus.searchInput);
                      })
                  }
  
              });
  
              // 搜索结果查看联盟详情
              $('body').on('click', '.anchor_look_more_btn', function () {
                  var index = $(this).attr('listNumber');
                  render.renderPop8(bus.searchUnionResult.vList[index]);
              });
  
              // 排行榜查看联盟详情
              $('body').on('click', '.board_look_more_btn', function () {
                  var index = $(this).attr('listNumber');
                  render.renderPop8(bus.bestLeague.data.vRank[index].tInfo);
              });
  
              // 退出联盟弹框
              $('body').on('click', '.league_exit_btn', function () {
                  render.renderPop12(bus.iLeaveUNCnt, bus.iScore);
              });
  
              // 真正退出联盟
              $('body').on('click', '.ensure_exit_btn', function () {
                  var leagueId = $('.league_name1').attr('leagueId');
                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=leave", {
                      unionId: leagueId
                  }, function (res) {
                      if (res.status == 200) {
                          if (res.data.iRspCode == 0) {
                              render.renderPopSuccess("退出成功！");
  
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getUnionInfo", {}, function (res) {
                                  if (res.status == 200) { // 主播
                                      bus.union = res.data; // 保存联盟信息
                                      bus.myUnionId = res.data.iUnionId; // 保存联盟id
  
                                      // 重新获取用户信息
                                      dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getIdolInfo", {}, function (res) {
                                          if (res.status == 200) {
                                              bus.myUid = res.data.lUid; // 保存用户uid
                                              bus.role = res.data.iRoleType; // 保存用户角色 
                                              var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
                                              bus.roleName = roles[res.data.iRoleType]; // 保存用户角色名字
                                              bus.iScore = res.data.iScore; // 保存用户知名度
                                              bus.iLeaveUNCnt = res.data.iLeaveUNCnt; // 保存用户退出次数                     
                                          } else {
                                              console.log("获取用户信息失败");
                                          }
                                      });
  
                                  } else if (res.status == 402) { // 402非主播
                                      render.renderNotAnchor();
                                  }
                              }, "ajax2");
  
                              // 重新render未加入的模板
                              var selects = bus.selects.join("");
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getCanJoinUnion", {
                                  filter: "",
                                  lackType: selects
                              }, function (res) {
                                  render.renderNotAdd(res.data, bus.role, bus.selects, bus.searchInput);
                              })
                          } else {
                              render.renderPopFail(res.data.sCodeDesc);
                          }
                      }
                  }, "ajax4");
              });
  
  
              // 弹出加盟审批
              $('body').on('click', '.approval_btn', function () {
                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getApplyList", {}, function (res) {
                      render.renderPop9(res.data, bus.union);
                  }, "ajax8");
              });
  
              // 弹出是否解散联盟
              $('body').on('click', '.league_dissolution_btn', function () {
                  render.renderPop10();
              });
  
              // 真正解散联盟
              $('body').on('click', '.ensure_dissolution_btn', function () {
                  var leagueId = $('.league_name2').attr('leagueId');
                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=disolve", {
                      unionId: leagueId
                  }, function (res) {
                      if (res.status == 200) {
                          if (res.data.iRspCode == 0) {
                              render.renderPopSuccess("解散成功！");
  
                              // 重新render未加入的模板
                              var selects = bus.selects.join("");
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getCanJoinUnion", {
                                  filter: "",
                                  lackType: selects
                              }, function (res) {
                                  bus.searchUnionResult = res.data;
                                  render.renderNotAdd(res.data, bus.role, bus.selects, bus.searchInput);
                              });
  
                          } else {
                              render.renderPopFail(res.data.sCodeDesc);
                          }
                      }
                  }, "ajax6");
              });
  
              // 踢出联盟弹框
              $('body').on('click', '.out', function () {
                  render.renderPop11();
                  bus.outParent = $(this);
              });
  
              //真正踢出联盟
              $('body').on('click', '.ensure_out_btn', function () {
                  var $parent = bus.outParent.parents('li');
                  var uid = bus.outParent.attr('uid');
                  var index = $('.my_member').index(bus.outParent);
                  dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=kickout", {
                      addPid: uid
                  }, function (res) {
                      if (res.status == 200) {
                          if (res.data.iRspCode == 0) {
                              render.renderPopSuccess("踢出成功！");
                              bus.union.vMember = bus.union.vMember.splice(index, 1); // 删除我的联盟中对应下标的队员
                              $parent.remove(); // 页面表面删除这个元素
  
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getUnionInfo", {}, function (res) {
                                  if (res.status == 200) { // 主播
                                      bus.union = res.data; // 保存联盟信息
                                      bus.myUnionId = res.data.iUnionId; // 保存联盟id       
                                  } else if (res.status == 402) { // 402非主播
                                      render.renderNotAnchor();
                                  }
                              }, "ajax2");
  
                              // 重新渲染盟主视角
                              dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getUnionInfo", {}, function (res) {
                                  render.renderCreated(res.data)
                              })
  
                          } else {
                              render.renderPopFail(res.data.sCodeDesc);
                          }
                      }
                  }, "ajax7");
              });
  
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
  
  
              // 点击隐藏弹框
              $('#ensure_btn').on('click', function () {
                  $('.info_wrap').removeClass("on");
              });
  
  
              // 最佳偶像排行榜切换
              $('.best_idol_change_btn').on('click', function () {
                  $(this).addClass("active").siblings().removeClass("active");
                  var role = $(this).attr("class");
                  role = (role.split("best_idol_change_btn"))[2];
                  role = parseInt(role); // 角色下标
                  bus.bestIdol.tab = role;
                  render.renderBestIdol(bus.bestIdol.tab, 0, bus.bestIdol.data, true);
  
                  if (bus.bestIdol.data.vRankList[role]) {
                      render.renderPage(bus.bestIdol.data.vRankList[role].vRank, "best_idol", 10);
                      bus.page.pageBestIdol.active = 1; //new PageTotal(bus.total.vRsp[tab]["vOnTVRankItem"], "total", "total");
                      bus.page.pageBestIdol.count = $("#page_best_idol").find('a').length - 2;
                  }
              });
  
  
              // 对决实况hover
              $('body').on('mouseenter', '.fight_live_list', function (e) {
                  var x = e.clientX;
                  var y = e.clientY;
                  var $hover = $('.fight_live_hover');
                  var index = $(this).attr('class').split("fight_live")[2];
                  console.log(index);
                  if ($(this).hasClass('atk')) {
                      render.renderFightLiveHover(bus.fightLive.data, index, true);
                      $hover.css('left', x + 'px').css('top', y + 'px').addClass('on');
                  } else {
                      render.renderFightLiveHover(bus.fightLive.data, index, false);
                      $hover.css('left', x + 'px').css('top', y + 'px').addClass('on');
                  }
              });
  
              // 对决实况hover消失
              $('body').on('mouseleave', '.fight_live_list', function (e) {
                  $('.fight_live_hover').removeClass('on');
              });
  
  
              $('.fight_live_hover').on('mouseenter', function () {
                  $(this).addClass('on');
              });
  
  
              $('.fight_live_hover').on('mouseleave', function () {
                  $(this).removeClass('on');
              })
  
  
  
  
              // 头像加载错误时使用默认头像
              // $('.head_pic').error(function () {
              //     $(this).attr('src', "../../img/avatar_default1.png");
              // });
          },
          getCountDown: function (time) {
              var str = '';
              var minuts = Math.floor(time / 60);
              var seconds = time % 60;
              str = str + minuts + "分" + seconds + "秒"
              return str;
          },
          param: {}
      }
  
      App.init();
  })(jQuery, window);

});
