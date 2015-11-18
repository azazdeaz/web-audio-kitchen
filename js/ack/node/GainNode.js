define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/View", "ack/gui/Aligner", "ack/node/AudioParamEditor"], 
    function(ack, gui, AudioNode, utils,
        Window, View, Aligner, AudioParamEditor) {
        "use strict";
       
	var instanceCounter = 0;
	function GainNode () {
        p.Super.apply(this, arguments);
		
        this.name = "gain "+(++instanceCounter);
		this.node = ack.ctx.createGain || ack.ctx.createGainNode;
		this.node = this.node.call(ack.ctx);
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, 
            outputs: this.node.numberOfOutputs 
        });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){
            View.removeNode(this.id);
        }, this);
		this.win.infoLink = this.w3cLink + "#GainNode";
		this.aligner = new Aligner;
		
		this.apGain = new AudioParamEditor("gain", this.node.gain, 0.01);
		
		var guis = [this.apGain];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	};
    
	var p = utils.inherit(GainNode, AudioNode);
    
	return GainNode;
});