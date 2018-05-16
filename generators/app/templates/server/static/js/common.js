;/*!js/mod/data.js*/
define('data.js', function(require, exports, module) {

  
   var dataFunc = {
       count: 4, // 页面初始所需的ajax数
      //  set: function (key, newData, renderName) {  // 设置数据，并且更新对应视图
      //     key = newData;
      //     render[renderName]();
      //  },
       ajax: function (url, data, success, uid) {
           $.ajax({
               url: url,
               dataType: 'jsonp',
               data: data,
               cache: true,
               jsonpCallback: uid,
               success: success
           })
       },
       done: function (){},
       when: function () {  // 所有必要数据加载完就会执行该方法 
           this.count--;
           if (this.count == 0) {
               this.done();
           }
       },
       initialData: function () { // 进页面获取各种数据
            dataFunc.ajax("https://activity.huya.com/idolunion/cache.php?m=IdolUnion&do=getBestUnionRank", {}, function (res) {
               bus.bestLeague.data = res.data   // 保存最强联盟数据
               dataFunc.when();
            });
  
            dataFunc.ajax("https://activity.huya.com/idolunion/cache.php?m=IdolUnion&do=getBestIdolRank", {}, function (res) {
              bus.bestIdol.data = res.data   // 保存最佳偶像数据
              dataFunc.when();
           });
  
           dataFunc.ajax("https://activity.huya.com/idolunion/cache.php?m=IdolUnion&do=getPKLive", {}, function (res) {
              bus.fightLive = res   // 保存对决实况
              dataFunc.when();
           });
  
           dataFunc.ajax("https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getWarGodLive", {}, function (res) {
              bus.god = res   // 保存战胜榜
              dataFunc.when();
           });
  
          
       }
   }
  
   //公共数据存放
   var bus = {
       iLeaveUNCnt: null, // 退队次数
       isSearched: false, // 是否点击过搜索
       searchInput: '', // 保存搜索输入框输入的值
       myUnionId: null, // 我的联盟uid
       searchUnionResult: null, // 联盟搜索结果
       myUid: null, // 我的uid
       selects: [0, 0, 0, 0, 0],
       union: null, // 我的联盟信息
       role: null, // 当前角色下标
       iScore: null, // 当前分值 
       activeTabIndex: 0, // 当前处于哪个大区，默认为0，按需使用
       curDay: null, // 当前是活动第几天
       outParent: null, // 踢出队员对应项
       bestLeague: {
           data: null, // 最强联盟数据
           tab: 0    
       },
       bestIdol: {
          tab: 1,     // 最强联盟现在的tab，其实也就是role类型
          data: null
      },
      page: {      // 页面上的分页组件
          pageBestIdol: null,
          pageBestLeague: null
      },
       totalLocation: 0 // 总榜目前渲染的下标 
   }
  
   dataFunc.initialData();
   module.exports.dataFunc = dataFunc;
   module.exports.bus = bus;

});

