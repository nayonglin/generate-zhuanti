
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
     iLeaveUNCnt: null, // 退队次数
     isSearched: false, // 是否点击过搜索
     searchInput: '', // 保存搜索输入框输入的值
     myUnionId: null, // 我的联盟uid
     searchUnionResult: null, // 联盟搜索结果
     myUid: null, // 我的uid
     selects: [0, 0, 0, 0, 0],
     union: null, // 我的联盟信息
     role: null, // 当前角色下标
     iScore: null, // 当前分值 
     activeTabIndex: 0, // 当前处于哪个大区，默认为0，按需使用
     curDay: null, // 当前是活动第几天
     outParent: null, // 踢出队员对应项
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
     totalLocation: 0 // 总榜目前渲染的下标 
 }

 module.exports.dataFunc = dataFunc;
 module.exports.bus = bus;
 module.exports.getData = getData;