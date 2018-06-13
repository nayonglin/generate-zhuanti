var util = {
	loger: {
		log: function (tip, data, outputJson) {
			console.log('%c[LOG-' + tip + ':]%c', util.loger.logcss("#009100"), null, data);
		},
		logcss: function (color) {
			return "color:" + color + ";font-weight:900"; 
		}
	},
	ajax: function (url, data, success, uid) {  // jsonp请求
        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: data,
            cache: true,
            jsonpCallback: uid,
            success: success
        })
    }
};


module.exports = util;

