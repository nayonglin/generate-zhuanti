
<%
    // 对决战报hover
    // data: 对决战报数据
    // index： 要显示的队伍信息下标
    // isAttack: 是否是进攻方

    var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
    var rolesClass = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];
    if(data.vList && data.vList.length > 0) {
        if(isAttack) {
%>
    <div class="top">联盟名称：
        <span class="league_name"><%= data.vList[index].tAtkUnionInfo.sUnionName %></span>
        <span class="attck_or_guard">(挑战方)</span>
    </div>
    <div class="bottom">
        <ul>
            <%
            console.log(data);
                var data = data.vList[index].tAtkUnionInfo.vMember;
                for(var i = 0; i < data.length; i++) {
                    if(data[i].tJump.lPid != 0) {
            %>
            <li>
                <% if(data[i].iPKMain == 1) { %>
                    <span class="is_main">主战：</span>
                <% } else {%>
                    <span class="is_main">助攻：</span>
                <% } %>
                <span class="<%= 'role ' + rolesClass[data[i].iRoleType] %>"><%= roles[data[i].iRoleType] %></span>
                <div class="name_wrap">
                  <a href="<%= 'https://www.huya.com/' + data[i].tJump.iRoomId %>" target="_blank">
                     <span class="name"><%= data[i].sNickName %></span>
                  </a>
                </div>
                &nbsp;&nbsp;赞数量：
                <span class="like_number"><%= data[i].iPKScore %></span>
            </li>
            <% }} %>
        </ul>
    </div>
<%} else { %>
    <div class="top">联盟名称：
            <span class="league_name"><%= data.vList[index].tDefUnionInfo.sUnionName %></span>
            <span class="attck_or_guard">(防守方)</span>
    </div>
    <div class="bottom">
        <ul>
            <%
                var data = data.vList[index].tDefUnionInfo.vMember;
                for(var i = 0; i < data.length; i++) {
                    if(data[i].tJump.lPid != 0) {
            %>
            <li>
                <% if(data[i].iPKMain == 1) { %>
                    <span class="is_main">主战：</span>
                <% } else {%>
                    <span class="is_main">助攻：</span>
                <% } %>
                <span class="<%= 'role ' + rolesClass[data[i].iRoleType] %>"><%= roles[data[i].iRoleType] %></span>
                <div class="name_wrap">
                    <a href="<%= 'https://www.huya.com/' + data[i].tJump.iRoomId %>" target="_blank">
                        <span class="name"><%= data[i].sNickName %></span>
                    </a>
                </div>
                &nbsp;&nbsp;赞数量：
                <span class="like_number"><%= data[i].iPKScore %></span>
            </li>
            <% }} %>
        </ul>
    </div>
<% }} else { console.log('队伍信息为空');}%>

