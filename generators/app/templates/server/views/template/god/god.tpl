<%
    // 战神榜
    // data: 战神榜数据
    // isLogin： 是否登录

    function getCountDown(time) {
        var str = '';
        var minuts = Math.floor(time/60);
        var seconds = time%60;
            str = str + minuts + "分" + seconds + "秒"
        return str;
    }

    var time = getCountDown(data.iNextCountDown);
%>

<div class="top">
        战神争夺实况<span><span id="god_count_down"><%= time %></span>后榜首用户可成为战神，获得战神挂件+入场横幅</span>
    </div>
    <div class="bottom">
      <div class="bottom_bottom">
          <% if(data.tCurGod && data.tCurGod.lUid != 0) {
              var sLogoUrl = data.tCurGod.sLogoUrl.replace("http://", "//");
          %>
            <div class="left">
                <img src="/img/god.png" class="god_cover">
                <img src="<%= sLogoUrl %>" class="head_pic"  onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
            </div>
            <div class="right">
                <span class="name"><%= data.tCurGod.sName %></span>
                <% 
                   if(data.vRank[0]) { 
                    if(data.tCurGod.lUid != data.vRank[0].lUid) {
                %>
                    战神之位恐怕要不保啦，要加油哦！
                <% } else {%>
                    战神之位暂时无人撼动！
                <% }} else { %>
                     战神之位暂时无人撼动！
                <% } %>
            </div>
            <% } else {%>
                <div class="left">
                    <img src="/img/god.png" class="god_cover">
                    <img src="//hd.huya.com/201804lottery/img/avatar_default.png" class="head_pic">
                </div>
                <div class="right">
                    <span class="name">虚位以待</span>
                </div>
            <% } %>   
        </div>
        <div class="bottom_center">
            <div class="center_top">
                <ul>
                    <li class="rank">排名</li>
                    <li class="league_name">用户昵称</li>
                    <li class="like_number">PK贡献"赞"数</li>
                </ul>
            </div>
            <div class="center_bottom">
                <ul class="leaderboard_2">
                    <% 
                       if(data.vRank && (data.vRank.length > 0)) {
                        for(var i = 0; i < data.vRank.length; i++) {
                            var sLogoUrl = data.vRank[i].sLogoUrl.replace("http://", "//");
                    %>
                    <li>
                        <% if(i < 3) { %>
                          <div class="list list<%= i + 1 %>"><%= i + 1 %></div>
                        <% } else { %>
                         <div class="list"><%= i + 1 %></div>
                        <% } %>
                        <div class="left">
                            <div class="head_wrap">
                                <div class="head">
                                    <img src="<%= sLogoUrl %>" class="head_pic"  onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
                                </div>
                            </div>
                                <span class="name"><%= data.vRank[i].sName %></span> 
                                <% if(data.vRank[i].sDeroUrl != "") {
                                    var sDeroUrl = data.vRank[i].sDeroUrl.replace("http://", "//");
                                    sDeroUrl = sDeroUrl.replace(".png", "_3.png");    
                                %>
                                <img src="<%= sDeroUrl %>" class="hero_pic">
                                <% } %>
                        </div>
                        <div class="right">
                                <div class="col_1"><%= data.vRank[i].iScore %></div>									
                        </div>
                    </li>
                    <% }} else { %>
                      <img class="god_none" src="/img/god_none.png">  
                    <% } %>
                </ul> 
            </div>
        </div>
        <% if(data.tMyInfo.lUid == 0) { %>
            <div class="bottom_top">请<a href="javascript:void(0);" class="login_btn">登录</a>后查看你的[赞]贡献排名
            </div>
        <% } else {%>

            <div class="bottom_top">我当前PK贡献"赞"数为
                <span class="my_score"><%= data.tMyInfo.iScore %></span>
                ，排名
                <% if((data.tMyInfo.iRank == 0) || (data.tMyInfo.iRank > 999)) { %>
                    <span class="my_rank">999+</span>
                <% } else { %>
                    <span class="my_rank"><%= data.tMyInfo.iRank %></span>
                <% } %>        
            </div>
        <% } %>
    </div>