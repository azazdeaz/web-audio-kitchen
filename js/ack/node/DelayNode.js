define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/View", "ack/node/AudioParamEditor",
    "ack/gui/Aligner"], 
    function(ack, gui, AudioNode, utils,
        Window, View, AudioParamEditor,
        Aligner) {
        "use strict";
            
	var instanceCounter = 0;
	function DelayNode(){
        p.Super.apply(this, arguments);
        
        this.name = "delay "+(++instanceCounter);
		this.node = ack.ctx.createDelay || ack.ctx.createDelayNode;
		this.node = this.node.call(ack.ctx);
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id)}, this);
		this.win.infoLink = this.w3cLink + "#DelayNode";
		this.aligner = new Aligner;
		
		this.apDelay = new AudioParamEditor("delayTime", this.node.delayTime, 0.001);
		
		var guis = [this.apDelay];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	};
	var p = utils.inherit(DelayNode, AudioNode);
    
	return DelayNode;
});