define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/gui/Aligner"], 
    function(ack, gui, AudioNode, utils,
        Window, Aligner) {
        "use strict";
            
	var instanceCounter = 0;
	function WaveShaperNode (){
        p.Super.apply(this, arguments);
		
        this.name = "wave shaper "+(++instanceCounter);
		this.node = ack.ctx.createWaveShaper();
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id)}, this);
		this.win.infoLink = this.w3cLink + "#WaveShaperNode";
		this.aligner = new Aligner;
		
		var guis = [];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	}
	var p = utils.inherit(WaveShaperNode, AudioNode);
    
	return WaveShaperNode;
});