;/*!js/mod/render.js*/
define('render.js', function(require, exports, module) {

  var bus = require('data.js').bus;
  
  module.exports = {
      renderNotAnchor: function () { // 不是主播
          var templateNotAnchor = "<div class=\"not_anchor\">\r\n        <div class=\"bottom\"></div>\r\n</div>";
          var compiled = _.template(templateNotAnchor);
          var html = compiled({});
          $('.my_league').html(html);
      },
      renderNotLogin: function () { // 未登录
          var templateNotLogin = "<div class=\"not_login\">\r\n        <div class=\"center\"></div>\r\n        <div class=\"bottom\">\r\n            请<a href=\"javascript:void(0);\" class=\"login_btn\" id=\"login_btn\">登录</a>后查看\r\n        </div>\r\n</div>";
          var compiled = _.template(templateNotLogin);
          var html = compiled({});
          $('.my_league').html(html);
      },
      renderNotAdd: function (data, role, selects, input) { // 未加入
          var templateNotAdd = "\r\n<%\r\n    // 注意，能渲染这里，证明已经是判断过没加入联盟了\r\n    // data: 联盟列表\r\n    // role:表明现在是什么角色，role是一进页面就请求getIdoInfo之后存在bus.userInfo中的\r\n    // selects: 长度为5的数组，存储在bus.selects,对应位为1时，表明选中\r\n    // input: 用户之前输入的值，默认为空\r\n\r\n    var rolesClass = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];\r\n    var roles = [\"颜值担当\", \"人气担当\", \"智慧担当\", \"气质担当\", \"才艺担当\"];\r\n    var option = [\"缺才艺担当\", \"缺气质担当\", \"缺智慧担当\", \"缺人气担当\", \"缺颜值担当\"];\r\n%>\r\n<div class=\"league_not_added\">\r\n        <div class=\"center\">\r\n            <div class=\"left\">你当前偶像类型：\r\n                <a href=\"javascript:void(0);\" class=\"change_role_btn\">更改</a>\r\n                <p class=\"<%= rolesClass[role] %>\"><%= roles[role] %></p> \r\n            </div>\r\n            <div class=\"right\">你还没有加入任何联盟，可以选择联盟加入哦！或者\r\n                <a href=\"javascript:void(0);\" class=\"add_league_btn\">创建联盟</a>\r\n            </div>\r\n        </div>\r\n        <div class=\"center_2\">\r\n            <div class=\"search\">\r\n                <input type=\"text\" placeholder=\"战队名称或主播名称\" class=\"search_input\" value=\"<%= input %>\">\r\n                <a href=\"javascript:void(0);\" class=\"search_btn\">搜索</a>\r\n            </div>\r\n            <div class=\"select_type\">\r\n                <ul>\r\n                   <% for(var t = 0; t < 5; t++) {\r\n                       var isSelected = selects[t]; \r\n                    %>\r\n                      <% if(isSelected) { %>\r\n                           <li><div class=\"select select_btn on\"></div><%= option[t] %></li>\r\n                       <% } else { %>\r\n                           <li><div class=\"select select_btn\"></div><%= option[t] %></li>\r\n                        <% } %>\r\n                    <% } %>  \r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n                    <ul>\r\n                        <li class=\"rank\">排名</li>\r\n                        <li class=\"league_name\">战队名称</li>\r\n                        <li class=\"league_people\">战队成员</li>\r\n                        <li>知名度</li>\r\n                        <li>操作</li>\r\n                    </ul>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                    <ul class=\"leaderboard_2\">\r\n                    <% if(data.vList && (data.vList.length > 0)) { \r\n                         var data = data.vList;\r\n                       console.log(data);\r\n                         for(var i = 0; i < data.length; i++) {    \r\n                           \r\n                            var unionLogo = data[i].sDecoUrl.replace(\"http://\", \"//\");\r\n                            unionLogo = unionLogo.replace(\".png\", \"_3.png\")\r\n                    %>     \r\n                       <li>\r\n                            <div class=\"list\" class=\"list\"><%= i + 1 %></div> \r\n                            <div class=\"left\">\r\n                                <div class=\"league_name\"><%= data[i].sUnionName %></div>\r\n                                <div class=\"logo_wrap\">\r\n                                    <img src=\"<%= unionLogo %>\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/logo_default.png'\">\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"right\">\r\n                                    <div class=\"col_1\">\r\n                                      <% for(var j = 0; j < data[i].vMember.length; j++) { \r\n                                          if(data[i].vMember[j].tJump.lPid != 0) {\r\n                                            if(data[i].vMember[j].sLogoUrl) {\r\n                                                var sLogoUrl = data[i].vMember[j].sLogoUrl.replace(\"http://\", \"//\");\r\n                                            } else {\r\n                                                var sLogoUrl = \"\";\r\n                                            }\r\n                                      %>\r\n                                          <div class=\"head_wrap\">\r\n                                             <a href=\"<%= 'https://www.huya.com/' + data[i].vMember[j].tJump.iRoomId %>\" target=\"_blank\">\r\n                                              <img src=\"<%= sLogoUrl %>\" class=\"head_pic\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\" title=\"<%= data[i].vMember[j].sNickName%>\">\r\n                                             </a>\r\n                                            <% if((data[i].vMember[j].tJump.lTid) != 0 && (data[i].vMember[j].tJump.lSid != 0)) { %>\r\n                                             <img src=\"/img/online.png\" class=\"is_online\">\r\n                                            <% } %>\r\n                                            <% if(data[i].vMember[j].iBeCaptain == 1) { %>\r\n                                             <img src=\"/img/leader.png\" class=\"leader\">\r\n                                             <% } %>\r\n                                          </div>\r\n                                        <% }} %>\r\n                                    </div>\r\n                                    <div class=\"col_2\"><%= data[i].iScore %></div>\r\n                                    <div class=\"col_3\">\r\n                                        <% if(data[i].iApplyStatus == 0) { %>\r\n                                        <a href=\"javascript:void(0);\" class=\"add_please_btn\" unionId=\"<%= data[i].iUnionId %>\">申请加入</a>\r\n                                        <% } else { %>\r\n                                        <a href=\"javascript:void(0);\" class=\"applied_btn\">&nbsp;&nbsp;&nbsp;已申请</a>   \r\n                                        <% } %>    \r\n                                        <a href=\"javascript:void(0);\" class=\"look_more_btn anchor_look_more_btn\" listNumber=\"<%= i %>\">查看详情</a>\r\n                                    </div>\r\n                            </div>\r\n                        </li>\r\n                   <% }} else { %>\r\n                         <img class=\"search_none\" src=\"/img/search_none.png\">\r\n                    <% } %>\r\n                       </ul> \r\n                </div>\r\n        </div>\r\n  </div>\r\n";
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
          var templateAdded = "<%\r\n    // 注意，能渲染这里，证明已经是判断过是团长了\r\n    var unionLogo = data.sDecoUrl.replace(\"http://\", \"//\");\r\n        unionLogo = unionLogo.replace(\".png\", \"_3.png\")\r\n    var numbers = 0;  // 成员数量\r\n    var roles = [\"颜值担当\", \"人气担当\", \"智慧担当\", \"气质担当\", \"才艺担当\"];\r\n\r\n    // 计算队员数量\r\n    if(data.vMember && data.vMember.length > 0) {\r\n        for(var i = 0; i < 5; i++) {\r\n            if(data.vMember[i].tJump.lPid != 0) {\r\n            numbers++;\r\n            }\r\n        }\r\n    }     \r\n%>\r\n\r\n\r\n<div class=\"league_added\">\r\n        <div class=\"center\">\r\n            <div class=\"league_name league_name1\" leagueId=\"<%= data.iUnionId %>\">联盟名称：<span><%= data.sUnionName %></span></div>\r\n            <div class=\"league_logo\">联盟挂件：<img src=\"<%= unionLogo %>\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/logo_default.png'\"></div>\r\n            <div class=\"league_people_number\">联盟成员：<span><%= numbers %>/5</span></div>\r\n            <div class=\"league_reputation\">总知名度：<span><%= data.iScore %></span></div>\r\n            <% if((data.iRank == 0) || (data.iRank > 999)){\r\n                var rank = '999+';\r\n              } else {\r\n                var rank = data.iRank;\r\n              }\r\n             %>\r\n            <div class=\"league_rank\">联盟排名：<span><%= rank %></span></div>\r\n            <a href=\"javascript:void(0);\" class=\"league_exit_btn\">退出联盟</a>\t\r\n        </div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n                <ul>\r\n                   <li>序号</li>\r\n                   <li>主播昵称</li>\r\n                   <li>偶像类型</li>\r\n                   <li>知名度</li>\r\n                   <li>偶像类型排名</li>\r\n                   <li>操作</li>\r\n                </ul>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <ul class=\"leaderboard_2\">\r\n                    <% \r\n                       var t = 0;\r\n                       for(var i = 0; i < data.vMember.length; i++) {\r\n                         if(data.vMember[i].tJump.lPid != 0 ) {\r\n                           t++;\r\n                         var sLogoUrl = data.vMember[i].sLogoUrl.replace(\"http://\", \"//\");\r\n                         var role = parseInt(data.vMember[i].iRoleType);\r\n                           role = roles[role]\r\n                    %>\r\n\r\n                   <li>\r\n                        <div class=\"list\"><%= t %></div> \r\n                        <div class=\"left\">\r\n                            <div class=\"head_wrap\">\r\n                               <div class=\"head_wrap\">\r\n                                  <a href=\"<%= 'https://www.huya.com/' + data.vMember[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                                    <img src=\"<%= sLogoUrl %>\" class=\"head_pic\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n                                  </a>\r\n                                  <% if((data.vMember[i].tJump.lTid) != 0 && (data.vMember[i].tJump.lSid != 0)) { %>\r\n                                    <img src=\"/img/online.png\" class=\"is_online\">\r\n                                  <% } %>\r\n                                  <% if(data.vMember[i].iBeCaptain == 1) { %>\r\n                                    <img src=\"/img/leader.png\" class=\"leader\">\r\n                                  <% } %>\r\n                               </div>            \r\n                            </div>\r\n                            <a href=\"<%= 'https://www.huya.com/' + data.vMember[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                                <span class=\"name\"><%=  data.vMember[i].sNickName %></span>\r\n                             </a>\r\n                        </div>    \r\n                        <div class=\"right\">\r\n                                <div class=\"col_1\"><%= role %></div>\r\n                                <div class=\"col_2\"><%= data.vMember[i].iScore %></div>\r\n                                <% if((data.vMember[i].iRank == 0) || (data.vMember[i].iRank > 999)){\r\n                                       var rank = '999+';\r\n                                   } else {\r\n                                       var rank = data.vMember[i].iRank;\r\n                                   }\r\n                                %>\r\n                                <div class=\"col_3\"><%= rank %></div>\r\n                                <div class=\"col_4\">-</div>\r\n                        </div>\r\n                    </li>\r\n                    <% }} %>\r\n                   </ul> \r\n            </div>\r\n        </div>\r\n      </div>\t\r\n";
          var compiled = _.template(templateAdded);
          var html = compiled({
              'data': data
          });
          $('.my_league').html(html);
      },
      renderCreated: function (data) { // 盟主
          var templateCreated = "<%\r\n    // 注意，能渲染这里，证明已经是判断过是团长了\r\n    // data: 联盟数据\r\n    var unionLogo = data.sDecoUrl.replace(\"http://\", \"//\");\r\n    unionLogo = unionLogo.replace(\".png\", \"_3.png\")\r\n    var numbers = 0;  // 成员数量\r\n    var roles = [\"颜值担当\", \"人气担当\", \"智慧担当\", \"气质担当\", \"才艺担当\"];\r\nconsole.log(data);\r\n    // 计算队员数量\r\n    if(data.vMember && data.vMember.length > 0) {\r\n        for(var i = 0; i < 5; i++) {\r\n            if(data.vMember[i].tJump.lPid != 0) {\r\n            numbers++;\r\n            }\r\n        }\r\n    }      \r\n   \r\n%>\r\n\r\n<div class=\"league_created\">\r\n        <div class=\"center\">\r\n            <div class=\"league_name league_name2\" leagueId=\"<%= data.iUnionId %>\">联盟名称：<span><%= data.sUnionName %></span></div>\r\n            <div class=\"league_logo\">联盟挂件：<img src=\"<%= unionLogo %>\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/logo_default.png'\"></div>\r\n            <div class=\"league_people_number\">联盟成员：<span><%= numbers %>/5</span></div>\r\n            <div class=\"league_reputation\">总知名度：<span><%= data.iScore %></span></div>\r\n            <% if((data.iRank == 0) || (data.iRank > 999)){\r\n                 var rank = '999+';\r\n                } else {\r\n                 var rank = data.iRank;\r\n                }\r\n            %>\r\n            <div class=\"league_rank\">联盟排名：<span><%= rank %></span></div>\r\n            <div class=\"league_approval\">\r\n                    <a href=\"javascript:void(0);\" class=\"approval_btn\">加盟审批</a>\r\n                    <% if(data.iApplyNum > 0) { %>\r\n                    <div class=\"approval_number\"><%= data.iApplyNum %></div>\r\n                    <% } %>\r\n            </div>\r\n            <a href=\"javascript:void(0);\" class=\"league_dissolution_btn\">解散联盟</a>\r\n        </div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n                <ul>\r\n                        <li>序号</li>\r\n                        <li>主播昵称</li>\r\n                        <li>偶像类型</li>\r\n                        <li>知名度</li>\r\n                        <li>偶像类型排名</li>\r\n                        <li>操作</li>\r\n                </ul>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <ul class=\"leaderboard_2\" id=\"league_list\">\r\n                    <% \r\n                         var t = 0;\r\n                        for(var i = 0; i < data.vMember.length; i++) {\r\n                          if(data.vMember[i].tJump.lPid != 0 ) {\r\n                            t++;\r\n                          var sLogoUrl = data.vMember[i].sLogoUrl.replace(\"http://\", \"//\");\r\n                          var role = parseInt(data.vMember[i].iRoleType);\r\n                            role = roles[role]\r\n                     %>\r\n                        <li uid=\"<%= data.vMember[i].tJump.lPid %>\" class=\"my_member\">\r\n                            <div class=\"list\"><%= t %></div> \r\n                            <div class=\"left\">\r\n                                <div class=\"head_wrap\">\r\n                                   <a href=\"<%= 'https://www.huya.com/' + data.vMember[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                                     <img src=\"<%= data.vMember[i].sLogoUrl %>\" class=\"head_pic\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n                                   </a>\r\n                                <% if((data.vMember[i].tJump.lTid) != 0 && (data.vMember[i].tJump.lSid != 0)) { %>\r\n                                   <img src=\"/img/online.png\" class=\"is_online\">\r\n                                <% } %>\r\n                                <% if(data.vMember[i].iBeCaptain == 1) { %>\r\n                                   <img src=\"/img/leader.png\" class=\"leader\">\r\n                                <% } %>\r\n                                </div>\r\n                                <a href=\"<%= 'https://www.huya.com/' + data.vMember[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                                  <span class=\"name\"><%= data.vMember[i].sNickName %></span>\r\n                                </a> \r\n                            </div>\r\n                            <div class=\"right\">\r\n                                    <div class=\"col_1\"><%= role %></div>\r\n                                    <div class=\"col_2\"><%= data.vMember[i].iScore %></div>\r\n                                    <% if((data.vMember[i].iRank == 0) || (data.vMember[i].iRank > 999)){\r\n                                         var rank = '999+';\r\n                                        } else {\r\n                                         var rank = data.vMember[i].iRank;  \r\n                                        }\r\n                                    %>\r\n                                    <div class=\"col_3\"><%= rank %></div>\r\n                                    <% if((t != 1) && (t != 1)) {  %>\r\n                                    <div class=\"col_4\"><a href=\"javascript:void(0);\" class=\"out\" uid=\"<%= data.vMember[i].tJump.lPid %>\">踢出</a></div>\r\n                                    <% } %>    \r\n                                </div>\r\n                        </li>\r\n                    <% }} %>\r\n                </ul> \r\n            </div>\r\n        </div>\r\n      </div>";
          var compiled = _.template(templateCreated);
          var html = compiled({
              'data': data // 我的联盟数据
          });
          $('.my_league').html(html);
      },
      renderBestLeague: function (index, data, isFirst) { // 渲染最佳联盟
          var templateBestLeague = "<%\r\n    // 最强联盟排行榜\r\n    // data: 最强联盟数据\r\n    // index: 渲染的起始下标\r\n    // isFirst: 首次渲染为true,切换页码为false\r\n\r\n%>\r\n\r\n\r\n                <% if(data.vRank && (data.vRank.length > 0)) { %>\r\n                    <ul class=\"leaderboard_2\" id=\"leaderboard_best_league_ul\">\r\n                <%        \r\n                    var len = (data.vRank.length) < (index + 10) ? (data.vRank.length): (index + 10);\r\n                    for(var i = index; i < len; i++) {                    \r\n                %>\r\n               \r\n                    <li>\r\n                         <% if(i < 3) { %>\r\n                           <div class=\"list list<%= i + 1 %>\"><%= i + 1 %></div>\r\n                         <% } else { %>\r\n                          <div class=\"list\"><%= i + 1 %></div>\r\n                         <% } %>\r\n                         <div class=\"left\">\r\n                             <div class=\"league_name\"><%= data.vRank[i].tInfo.sUnionName %></div>\r\n                             <div class=\"logo_wrap\">\r\n                                <% var sDecoUrl = data.vRank[i].tInfo.sDecoUrl.replace(\"http://\", \"//\");\r\n                                   sDecoUrl = sDecoUrl.replace(\".png\", \"_3.png\"); \r\n                                %>\r\n                                 <img src=\"<%= sDecoUrl %>\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/logo_default.png'\">\r\n                             </div>\r\n                         </div>\r\n                         <div class=\"right\">\r\n                                 <div class=\"col_1\">                                \r\n                                    <%  for(var j = 0; j < data.vRank[i].tInfo.vMember.length; j++) { \r\n                                        if(data.vRank[i].tInfo.vMember[j].tJump.lPid != 0) {\r\n                                        if(data.vRank[i].tInfo.vMember[j].sLogoUrl) {\r\n                                            var sLogoUrl = data.vRank[i].tInfo.vMember[j].sLogoUrl.replace(\"http://\", \"//\");\r\n                                            var sLogoUrl = sLogoUrl.replace('.png', '_3.png');\r\n                                        } else {\r\n                                            var sLogoUrl = \"\";\r\n                                        }\r\n                                    %>\r\n                                        <div class=\"head_wrap\">\r\n                                            <a href=\"<%= 'https://www.huya.com/' + data.vRank[i].tInfo.vMember[j].tJump.iRoomId %>\" target=\"_blank\">\r\n                                            <img src=\"<%= sLogoUrl %>\" class=\"head_pic\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\" title=\"<%= data.vRank[i].tInfo.vMember[j].sNickName %>\">\r\n                                            </a>\r\n                                        <% if((data.vRank[i].tInfo.vMember[j].tJump.lTid) != 0 && (data.vRank[i].tInfo.vMember[j].tJump.lSid != 0)) { %>\r\n                                            <img src=\"/img/online.png\" class=\"is_online\">\r\n                                        <% } %>\r\n                                        <% if(data.vRank[i].tInfo.vMember[j].iBeCaptain == 1) { %>\r\n                                            <img src=\"/img/leader.png\" class=\"leader\">\r\n                                        <% } %>\r\n                                        </div>\r\n                                    <% }} %>   \r\n                                 </div>\r\n                                 <div class=\"col_2\"><%= data.vRank[i].tInfo.iScore %></div>\r\n                                 <div class=\"col_3\">\r\n                                     <a href=\"javascript:void(0);\" class=\"look_more_btn board_look_more_btn\" listNumber=\"<%= i %>\">查看详情</a>\r\n                                 </div>\r\n                         </div>\r\n                     </li>\r\n                    \r\n                     <% }} else { %>\r\n                        <img class=\"best_league_none\" src=\"/img/board_none.png\">\r\n                     <% } %>\r\n                    </ul>\r\n                    <% if(isFirst == true) { %>\r\n                        <div class=\"page\" id=\"page_best_league\"></div>\r\n                    <% } %>    \r\n         ";
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
          var templateBestIdol = "\r\n<%\r\n    // 最佳偶像\r\n    // role: 渲染角色类型下标\r\n    // index: 渲染条目起始下标\r\n    // data: 最佳偶像数据\r\n    // isFirst: 是否是第一次渲染\r\n    var roles = ['人气担当', '才艺担当', '智慧担当', '气质担当', '颜值担当']\r\n%>\r\n\r\n    <ul class=\"leaderboard_2\" id=\"leaderboard_best_idol_ul\">\r\n        <% if(data.vRankList[role] && data.vRankList[role].vRank && data.vRankList[role].vRank.length > 0) {\r\n                var data = data.vRankList[role].vRank;\r\n                var len = (data.length) < (index + 10) ? (data.length): (index + 10); \r\n                for(var i = index; i < len; i++) {\r\n                var sLogoUrl = data[i].sLogoUrl.replace(\"http://\", \"//\");\r\n        %>\r\n        <li>\r\n            <% if(i < 3) { %>\r\n                <div class=\"list list<%= i + 1 %>\"><%= i + 1 %></div>\r\n            <% } else { %>\r\n                <div class=\"list\"><%= i + 1 %></div>\r\n            <% } %>\r\n            <div class=\"left\">\r\n                <div class=\"head_wrap\">\r\n                    <a href=\"<%= 'https://www.huya.com/' + data[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                        <img src=\"<%= sLogoUrl %>\" class=\"head_pic\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n                    </a>\r\n                <% if((data[i].tJump.lTid) != 0 && (data[i].tJump.lSid != 0)) { %>\r\n                    <img src=\"/img/online.png\" class=\"is_online\">\r\n                <% } %>\r\n                </div>\r\n                <a href=\"<%= 'https://www.huya.com/' + data[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                    <span class=\"name\"><%= data[i].sName %></span>\r\n                </a>\r\n            </div>\r\n            <div class=\"right\">\r\n                     <% if(data[i].sUnionName != \"\") { %>\r\n                        <div class=\"col_1\"><%= data[i].sUnionName %></div>\r\n                     <% }  else { %>\r\n                        <div class=\"col_1 no_league\">暂未加入任何联盟</div>\r\n                     <% } %>      \r\n                    <div class=\"col_2\"><%= data[i].iScore %></div>\t\t\t\t\t\t\t\t\t\r\n            </div>\r\n        </li>\r\n        <% }} else { %>\r\n            <img class=\"best_idol_none\" src=\"/img/board_none.png\"> \r\n        <% } %>\r\n    </ul> \r\n    <% if(isFirst == true) { %>\r\n        <div class=\"page\" id=\"page_best_idol\"></div>\r\n    <% } %>    \r\n\r\n";
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
          var templateFightLive = "<%\r\n    // 对决实况\r\n    // data: 对决实况数据\r\n    var roles = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];\r\n    var mainLeft = []; // 左边主战的队员\r\n    var mainRight = []; // 右边主战队员\r\n    console.log(data);\r\n\r\n    if(data.vList && data.vList.length > 0) {\r\n        for(var i = 0; i < data.vList.length; i++) {\r\n            for(var j = 0; j < data.vList[i].tAtkUnionInfo.vMember.length; j++) {\r\n                if(data.vList[i].tAtkUnionInfo.vMember[j].iPKMain == 1) {\r\n                    mainLeft.push(data.vList[i].tAtkUnionInfo.vMember[j]);\r\n                    break;\r\n                }\r\n            }\r\n        }\r\n        for(var i = 0; i < data.vList.length; i++) {\r\n            for(var j = 0; j < data.vList[i].tDefUnionInfo.vMember.length; j++) {\r\n                if(data.vList[i].tDefUnionInfo.vMember[j].iPKMain == 1) {\r\n                    mainRight.push(data.vList[i].tDefUnionInfo.vMember[j]);\r\n                    break;\r\n                }\r\n            }\r\n        }\r\n    }\r\n    \r\n%>\r\n\r\n\r\n    <div class=\"top\">\r\n        联盟对决实况<span>展现对决双方当前收获的[赞]数量总和排名前三的对决实况</span>\r\n    </div>\r\n    <div class=\"bottom\">\r\n        <ul>\r\n           <% \r\n             if(data.vList  && (data.vList.length > 0)) {\r\n              for(var i = 0; i < data.vList.length; i++) { \r\n           %> \r\n            <li>\r\n                <div class=\"ul_top\">\r\n                    <div class=\"<%= roles[data.vList[i].iRoleType] %>\"></div>\r\n                </div>\r\n                <div class=\"ul_center\">\r\n                        <% if(data.vList[i].tAtkUnionInfo.iUnionId != 0) { %>\r\n                            <div class=\"<%= 'left atk fight_live_list fight_live' + i %>\" > \r\n                        <% } else {%>                      \r\n                            <div class=\"left\">\r\n                        <% } %>        \r\n                        <div class=\"ul_center_top\">\r\n                            <% if(data.vList[i].tAtkUnionInfo.iUnionId != 0) { %>\r\n                                <img src=\"/img/meng.png\" class=\"meng\">\r\n                                <p class=\"name\"><%= data.vList[i].tAtkUnionInfo.sUnionName %></p>\r\n                            <% } else { %>\r\n                                <p class=\"name\"></p>\r\n                            <% } %>    \r\n                        </div>\r\n                        <div class=\"ul_center_bottom\">\r\n                          <a href=\"<%= 'https://www.huya.com/' + mainLeft[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                            <% if(mainLeft[i].sLogoUrl) {\r\n                                var mainLeftLogoUrl = mainLeft[i].sLogoUrl.replace(\"http://\", \"//\"); \r\n                            } else {\r\n                                var mainLeftLogoUrl = \"\";\r\n                            }\r\n                            %>\r\n                            <img src=\"<%= mainLeftLogoUrl %>\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n                          </a>\r\n                          <a href=\"<%= 'https://www.huya.com/' + mainLeft[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                            <p class=\"name\"><%=  mainLeft[i].sNickName %></p>\r\n                          </a>\r\n                        </div>\r\n                    </div>\r\n                    <% if(data.vList[i].tDefUnionInfo.iUnionId != 0) { %>\r\n                        <div class=\"<%= 'right def fight_live_list fight_live' + i %>\" >\r\n                    <% } else { %>\r\n                        <div class=\"right\">\r\n                    <% } %>       \r\n                         <div class=\"ul_center_top\">\r\n                            <% if(data.vList[i].tDefUnionInfo.iUnionId != 0) { %>\r\n                                <img src=\"/img/meng.png\" class=\"meng\">\r\n                                <p class=\"name\"><%= data.vList[i].tDefUnionInfo.sUnionName %></p>\r\n                            <% } else { %>\r\n                                <p class=\"name\"></p>\r\n                            <% } %>    \r\n                        </div>\r\n                        <div class=\"ul_center_bottom\">\r\n                                <a href=\"<%= 'https://www.huya.com/' + mainRight[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                                    <% if(mainRight[i].sLogoUrl) {\r\n                                        var mainRightLogoUrl = mainRight[i].sLogoUrl.replace(\"http://\", \"//\"); \r\n                                    } else {\r\n                                        var mainRightLogoUrl = \"\";\r\n                                    }\r\n                                    %>\r\n                                    <img src=\"<%= mainRightLogoUrl %>\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n                                </a>\r\n                                <a href=\"<%= 'https://www.huya.com/' + mainRight[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                                  <p class=\"name\"><%=  mainRight[i].sNickName %></p>\r\n                                </a>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"ul_bottom fight_live_ul_bottom\">\r\n                    <div class=\"ul_bottom_left\">\r\n                        <img src=\"/img/like.png\">                       \r\n                    </div>\r\n                    <div class=\"ul_bottom_right\">\r\n                        <img src=\"/img/like.png\">                  \r\n                    </div>\r\n                    <div class=\"score_panel\">\r\n                        <span class=\"score_left\"><%= data.vList[i].tAtkUnionInfo.iScore %></span>\r\n                        <span class=\"score_right\"><%= data.vList[i].tDefUnionInfo.iScore %></span>\r\n                    </div>\r\n                </div>\r\n            </li>\r\n            <% }} else { %>\r\n                <img class=\"fight_live_none\" src=\"/img/live_none.png\">\r\n            <% } %>\r\n        </ul>\r\n    </div>\r\n";
          compiled = _.template(templateFightLive);
          html = compiled({
              'data': data,
          });
          $('.fight_live').html(html);
      },
      renderGod: function (data) { // 渲染战神榜
          var templateGod = "<%\r\n    // 战神榜\r\n    // data: 战神榜数据\r\n    // isLogin： 是否登录\r\n\r\n    function getCountDown(time) {\r\n        var str = '';\r\n        var minuts = Math.floor(time/60);\r\n        var seconds = time%60;\r\n            str = str + minuts + \"分\" + seconds + \"秒\"\r\n        return str;\r\n    }\r\n\r\n    var time = getCountDown(data.iNextCountDown);\r\n%>\r\n\r\n<div class=\"top\">\r\n        战神争夺实况<span><span id=\"god_count_down\"><%= time %></span>后榜首用户可成为战神，获得战神挂件+入场横幅</span>\r\n    </div>\r\n    <div class=\"bottom\">\r\n      <div class=\"bottom_bottom\">\r\n          <% if(data.tCurGod && data.tCurGod.lUid != 0) {\r\n              var sLogoUrl = data.tCurGod.sLogoUrl.replace(\"http://\", \"//\");\r\n          %>\r\n            <div class=\"left\">\r\n                <img src=\"/img/god.png\" class=\"god_cover\">\r\n                <img src=\"<%= sLogoUrl %>\" class=\"head_pic\"  onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n            </div>\r\n            <div class=\"right\">\r\n                <span class=\"name\"><%= data.tCurGod.sName %></span>\r\n                <% \r\n                   if(data.vRank[0]) { \r\n                    if(data.tCurGod.lUid != data.vRank[0].lUid) {\r\n                %>\r\n                    战神之位恐怕要不保啦，要加油哦！\r\n                <% } else {%>\r\n                    战神之位暂时无人撼动！\r\n                <% }} else { %>\r\n                     战神之位暂时无人撼动！\r\n                <% } %>\r\n            </div>\r\n            <% } else {%>\r\n                <div class=\"left\">\r\n                    <img src=\"/img/god.png\" class=\"god_cover\">\r\n                    <img src=\"//hd.huya.com/201804lottery/img/avatar_default.png\" class=\"head_pic\">\r\n                </div>\r\n                <div class=\"right\">\r\n                    <span class=\"name\">虚位以待</span>\r\n                </div>\r\n            <% } %>   \r\n        </div>\r\n        <div class=\"bottom_center\">\r\n            <div class=\"center_top\">\r\n                <ul>\r\n                    <li class=\"rank\">排名</li>\r\n                    <li class=\"league_name\">用户昵称</li>\r\n                    <li class=\"like_number\">PK贡献\"赞\"数</li>\r\n                </ul>\r\n            </div>\r\n            <div class=\"center_bottom\">\r\n                <ul class=\"leaderboard_2\">\r\n                    <% \r\n                       if(data.vRank && (data.vRank.length > 0)) {\r\n                        for(var i = 0; i < data.vRank.length; i++) {\r\n                            var sLogoUrl = data.vRank[i].sLogoUrl.replace(\"http://\", \"//\");\r\n                    %>\r\n                    <li>\r\n                        <% if(i < 3) { %>\r\n                          <div class=\"list list<%= i + 1 %>\"><%= i + 1 %></div>\r\n                        <% } else { %>\r\n                         <div class=\"list\"><%= i + 1 %></div>\r\n                        <% } %>\r\n                        <div class=\"left\">\r\n                            <div class=\"head_wrap\">\r\n                                <div class=\"head\">\r\n                                    <img src=\"<%= sLogoUrl %>\" class=\"head_pic\"  onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n                                </div>\r\n                            </div>\r\n                                <span class=\"name\"><%= data.vRank[i].sName %></span> \r\n                                <% if(data.vRank[i].sDeroUrl != \"\") {\r\n                                    var sDeroUrl = data.vRank[i].sDeroUrl.replace(\"http://\", \"//\");\r\n                                    sDeroUrl = sDeroUrl.replace(\".png\", \"_3.png\");    \r\n                                %>\r\n                                <img src=\"<%= sDeroUrl %>\" class=\"hero_pic\">\r\n                                <% } %>\r\n                        </div>\r\n                        <div class=\"right\">\r\n                                <div class=\"col_1\"><%= data.vRank[i].iScore %></div>\t\t\t\t\t\t\t\t\t\r\n                        </div>\r\n                    </li>\r\n                    <% }} else { %>\r\n                      <img class=\"god_none\" src=\"/img/god_none.png\">  \r\n                    <% } %>\r\n                </ul> \r\n            </div>\r\n        </div>\r\n        <% if(data.tMyInfo.lUid == 0) { %>\r\n            <div class=\"bottom_top\">请<a href=\"javascript:void(0);\" class=\"login_btn\">登录</a>后查看你的[赞]贡献排名\r\n            </div>\r\n        <% } else {%>\r\n\r\n            <div class=\"bottom_top\">我当前PK贡献\"赞\"数为\r\n                <span class=\"my_score\"><%= data.tMyInfo.iScore %></span>\r\n                ，排名\r\n                <% if((data.tMyInfo.iRank == 0) || (data.tMyInfo.iRank > 999)) { %>\r\n                    <span class=\"my_rank\">999+</span>\r\n                <% } else { %>\r\n                    <span class=\"my_rank\"><%= data.tMyInfo.iRank %></span>\r\n                <% } %>        \r\n            </div>\r\n        <% } %>\r\n    </div>";
          compiled = _.template(templateGod);
          html = compiled({
              'data': data,
          });
          $('.fight_god').html(html);
      },
      renderFightLiveHover: function (data, index, isAttack) { // 渲染对战实况的hover
          var templateFightLiveHover = "\r\n<%\r\n    // 对决战报hover\r\n    // data: 对决战报数据\r\n    // index： 要显示的队伍信息下标\r\n    // isAttack: 是否是进攻方\r\n\r\n    var roles = [\"颜值担当\", \"人气担当\", \"智慧担当\", \"气质担当\", \"才艺担当\"];\r\n    var rolesClass = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];\r\n    if(data.vList && data.vList.length > 0) {\r\n        if(isAttack) {\r\n%>\r\n    <div class=\"top\">联盟名称：\r\n        <span class=\"league_name\"><%= data.vList[index].tAtkUnionInfo.sUnionName %></span>\r\n        <span class=\"attck_or_guard\">(挑战方)</span>\r\n    </div>\r\n    <div class=\"bottom\">\r\n        <ul>\r\n            <%\r\n            console.log(data);\r\n                var data = data.vList[index].tAtkUnionInfo.vMember;\r\n                for(var i = 0; i < data.length; i++) {\r\n                    if(data[i].tJump.lPid != 0) {\r\n            %>\r\n            <li>\r\n                <% if(data[i].iPKMain == 1) { %>\r\n                    <span class=\"is_main\">主战：</span>\r\n                <% } else {%>\r\n                    <span class=\"is_main\">助攻：</span>\r\n                <% } %>\r\n                <span class=\"<%= 'role ' + rolesClass[data[i].iRoleType] %>\"><%= roles[data[i].iRoleType] %></span>\r\n                <div class=\"name_wrap\">\r\n                  <a href=\"<%= 'https://www.huya.com/' + data[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                     <span class=\"name\"><%= data[i].sNickName %></span>\r\n                  </a>\r\n                </div>\r\n                &nbsp;&nbsp;赞数量：\r\n                <span class=\"like_number\"><%= data[i].iPKScore %></span>\r\n            </li>\r\n            <% }} %>\r\n        </ul>\r\n    </div>\r\n<%} else { %>\r\n    <div class=\"top\">联盟名称：\r\n            <span class=\"league_name\"><%= data.vList[index].tDefUnionInfo.sUnionName %></span>\r\n            <span class=\"attck_or_guard\">(防守方)</span>\r\n    </div>\r\n    <div class=\"bottom\">\r\n        <ul>\r\n            <%\r\n                var data = data.vList[index].tDefUnionInfo.vMember;\r\n                for(var i = 0; i < data.length; i++) {\r\n                    if(data[i].tJump.lPid != 0) {\r\n            %>\r\n            <li>\r\n                <% if(data[i].iPKMain == 1) { %>\r\n                    <span class=\"is_main\">主战：</span>\r\n                <% } else {%>\r\n                    <span class=\"is_main\">助攻：</span>\r\n                <% } %>\r\n                <span class=\"<%= 'role ' + rolesClass[data[i].iRoleType] %>\"><%= roles[data[i].iRoleType] %></span>\r\n                <div class=\"name_wrap\">\r\n                    <a href=\"<%= 'https://www.huya.com/' + data[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                        <span class=\"name\"><%= data[i].sNickName %></span>\r\n                    </a>\r\n                </div>\r\n                &nbsp;&nbsp;赞数量：\r\n                <span class=\"like_number\"><%= data[i].iPKScore %></span>\r\n            </li>\r\n            <% }} %>\r\n        </ul>\r\n    </div>\r\n<% }} else { console.log('队伍信息为空');}%>\r\n\r\n";
          compiled = _.template(templateFightLiveHover);
          html = compiled({
              'index': index, // 要渲染的队伍的下标
              'data': data,
              'isAttack': isAttack // 是否是进攻方
          });
          $('.fight_live_hover').html(html);
      },
      renderPop1: function () { // 角色更改
          var templatePop1 = "\r\n<%\r\n    // 更改角色类型弹框\r\n    // role：当前角色下标\r\n    // iScore: 当前分值\r\n    var roles = [\"颜值担当\", \"人气担当\", \"智慧担当\", \"气质担当\", \"才艺担当\"];\r\n    var rolesClass = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];\r\n    console.log(role);\r\n%>\r\n\r\n<div class=\"cover\"></div>\r\n<div class=\"pop1 on\">\r\n        <div class=\"top\">更改偶像类型<div class=\"close\"></div></div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n                <div class=\"idol_type\">当前偶像类型：<p class=\"<%= rolesClass[role] %>\"><%= roles[role] %></p></div>\r\n                <div class=\"reputation\">知名度：<p class=\"score\"><%= iScore %></p></div>\r\n            </div>\r\n            <div class=\"bottom_center\">\r\n                <ul>     \r\n                    <% if(role == 0) {\r\n                        var roles = [\"颜值担当\", \"人气担当\", \"智慧担当\", \"气质担当\", \"才艺担当\"];\r\n                    %>\r\n                        <li class=\"type type2\"><%= roles[1] %></li>\r\n                        <li class=\"type type3\"><%= roles[2] %></li>\r\n                        <li class=\"type type4\"><%= roles[3] %></li>\r\n                        <li class=\"type type5\"><%= roles[4] %></li>\r\n                    <p>注：更换偶像类型后知名度将清零</p>\r\n                    <% } else if(role == 1 ) {\r\n                        var roles = [\"智慧担当\"];   \r\n                    %>              \r\n                        <li class=\"type type3\"><%= roles[0] %></li>\r\n                        <p style=\"padding-top: 60px\">注：更换偶像类型后知名度将清零，当前仅可转为智慧担当</p>\r\n                    <% } else if(role == 2 ) {\r\n                        var roles = [\"人气担当\"];\r\n                     %>\r\n                        <li class=\"type type2\"><%= roles[0] %></li>\r\n                        <p style=\"padding-top: 60px\">注：更换偶像类型后知名度将清零，当前仅可转为人气担当</p>\r\n                    <% } else if(role == 3 ) {\r\n                        var roles = [\"才艺担当\"];    \r\n                    %>\r\n                        <li class=\"type type5\"><%= roles[0] %></li>\r\n                        <p style=\"padding-top: 60px\">注：更换偶像类型后知名度将清零，当前仅可转为才艺担当</p>\r\n                    <% } else {\r\n                        var roles = [\"气质担当\"];    \r\n                    %>    \r\n                        <li class=\"type type4\"><%= roles[0] %></li>\r\n                        <p style=\"padding-top: 60px\">注：更换偶像类型后知名度将清零，当前仅可转为气质担当</p>\r\n                    <% } %>\r\n                </ul>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <a href=\"javascript:void(0);\" class=\"ensure_btn ensure_change_role_btn1\">确认更改</a>\r\n                <a href=\"javascript:void(0);\" class=\"cancel_btn\">取消</a>\r\n            </div>\r\n        </div>\r\n    </div>";
          var compiled = _.template(templatePop1);
          var html = compiled({
              'role': bus.role, // 角色下标
              'iScore': bus.iScore // 主播分值
          });
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop2: function (roleName, myRoleName) { // 角色更改确认
          var templatePop2 = "\r\n\r\n<% \r\n    // roleName: 当前要更换角色的名字\r\n    // myRoleName: 当前角色名字\r\n\r\n\r\n%>\r\n\r\n<div class=\"cover\"></div>\r\n<div class=\"pop2 on\">\r\n        <div class=\"top\">更改偶像类型<div class=\"close\"></div></div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n               <img src=\"/img/logo6.png\">\r\n            </div>\r\n            <div class=\"bottom_center\">\r\n             <p>当前偶像类型为<span><%= myRoleName %></span>,将更改成为<span><%= roleName %></span>，<br>\r\n              更改后知名度清空重计，是否确认更改？</p> \r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <a href=\"javascript:void(0);\" class=\"ensure_btn ensure_change_role_btn2\">确认</a>\r\n                <a href=\"javascript:void(0);\" class=\"cancel_btn\">我再想想</a>\r\n            </div>\r\n        </div>\r\n    </div>";
          var compiled = _.template(templatePop2);
          var html = compiled({
              'roleName': roleName, // 当前选择更改角色名字
              'myRoleName': myRoleName // 用户当前角色名字
          });
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop3: function (leagueName) { // 创建联盟成功
          var templatePop3 = "\r\n<%\r\n// leagueName: 联盟名字\r\n%>\r\n<div class=\"cover\"></div>\r\n<div class=\"pop3 on\">\r\n        <div class=\"top\">创建联盟<div class=\"close\"></div></div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n               <img src=\"/img/logo_success.png\">\r\n            </div>\r\n            <div class=\"bottom_center\">\r\n            <p>你已成功创建联盟：<span><%= leagueName %></span>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <a href=\"javascript:void(0);\" class=\"ensure_btn close_pop\">好的</a>\r\n            </div>\r\n        </div>\r\n    </div>";
          var compiled = _.template(templatePop3);
          var html = compiled({
              'leagueName': leagueName // 联盟名称
          });
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop4: function () { // 确认是否退出
          var templatePop4 = "\r\n\r\n<% \r\n// 确认是否退出联盟\r\n%>\r\n\r\n<div class=\"cover\"></div>\r\n<div class=\"pop10 on\">\r\n    <div class=\"top\">退出联盟<div class=\"close\"></div></div>\r\n    <div class=\"bottom\">\r\n        <div class=\"bottom_top\">\r\n           <img src=\"/img/logo6.png\">\r\n        </div>\r\n        <div class=\"bottom_center\">\r\n         <p>是否确认退出联盟？<span></span><br>\r\n          </p> \r\n        </div>\r\n        <div class=\"bottom_bottom\">\r\n            <a href=\"javascript:void(0);\" class=\"ensure_btn ensure_exit_btn\">确认</a>\r\n            <a href=\"javascript:void(0);\" class=\"cancel_btn\">我再想想</a>\r\n        </div>\r\n    </div>\r\n</div>";
          var compiled = _.template(templatePop4);
          var html = compiled({});
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop5: function () { // 创建联盟表单弹框
          var templatePop5 = "<div class=\"cover\"></div>\r\n<div class=\"pop5 on\">\r\n        <div class=\"top\">创建联盟<div class=\"close\"></div></div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n                联盟名称：<input type=\"text\"  class=\"league_name_input\" placeholder=\"限制8个以内的中文字符长度\">\r\n                     <p class=\"p1\">请输入名称！</p>\r\n                <div class=\"bottom_top_center\">\r\n                     联盟挂件名称：<input type=\"text\"  class=\"league_logo_name_input\" placeholder=\"限制2个以内的中文字符长度\">\r\n                     <p class=\"p2\">请输入名称！</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"bottom_center\">\r\n                注：<span>挂件将用于联盟主播的粉丝在公屏发言时昵称后的显示。</span><br>\r\n                    <span>联盟挂件需与联盟名称相关，两个名称提交后不可修改，请谨慎填写</span>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <a href=\"javascript:void(0);\" class=\"ensure_btn ensure_create_league_btn\">确认创建</a>\r\n            </div>\r\n        </div>\r\n</div>";
          var compiled = _.template(templatePop5);
          var html = compiled({});
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop6: function () { // 角色更改成功弹框
          var templatePop6 = "<div class=\"cover\"></div>\r\n<div class=\"pop6 on\">\r\n        <div class=\"top\">更改偶像类型<div class=\"close\"></div></div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n               <img src=\"/img/logo_success.png\">\r\n            </div>\r\n            <div class=\"bottom_center\">\r\n             <p>你已成功更改偶像类型！</p> \r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <a href=\"javascript:void(0);\" class=\"ensure_btn close_pop\">好的</a>\r\n            </div>\r\n        </div>\r\n</div>\r\n";
          var compiled = _.template(templatePop6);
          var html = compiled({});
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop8: function (data) { // 主播查看联盟详情
          var templatePop8 = "<%\r\n  //联盟详情弹框\r\n  //data: 联盟信息\r\n \r\n  console.log(data);\r\n  var unionLogo = data.sDecoUrl.replace(\"http://\", \"//\");\r\n      unionLogo = unionLogo.replace(\".png\", \"_3.png\");\r\n  var roles = [\"颜值担当\", \"人气担当\", \"智慧担当\", \"气质担当\", \"才艺担当\"];\r\n  var numbers = 0; // 队员数量\r\n\r\n  // 计算队员数量\r\n  if(data.vMember && data.vMember.length > 0) {\r\n      for(var i = 0; i < 5; i++) {\r\n          if(data.vMember[i].tJump.lPid != 0) {\r\n          numbers++;\r\n          }\r\n      }\r\n  }  \r\n%>\r\n\r\n<div class=\"cover\"></div>\r\n<div class=\"pop8 on\">\r\n        <div class=\"top\">联盟详情<div class=\"close\"></div></div>\r\n        <div class=\"center\">\r\n                <div class=\"col_1\">联盟名称：<span><%= data.sUnionName %></span></div>\r\n                <div class=\"col_2\">联盟挂件：\r\n                    <div class=\"league_logo\">\r\n                        <img src=\"<%= unionLogo %>\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/logo_default.png'\">\r\n                    </div>\r\n                </div>\r\n                <div class=\"col_3\">联盟成员：<span><%= numbers %>/5</span></div>\r\n                <div class=\"col_4\">总知名度：<span><%= data.iScore %></span></div>\r\n                <% if(data.iRank == 0){\r\n                        var rank = '999+';\r\n                    } else {\r\n                        var rank = data.iRank;\r\n                    }\r\n                %>\r\n                <div class=\"col_5\">联盟排名：<span><%= rank %></span></div>\r\n        </div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n                <ul>\r\n                    <li class=\"rank\">序号</li>\r\n                    <li class=\"league_name\">主播昵称</li>\r\n                    <li class=\"league_people\">偶像类型</li>\r\n                    <li>知名度</li>\r\n                    <li>偶像类型排名</li>\r\n                </ul>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <ul class=\"leaderboard_2\">\r\n                    <%\r\n                        var t = 0;  //序号\r\n                        for(var i = 0; i < data.vMember.length; i++) {\r\n                            if(data.vMember[i].tJump.lPid != 0) {\r\n                                t++;\r\n                            var sLogoUrl = data.vMember[i].sLogoUrl.replace(\"http://\", \"//\");\r\n\r\n                    %>\r\n                        <li>\r\n                            <div class=\"list\"><%= t %></div>\r\n                            <div class=\"left\">\r\n                               <div class=\"head_wrap\">\r\n                                  <a href=\"<%= 'https://www.huya.com/' + data.vMember[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                                    <img src=\"<%= sLogoUrl %>\" class=\"head_pic\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n                                  </a>\r\n                               <% if((data.vMember[i].tJump.lTid) != 0 && (data.vMember[i].tJump.lSid != 0)) { %>\r\n                                  <img src=\"/img/online.png\" class=\"is_online\">\r\n                               <% } %>\r\n                               <% if(data.vMember[i].iBeCaptain) { %>\r\n                               <img src=\"/img/leader.png\" class=\"leader\">\r\n                               <% } %>\r\n                               </div>\r\n                               <a href=\"<%= 'https://www.huya.com/' + data.vMember[i].tJump.iRoomId %>\" target=\"_blank\">\r\n                                  <span class=\"name\"><%= data.vMember[i].sNickName %></span>\r\n                               </a>\r\n                            </div>\r\n                            <div class=\"right\">\r\n                                    <div class=\"col_1\"><%= roles[data.vMember[i].iRoleType] %></div>\r\n                                    <div class=\"col_2\"><%= data.vMember[i].iScore %></div>\r\n                                    <% if(data.vMember[i].iRank == 0){\r\n                                        var rank = '999+';\r\n                                    } else {\r\n                                        var rank = data.vMember[i].iRank;\r\n                                    }\r\n                                %>\r\n                                    <div class=\"col_3\"><%= rank %></div>\r\n                            </div>\r\n                        </li>\r\n                    <% }} %>\r\n                </ul> \r\n            </div>\r\n        </div>\r\n    </div>";
          var compiled = _.template(templatePop8);
          var html = compiled({
              'data': data, // 对应联盟信息
          });
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop9: function (data, union) { // 申请列表弹框
          var templatePop9 = "\r\n<%\r\n\r\n    // data: 审批列表\r\n    // union: 我的联盟信息，保存在了bus的union中\r\n\r\n    function getLocalTime(nS) {\r\n        var date = new Date(parseInt(nS) * 1000),\r\n            time;\r\n        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';\r\n        D = (date.getDate()).toString(); \r\n        D = (D.length == 2) ? (D + '日 ') : ('0' + D + '日 ');\r\n        h = (date.getHours()).toString();\r\n        h = (h.length == 2) ? (h + ':') : ('0' + h + ':');\r\n        m = ((date.getMinutes()).toString());\r\n        m = (m.length == 2) ? (m + '') : ('0' + m + '');\r\n        s = (date.getSeconds()).toString(); \r\n        s = (s.length == 2) ? (s) : ('0' + s);\r\n        time = M+D+h+m;\r\n        return time;\r\n    }\r\n\r\n    var roles = [\"颜值担当\", \"人气担当\", \"智慧担当\", \"气质担当\", \"才艺担当\"];\r\n    var numbers = 0; // 队员数量\r\n    \r\n    // 计算队员数量\r\n    if(union.vMember && union.vMember.length > 0) {\r\n        for(var i = 0; i < 5; i++) {\r\n            if(union.vMember[i].tJump.lPid != 0) {\r\n            numbers++;\r\n            }\r\n        }\r\n    }  \r\n%>\r\n<div class=\"cover\"></div>\r\n<div class=\"pop9 on\">\r\n        <div class=\"top\">加盟审批<div class=\"close\"></div></div>\r\n        <div class=\"center\">\r\n                <div class=\"col_1\">当前联盟成员组成(<%= numbers %>/5)：\r\n                        <ul>\r\n                            <%\r\n                            for(var i = 0; i < 5; i++) {\r\n                                for(var j = 0; j < union.vMember.length; j++) {\r\n                                 if(union.vMember[j].iRoleType == i && (union.vMember[j].tJump.lPid != 0)) {   \r\n                            %>\r\n                                <li class=\"<%= 'type' + (i + 1) + ' active'%>\"><%= roles[i] %></li>\r\n                            <% break; }}\r\n                                if(j == 5) {    \r\n                            %>  \r\n                               <li class=\"<%= 'type' + (i + 1)%>\"><%= roles[i] %></li>\r\n                            <% }} %>\r\n                        </ul>\r\n                </div>\r\n        </div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n                    <ul>\r\n                        <li class=\"rank\">序号</li>\r\n                        <li class=\"league_name\">主播昵称</li>\r\n                        <li class=\"league_people\">偶像类型</li>\r\n                        <li class=\"reputation\">知名度</li>\r\n                        <li class=\"type\">偶像类型排名</li>\r\n                        <li class=\"time\">申请时间</li>\r\n                        <li class=\"oprate\">操作</li>\r\n                    </ul>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                    <ul class=\"leaderboard_2\">                      \r\n                        <% \r\n                          if(data.vApplayList && (data.vApplayList.length > 0)){  \r\n                            for(var i = 0; i < data.vApplayList.length; i++) {\r\n                                var sLogoUrl = data.vApplayList[i].tMem.sLogoUrl.replace(\"http://\", \"//\");\r\n                                var role = parseInt(data.vApplayList[i].tMem.iRoleType);\r\n                                    role = roles[role];\r\n                                var time = getLocalTime(data.vApplayList[i].iApplyTS);    \r\n                        %>\r\n                            <li>\r\n                                <div class=\"list\"><%= i + 1 %></div>\r\n                                <div class=\"left\">\r\n                                   <div class=\"head_wrap\">\r\n                                      <a href=\"<%= 'https://www.huya.com/' + data.vApplayList[i].tMem.tJump.iRoomId %>\" target=\"_blank\">\r\n                                        <img src=\"<%= sLogoUrl %>\" class=\"head_pic\" onerror=\"this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'\">\r\n                                      </a>\r\n                                   <% if((data.vApplayList[i].tMem.tJump.lTid) != 0 && (data.vApplayList[i].tMem.tJump.lSid != 0)) { %>\r\n                                      <img src=\"/img/online.png\" class=\"is_online\">\r\n                                   <% } %>\r\n                                   </div>\r\n                                   <a href=\"<%= 'https://www.huya.com/' + data.vApplayList[i].tMem.tJump.iRoomId %>\" target=\"_blank\">\r\n                                      <span class=\"name\"><%= data.vApplayList[i].tMem.sNickName %></span>\r\n                                   </a>                   \r\n                                </div>\r\n                                <div class=\"right\">\r\n                                        <div class=\"col_1\"><%= role %></div>\r\n                                        <div class=\"col_2\"><%= data.vApplayList[i].tMem.iScore %></div>\r\n                                        <% if(data.vApplayList[i].tMem.iRank == 0){\r\n                                              var rank = '999+';\r\n                                            } else {\r\n                                              var rank = data.vApplayList[i].tMem.iRank;\r\n                                            }\r\n                                        %>\r\n                                        <div class=\"col_3\"><%= rank %></div>\r\n                                        <div class=\"col_4\"><%= time %></div>\r\n                                        <div class=\"col_5\">\r\n                                            <% if(data.vApplayList[i].iStatus == 1) { %>\r\n                                            <a href=\"javascript:void(0);\" class=\"permit_btn\" uid=\"<%= data.vApplayList[i].tMem.tJump.lPid %>\">通过</a>\r\n                                            <a href=\"javascript:void(0);\" class=\"refuse_btn\" uid=\"<%= data.vApplayList[i].tMem.tJump.lPid %>\">拒绝</a>\r\n                                            <% } else if(data.vApplayList[i].iStatus == 2) { %>\r\n                                            <a href=\"javascript:void(0);\" class=\"permited_btn\">已通过</a>\r\n                                            <% } else if(data.vApplayList[i].iStatus == 3) { %>\r\n                                            <a href=\"javascript:void(0);\" class=\"refused_btn\">已拒绝</a>\r\n                                            <% } else if(data.vApplayList[i].iStatus == 5) { %>\r\n                                            <a href=\"javascript:void(0);\" class=\"refused_btn\">已被踢出</a>\r\n                                            <% } %>\r\n                                        </div>\r\n                                </div>\r\n                            </li>\r\n                        <% }} else { %>\r\n                            <img class=\"approval_none\" src=\"/img/approval_none.png\">\r\n                         <% } %>\r\n                    </ul> \r\n            </div>\r\n        </div>\r\n</div>";
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
          var templatePop10 = "\r\n\r\n<% \r\n// 确认是否解散联盟弹框\r\n%>\r\n\r\n<div class=\"cover\"></div>\r\n<div class=\"pop10 on\">\r\n    <div class=\"top\">解散联盟<div class=\"close\"></div></div>\r\n    <div class=\"bottom\">\r\n        <div class=\"bottom_top\">\r\n           <img src=\"/img/logo6.png\">\r\n        </div>\r\n        <div class=\"bottom_center\">\r\n         <p>解散联盟，每位成员都将<span>失去1/5的知名度</span><br>\r\n          是否确认解散？</p> \r\n        </div>\r\n        <div class=\"bottom_bottom\">\r\n            <a href=\"javascript:void(0);\" class=\"ensure_btn ensure_dissolution_btn\">确认</a>\r\n            <a href=\"javascript:void(0);\" class=\"cancel_btn\">我再想想</a>\r\n        </div>\r\n    </div>\r\n</div>";
          var compiled = _.template(templatePop10);
          var html = compiled({});
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop11: function () { // 确认是否踢出联盟
          var templatePop11 = "\r\n<% \r\n    // 确认是否踢出联盟\r\n%>\r\n\r\n<div class=\"cover\"></div>\r\n<div class=\"pop10 on\">\r\n    <div class=\"top\">踢出联盟<div class=\"close\"></div></div>\r\n    <div class=\"bottom\">\r\n        <div class=\"bottom_top\">\r\n           <img src=\"/img/logo6.png\">\r\n        </div>\r\n        <div class=\"bottom_center\">\r\n         <p>是否确认踢出联盟？<span></span><br>\r\n          </p> \r\n        </div>\r\n        <div class=\"bottom_bottom\">\r\n            <a href=\"javascript:void(0);\" class=\"ensure_btn ensure_out_btn\">确认</a>\r\n            <a href=\"javascript:void(0);\" class=\"cancel_btn\">我再想想</a>\r\n        </div>\r\n    </div>\r\n</div>";
          var compiled = _.template(templatePop11);
          var html = compiled({});
          $('.info_wrap').html(html).addClass('on');
      },
      renderPop12: function (exitNumber, score) { // 确认是否退出联盟
          var templatePop12 = "\r\n\r\n<% \r\n// 确认是否退出联盟\r\n// exitNumber: 退出次数\r\n// score: 用户知名度\r\nvar decScore = Math.floor(score/4);          \r\n%>\r\n\r\n<div class=\"cover\"></div>\r\n<div class=\"pop10 on\">\r\n    <div class=\"top\">退出联盟<div class=\"close\"></div></div>\r\n    <div class=\"bottom\">\r\n        <div class=\"bottom_top\">\r\n           <img src=\"/img/logo6.png\">\r\n        </div>\r\n        <div class=\"bottom_center\">\r\n         <% if(exitNumber > 0) { %>   \r\n             <p>退出联盟将<span>失去1/4的知名度(<%=  decScore %>知名度)</span><br>\r\n                并且退出后没有机会加入其它联盟</p> \r\n          <% } else if(exitNumber == 0 ) { %>\r\n            <p>退出联盟将<span>失去1/4的知名度(<%= decScore %>知名度)</span><br>\r\n                并且退出后仅有1次加入其它联盟的机会</p> \r\n          <% } %>\r\n        </div>\r\n        <div class=\"bottom_bottom\">\r\n            <a href=\"javascript:void(0);\" class=\"ensure_btn ensure_exit_btn\">确认</a>\r\n            <a href=\"javascript:void(0);\" class=\"cancel_btn\">我再想想</a>\r\n        </div>\r\n    </div>\r\n</div>";
          var compiled = _.template(templatePop12);
          var html = compiled({
              'exitNumber': exitNumber,  // 退出过的次数
              'score': score  // 用户知名度
          });
          $('.info_wrap').html(html).addClass('on');
      },
      renderPopSuccess: function (text) { // 成功通用提示
          var templatePopSuccess = "<%\r\n// text: 需要提示的信息\r\n%>\r\n<div class=\"cover\"></div>\r\n<div class=\"pop3 on\">\r\n        <div class=\"top\">温馨提示<div class=\"close\"></div></div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n               <img src=\"/img/logo_success.png\">\r\n            </div>\r\n            <div class=\"bottom_center\">\r\n            <p><%= text %></p>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <a href=\"javascript:void(0);\" class=\"ensure_btn close_pop\">我知道了</a>\r\n            </div>\r\n        </div>\r\n    </div>";
          var compiled = _.template(templatePopSuccess);
          var html = compiled({
              'text': text // 提示内容
          });
          $('.info_wrap').html(html).addClass('on');
      },
      renderPopFail: function (text) { // 失败通用提示
          var templatePopFail = "<%\r\n// text: 需要提示的信息\r\n%>\r\n<div class=\"cover\"></div>\r\n<div class=\"pop3 on\">\r\n        <div class=\"top\">温馨提示<div class=\"close\"></div></div>\r\n        <div class=\"bottom\">\r\n            <div class=\"bottom_top\">\r\n               <img src=\"/img/logo6.png\">\r\n            </div>\r\n            <div class=\"bottom_center\">\r\n            <p><%= text %></p>\r\n            </div>\r\n            <div class=\"bottom_bottom\">\r\n                <a href=\"javascript:void(0);\" class=\"ensure_btn close_pop\">我知道了</a>\r\n            </div>\r\n        </div>\r\n    </div>";
          var compiled = _.template(templatePopFail);
          var html = compiled({
              'text': text // 提示内容
          });
          $('.info_wrap').html(html).addClass('on');
      },
      renderPage: function (data, type, perCount) { // 渲染页码
          var templatePage = "<%\r\n   var pageCount = Math.ceil(data.length / perCount);\r\n     console.log(data.length);\r\n%>\r\n\r\n   <% if(data.length > 0) { %>\r\n    <div class=\"page\" id=\"page_<%= type %>\">\r\n            <a href=\"javascript:void(0);\" class=\"prev_page\" id=\"prev_<%= type %>\">上一页</a>\r\n            <a href=\"javascript:void(0);\" class=\"page_choose page_active page_<%= type %>\">1</a>\r\n<%\r\n     for(var i = 2; i <= pageCount; i++ ) {\r\n%>\r\n           \r\n            <a href=\"javascript:void(0);\" class=\"page_choose page_<%= type %>\"><%= i %></a>\r\n<%\r\n     }\r\n%>          \r\n            <a href=\"javascript:void(0);\" class=\"next_page\" id=\"next_<%= type %>\">下一页</a>\r\n    </div>\r\n      <% } else { %>\r\n         <div class=\"page\" id=\"page_<%= type %>\">\r\n      <% } %>";
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

});

;/*!js/mod/pageBestLeague.js*/
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

;/*!js/mod/pageBestIdol.js*/
define('pageBestIdol.js', function(require, exports, module) {

  var render = require('render.js');
  var data = require('data.js');
  var bus = data.bus;
  
  /**
   * 分页组件
   * @param {object} data  分页对象的数据
   * @param {string} name  分页对象名字
   * @param {string} type  分页对象类别，比如说总榜，时段榜
   */
  var page = function (data, name, type) {
  
      var _that = this;
      this.count = $("#page_" + name).find('a').length - 2;
      this.active = 1;
      this.data = data;
      this.name = name;
      this.renderName = "render" + firUpper(type);
  
  
  
      // 上一页
      $('body').on('click', '#prev_' + name, function (e) {
          if (_that.active > 1) {
              $(this).siblings().eq(_that.active - 1).removeClass("page_active").prev().addClass("page_active");
              render[_that.renderName](bus.bestIdol.tab, (_that.active - 2) * 10, bus.bestIdol.data, false);
              _that.active--;
          }
      });
  
      // 下一页
      $('body').on('click', '#next_' + name, function () {
          if (_that.active < _that.count) {
              $(this).siblings().removeClass("page_active").eq(_that.active + 1).addClass("page_active");
              render[_that.renderName](bus.bestIdol.tab, _that.active * 10, bus.bestIdol.data, false);
              _that.active++;
          }
      });
  
      // 切换页码
      $('body').on('click', '.page_' + name, function () {
          _that.active = parseInt($(this).text());
          render[_that.renderName](bus.bestIdol.tab, (_that.active - 1) * 10, bus.bestIdol.data, false);
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

;/*!js/mod/app.js*/
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

;/*!js/mod/page.js*/
define('page.js', function(require, exports, module) {

  var render = require('render.js');
  var data = require('data.js');
  var bus = data.bus;
  
  /**
   * 分页组件
   * @param {object} data  分页对象的数据
   * @param {string} name  分页对象名字
   * @param {string} type  分页对象类别，比如说总榜，时段榜
   */
  var page = function (data, name, type) {
  
      var _that = this;
      this.count = $("#page_" + name).find('a').length - 2;
      this.active = 1;
      this.data = data;
      this.name = name;
      this.renderName = "render" + firUpper(type);
  
  
  
      // 上一页
      $('body').on('click', '#prev_' + name, function (e) {
          if (_that.active > 1) {
              $(this).siblings().eq(_that.active - 1).removeClass("page_active").prev().addClass("page_active");
              render[_that.renderName]((_that.active - 2) * 10, _that.data[bus.curDay], bus.curDay);
              _that.active--;
          }
      });
  
      // 下一页
      $('body').on('click', '#next_' + name, function () {
          if (_that.active < _that.count) {
              $(this).siblings().removeClass("page_active").eq(_that.active + 1).addClass("page_active");
              render[_that.renderName](_that.active * 10, _that.data[bus.curDay], bus.curDay);
              _that.active++;
          }
      });
  
      // 切换页码
      $('body').on('click', '.page_' + name, function () {
          _that.active = parseInt($(this).text());
         // render[_that.renderName]((_that.active - 1) * 10, _that.data, bus.curDay);
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

;/*!js/mod/util.js*/
define('util.js', function(require, exports, module) {

  
  var Util = {
  	APP:'axletree-demo',
  	VERSION: '1.0.0'
  };
  
  module.exports = Util;
  
  

});
