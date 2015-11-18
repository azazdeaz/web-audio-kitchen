define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/View", "ack/gui/Aligner", "ack/node/AudioParamEditor",
    "ack/gui/Button", "ack/gui/ComboBox", "ack/node/node"], 
    function(ack, gui, AudioNode, utils,
        Window, View, Aligner, AudioParamEditor,
        Button, ComboBox, node) {
        "use strict";
            
	var instanceCounter = 0;
	var oscillatorTypes = ["sine", "square", "sawtooth", "triangle"];
    
	function OscillatorNode(){
        p.Super.apply(this, arguments);
        
		this.name = "oscillator"+(++instanceCounter);
		this.recreateNode(true);
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id)}, this);
		this.win.infoLink = this.w3cLink + "#OscillatorNode";
		this.aligner = new Aligner;
		this.playBtn = new Button("start(0)");
		this.playBtn.ps.sub(gui.evt.ON_PRESS, function(){
			this.node.start(0);
		}, this);
		this.stopBtn = new Button("stop(0)");
		this.stopBtn.ps.sub(gui.evt.ON_PRESS, function(){
			this.node.stop(0);
			this.recreateNode();
			this.reconnect();
		}, this);
		this.typeCb = new ComboBox(oscillatorTypes);
		this.typeCb.ps.sub(gui.evt.ON_SELECT, function(type){
			// this.node.type = type;
			this.node.type = oscillatorTypes.indexOf(type);
		}, this);
		
		this.apFrequency = new AudioParamEditor("freqency", this.node.frequency, 1);
		this.apDetune = new AudioParamEditor("detune", this.node.detune, 1);
		
		var guis = [this.playBtn, this.stopBtn, 
			this.typeCb, this.apFrequency, this.apDetune];
		for(var i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	};
	var p = utils.inherit(OscillatorNode, AudioNode);
    
	p.reconnect = node.reconnectFunction;
    
	p.recreateNode = function(first) {
		this.node = ack.ctx.createOscillator();
		if(!this.node.start) this.node.start = this.node.noteOn;//old Chrome
		if(!this.node.stop) this.node.stop = this.node.noteOff;//old Chrome
		if(!first) {
			this.apFrequency.useSrc(this.node.frequency);
			this.apDetune.useSrc(this.node.detune);
		}
	};
    
	return OscillatorNode;
});