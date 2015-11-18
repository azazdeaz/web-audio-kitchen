define(["utils/PubSub", "ack/gui/gui", "ack/gui/GuiItem", "utils/utils"], 
    function (PubSub, gui, GuiItem, utils) {
    "use strict";

	function Aligner(way, space){
        p.Super.apply(this, arguments);
        
		this.items = [];
		this.way = way === Aligner.HORISONTAL ? Aligner.HORISONTAL : Aligner.VERTICAL;
		this.space = space || gui.c.baseSpace;
	}
	Object.defineProperties(Aligner, {
		VERTICAL:{value:"vertical"},
		HORISONTAL:{value:"horisontal"}
	});
	var p = utils.inherit(Aligner, GuiItem);
    
	p.add = function(sprite){
		this.items.push(sprite);
		this.align();
	};
    
	p.remove = function(sprite) {
		var idx = this.items.indexOf(sprite);
		if(idx !== -1) {
			this.items.splice(idx, 1);
		}
		this.align();
	};
    
	p.align = function(){
		var pos = 0, item;
		if(this.way === Aligner.HORISONTAL) {
			for(var i in this.items) {
				this.items[i].x = pos;
				pos += this.items[i].w + this.space;
			}
		}
		else {
			for(var i in this.items) {
				item = this.items[i];
				if(item.spaces) pos += item.spaces.up || 0;
				item.y = pos;
				pos += item.h + this.space;
				if(item.spaces) pos += item.spaces.down || 0;
			}
		}
	};
    
	return Aligner;
});