define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/View", "ack/gui/Aligner", "utils/Sprite"], 
    function(ack, gui, AudioNode, utils,
        Window, View, Aligner, Sprite) {
        "use strict";
            
	function Destination() {
        p.Super.apply(this, arguments);
		
        this.name = "destination";
		this.node = ack.ctx.destination;
		
		this.win = new Window(this.name, this, undefined, 60, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id);}, this);
		this.win.showCloseBtn = false;
		this.win.infoLink = this.w3cLink + "#AudioDestinationNode";
		this.aligner = new Aligner;
		
		var icon = new Sprite();
		icon.ctx = utils.createCtx(60, 74);
		icon.canvas = icon.ctx.canvas;
		var r = 27.5;
		icon.ctx.strokeStyle = "#ffffff";
		icon.ctx.lineWidth = 3;
		for(var i = 0; i < 3; ++i) {
			icon.ctx.beginPath();
			icon.ctx.arc(0, 37, r, -Math.PI/4, Math.PI/4);
			r -= 11;
			icon.ctx.stroke();
		}
		icon.autoWH();
		icon.x = gui.c.defaultItemW/2 - icon.w*.4;
		
		var guis = [{sprite: icon}];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	}
	var p = utils.inherit(Destination, AudioNode);
    
	return Destination;
});