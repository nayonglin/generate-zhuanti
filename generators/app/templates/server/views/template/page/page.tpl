<%
   var pageCount = Math.ceil(data.length / perCount);
     console.log(data.length);
%>

   <% if(data.length > 0) { %>
    <div class="page" id="page_<%= type %>">
            <a href="javascript:void(0);" class="prev_page" id="prev_<%= type %>">上一页</a>
            <a href="javascript:void(0);" class="page_choose page_active page_<%= type %>">1</a>
<%
     for(var i = 2; i <= pageCount; i++ ) {
%>
           
            <a href="javascript:void(0);" class="page_choose page_<%= type %>"><%= i %></a>
<%
     }
%>          
            <a href="javascript:void(0);" class="next_page" id="next_<%= type %>">下一页</a>
    </div>
      <% } else { %>
         <div class="page" id="page_<%= type %>">
      <% } %>