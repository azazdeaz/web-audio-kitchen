define (function() {

var utils = {};

utils.setupPrefixedApis = function () {
	var prefs = ["moz", "ms", "o", "webkit"];
	for(var i in prefs) {
		if(!window.audioContext && window[prefs[i]+"AudioContext"]) {
			window.audioContext = window[prefs[i]+"AudioContext"];
		}
		if(!window.requestAnimationFrame && window[prefs[i]+"RequestAnimationFrame"]) {
			window.requestAnimationFrame = window[prefs[i]+"RequestAnimationFrame"];
		}
	}
};

utils.clone = function(obj){
    if(obj === null || typeof(obj) !== 'object') {
        return obj;
    }

    var temp = new obj.constructor();
    for(var key in obj)
        temp[key] = utils.clone(obj[key]);

    return temp;
};

utils.createCtx = function(w, h){
	var canvas = document.createElement("canvas");
	canvas.width = w === undefined ? 300 : w;
	canvas.height = h === undefined ? 250 : h;
	return canvas.getContext("2d");
};

utils.inherit = function (ChildClass, ParentClass) {
    function F() {};
    F.prototype = ParentClass.prototype;
    ChildClass.prototype = new F();
    
    ChildClass.prototype.constructor = ChildClass;
    ChildClass.prototype.Super = ParentClass;
    return ChildClass.prototype;
};

return utils;

});