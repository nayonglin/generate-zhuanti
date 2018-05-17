var util = {
	APP: 'axletree-demo',
	VERSION: '1.0.0'
};

var loger = {
	log: function (tip, data, outputJson) {
		console.log('%c[YS-LOG-' + tip + ':]%c', this.logcss("#009100"), null, data);
	},
	logcss(color) {
		return "color:" + color + ";font-weight:900"; 
	}
}
module.exports.util = util;
module.exports.log = loger;