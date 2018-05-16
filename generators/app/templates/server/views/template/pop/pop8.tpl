<%
  //联盟详情弹框
  //data: 联盟信息
 
  console.log(data);
  var unionLogo = data.sDecoUrl.replace("http://", "//");
      unionLogo = unionLogo.replace(".png", "_3.png");
  var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
  var numbers = 0; // 队员数量

  // 计算队员数量
  if(data.vMember && data.vMember.length > 0) {
      for(var i = 0; i < 5; i++) {
          if(data.vMember[i].tJump.lPid != 0) {
          numbers++;
          }
      }
  }  
%>

<div class="cover"></div>
<div class="pop8 on">
        <div class="top">联盟详情<div class="close"></div></div>
        <div class="center">
                <div class="col_1">联盟名称：<span><%= data.sUnionName %></span></div>
                <div class="col_2">联盟挂件：
                    <div class="league_logo">
                        <img src="<%= unionLogo %>" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/logo_default.png'">
                    </div>
                </div>
                <div class="col_3">联盟成员：<span><%= numbers %>/5</span></div>
                <div class="col_4">总知名度：<span><%= data.iScore %></span></div>
                <% if(data.iRank == 0){
                        var rank = '999+';
                    } else {
                        var rank = data.iRank;
                    }
                %>
                <div class="col_5">联盟排名：<span><%= rank %></span></div>
        </div>
        <div class="bottom">
            <div class="bottom_top">
                <ul>
                    <li class="rank">序号</li>
                    <li class="league_name">主播昵称</li>
                    <li class="league_people">偶像类型</li>
                    <li>知名度</li>
                    <li>偶像类型排名</li>
                </ul>
            </div>
            <div class="bottom_bottom">
                <ul class="leaderboard_2">
                    <%
                        var t = 0;  //序号
                        for(var i = 0; i < data.vMember.length; i++) {
                            if(data.vMember[i].tJump.lPid != 0) {
                                t++;
                            var sLogoUrl = data.vMember[i].sLogoUrl.replace("http://", "//");

                    %>
                        <li>
                            <div class="list"><%= t %></div>
                            <div class="left">
                               <div class="head_wrap">
                                  <a href="<%= 'https://www.huya.com/' + data.vMember[i].tJump.iRoomId %>" target="_blank">
                                    <img src="<%= sLogoUrl %>" class="head_pic" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
                                  </a>
                               <% if((data.vMember[i].tJump.lTid) != 0 && (data.vMember[i].tJump.lSid != 0)) { %>
                                  <img src="/img/online.png" class="is_online">
                               <% } %>
                               <% if(data.vMember[i].iBeCaptain) { %>
                               <img src="/img/leader.png" class="leader">
                               <% } %>
                               </div>
                               <a href="<%= 'https://www.huya.com/' + data.vMember[i].tJump.iRoomId %>" target="_blank">
                                  <span class="name"><%= data.vMember[i].sNickName %></span>
                               </a>
                            </div>
                            <div class="right">
                                    <div class="col_1"><%= roles[data.vMember[i].iRoleType] %></div>
                                    <div class="col_2"><%= data.vMember[i].iScore %></div>
                                    <% if(data.vMember[i].iRank == 0){
                                        var rank = '999+';
                                    } else {
                                        var rank = data.vMember[i].iRank;
                                    }
                                %>
                                    <div class="col_3"><%= rank %></div>
                            </div>
                        </li>
                    <% }} %>
                </ul> 
            </div>
        </div>
    </div>