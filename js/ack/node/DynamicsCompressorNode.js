define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/View", "ack/gui/Aligner", "ack/node/AudioParamEditor"], 
    function(ack, gui, AudioNode, utils,
        Window, View, Aligner, AudioParamEditor) {
        "use strict";
            
	var instanceCounter = 0;
	function DynamicsCompressorNode(){
        p.Super.apply(this, arguments);
        
        this.name = "dynamics compressor "+(++instanceCounter);
		this.node = ack.ctx.createDynamicsCompressor();
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id)}, this);
		this.win.infoLink = this.w3cLink + "#DynamicsCompressorNode";
		this.aligner = new Aligner;
		
		this.apThreshold = new AudioParamEditor("threshold", this.node.threshold, .01, "dB");
		this.apKnee = new AudioParamEditor("knee", this.node.knee, .01, "dB");
		this.apRatio = new AudioParamEditor("ratio", this.node.ratio, .001);
		this.apReduction = new AudioParamEditor("reduction", this.node.reduction, .01, "dB");
		this.apAttack = new AudioParamEditor("attack", this.node.attack, .01, "sec");
		this.apRelease = new AudioParamEditor("release", this.node.release, .01, "sec");
		
		var guis = [this.apThreshold, this.apKnee, this.apRatio, 
			this.apReduction, this.apAttack, this.apRelease
		];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	}
	var p = utils.inherit(DynamicsCompressorNode, AudioNode);
    
	return DynamicsCompressorNode;
});