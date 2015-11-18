define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/View", "ack/node/node"], 
    function(ack, gui, AudioNode, utils,
        Window, View, node) {
        "use strict";
            
	var instanceCounter = 0;
	function ChannelMergerNode(){
        p.Super.apply(this, arguments);
        
        this.name = "channel merger "+(++instanceCounter);
		this.node = ack.ctx.createChannelMerger();
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id)}, this);
		this.win.infoLink = this.w3cLink + "#ChannelMergerNode";
		// this.inBtns = [];
		
		this.win.autoHeight();
		
		this.ps.sub(node.ON_CONNECT_TO_INPUT, this.onConnectToInput, this);
		this.onConnectToInput();
	};
	var p = utils.inherit(ChannelMergerNode, AudioNode);
    
	p.onConnectToInput = function(){
		// while(this.inBtns.length) {
			// var btn = this.inBtns.pop();
			// this.aligner.remove(btn.sprite);
			// this.win.container.remove(btn.sprite);
		// }
		// for(var i = 0; i < this.node.numberOfOutputs; ++i) {
			// var btn = createPlugBtn.call(this, true, i);
			// this.aligner.add(btn.sprite);
			// this.win.container.add(btn.sprite);
			// this.inBtns.push(btn);
		// }
	};
	return ChannelMergerNode;
});