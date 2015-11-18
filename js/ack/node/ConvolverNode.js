define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/gui/Aligner", "ack/node/AudioBuffer", 
    "ack/gui/CheckBox", "ack/View"], 
    function(ack, gui, AudioNode, utils,
        Window, Aligner, AudioBuffer, 
        CheckBox, View) {
        "use strict";
            
	var instanceCounter = 0;
	function ConvolverNode() {
        p.Super.apply(this, arguments);
        
        this.name = "convolver "+(++instanceCounter);
		this.node = ack.ctx.createConvolver();
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id);}, this);
		this.win.infoLink = this.w3cLink + "#ConvolverNode";
		this.aligner = new Aligner();
		
		this.normalizeXb = new CheckBox("normalize");
		this.normalizeXb.ps.sub(gui.evt.ON_CHANGE, function(on){
			this.node.normalize = on;
		}, this);
		
		this.buffer = new AudioBuffer(this.node);
		this.buffer.ps.sub("change", this.onBufferChange, this);
		
		var guis = [this.normalizeXb, this.buffer];
		for(var i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	};
	var p = utils.inherit(ConvolverNode, AudioNode);
    
	p.onBufferChange = function(){
		this.node.buffer = this.buffer.node;
	};
    
	return ConvolverNode;
});