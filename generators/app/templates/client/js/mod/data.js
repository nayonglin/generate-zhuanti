
 var dataFunc = {
     count: 4, // 页面初始所需的ajax数
    //  set: function (key, newData, renderName) {  // 设置数据，并且更新对应视图
    //     key = newData;
    //     render[renderName]();
    //  },
     ajax: function (url, data, success, uid) {
         $.ajax({
             url: url,
             dataType: 'jsonp',
             data: data,
             cache: true,
             jsonpCallback: uid,
             success: success
         })
     },
     done: function (){},
     when: function () {  // 所有必要数据加载完就会执行该方法 
         this.count--;
         if (this.count == 0) {
             this.done();
         }
     },
     initialData: function () { // 进页面获取各种数据
    
        
     }
 }

 // 获取数据的所有接口都写在这里
var getData = {
    isTest: false,
    searchTeam: function (callback, options) { // 获得搜索结果
        this.ajax((getData.isTest ? "http://test." : "https://") + "activity.huya.com/actworldcup/index.php?m=ActWorldCup&do=searchTeam", options, function (res) {  
        callback(res)
        }, "ajax1");
    },
    ajax: function (url, data, success, uid) {
        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: data,
            cache: true,
            jsonpCallback: uid,
            success: success
        })
    }
}


 //公共数据存放
 var bus = {
     searchInput: '', // 保存搜索输入框输入的值
     bestLeague: {
         data: null, // 最强联盟数据
         tab: 0    
     },
     bestIdol: {
        tab: 1,     // 最强联盟现在的tab，其实也就是role类型
        data: null
    },
    page: {      // 页面上的分页组件
        pageBestIdol: null,
        pageBestLeague: null
    },
 }

 module.exports.dataFunc = dataFunc;
 module.exports.bus = bus;
 module.exports.getData = getData;