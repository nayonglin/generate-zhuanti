

<% 
    // roleName: 当前要更换角色的名字
    // myRoleName: 当前角色名字


%>

<div class="cover"></div>
<div class="pop2 on">
        <div class="top">更改偶像类型<div class="close"></div></div>
        <div class="bottom">
            <div class="bottom_top">
               <img src="/img/logo6.png">
            </div>
            <div class="bottom_center">
             <p>当前偶像类型为<span><%= myRoleName %></span>,将更改成为<span><%= roleName %></span>，<br>
              更改后知名度清空重计，是否确认更改？</p> 
            </div>
            <div class="bottom_bottom">
                <a href="javascript:void(0);" class="ensure_btn ensure_change_role_btn2">确认</a>
                <a href="javascript:void(0);" class="cancel_btn">我再想想</a>
            </div>
        </div>
    </div>