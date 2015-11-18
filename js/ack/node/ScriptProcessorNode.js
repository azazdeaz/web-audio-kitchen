define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/View", "ack/gui/Window", "ack/gui/Aligner", "ack/gui/ComboBox"], 
    function(ack, gui, AudioNode, utils,
        View, Window, Aligner, ComboBox) {
        "use strict";
            
	var instanceCounter = 0;
	function ScriptProcessorNode() {
        p.Super.apply(this, arguments);
		
        this.name = "script processor "+(++instanceCounter);
		this.node = ack.ctx.createJavaScriptNode || ack.ctx.createScriptProcessor;
		this.node = this.node.call(ack.ctx, bufferSizes[3], 1, 1);
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id);}, this);
		this.win.infoLink = this.w3cLink + "#ScriptProcessorNode";
		this.aligner = new Aligner;
		
		this.bufferSizeCb = new ComboBox(bufferSizes);
		this.bufferSizeCb.ps.sub(gui.evt.ON_SELECT, function(size){
			this.node.bufferSize = size;
		}, this);

		this.node.onaudioprocess = function(e){
			var input = [];
			var output = [];
			var node = e.node || e.target;
			for(var i = 0, il = node.numberOfInputs; i < il; ++i){
				input.push(e.inputBuffer.getChannelData(i));
			}
			for(i = 0, il = node.numberOfOutputs; i < il; ++i){
				output.push(e.outputBuffer.getChannelData(i));
			}
			for(i in output) {
				for(var j = 0; j < output[i].length; ++j) {
					output[i][j] = Math.random();
				}
			}
		};
		
		var guis = [this.bufferSizeCb];
		for(var i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	}
	var bufferSizes = [256, 512, 1024, 2048, 4096, 8192, 16384];
	var p = utils.inherit(ScriptProcessorNode, AudioNode);
    
	return ScriptProcessorNode;
});