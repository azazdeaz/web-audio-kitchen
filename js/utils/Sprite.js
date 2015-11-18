define(["utils/MouseEvent", "utils/PubSub"], function (ME, PubSub) {
	var idCounter = 0;
	
	function Sprite (canvas){
		this.init(canvas);
	}
	var p = Sprite.prototype;
	
	p.init = function (canvas) {
		this.id = idCounter++;
		this.x = 0; 
		this.y = 0; 
		this.w = 0;
		this.h = 0;
		this.par = undefined; 
		this.stage = undefined; 
		this.canvas = canvas;
		this.mouseEnabled = true;
		this.ps = new PubSub();
		this.name = "inst_" + this.id;
		this.hitRect = undefined;
		this.maskRect = undefined;
		this.visible = true;
		this.alpha = 1;
		this.draggable = false;
		
		this.__onMouseOver = false;
		this.__onMouseDown = false;
		this.__dl = [];
	};
		
	p.autoWH = function (setHitRect) {
		var minX, minY, maxX, maxY;
		if(this.canvas) {
			minX = minY = 0;
			maxX = this.canvas.width;
			maxY = this.canvas.height;
		}
		for(var i in this.__dl) {
			var s = this.__dl[i];
			if(minX === undefined || s.x < minX) minX = s.x;
			if(minY === undefined || s.y < minY) minY = s.y;
			if(maxX === undefined || s.x + s.w > maxX) maxX = s.x + s.w;
			if(maxY === undefined || s.y + s.h > maxY) maxY = s.y + s.h;
		}
		this.w = maxX - minX || 0;
		this.h = maxY - minY || 0;
		
		if(setHitRect) this.setHitRect(minX, minY, this.w, this.h);
	};
	
	p.add = function(sprite, idx) {
		if(!(sprite instanceof Sprite)) {
			throw(new TypeError(sprite+" is not Sprite!"));
		}
		function checkCircRef(s){
			var i = 0; 
			var child;
			while(child = s.getChildAt(i++)) {
				if(child === this) {
					throw (new Error("Circular reference error:\n"+
						sprite.logHierarchy()+" add to '"+this.name+"'"));
				}
				checkCircRef(child);
			}
		};
		if (sprite.par) sprite.par.remove(sprite);
		checkCircRef(sprite)
		
		
		if (idx === undefined || 
			idx > this.__dl.length) idx = this.__dl.length;
		else if (idx < 0) idx = 0;
		
		this.__dl.splice(idx, 0, sprite);
		sprite.par = this;
		sprite._setStage(this.stage || this);
		this.change();
	};
    
	p.remove = function(sprite) {
		var idx = this.__dl.indexOf(sprite);
		if(idx >= 0) {
			this.__dl.splice(idx, 1)
			sprite.par = undefined;
			sprite._setStage(undefined);
			this.change();
		}
	};
    
	p.getChildAt = function(idx) {
		return idx >= 0 && idx < this.__dl.length ? this.__dl[idx] : undefined;
	};
    
	p.getNumChildren = function() {
		return this.__dl.length;
	};
    
	p.draw = function(ctx) {
		if(!ctx) return;
		
		if(this.onDraw) this.onDraw(ctx);
		try{if(this.canvas) ctx.drawImage(this.canvas, 0, 0);}
		catch(e){//canvas width or height equal to zero
		}
		
		var i = 0;
		var s;
		while(s = this.__dl[i++]) {
			if(!s.visible) continue;
			ctx.save();
			if(s.alpha !== 1) {
				ctx.globalAlpha *= s.alpha;
			}
			if(this.maskRect) {
				ctx.beginPath();
				ctx.rect(this.maskRect.x, this.maskRect.y, this.maskRect.w, this.maskRect.h);
				ctx.clip();
			}
			ctx.translate(~~s.x, ~~s.y);
			s.draw(ctx);
			ctx.restore();
		}
	};
    
	p.setHitRect = function(x, y, w, h) {
		this.hitRect = {x:x, y:y, w:w, h:h};
	};
    
	p.setMaskRect = function(x, y, w, h) {
		this.maskRect = {x:x, y:y, w:w, h:h};
	};
    
	p.change = function(){
		if(this.par) this.par.change();
	};
    
	p.givMouseEvt = function(e){
		var i = this.__dl.length;
		var s;
		var loc = e.getLocal(this);
		var catcher;
		var clicked = false;
		
		if(!this.__onMouseOver) {
			var evt = e.clone(e.isDragEvt ? ME.DRAG_OVER : ME.MOUSE_OVER);
			this.__onMouseOver = true;
			this.ps.pub(evt.type, evt)
		}
		if(e.type === ME.MOUSE_DOWN) {
			this.__onMouseDown = true;
		}
		else if(e.type === ME.MOUSE_UP && this.__onMouseDown) {
			this.__onMouseDown = false;
			clicked = true;
		}
		else if(this.draggable && e.type === ME.MOUSE_MOVE && this.__onMouseDown) {
			var evt = e.clone(ME.DRAG_START);
			this.__onMouseDown = false;
			this.bubbleMouseEvt(evt);
			return;
		}
		
		while (s = this.__dl[--i]) {
			if(!s.mouseEnabled) continue;
			var hr = s.hitRect;
			if (!catcher && 
				(hr === undefined || hr.w === undefined || hr.h === undefined || (
				hr.x + s.x < loc.x && hr.x + s.x + hr.w > loc.x &&
				hr.y + s.y < loc.y && hr.y + s.y + hr.h > loc.y)))
			{
				catcher = s;
			}
			else if(s.__onMouseOver) {
				var evt = e.clone(e.isDragEvt ? ME.DRAG_OUT : ME.MOUSE_OUT);
				turnOffMouseOver(s, evt);
				s.__onMouseDown = false;
			}
		}
		if(clicked && (!catcher || !catcher.__onMouseDown)) {
			var evt = e.clone(ME.CLICK);
			this.bubbleMouseEvt(evt);
		}
		if(catcher) {
			catcher.givMouseEvt(e);
		} else {
			this.bubbleMouseEvt(e);
		}
		
		function turnOffMouseOver(s, e){
			for(var i in s.__dl) {
				if(s.__dl[i].__onMouseOver) {
					turnOffMouseOver(s.__dl[i], e);
				}
			}
			s.__onMouseOver = false;
			s.ps.pub(e.type, e);
		}
	};
    
	p.bubbleMouseEvt = function(e){
		// if(window.fndejgnsi !== e.type) { 
			// console.log(this.name+": "+e.type);
			// window.fndejgnsi = e.type
		// }
		if(this.ps.pub(e.type, e) !== false && this.par) {//if propagation is not stopped and have parent
			this.par.bubbleMouseEvt(e);
		}
	};
    
	p._setStage = function(stage, ddd){
		this.stage = stage;
		for(var i in this.__dl) {
			this.__dl[i]._setStage(stage);
		}
	};
    
	p.destroy = function(){
		for(var i in this) {
			delete this[i];
		}
	};
    
	p.logHierarchy = function(silent){
		var ret = "";
		log(this, 0);
		if(!silent) console.log(ret);
		return ret;
		
		function log(s, deep){
			for(var d = 0; d < deep; ++d) ret += "\t";
			ret += s.name+"("+s.x+"/"+s.y+", "+s.w+"*"+s.h+")";
			if(s.hitRect && s.mouseEnabled) ret +="hit x:"+s.hitRect.x+" y:"+s.hitRect.y+" w:"+s.hitRect.w+" h:"+s.hitRect.h;
			if(!s.mouseEnabled) ret += "mouseEnabled: false";
			ret += "\n";
			for(var i = 0, l = s.getNumChildren(); i < l; ++i) {
				log(s.getChildAt(i), deep+1);
			}
		}
	};
    
	p.setToStage = function(){
		var canvas = this.canvas;
		var ctx = canvas.getContext("2d");
		var update = false;
		var self = this;
		this.change = function(){
			if(!update){
				update = true;
				window.requestAnimationFrame(function(){
					update = false;
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					self.draw(ctx);
				})
			}
		}
		
		// $(ctx.canvas).on("click", onMouseEvt);
		$(ctx.canvas).on("mousedown", onMouseEvt);
		$(ctx.canvas).on("mouseup", onMouseEvt);
		$(ctx.canvas).on("mousemove", onMouseEvt);
		
		$(ctx.canvas).on("mouseleave", function(e){self.ps.pub(ME.MOUSE_LEAVE)});
		
		this.ps.sub(ME.DRAG_START, function(){
			ME.setOnDrag(true);
		});
		this.ps.sub(ME.MOUSE_DROP, ME.setOnDrag);
		this.ps.sub(ME.MOUSE_LEAVE, ME.setOnDrag);
		function onMouseEvt(e){
			var type = e.type;
			if(ME.getOnDrag()) {
				if(type === ME.MOUSE_MOVE) type = ME.DRAG_MOVE;
				else if(type === ME.MOUSE_UP) type = ME.DRAG_END;
			}
			var evt = new ME(type, e.offsetX, e.offsetY);
			self.givMouseEvt(evt);
			if(type === ME.DRAG_END) ME.setOnDrag(false);
		}
	};
    
    return Sprite;
});

