define(["utils/PubSub", "ack/gui/gui", "ack/gui/GuiItem", "utils/utils", 
    "ack/gui/Label", "utils/Sprite"], 
    function (PubSub, gui, GuiItem, utils, 
        Label, Sprite) {
        "use strict";
        
	var CheckBox = function(name){
		this.init(name);
        
        this.ps = new PubSub();
		this.sprite = new Sprite();
		this.sprite.name = "CheckBox_"+name;
		
		this.rect = new Sprite();
		this.rect.ctx = utils.createCtx(this.boxSize, this.boxSize);
		this.rect.canvas = this.rect.ctx.canvas;
		this.rect.autoWH(true);
		
		this.nameLabel = new Label(name, {yOffset:14});
		this.nameLabel.sprite.x = this.boxSize + 4;
		this.nameLabel.sprite.y = (this.boxSize - this.nameLabel.sprite.h) / 2;
		
		this.sprite.ps.sub("mousedown", this.onClick, this);
		this.sprite.add(this.rect);
		this.sprite.add(this.nameLabel.sprite);
		this.sprite.autoWH(true);
		
		this.onMouseOver = false;
		this.sprite.ps.sub("mouseover", this.__onRoll, this);
		this.sprite.ps.sub("mouseout", this.__onRoll, this);
		
		this.priv_checked = false;
		this.checked = false;
	}
	var p = utils.inherit(CheckBox, GuiItem);
    
	p.boxSize = 20;
    
	Object.defineProperty(p, "checked", {
		get: function(){ return this.priv_checked; },
		set: function(on){ 
			this.priv_checked = Boolean(on);
			this.render();
		},
		enumerable: true
	});
    
	p.render = function() {
		gui.u.drawRect(this.rect.ctx, 0, 0, this.boxSize, this.boxSize, gui.c.colors.black);
		
		if(this.checked) this.rect.ctx.fillStyle = gui.c.colors.pink;
		else if(this.onMouseOver) this.rect.ctx.fillStyle = gui.c.colors.white;
		else this.rect.ctx.fillStyle = gui.c.colors.grey1;
		
		this.rect.ctx.fillRect(5, 5, this.boxSize-10, this.boxSize-10);
		this.rect.change();
	};
    
	p.onClick = function(e){
		this.checked = !this.checked;
		this.ps.pub(gui.evt.ON_CHANGE, this.checked);
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
	
	return CheckBox;
});