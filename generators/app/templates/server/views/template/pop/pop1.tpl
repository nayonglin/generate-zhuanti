
<%
    // 更改角色类型弹框
    // role：当前角色下标
    // iScore: 当前分值
    var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
    var rolesClass = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];
    console.log(role);
%>

<div class="cover"></div>
<div class="pop1 on">
        <div class="top">更改偶像类型<div class="close"></div></div>
        <div class="bottom">
            <div class="bottom_top">
                <div class="idol_type">当前偶像类型：<p class="<%= rolesClass[role] %>"><%= roles[role] %></p></div>
                <div class="reputation">知名度：<p class="score"><%= iScore %></p></div>
            </div>
            <div class="bottom_center">
                <ul>     
                    <% if(role == 0) {
                        var roles = ["颜值担当", "人气担当", "智慧担当", "气质担当", "才艺担当"];
                    %>
                        <li class="type type2"><%= roles[1] %></li>
                        <li class="type type3"><%= roles[2] %></li>
                        <li class="type type4"><%= roles[3] %></li>
                        <li class="type type5"><%= roles[4] %></li>
                    <p>注：更换偶像类型后知名度将清零</p>
                    <% } else if(role == 1 ) {
                        var roles = ["智慧担当"];   
                    %>              
                        <li class="type type3"><%= roles[0] %></li>
                        <p style="padding-top: 60px">注：更换偶像类型后知名度将清零，当前仅可转为智慧担当</p>
                    <% } else if(role == 2 ) {
                        var roles = ["人气担当"];
                     %>
                        <li class="type type2"><%= roles[0] %></li>
                        <p style="padding-top: 60px">注：更换偶像类型后知名度将清零，当前仅可转为人气担当</p>
                    <% } else if(role == 3 ) {
                        var roles = ["才艺担当"];    
                    %>
                        <li class="type type5"><%= roles[0] %></li>
                        <p style="padding-top: 60px">注：更换偶像类型后知名度将清零，当前仅可转为才艺担当</p>
                    <% } else {
                        var roles = ["气质担当"];    
                    %>    
                        <li class="type type4"><%= roles[0] %></li>
                        <p style="padding-top: 60px">注：更换偶像类型后知名度将清零，当前仅可转为气质担当</p>
                    <% } %>
                </ul>
            </div>
            <div class="bottom_bottom">
                <a href="javascript:void(0);" class="ensure_btn ensure_change_role_btn1">确认更改</a>
                <a href="javascript:void(0);" class="cancel_btn">取消</a>
            </div>
        </div>
    </div>