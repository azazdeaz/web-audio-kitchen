define(["utils/Sprite", "ack/gui/gui", "ack/gui/GuiItem", "utils/utils"], 
    function (Sprite, gui, GuiItem, utils) {
        "use strict";
        
	var Label = function(text, style) {
        p.Super.apply(this, arguments);
        
		text = text || "Label";
        
        this.style = style || {};
		this.style.size = this.style.size === undefined ? gui.c.fontSize : this.style.size;
		this.style.color = this.style.color === undefined ? gui.c.fontColor : this.style.color;
		this.style.maxW = this.style.maxW === undefined ? gui.c.defaultItemW : this.style.maxW;
		// this.style.yOffset = this.style.yOffset || gui.c.fontYOffset;
		this.style.xMargin = this.style.xMargin || 0;
		
		this.sprite = new Sprite();
		this.sprite.name = "Label";
		this.sprite.mouseEnabled = false;
		this.sprite.ctx = utils.createCtx(1, 1);
		this.sprite.canvas = this.sprite.ctx.canvas;
		
		this.priv_textFont = (this.style.size || gui.c.fontSize)+" "+gui.c.fontName;
		// this.priv_textColor = this.style.color || gui.c.fontColor;
		// this.priv_yOffset = this.style.yOffset || gui.c.fontYOffset;
		// this.priv_xMargin = this.style.xMargin || 0;
		this.text = text;
	};
	var p = utils.inherit(Label, GuiItem);
    
	Object.defineProperties(p, {
		text: {
			get:function(){return this.priv_text;},
			set:function(t){
				this.priv_text = t + "";
				this.render();
			},
			enumerable: true
		},
		textColor: {
			get:function(){return this.priv_text;},
			set:function(c){
				this.style.color = c;
				this.render();
			},
			enumerable: true
		}
	});
    
	p.render = function(){
		this.sprite.ctx.font = this.priv_textFont;
		var renderText = this.priv_text;
		var m = this.sprite.ctx.measureText(renderText);
		if(this.style.maxW && this.style.maxW < m.width) {
			var maxW = this.style.maxW;
			var shortened = renderText;
			var endTag = "...";
			do {
				shortened = shortened.slice(0, shortened.length-1);
				m = this.sprite.ctx.measureText(shortened + endTag);
			}
			while(maxW < m.width && shortened.length > 0);
			renderText = shortened + endTag;
		}
		this.sprite.canvas.width = m.width+this.style.xMargin*2;
		this.sprite.canvas.height = parseInt(this.style.size)+1;
		this.sprite.autoWH();
		this.sprite.ctx.font = this.priv_textFont;
		this.sprite.ctx.textBaseline = "top";
		// this.sprite.ctx.lineWidth = 3;
		// this.sprite.ctx.strokeStyle = "#ff3311";
		// this.sprite.ctx.strokeRect(.5, .5, this.sprite.canvas.width-1, this.sprite.canvas.height-1); 
		this.sprite.ctx.fillStyle = this.style.color;
		this.sprite.ctx.fillText(renderText, this.style.xMargin, 0);
		this.sprite.autoWH();
		this.sprite.change();
	};
    
	return Label;
    
});