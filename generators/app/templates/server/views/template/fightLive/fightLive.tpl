<%
    // 对决实况
    // data: 对决实况数据
    var roles = ['yanzhi', 'popularity', 'wisdom', 'temperament', 'talent'];
    var mainLeft = []; // 左边主战的队员
    var mainRight = []; // 右边主战队员
    console.log(data);

    if(data.vList && data.vList.length > 0) {
        for(var i = 0; i < data.vList.length; i++) {
            for(var j = 0; j < data.vList[i].tAtkUnionInfo.vMember.length; j++) {
                if(data.vList[i].tAtkUnionInfo.vMember[j].iPKMain == 1) {
                    mainLeft.push(data.vList[i].tAtkUnionInfo.vMember[j]);
                    break;
                }
            }
        }
        for(var i = 0; i < data.vList.length; i++) {
            for(var j = 0; j < data.vList[i].tDefUnionInfo.vMember.length; j++) {
                if(data.vList[i].tDefUnionInfo.vMember[j].iPKMain == 1) {
                    mainRight.push(data.vList[i].tDefUnionInfo.vMember[j]);
                    break;
                }
            }
        }
    }
    
%>


    <div class="top">
        联盟对决实况<span>展现对决双方当前收获的[赞]数量总和排名前三的对决实况</span>
    </div>
    <div class="bottom">
        <ul>
           <% 
             if(data.vList  && (data.vList.length > 0)) {
              for(var i = 0; i < data.vList.length; i++) { 
           %> 
            <li>
                <div class="ul_top">
                    <div class="<%= roles[data.vList[i].iRoleType] %>"></div>
                </div>
                <div class="ul_center">
                        <% if(data.vList[i].tAtkUnionInfo.iUnionId != 0) { %>
                            <div class="<%= 'left atk fight_live_list fight_live' + i %>" > 
                        <% } else {%>                      
                            <div class="left">
                        <% } %>        
                        <div class="ul_center_top">
                            <% if(data.vList[i].tAtkUnionInfo.iUnionId != 0) { %>
                                <img src="/img/meng.png" class="meng">
                                <p class="name"><%= data.vList[i].tAtkUnionInfo.sUnionName %></p>
                            <% } else { %>
                                <p class="name"></p>
                            <% } %>    
                        </div>
                        <div class="ul_center_bottom">
                          <a href="<%= 'https://www.huya.com/' + mainLeft[i].tJump.iRoomId %>" target="_blank">
                            <% if(mainLeft[i].sLogoUrl) {
                                var mainLeftLogoUrl = mainLeft[i].sLogoUrl.replace("http://", "//"); 
                            } else {
                                var mainLeftLogoUrl = "";
                            }
                            %>
                            <img src="<%= mainLeftLogoUrl %>" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
                          </a>
                          <a href="<%= 'https://www.huya.com/' + mainLeft[i].tJump.iRoomId %>" target="_blank">
                            <p class="name"><%=  mainLeft[i].sNickName %></p>
                          </a>
                        </div>
                    </div>
                    <% if(data.vList[i].tDefUnionInfo.iUnionId != 0) { %>
                        <div class="<%= 'right def fight_live_list fight_live' + i %>" >
                    <% } else { %>
                        <div class="right">
                    <% } %>       
                         <div class="ul_center_top">
                            <% if(data.vList[i].tDefUnionInfo.iUnionId != 0) { %>
                                <img src="/img/meng.png" class="meng">
                                <p class="name"><%= data.vList[i].tDefUnionInfo.sUnionName %></p>
                            <% } else { %>
                                <p class="name"></p>
                            <% } %>    
                        </div>
                        <div class="ul_center_bottom">
                                <a href="<%= 'https://www.huya.com/' + mainRight[i].tJump.iRoomId %>" target="_blank">
                                    <% if(mainRight[i].sLogoUrl) {
                                        var mainRightLogoUrl = mainRight[i].sLogoUrl.replace("http://", "//"); 
                                    } else {
                                        var mainRightLogoUrl = "";
                                    }
                                    %>
                                    <img src="<%= mainRightLogoUrl %>" onerror="this.onerror=null;this.src='//hd.huya.com/201804lottery/img/avatar_default.png'">
                                </a>
                                <a href="<%= 'https://www.huya.com/' + mainRight[i].tJump.iRoomId %>" target="_blank">
                                  <p class="name"><%=  mainRight[i].sNickName %></p>
                                </a>
                        </div>
                    </div>
                </div>
                <div class="ul_bottom fight_live_ul_bottom">
                    <div class="ul_bottom_left">
                        <img src="/img/like.png">                       
                    </div>
                    <div class="ul_bottom_right">
                        <img src="/img/like.png">                  
                    </div>
                    <div class="score_panel">
                        <span class="score_left"><%= data.vList[i].tAtkUnionInfo.iScore %></span>
                        <span class="score_right"><%= data.vList[i].tDefUnionInfo.iScore %></span>
                    </div>
                </div>
            </li>
            <% }} else { %>
                <img class="fight_live_none" src="/img/live_none.png">
            <% } %>
        </ul>
    </div>
