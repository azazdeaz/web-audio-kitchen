define(["ack/gui/gui", "ack/gui/GuiItem", "utils/utils", "utils/Sprite"], 
    function (gui, GuiItem, utils, Sprite) {
        "use strict";

	function Separator(w, h){
        p.Super.apply(this, arguments);
        
        w = w || gui.c.defaultItemW;
		h = h || 1;
		this.sprite = new Sprite();
		this.sprite.mouseEnabled = false;
		this.sprite.name = "Separator";
		this.sprite.ctx = utils.createCtx(w, h);
		this.sprite.canvas = this.sprite.ctx.canvas;
		this.sprite.spaces = {up:7, down:7};
		
		this.sprite.ctx.strokeStyle = gui.c.colors.black;
		this.sprite.ctx.beginPath();
		this.sprite.ctx.moveTo(0, .5);
		this.sprite.ctx.lineTo(w, .5);
		this.sprite.ctx.stroke();
		this.sprite.ctx.closePath();
		
		this.sprite.autoWH();
	}
	var p = utils.inherit(Separator, GuiItem);
    
	return Separator;
});