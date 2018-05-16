<%
    // 对决战报
    // data: 对决战报数据 
    function getLocalTime(nS) {
        var date = new Date(parseInt(nS) * 1000),
            time;
        Y = date.getFullYear() + '年';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
        D = (date.getDate()).toString(); 
        D = (D.length == 2) ? (D + ' ') : ('0' + D + ' ');
        h = (date.getHours()).toString();
        h = (h.length == 2) ? (h + ':') : ('0' + h + ':');
        m = ((date.getMinutes()).toString());
        m = (m.length == 2) ? (m + ':') : ('0' + m + ':');
        s = (date.getSeconds()).toString(); 
        s = (s.length == 2) ? (s) : ('0' + s);
        time = Y+M+D+h+m+s;
        return time;
    }
    var rolesClass = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];
    var roles = ['颜值对决', '人气对决', '智慧对决', '气质对决', '才艺对决'];
%>

<div class="top">对决战报</div>
<div class="bottom live_bottom_bottom">
    <ul class="news">
      <%
        if(data.vList && (data.vList.length > 0)) {
          for(var i = 0; i < data.vList.length; i++) {
              var time = getLocalTime(data.vList[i].lTS);  
      %>
        <li class="news_item">
            <span class="time"><%= time %></span>
            <span class="<%= rolesClass[data.vList[i].iRoleType] %>"><%= roles[data.vList[i].iRoleType] %></span>
            <% var sLogoUrl = data.vList[i].tAttack.sLogoUrl.replace("http://", "//");%>
            <div class="head_wrap">
                <a href="<%= 'https://www.huya.com/' + data.vList[i].tAttack.tJump.iRoomId %>" target="_blank">
                <img src="<%= sLogoUrl %>" class="head_pic" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
                </a>
            <% if((data.vList[i].tAttack.tJump.lTid != 0) && (data.vList[i].tAttack.tJump.lSid != 0)) {  %>
                <img src="../img/online.png" class="is_online">
            <% } %>
            </div>
            <div class="name_and_meng">
                <a href="<%= 'https://www.huya.com/' + data.vList[i].tAttack.tJump.iRoomId %>" target="_blank">
                    <span class="name" title="<%= data.vList[i].tAttack.sNickName %>"><%= data.vList[i].tAttack.sNickName %></span>
                </a>
                <% if(data.vList[i].tAttack.iUnionId != 0) { %>
                <img src="/img/meng.png" class="meng">
                <% } %>
            </div>
            &nbsp;挑战&nbsp;&nbsp;
            <% var sLogoUrl = data.vList[i].tGuard.sLogoUrl.replace("http://", "//"); %>
            <div class="head_wrap">
                <a href="<%= 'https://www.huya.com/' + data.vList[i].tGuard.tJump.iRoomId %>" target="_blank">
                  <img src="<%= sLogoUrl %>" class="head_pic" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
                </a>
            <% if((data.vList[i].tGuard.tJump.lTid != 0) && (data.vList[i].tGuard.tJump.lSid != 0)) { %>
                <img src="../img/online.png" class="is_online">
            <% } %>
            </div>
            <a href="<%= 'https://www.huya.com/' + data.vList[i].tGuard.tJump.iRoomId %>" target="_blank">
                <span class="name" title="<%= data.vList[i].tGuard.sNickName %>"><%= data.vList[i].tGuard.sNickName %></span>
            </a>
            <% if(data.vList[i].tGuard.iUnionId != 0) { %>
                <img src="/img/meng.png" >
            <% } %>
            <% if(data.vList[i].iWinFlag == 1) {%>
             ， 大获全胜，知名度 <span class="score">+<%= data.vList[i].iScoreChg %></span>
            <% } else if(data.vList[i].iWinFlag == 2){ %> 
             ， 打成平手，知名度不变  
            <% } else {%> 
             ， 不幸落败，知名度不变
            <% } %>
        </li>
        <% }} else { %>
          <img class="news_none" src="../img/news_none.png">
        <% } %>
    </ul>
</div>