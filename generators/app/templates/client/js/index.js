//基础库都可以在这里inline进来，不用在页面中手动引入
__inline('lib/jquery');
__inline('lib/underscore');
<% if(isNews == "yes") { %>
__inline('lib/jquery.mousewheel');
<% } %>
// __inline('lib/jquery.jscrollpane');


