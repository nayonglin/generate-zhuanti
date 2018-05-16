<%
    // 最强联盟排行榜
    // data: 最强联盟数据
    // index: 渲染的起始下标
    // isFirst: 首次渲染为true,切换页码为false

%>


                <% if(data.vRank && (data.vRank.length > 0)) { %>
                    <ul class="leaderboard_2" id="leaderboard_best_league_ul">
                <%        
                    var len = (data.vRank.length) < (index + 10) ? (data.vRank.length): (index + 10);
                    for(var i = index; i < len; i++) {                    
                %>
               
                    <li>
                         <% if(i < 3) { %>
                           <div class="list list<%= i + 1 %>"><%= i + 1 %></div>
                         <% } else { %>
                          <div class="list"><%= i + 1 %></div>
                         <% } %>
                         <div class="left">
                             <div class="league_name"><%= data.vRank[i].tInfo.sUnionName %></div>
                             <div class="logo_wrap">
                                <% var sDecoUrl = data.vRank[i].tInfo.sDecoUrl.replace("http://", "//");
                                   sDecoUrl = sDecoUrl.replace(".png", "_3.png"); 
                                %>
                                 <img src="<%= sDecoUrl %>" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/logo_default.png'">
                             </div>
                         </div>
                         <div class="right">
                                 <div class="col_1">                                
                                    <%  for(var j = 0; j < data.vRank[i].tInfo.vMember.length; j++) { 
                                        if(data.vRank[i].tInfo.vMember[j].tJump.lPid != 0) {
                                        if(data.vRank[i].tInfo.vMember[j].sLogoUrl) {
                                            var sLogoUrl = data.vRank[i].tInfo.vMember[j].sLogoUrl.replace("http://", "//");
                                            var sLogoUrl = sLogoUrl.replace('.png', '_3.png');
                                        } else {
                                            var sLogoUrl = "";
                                        }
                                    %>
                                        <div class="head_wrap">
                                            <a href="<%= 'https://www.huya.com/' + data.vRank[i].tInfo.vMember[j].tJump.iRoomId %>" target="_blank">
                                            <img src="<%= sLogoUrl %>" class="head_pic" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'" title="<%= data.vRank[i].tInfo.vMember[j].sNickName %>">
                                            </a>
                                        <% if((data.vRank[i].tInfo.vMember[j].tJump.lTid) != 0 && (data.vRank[i].tInfo.vMember[j].tJump.lSid != 0)) { %>
                                            <img src="/img/online.png" class="is_online">
                                        <% } %>
                                        <% if(data.vRank[i].tInfo.vMember[j].iBeCaptain == 1) { %>
                                            <img src="/img/leader.png" class="leader">
                                        <% } %>
                                        </div>
                                    <% }} %>   
                                 </div>
                                 <div class="col_2"><%= data.vRank[i].tInfo.iScore %></div>
                                 <div class="col_3">
                                     <a href="javascript:void(0);" class="look_more_btn board_look_more_btn" listNumber="<%= i %>">查看详情</a>
                                 </div>
                         </div>
                     </li>
                    
                     <% }} else { %>
                        <img class="best_league_none" src="/img/board_none.png">
                     <% } %>
                    </ul>
                    <% if(isFirst == true) { %>
                        <div class="page" id="page_best_league"></div>
                    <% } %>    
         