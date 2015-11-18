define(["jquery"], function ($) {
	var dragData;
	var onDrag = false;
	var me = function MouseEvent(type, x, y) {
		Object.defineProperties(this, {
			type: {value: type, enumerable: true},
			x: {value: x, enumerable: true},
			y: {value: y, enumerable: true},
			isDragEvt: {value: onDrag, enumerable: true},
		});
	}
	me.MOUSE_LEAVE = "mouseleave";
	me.MOUSE_MOVE = "mousemove";
	me.MOUSE_OVER = "mouseover";
	me.MOUSE_OUT = "mouseout";
	me.MOUSE_DOWN = "mousedown";
	me.MOUSE_UP = "mouseup";
	me.CLICK = "click";
	me.DRAG_MOVE = "dragmove";
	me.DRAG_OVER = "dragover";
	me.DRAG_OUT = "drageout";
	me.DRAG_START = "dragstart";
	me.DRAG_END = "dragend";
	
	me.clickLink = undefined;
	$("body").on("click", function(){
		if(me.clickLink){
			window.open(me.clickLink);
			delete me.clickLink;
		}
	});
	
	me.setOnDrag = function(on){
		onDrag = Boolean(on);
	};
    
	me.getOnDrag = function(on){
		return onDrag;
	};
    
	me.prototype.clone = function(type, x, y){
		return new me(
			type === undefined ? this.type : type, 
			x === undefined ? this.x : x, 
			y === undefined ? this.y : y
		);
	};
    
	me.prototype.getLocal = function(p) {
		var x = this.x;
		var y = this.y;
		do {x -= p.x;
			y -= p.y;
		} while(p = p.par);
		return {x: x, y:y};
	};
    
	me.prototype.setDragData = function(data) {
		dragData = data;
	};
    
	me.prototype.getDragData = function() {
		return dragData;
	};
	
    return me;
});