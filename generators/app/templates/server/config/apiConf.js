/**
 * @author kekobin@163.com
 *
 * @file 项目配置：页面对应的服务端api接口
 * @param page -> 页面名称：对应路由和html
 * @param urls -> 页面需要的服务端接口，形式如下
 * 	 {
 *		 "name": "", //api名称，在模版中对请求结果的引用
 *		 "url":""
 *	 }
 * @param cache -> 是否需要缓存接口数据 
 * 	 cache:true -> 页面路由为/201805activity/index
 * 	 cache:false -> 页面路由为/live/201805activity/index
 * 	 (注:开发模式下，cache无论是多少统一访问/201805activity/index)
 */

module.exports = {
	"201805activity": {
		"pages": [{
			"page": "index",
			"urls": [{
					"name": "god",
					"url": 'https://activity.huya.com/idolunion/index.php?m=IdolUnion&do=getWarGodLive'
				},
				{
					"name": "bestLeague",
					"url": 'https://activity.huya.com/idolunion/cache.php?m=IdolUnion&do=getBestUnionRank'
				},
				{
					"name": "bestIdol",
					"url": 'https://activity.huya.com/idolunion/cache.php?m=IdolUnion&do=getBestIdolRank'
				},
				{
					"name": "fightLive",
					"url": 'https://activity.huya.com/idolunion/cache.php?m=IdolUnion&do=getPKLive'
				},
				{
					"name": "news",
					"url": 'https://activity.huya.com/idolunion/cache.php?m=IdolUnion&do=getWarInfo'
				},
			],
			"cache": false,
			"persist": false
		}]
	}
}