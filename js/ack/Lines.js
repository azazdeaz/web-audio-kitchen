define (["utils/utils", "ack/ack", "utils/Sprite", "ack/gui/gui", "ack/View",
    "utils/MouseEvent"], 
    function (utils, ack, Sprite, gui, View,
        MouseEvent) {
            
    "use strict";
            
	var l = {};
	var connections = [];
	var newWire;
	l.init = function(){
		delete l.init;
		l.sprite = new Sprite();
		l.sprite.name = "lines";
		l.sprite.ctx = utils.createCtx(ack.w, ack.h);
		l.sprite.canvas = l.sprite.ctx.canvas;
		ack.ps.sub("resize", onResize);
		View.ps.sub(View.ON_NODES_CONNECTED, onNodesConnected);
		View.ps.sub(View.ON_NODES_DISCONNECTED, onNodesDisconnected);
		l.sprite.ps.sub("mousemove", onMMove);
		l.sprite.ps.sub("mouseout", onMOut);
		l.dcBtn = l.dcBtn();
		l.sprite.add(l.dcBtn);
	};
	l.dcBtn = function(){
		var s = new Sprite();
		s.name = "cdBtn";
		var cBtnLW = 3;
		var cBtnLL = 8;
		var cW = cBtnLW + cBtnLL;
		cW = Math.sqrt(cW*cW+cW*cW);
		var space = (cW - (cBtnLW + cBtnLL))/2;
		s.ctx = utils.createCtx(cW, cW);
		s.canvas = s.ctx.canvas;
		s.ps.sub("click", onDcBtnClick);
		s.visible = false;
		s.connectionReg = undefined;
		
		// s.ctx.beginPath();
		// s.ctx.fillStyle = gui.c.colors.pink;
		// var r = (~~cW)/2
		// s.ctx.arc(r, r, r-1, 0, Math.PI*2);
		// s.ctx.closePath();
		// s.ctx.fill();
		
		s.ctx.lineWidth = cBtnLW;
		s.ctx.strokeStyle = gui.c.colors.pink;
		s.ctx.lineCap = "round";
		s.ctx.translate(space, space);
		s.ctx.beginPath();
		s.ctx.moveTo(cBtnLW/2, cBtnLW/2);
		s.ctx.lineTo(cBtnLL +  cBtnLW/2, cBtnLL + cBtnLW/2);
		s.ctx.moveTo(cBtnLL +  cBtnLW/2, cBtnLW/2);
		s.ctx.lineTo(cBtnLW/2, cBtnLL +  cBtnLW/2);
		s.ctx.stroke();
		s.autoWH(true);
		return s;
	};
    
	l.startWiring = function(win, conName){
		newWire = {
			ax: win.metrics.x + win.metrics.connectors[conName].x,
			ay: win.metrics.y + win.metrics.connectors[conName].y,
			bx: l.sprite.stage.mouseX,
			by: l.sprite.stage.mouseY
		};
		l.sprite.stage.ps.sub(MouseEvent.DRAG_MOVE, onMMove);
		l.sprite.stage.ps.sub(MouseEvent.DRAG_END, onMDrop);
		l.sprite.stage.ps.sub(MouseEvent.MOUSE_LEAVE, onMDrop);
		function onMMove(e) {
			newWire.bx = e.x;
			newWire.by = e.y;
			render();
		}
		function onMDrop(e) {
			l.sprite.stage.ps.unsub(MouseEvent.DRAG_MOVE, onMMove);
			l.sprite.stage.ps.unsub(MouseEvent.DRAG_END, onMDrop);
			l.sprite.stage.ps.unsub(MouseEvent.MOUSE_LEAVE, onMDrop);
			newWire = undefined;
			render();
		}
	};
    
	function onResize(e) {
		l.sprite.canvas.width = e.w;
		l.sprite.canvas.height = e.h;
		render();
		l.sprite.change();
	}
	function onNodesConnected(e){
		View.getAckNode(e.id1).win.ps.sub(gui.evt.ON_METRICS_CHANGE, render);
		View.getAckNode(e.id2).win.ps.sub(gui.evt.ON_METRICS_CHANGE, render);
		connections.push(e);
		render();
	}
	function onNodesDisconnected(e){
		connections.every(function(c, i, a) {
			if (c.id1 === e.id1 && c.id2 === e.id2 && 
				c.c1 === e.c1 && c.c2 === e.c2) 
			{
				a.splice(i, 1);
				return false;
			}
			else return true;
		});
		render();
	}
	function onMMove(e){
		var maxDif = 8;
		var found = false
		function unfinity(n) {
			return (n === Number.POSITIVE_INFINITY || n === Number.NEGATIVE_INFINITY) ? 0 : n;
		}
		connections.every(function(con){
			var wm1 = View.getAckNode(con.id1).win.metrics;
			var wm2 = View.getAckNode(con.id2).win.metrics;
			var ax = wm1.x + wm1.connectors[con.c1].x;
			var ay = wm1.y + wm1.connectors[con.c1].y;
			var bx = wm2.x + wm2.connectors[con.c2].x;
			var by = wm2.y + wm2.connectors[con.c2].y;
			if (e.x < Math.min(ax, bx) - maxDif || 
				e.x > Math.max(ax, bx) + maxDif ||
				e.y < Math.min(ay, by) - maxDif ||
				e.y > Math.max(ay, by) + maxDif)
			{ return true; }
			
			var dx = bx - ax;
			var dy = by - ay;
			var mx = e.x - ax;
			var my = e.y - ay;
			var cx = mx - unfinity(my / dy * dx);
			var cy = my - unfinity(mx / dx * dy);
			var c = Math.sqrt(cx*cx + cy*cy);
			var c1 = (c*c - cy*cy + cx*cx) / (2*c);
			var m = Math.sqrt(cx*cx - c1*c1);
			// console.log(m);
			if (Math.abs(m) <= maxDif) 
			{
				var f = Math.sqrt(mx*mx + my*my);
				var g1 = Math.sqrt(f*f - m*m);
				var g = Math.sqrt(dx*dx + dy*dy);
				l.dcBtn.x = (ax + dx * (g1 / g)) - l.dcBtn.w/2;
				l.dcBtn.y = (ay + dy * (g1 / g)) - l.dcBtn.h/2;
				// console.log(l.dcBtn.x, l.dcBtn.y)
				l.dcBtn.change();
				l.dcBtn.connectionReg = con;
				found = true;
				return false;
			}
			else {
				return true;
			}
		})
		if(l.dcBtn.visible !== found) {
			l.dcBtn.visible = found;
			l.dcBtn.change();
		}
		if(l.dcBtn.connectionReg && !found) {
			l.dcBtn.connectionReg = undefined;
		}
	}
	function onMOut(e) {
		l.dcBtn.visible = false;
		l.dcBtn.change();
	}
	function onDcBtnClick(e) {
		if(l.dcBtn.connectionReg) {
			var c = l.dcBtn.connectionReg;
			View.disconnectAs(
				View.getAckNode(c.id1), 
				View.getAckNode(c.id2), c.c1, c.c2
			);
		}
	}
	function render(){
		l.sprite.ctx.clearRect(0, 0, ack.w, ack.h);
		l.sprite.ctx.beginPath();
		l.sprite.ctx.strokeStyle = gui.c.colors.pink;
		l.sprite.ctx.lineWidth = 1;
		for(var i in connections) {
			var c = connections[i];
			var wm1 = View.getAckNode(c.id1).win.metrics;
			var wm2 = View.getAckNode(c.id2).win.metrics;
			l.sprite.ctx.moveTo(wm1.x + wm1.connectors[c.c1].x, wm1.y + wm1.connectors[c.c1].y);
			l.sprite.ctx.lineTo(wm2.x + wm2.connectors[c.c2].x, wm2.y + wm2.connectors[c.c2].y);
		}
		if(newWire) {
			l.sprite.ctx.moveTo(newWire.ax, newWire.ay);
			l.sprite.ctx.lineTo(newWire.bx, newWire.by);
		}
		l.sprite.ctx.stroke();
		l.sprite.ctx.closePath();
		l.sprite.change();
	}
	return l;
});