
<%

    // data: 审批列表
    // union: 我的联盟信息，保存在了bus的union中

    function getLocalTime(nS) {
        var date = new Date(parseInt(nS) * 1000),
            time;
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月';
        D = (date.getDate()).toString(); 
        D = (D.length == 2) ? (D + '日 ') : ('0' + D + '日 ');
        h = (date.getHours()).toString();
        h = (h.length == 2) ? (h + ':') : ('0' + h + ':');
        m = ((date.getMinutes()).toString());
        m = (m.length == 2) ? (m + '') : ('0' + m + '');
        s = (date.getSeconds()).toString(); 
        s = (s.length == 2) ? (s) : ('0' + s);
        time = M+D+h+m;
        return time;
    }

    var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
    var numbers = 0; // 队员数量
    
    // 计算队员数量
    if(union.vMember && union.vMember.length > 0) {
        for(var i = 0; i < 5; i++) {
            if(union.vMember[i].tJump.lPid != 0) {
            numbers++;
            }
        }
    }  
%>
<div class="cover"></div>
<div class="pop9 on">
        <div class="top">加盟审批<div class="close"></div></div>
        <div class="center">
                <div class="col_1">当前联盟成员组成(<%= numbers %>/5)：
                        <ul>
                            <%
                            for(var i = 0; i < 5; i++) {
                                for(var j = 0; j < union.vMember.length; j++) {
                                 if(union.vMember[j].iRoleType == i && (union.vMember[j].tJump.lPid != 0)) {   
                            %>
                                <li class="<%= 'type' + (i + 1) + ' active'%>"><%= roles[i] %></li>
                            <% break; }}
                                if(j == 5) {    
                            %>  
                               <li class="<%= 'type' + (i + 1)%>"><%= roles[i] %></li>
                            <% }} %>
                        </ul>
                </div>
        </div>
        <div class="bottom">
            <div class="bottom_top">
                    <ul>
                        <li class="rank">序号</li>
                        <li class="league_name">主播昵称</li>
                        <li class="league_people">偶像类型</li>
                        <li class="reputation">知名度</li>
                        <li class="type">偶像类型排名</li>
                        <li class="time">申请时间</li>
                        <li class="oprate">操作</li>
                    </ul>
            </div>
            <div class="bottom_bottom">
                    <ul class="leaderboard_2">                      
                        <% 
                          if(data.vApplayList && (data.vApplayList.length > 0)){  
                            for(var i = 0; i < data.vApplayList.length; i++) {
                                var sLogoUrl = data.vApplayList[i].tMem.sLogoUrl.replace("http://", "//");
                                var role = parseInt(data.vApplayList[i].tMem.iRoleType);
                                    role = roles[role];
                                var time = getLocalTime(data.vApplayList[i].iApplyTS);    
                        %>
                            <li>
                                <div class="list"><%= i + 1 %></div>
                                <div class="left">
                                   <div class="head_wrap">
                                      <a href="<%= 'https://www.huya.com/' + data.vApplayList[i].tMem.tJump.iRoomId %>" target="_blank">
                                        <img src="<%= sLogoUrl %>" class="head_pic" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
                                      </a>
                                   <% if((data.vApplayList[i].tMem.tJump.lTid) != 0 && (data.vApplayList[i].tMem.tJump.lSid != 0)) { %>
                                      <img src="../img/online.png" class="is_online">
                                   <% } %>
                                   </div>
                                   <a href="<%= 'https://www.huya.com/' + data.vApplayList[i].tMem.tJump.iRoomId %>" target="_blank">
                                      <span class="name"><%= data.vApplayList[i].tMem.sNickName %></span>
                                   </a>                   
                                </div>
                                <div class="right">
                                        <div class="col_1"><%= role %></div>
                                        <div class="col_2"><%= data.vApplayList[i].tMem.iScore %></div>
                                        <% if(data.vApplayList[i].tMem.iRank == 0){
                                              var rank = '999+';
                                            } else {
                                              var rank = data.vApplayList[i].tMem.iRank;
                                            }
                                        %>
                                        <div class="col_3"><%= rank %></div>
                                        <div class="col_4"><%= time %></div>
                                        <div class="col_5">
                                            <% if(data.vApplayList[i].iStatus == 1) { %>
                                            <a href="javascript:void(0);" class="permit_btn" uid="<%= data.vApplayList[i].tMem.tJump.lPid %>">通过</a>
                                            <a href="javascript:void(0);" class="refuse_btn" uid="<%= data.vApplayList[i].tMem.tJump.lPid %>">拒绝</a>
                                            <% } else if(data.vApplayList[i].iStatus == 2) { %>
                                            <a href="javascript:void(0);" class="permited_btn">已通过</a>
                                            <% } else if(data.vApplayList[i].iStatus == 3) { %>
                                            <a href="javascript:void(0);" class="refused_btn">已拒绝</a>
                                            <% } else if(data.vApplayList[i].iStatus == 5) { %>
                                            <a href="javascript:void(0);" class="refused_btn">已被踢出</a>
                                            <% } %>
                                        </div>
                                </div>
                            </li>
                        <% }} else { %>
                            <img class="approval_none" src="../img/approval_none.png">
                         <% } %>
                    </ul> 
            </div>
        </div>
</div>