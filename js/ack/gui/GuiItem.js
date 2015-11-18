define(function () {
        "use strict";
        
	function GuiItem(){
		this.init();
	};
    var p = GuiItem.prototype;
    
	p.init = function() {};
	p.destroy = function(){};
    
    return GuiItem;
});