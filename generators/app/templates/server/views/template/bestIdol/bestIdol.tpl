
<%
    // 最佳偶像
    // role: 渲染角色类型下标
    // index: 渲染条目起始下标
    // data: 最佳偶像数据
    // isFirst: 是否是第一次渲染
    var roles = ['人气担当', '才艺担当', '智慧担当', '气质担当', '颜值担当']
%>

    <ul class="leaderboard_2" id="leaderboard_best_idol_ul">
        <% if(data.vRankList[role] && data.vRankList[role].vRank && data.vRankList[role].vRank.length > 0) {
                var data = data.vRankList[role].vRank;
                var len = (data.length) < (index + 10) ? (data.length): (index + 10); 
                for(var i = index; i < len; i++) {
                var sLogoUrl = data[i].sLogoUrl.replace("http://", "//");
        %>
        <li>
            <% if(i < 3) { %>
                <div class="list list<%= i + 1 %>"><%= i + 1 %></div>
            <% } else { %>
                <div class="list"><%= i + 1 %></div>
            <% } %>
            <div class="left">
                <div class="head_wrap">
                    <a href="<%= 'https://www.huya.com/' + data[i].tJump.iRoomId %>" target="_blank">
                        <img src="<%= sLogoUrl %>" class="head_pic" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
                    </a>
                <% if((data[i].tJump.lTid) != 0 && (data[i].tJump.lSid != 0)) { %>
                    <img src="/img/online.png" class="is_online">
                <% } %>
                </div>
                <a href="<%= 'https://www.huya.com/' + data[i].tJump.iRoomId %>" target="_blank">
                    <span class="name"><%= data[i].sName %></span>
                </a>
            </div>
            <div class="right">
                     <% if(data[i].sUnionName != "") { %>
                        <div class="col_1"><%= data[i].sUnionName %></div>
                     <% }  else { %>
                        <div class="col_1 no_league">暂未加入任何联盟</div>
                     <% } %>      
                    <div class="col_2"><%= data[i].iScore %></div>									
            </div>
        </li>
        <% }} else { %>
            <img class="best_idol_none" src="/img/board_none.png"> 
        <% } %>
    </ul> 
    <% if(isFirst == true) { %>
        <div class="page" id="page_best_idol"></div>
    <% } %>    

