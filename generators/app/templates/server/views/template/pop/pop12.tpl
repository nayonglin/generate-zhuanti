

<% 
// 确认是否退出联盟
// exitNumber: 退出次数
// score: 用户知名度
var decScore = Math.floor(score/4);          
%>

<div class="cover"></div>
<div class="pop10 on">
    <div class="top">退出联盟<div class="close"></div></div>
    <div class="bottom">
        <div class="bottom_top">
           <img src="/img/logo6.png">
        </div>
        <div class="bottom_center">
         <% if(exitNumber > 0) { %>   
             <p>退出联盟将<span>失去1/4的知名度(<%=  decScore %>知名度)</span><br>
                并且退出后没有机会加入其它联盟</p> 
          <% } else if(exitNumber == 0 ) { %>
            <p>退出联盟将<span>失去1/4的知名度(<%= decScore %>知名度)</span><br>
                并且退出后仅有1次加入其它联盟的机会</p> 
          <% } %>
        </div>
        <div class="bottom_bottom">
            <a href="javascript:void(0);" class="ensure_btn ensure_exit_btn">确认</a>
            <a href="javascript:void(0);" class="cancel_btn">我再想想</a>
        </div>
    </div>
</div>