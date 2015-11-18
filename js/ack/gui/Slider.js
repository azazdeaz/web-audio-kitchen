define(["utils/PubSub", "ack/gui/gui", "ack/gui/GuiItem", "utils/utils", 
    "ack/gui/Label", "utils/Sprite"], 
    function (PubSub, gui, GuiItem, utils,
        Label, Sprite) {
        "use strict";
    
	function Slider (name, min, max, start, tick, unitName){
        p.Super.apply(this, arguments);
		
        this.name = name || "Slider";
		this.min = min === undefined ? 0 : Number(min);
		this.max = max === undefined ? 1 : Number(max);
		this.tick = tick || .1;
		this.unitName = unitName || false;
		this.ps = new PubSub();

		this.titleLabel = new Label(this.name);
		this.valueLabel = new Label(start);
		
		this.lineW = 8;
		this.sliderW = gui.c.defaultItemW - this.lineW;
		this.pointerR = 5.5;
		this.sprite = new Sprite();
		this.sprite.name = "Slider_"+this.name;
		this.sprite.spaces = {up:3, down:3};
		
		this.pointer = new Sprite();
		this.pointer.name = "pointer";
		this.pointer.ctx = utils.createCtx(this.pointerR*2, this.pointerR*2);
		this.pointer.canvas = this.pointer.ctx.canvas;
		this.pointer.autoWH();
		this.pointer.setHitRect(0, 0, this.pointer.w, this.pointer.h);
		this.pointer.ctx.arc(this.pointerR, this.pointerR, this.pointerR, 0, Math.PI*2);
		this.pointer.ctx.fillStyle = gui.c.colors.yellow;
		this.pointer.ctx.fill();
		this.sprite.ps.sub("mousedown", this.startPointerDrag, this);
		
		this.line = new Sprite();
		this.line.name = "line";
		this.line.mouseEnabled = false;
		this.line.y = this.titleLabel.sprite.h + this.pointerR;//~~(gui.c.unit*1.5) - this.lineW/2;
		this.line.ctx = utils.createCtx(this.sliderW + this.lineW, this.lineW);
		this.line.canvas = this.line.ctx.canvas;
		this.line.autoWH(true);
		this.line.ctx.strokeStyle = "#000000";
		this.line.ctx.moveTo(this.lineW/2, this.lineW/2);
		this.line.ctx.lineTo(this.lineW/2 + this.sliderW, this.lineW/2);
		this.line.ctx.lineCap = "round";
		this.line.ctx.lineWidth = this.lineW;
		this.line.ctx.stroke();
		
		this.sprite.add(this.line);
		this.sprite.add(this.pointer);
		this.sprite.add(this.titleLabel.sprite);
		this.sprite.add(this.valueLabel.sprite);
		this.setValue(start);
		this.sprite.autoWH(true);
		// this.sprite.x = (gui.c.defaultItemW - this.sprite.w) / 2;
	};
	var p = utils.inherit(Slider, GuiItem);
    
	p.setValue = function(value){
		value = parseFloat(value || 0);
		if(value < this.min) value = this.min;
		else if(value > this.max) value = this.max;
		var recTick = 1/this.tick;
		value = Math.round(value * recTick) / recTick;
		// if(this.value !== value) {
			this.value = value;
			this.ps.pub(gui.evt.ON_CHANGE, this.value);
			this.render();
		// }
	};
    
	p.setMinMax = function(min, max){
		this.min = min;
		this.max = max;
		this.setValue(this.value);
	};
    
	p.render = function() {
		this.pointer.y = ((this.line.y + this.lineW/2) - this.pointer.h/2);
		this.pointer.x = ((this.value - this.min) / (this.max - this.min)) * this.sliderW;
		this.pointer.x += this.lineW/2;
		this.pointer.x -= this.pointerR;
		var labelText = this.value;
		if(this.unitName) labelText+= " "+this.unitName;
		this.valueLabel.text = labelText;
		this.valueLabel.sprite.x = (this.sliderW + this.lineW) - this.valueLabel.sprite.w;
		this.sprite.change();
	};
    
	p.startPointerDrag = function(e){
		this.sprite.stage.ps.sub("mousemove", drag, this);
		this.sprite.stage.ps.sub("mouseup", end, this);
		this.sprite.stage.ps.sub("mouseleave", end, this);
		drag.call(this, e);
		function drag(e) {
			var loc = e.getLocal(this.sprite);
			this.setValue(this.min + ((this.max-this.min) * (loc.x / this.sliderW)));
			return false;
		}
		function end() {
			this.sprite.stage.ps.unsub("mousemove", drag);
			this.sprite.stage.ps.unsub("mouseup", end);
			this.sprite.stage.ps.unsub("mouseleave", end);
			return false;
		}
		return false;
	};
    
	return Slider; 
});