define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils", "utils/Sprite", 
    "ack/gui/Window", "ack/View", "ack/node/node"], 
    function(ack, gui, AudioNode, utils, Sprite, 
        Window, View, node) {
        "use strict";
            
	var instanceCounter = 0;
	function ChannelSplitterNode(){
        p.Super.apply(this, arguments);
        
        this.name = "channel splitter "+(++instanceCounter);
		this.node = ack.ctx.createChannelSplitter();
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id);}, this);
		this.win.infoLink = this.w3cLink + "#ChannelSplitterNode";
		// this.outBtns = [];
		
		this.win.autoHeight();
		
		this.ps.sub(node.ON_CONNECT_TO_INPUT, this.onConnectToInput, this);
		this.onConnectToInput();
	};
	var p = utils.inherit(ChannelSplitterNode, AudioNode);
    
	p.onConnectToInput = function(){
		// while(this.outBtns.length) {
			// var btn = this.outBtns.pop();
			// this.aligner.remove(btn.sprite);
			// this.win.container.remove(btn.sprite);
		// }
		// for(var i = 0; i < this.node.numberOfOutputs; ++i) {
			// var btn = createPlugBtn.call(this, false, i);
			// this.aligner.add(btn.sprite);
			// this.win.container.add(btn.sprite);
			// this.outBtns.push(btn);
		// }
    };
    
	return ChannelSplitterNode;
});