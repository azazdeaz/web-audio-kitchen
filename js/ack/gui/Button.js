define(["utils/PubSub", "ack/gui/gui", "ack/gui/GuiItem", "utils/utils", 
    "ack/gui/Label", "utils/Sprite"], 
    function (PubSub, gui, GuiItem, utils, 
        Label, Sprite) {
        "use strict";
        
	function Button (text, style) {
        p.Super.apply(this, arguments);
        
		this.style = style || gui.c.buttonB;
		this.ps = new PubSub();
		this.sprite = new Sprite();
		this.sprite.name = "Button";
		// this.sprite.draggable = true;
		this.label = new Label(text, {
			color: this.style.fontColorN,
			yOffset: this.style.fontYOffset,
			xMargin: this.style.xMargin,
			size: this.style.fontSize,
			maxW: this.style.width - this.style.xMargin*2 || undefined
		});
		this.sprite.ctx = utils.createCtx(this.style.width || this.label.sprite.w, this.style.height);
		this.sprite.canvas = this.sprite.ctx.canvas;
		this.label.sprite.y = (this.style.height - this.label.sprite.h)/2;
		this.sprite.add(this.label.sprite);
		this.text = text;
		this.sprite.ps.sub("click", this.__onClick, this);
		this.sprite.ps.sub("mousedown", function(){return false;});
		this.sprite.ps.sub("mouseover", this.__onRoll, this);
		this.sprite.ps.sub("mouseout", this.__onRoll, this);
		this.onMouseOver = false;
		this.__highlight = false;
	}
	var p = utils.inherit(Button, GuiItem);
    
	Object.defineProperty(p, "text", {
		get:function(){return this.label.text;},
		set:function(t){
			this.label.text = t;
			this.render();
		},
		enumerable: true
	});
    
	Object.defineProperty(p, "highlight", {
		get:function(){return this.__highlight;},
		set:function(hl){
			if (this.__highlight !== !!hl) {
				this.__highlight = hl;
				this.render();
			}
		},
		enumerable: true
	});
    
	p.render = function(){
		this.sprite.autoWH(true);
		this.sprite.canvas.width = this.sprite.w;
		this.sprite.canvas.height = this.sprite.h;
		var bgColor = 0;
		if (this.__highlight) {
			bgColor = this.style.fillColorH;
			this.label.textColor = this.style.fontColorH;
		} else if(this.onMouseOver) {
			bgColor = this.style.fillColorO;
			this.label.textColor = this.style.fontColorO;
		} else {
			bgColor = this.style.fillColorN;
			this.label.textColor = this.style.fontColorN;
		}
		gui.u.drawRect(this.sprite.ctx, 0, 0, this.sprite.w, this.sprite.h, bgColor);
	};
    
	p.__onClick = function(e) {
		this.ps.pub(gui.evt.ON_PRESS, this.text);
		return false;
	};
    
	p.__onRoll = function(e) {
		if(e.type === "mouseover") {
			this.onMouseOver = true;
			this.render();
		}
		else {
			this.onMouseOver = false;
			this.render();
		}
		this.render();
	};
	
	return Button;
});