define(["utils/PubSub", "ack/gui/gui", "ack/gui/GuiItem", "utils/utils", 
    "ack/gui/Button", "utils/Sprite"], 
    function (PubSub, gui, GuiItem, utils,
        Button, Sprite) {
            
        "use strict";
        
	var ComboBox = function(items, style){
        p.Super.apply(this, arguments);
        
		this.priv_items = [];
		this.priv_opened = false;
		this.style = style || {};
		this.style.width = this.style.width || 120;
		this.buttonStyle = utils.clone(gui.c.buttonB);
		
		this.ps = new PubSub();
		this.titleButton = new Button(items && items.length ? items[0] : "Select!", this.buttonStyle);
		this.titleButton.ps.sub(gui.evt.ON_PRESS, function(){
			this.open(!this.priv_opened)},
		this);
		this.sprite = new Sprite();
		this.sprite.name = "ComboBox";
		this.sprite.add(this.titleButton.sprite);
		
		for(var i in items) {
			this.addItem(items[i]);
		}
		this.open(false);
	};
	var p = utils.inherit(ComboBox, GuiItem);
    
	p.addItem = function(itemName){
		var btn = new Button(itemName, this.buttonStyle);
		btn.ps.sub(gui.evt.ON_PRESS, function(name){
			this.select(name);
			this.open(false);
		}, this);
		this.priv_items.push(btn);
		btn.sprite.y = this.priv_items.length * this.buttonStyle.height;
		if(this.priv_opened) this.sprite.add(btn);
	};
    
	p.open = function(on){
		this.priv_opened = Boolean(on);
		this.titleButton.highlight = this.priv_opened;
		for(var i in this.priv_items){
			if(this.priv_opened) {
				this.sprite.add(this.priv_items[i].sprite);
			} else {
				this.sprite.remove(this.priv_items[i].sprite);
			}
		}
		if(this.priv_opened && this.sprite.par) {
			this.sprite.par.add(this.sprite);
		}
		if(this.priv_opened) {
			this.sprite.ps.sub("mouseout", this.__onRollOut, this);
			if(this.sprite.stage) this.sprite.stage.ps.sub("mouseleave", this.__onRollOut, this);
		} else {
			this.sprite.ps.unsub("mouseout", this.__onRollOut, this);
			if(this.sprite.stage) this.sprite.stage.ps.unsub("mouseleave", this.__onRollOut, this);
		}
		this.sprite.autoWH(true);
		if(this.sprite.par) {//hack!
			this.sprite.par.autoWH(true);
			if(this.sprite.par.par) {
				this.sprite.par.par.autoWH(true);
				if(this.sprite.par.par.par) {
					this.sprite.par.par.par.autoWH(true);
				}
			}
		}
		this.sprite.change();
	};
    
	p.__onRollOut = function(e) {
		this.open(false);
	};
    
	p.select = function(id){
		var selected = undefined;
		if(typeof(id) === "string") {
			for(var i in this.priv_items){
				if(this.priv_items[i].text === id) {
					selected = this.priv_items[i];
					break;
				}
			}
		}
		else {
			//TODO: if index number
		}
		if(selected && selected.text !== this.titleButton.text) {
			this.titleButton.text = selected.text;
			this.ps.pub(gui.evt.ON_SELECT, selected.text);
		}
	};
    
	p.getSelection = function(){
		return this.titleButton.text;
	};
	
	return ComboBox;
});