define(["utils/PubSub", "ack/gui/gui", "ack/gui/GuiItem", "utils/utils", 
    "ack/gui/Label", "utils/Sprite", "utils/MouseEvent", "ack/Lines", "ack/View"], 
    function (PubSub, gui, GuiItem, utils, 
        Label, Sprite, MouseEvent, Lines, View) {
        "use strict";
        
	var Window = function(name, ackNode, w, h, connectors){
        p.Super.apply(this, arguments);
		
        this.ps = new PubSub();
		this.sprite = new Sprite();
		this.sprite.name = "Window";
		this.sprite.ctx = utils.createCtx(w||gui.c.windowWidth, h||420);
		this.sprite.canvas = this.sprite.ctx.canvas;
		this.ackNode = ackNode;
		this.inputs = [];
		this.outputs = [];
		this.connectorDist = 23;
		this.__showCloseBtn = true;
		this.__showInfoBtn = true;
		
		this.metrics = {
			x: 0, 
			y: 0, 
			w: this.sprite.canvas.width,
			h: this.sprite.canvas.height,
			headerH: 24,
			connectors: {}
		};
		
		if(connectors) {
			var i, btn, dist = 30;
			for(i = 0; i < connectors.inputs; ++i) {
				btn = this.createPlugBtn(true, i);
				this.inputs.push(btn);
			}
			for(i = 0; i < connectors.outputs; ++i) {
				btn = this.createPlugBtn(false, i);
				this.outputs.push(btn);
			}
		}
		
		this.header = new Sprite();
		this.header.name = "header";
		this.titleLabel = new Label(name, {
			size: "14px",
			yOffset: 16,
			xMargin: 10,
			color: "#ffffff"
		});
		this.header.add(this.titleLabel.sprite);
		this.header.autoWH(true);
		this.header.ctx = utils.createCtx(1, 1);
		this.header.canvas = this.header.ctx.canvas;
		
		this.closeBtn = new Sprite();
		this.closeBtn.name = "closeBtn";
		this.cBtnLW = 2;
		this.cBtnLL = 6;
		this.closeBtn.ctx = utils.createCtx(this.cBtnLL + this.cBtnLW, this.cBtnLL + this.cBtnLW);
		this.closeBtn.canvas = this.closeBtn.ctx.canvas;
		this.closeBtn.autoWH(true);
		this.closeBtnHL = false;
		this.closeBtn.ps.sub("mouseover", this.rollCloseBtn, this);
		this.closeBtn.ps.sub("mouseout", this.rollCloseBtn, this);
		this.closeBtn.ps.sub("click", this.clickCloseBtn, this);
		this.closeBtn.ps.sub("mousedown", this.mDownCloseBtn, this);
		this.renderCloseBtn();
		
		this.infoBtn = new Sprite();
		this.infoBtn.name = "infoBtn";
		this.infoBtn.ctx = utils.createCtx(this.cBtnLL + this.cBtnLW, this.cBtnLL + this.cBtnLW);
		this.infoBtn.canvas = this.infoBtn.ctx.canvas;
		this.infoBtn.autoWH(true);
		this.infoBtnHL = false;
		this.infoBtn.ps.sub("mouseover", this.rollInfoBtn, this);
		this.infoBtn.ps.sub("mouseout", this.rollInfoBtn, this);
		this.infoBtn.ps.sub("mousedown", this.mDownInfoBtn, this);
		this.renderInfoBtn();
		
		this.container = new Sprite();
		this.container.name = "container";
		
		this.sprite.ps.sub("mousedown", p.onMouseDown, this);
		
		this.resize();
		
		this.sprite.add(this.container);
		this.sprite.add(this.header);
		this.sprite.add(this.closeBtn);
		this.sprite.add(this.infoBtn);
		this.inputs.every(function(s){this.sprite.add(s); return true;}, this);
		this.outputs.every(function(s){this.sprite.add(s); return true;}, this);
		this.sprite.autoWH(true);
		gui.u.drawRect(this.sprite.ctx, 0, 0, this.sprite.w, this.sprite.h, gui.c.windowBgColor);
	};
	var p = utils.inherit(Window, GuiItem);
    
	p.resize = function(w, h) {
		w = w || this.sprite.canvas.width;
		h = h || this.sprite.canvas.height;
		this.sprite.canvas.width = this.metrics.w = ~~w;
		this.sprite.canvas.height = this.metrics.h = ~~h;
		
		var i, btn;
		for(i in this.inputs) {
			btn = this.inputs[i];
			btn.x = -btn.w/2;
			btn.y = this.metrics.headerH + (this.metrics.h - this.metrics.headerH)/2;
			btn.y -= (this.connectorDist*(this.inputs.length-1))/2;
			btn.y += i * this.connectorDist - btn.h/2;
			this.metrics.connectors["in"+i] = {x: btn.x + btn.w/2, y: btn.y + btn.h/2};
		}
		for(i in this.outputs) {
			btn = this.outputs[i];
			btn.x = this.metrics.w - btn.w/2;
			btn.y = this.metrics.headerH + (this.metrics.h - this.metrics.headerH)/2;
			btn.y -= (this.connectorDist*(this.outputs.length-1))/2;
			btn.y += i * this.connectorDist - btn.h/2;
			this.metrics.connectors["out"+i] = {x: btn.x + btn.w/2, y: btn.y + btn.h/2};
		}
		
		this.header.canvas.width = this.metrics.w;
		this.header.canvas.height = this.metrics.headerH;
		gui.u.drawRect(this.header.ctx, 0, 0, this.metrics.w, this.metrics.headerH, gui.c.colors.grey3);
	
		this.titleLabel.sprite.y = (this.metrics.headerH - this.titleLabel.sprite.h) / 2;
		this.closeBtn.x = (this.metrics.w - this.metrics.headerH/2) - this.closeBtn.canvas.width/2;
		this.closeBtn.y = this.metrics.headerH/2 - this.closeBtn.canvas.height/2;
		this.infoBtn.x = (this.metrics.w - this.metrics.headerH/2) - this.infoBtn.canvas.width*.5;
		if(this.showCloseBtn) this.infoBtn.x -= this.infoBtn.canvas.width*1.5;
		this.infoBtn.y = this.metrics.headerH/2 - this.infoBtn.canvas.height/2;
		
		this.container.y = this.metrics.headerH + gui.c.windowMargin;;
		this.container.x = gui.c.windowMargin;
		this.container.w = this.metrics.w -  gui.c.windowMargin * 2;
		this.container.h = this.metrics.h - (this.container.y + gui.c.windowMargin);

		this.sprite.autoWH(true);
		gui.u.drawRect(this.sprite.ctx, 0, 0, this.sprite.w, this.sprite.h, gui.c.windowBgColor);
		this.container.setHitRect(0, 0, this.sprite.w - gui.c.windowMargin*2, this.sprite.h - this.container.y);
	};
    
	p.autoHeight = function(){
		var maxH = (Math.max(this.inputs.length, this.outputs.length)+1) * this.connectorDist;
		function check(s, y) {
			for(var i = 0, l = s.getNumChildren(); i < l; ++i) {
				var c = s.getChildAt(i);
				var h = c.y + (c.h || 0);
				if(maxH < h || !maxH) {
					maxH = y + h;
				}
				check(c, y + c.y);
			}
		}
		check(this.container, 0);
		this.resize(undefined, maxH + this.container.y + gui.c.windowMargin);
	};
    
	Object.defineProperty(p, "showCloseBtn", {
		get:function(){return this.__showCloseBtn;},
		set:function(cb){
			if(this.__showCloseBtn != cb) {
				this.__showCloseBtn = cb;
				this.renderCloseBtn();
			}
		},
		enumerable: true
	});
    
	p.renderCloseBtn = function() {
		this.closeBtn.ctx.clearRect(0, 0, this.closeBtn.ctx.canvas.width, this.closeBtn.ctx.canvas.height);
		if(!this.showCloseBtn) return;
		this.closeBtn.ctx.lineWidth = this.cBtnLW;
		this.closeBtn.ctx.strokeStyle = this.closeBtnHL ? gui.c.colors.white : gui.c.colors.black;
		this.closeBtn.ctx.lineCap = "round";
		this.closeBtn.ctx.beginPath();
		this.closeBtn.ctx.moveTo(this.cBtnLW/2, this.cBtnLW/2);
		this.closeBtn.ctx.lineTo(this.cBtnLL +  this.cBtnLW/2, this.cBtnLL + this.cBtnLW/2);
		this.closeBtn.ctx.moveTo(this.cBtnLL +  this.cBtnLW/2, this.cBtnLW/2);
		this.closeBtn.ctx.lineTo(this.cBtnLW/2, this.cBtnLL +  this.cBtnLW/2);
		this.closeBtn.ctx.stroke();
		this.closeBtn.change();
	};
    
	p.rollCloseBtn = function(e) {
		this.closeBtnHL = Boolean(e.type === "mouseover");
		this.renderCloseBtn();
	};
    
	p.clickCloseBtn = function(e) {
		this.ps.pub(gui.evt.ON_CLOSE);
	};
    
	p.mDownCloseBtn = function(e) {
		return false;
	};
	
	Object.defineProperty(p, "showInfoBtn", {
		get:function(){return this.__showInfoBtn},
		set:function(cb){
            cb = !!cb;
			if(this.__showInfoBtn !== cb) {
				this.__showInfoBtn = cb;
				this.renderInfoBtn();
			}
		},
		enumerable: true
	});
	p.renderInfoBtn = function() {
		this.infoBtn.ctx.clearRect(0, 0, this.infoBtn.ctx.canvas.width, this.infoBtn.ctx.canvas.height);
		if(!this.showInfoBtn) return;
		var fullW = this.cBtnLL +  this.cBtnLW;
		this.infoBtn.ctx.lineWidth = this.cBtnLW;
		this.infoBtn.ctx.strokeStyle = this.infoBtnHL ? gui.c.colors.white : gui.c.colors.black;
		this.infoBtn.ctx.lineCap = "round";
		this.infoBtn.ctx.beginPath();
		this.infoBtn.ctx.moveTo(fullW / 2, this.cBtnLW/2);
		this.infoBtn.ctx.lineTo(fullW / 2, this.cBtnLW/2+.01);
		this.infoBtn.ctx.stroke();
		this.infoBtn.ctx.beginPath();
		this.infoBtn.ctx.moveTo(fullW / 2, fullW * .53);
		this.infoBtn.ctx.lineTo(fullW / 2, fullW - this.cBtnLW/2);
		this.infoBtn.ctx.stroke();
		this.infoBtn.change();
	};
    
	p.rollInfoBtn = function(e) {
		this.infoBtnHL = Boolean(e.type === "mouseover");
		this.renderInfoBtn();
		
        function out(){
            delete MouseEvent.clickLink;
        }
		if(this.infoLink) {
			MouseEvent.clickLink = this.infoLink;
			this.infoBtn.ps.sub("mouseout", out, this);
			this.sprite.stage.ps.sub("mouseleave", out, this);
		}
	};
    
	p.mDownInfoBtn = function(e) {
		return false;
	};
	
	p.onMouseDown = function(e){
		if(this.sprite.par) this.sprite.par.add(this.sprite);
		
		var mdmx = e.x;
		var mdmy = e.y;
		var mdpx = this.sprite.x;
		var mdpy = this.sprite.y;
		this.sprite.stage.ps.sub("mousemove", drag, this);
		this.sprite.stage.ps.sub("mouseup", end, this);
		this.sprite.stage.ps.sub("mouseleave", end, this);
		
		function drag(e) {
			this.setPos(mdpx + (e.x - mdmx), mdpy + (e.y - mdmy));
		}
		
		function end() {
			this.sprite.stage.ps.unsub("mousemove", drag);
			this.sprite.stage.ps.unsub("mouseup", end);
			this.sprite.stage.ps.unsub("mouseleave", end);
		}
	};
    
	p.setPos = function(x, y){
		this.metrics.x = this.sprite.x = x;
		this.metrics.y = this.sprite.y = y;
		this.ps.pub(gui.evt.ON_METRICS_CHANGE);
		this.sprite.change();
	};
    
	p.createPlugBtn = function(isInput, channel){
		channel = channel || 0;
		var aType = isInput ? "input" : "output";
		var bType = isInput ? "output" : "input";
		var plugBtn = new Sprite();
		var btnSize = 12;
		plugBtn.ctx = utils.createCtx(btnSize, btnSize);
		plugBtn.canvas = plugBtn.ctx.canvas;
		plugBtn.autoWH(true);
		plugBtn.ctx.fillStyle = gui.c.colors[aType];
		plugBtn.ctx.fillRect(0, 0, btnSize, btnSize);
		plugBtn.draggable = true;
		plugBtn.ps.sub("mousedown", function(){return false;});
		plugBtn.name = isInput ? "in"+channel : "out"+channel;
		plugBtn.ps.sub(MouseEvent.DRAG_START, function(e){
			Lines.startWiring(this, plugBtn.name);
			e.setDragData({type: aType, ackNode: this.ackNode, conName: plugBtn.name, channel:channel});
		}, this);
		plugBtn.ps.sub(MouseEvent.DRAG_END, function(e){
			var dragData = e.getDragData();
			if(dragData && dragData.type === bType) {
				if(isInput) {
					View.connectAs(this.ackNode, dragData.ackNode, 
						plugBtn.name, dragData.conName,
						channel, dragData.channel);
				} else {
					View.connectAs(dragData.ackNode, this.ackNode, 
						dragData.conName, plugBtn.name,
						dragData.channel, channel);
				}
			}
		}, this);
		// this.sprite.add(plugBtn);
		return plugBtn;
	};
    
	return Window;
});