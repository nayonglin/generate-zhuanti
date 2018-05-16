
<%
    // 注意，能渲染这里，证明已经是判断过没加入联盟了
    // data: 联盟列表
    // role:表明现在是什么角色，role是一进页面就请求getIdoInfo之后存在bus.userInfo中的
    // selects: 长度为5的数组，存储在bus.selects,对应位为1时，表明选中
    // input: 用户之前输入的值，默认为空

    var rolesClass = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];
    var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
    var option = ["缺才艺担当", "缺气质担当", "缺智慧担当", "缺人气担当", "缺颜值担当"];
%>
<div class="league_not_added">
        <div class="center">
            <div class="left">你当前偶像类型：
                <a href="javascript:void(0);" class="change_role_btn">更改</a>
                <p class="<%= rolesClass[role] %>"><%= roles[role] %></p> 
            </div>
            <div class="right">你还没有加入任何联盟，可以选择联盟加入哦！或者
                <a href="javascript:void(0);" class="add_league_btn">创建联盟</a>
            </div>
        </div>
        <div class="center_2">
            <div class="search">
                <input type="text" placeholder="战队名称或主播名称" class="search_input" value="<%= input %>">
                <a href="javascript:void(0);" class="search_btn">搜索</a>
            </div>
            <div class="select_type">
                <ul>
                   <% for(var t = 0; t < 5; t++) {
                       var isSelected = selects[t]; 
                    %>
                      <% if(isSelected) { %>
                           <li><div class="select select_btn on"></div><%= option[t] %></li>
                       <% } else { %>
                           <li><div class="select select_btn"></div><%= option[t] %></li>
                        <% } %>
                    <% } %>  
                </ul>
            </div>
        </div>
        <div class="bottom">
            <div class="bottom_top">
                    <ul>
                        <li class="rank">排名</li>
                        <li class="league_name">战队名称</li>
                        <li class="league_people">战队成员</li>
                        <li>知名度</li>
                        <li>操作</li>
                    </ul>
            </div>
            <div class="bottom_bottom">
                    <ul class="leaderboard_2">
                    <% if(data.vList && (data.vList.length > 0)) { 
                         var data = data.vList;
                       console.log(data);
                         for(var i = 0; i < data.length; i++) {    
                           
                            var unionLogo = data[i].sDecoUrl.replace("http://", "//");
                            unionLogo = unionLogo.replace(".png", "_3.png")
                    %>     
                       <li>
                            <div class="list" class="list"><%= i + 1 %></div> 
                            <div class="left">
                                <div class="league_name"><%= data[i].sUnionName %></div>
                                <div class="logo_wrap">
                                    <img src="<%= unionLogo %>" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/logo_default.png'">
                                </div>
                            </div>
                            <div class="right">
                                    <div class="col_1">
                                      <% for(var j = 0; j < data[i].vMember.length; j++) { 
                                          if(data[i].vMember[j].tJump.lPid != 0) {
                                            if(data[i].vMember[j].sLogoUrl) {
                                                var sLogoUrl = data[i].vMember[j].sLogoUrl.replace("http://", "//");
                                            } else {
                                                var sLogoUrl = "";
                                            }
                                      %>
                                          <div class="head_wrap">
                                             <a href="<%= 'https://www.huya.com/' + data[i].vMember[j].tJump.iRoomId %>" target="_blank">
                                              <img src="<%= sLogoUrl %>" class="head_pic" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'" title="<%= data[i].vMember[j].sNickName%>">
                                             </a>
                                            <% if((data[i].vMember[j].tJump.lTid) != 0 && (data[i].vMember[j].tJump.lSid != 0)) { %>
                                             <img src="/img/online.png" class="is_online">
                                            <% } %>
                                            <% if(data[i].vMember[j].iBeCaptain == 1) { %>
                                             <img src="/img/leader.png" class="leader">
                                             <% } %>
                                          </div>
                                        <% }} %>
                                    </div>
                                    <div class="col_2"><%= data[i].iScore %></div>
                                    <div class="col_3">
                                        <% if(data[i].iApplyStatus == 0) { %>
                                        <a href="javascript:void(0);" class="add_please_btn" unionId="<%= data[i].iUnionId %>">申请加入</a>
                                        <% } else { %>
                                        <a href="javascript:void(0);" class="applied_btn">&nbsp;&nbsp;&nbsp;已申请</a>   
                                        <% } %>    
                                        <a href="javascript:void(0);" class="look_more_btn anchor_look_more_btn" listNumber="<%= i %>">查看详情</a>
                                    </div>
                            </div>
                        </li>
                   <% }} else { %>
                         <img class="search_none" src="/img/search_none.png">
                    <% } %>
                       </ul> 
                </div>
        </div>
  </div>
