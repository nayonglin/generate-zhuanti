

<% 
    // 确认框
    // title: 弹框标题
    // text: 弹框内容
    // type: 绑定对应事件的class
%>

<div class="cover"></div>
<div class="pop_confirm on">
    <div class="top"><%= title %><div class="close"></div></div>
    <div class="bottom">
        <div class="bottom_top">
           <img src="/img/logo6.png">
        </div>
        <div class="bottom_center">
          <p>
             <%= text %><span></span><br>
          </p> 
        </div>
        <div class="bottom_bottom">
            <a href="javascript:void(0);" class="<%= 'ensure_btn' + type %>">确认</a>
            <a href="javascript:void(0);" class="cancel_btn">我再想想</a>
        </div>
    </div>
</div>