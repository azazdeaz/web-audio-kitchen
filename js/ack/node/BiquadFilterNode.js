define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/gui/Aligner", "ack/gui/ComboBox", "ack/View",
    "ack/node/AudioParamEditor"], 
    function(ack, gui, AudioNode, utils,
        Window, Aligner, ComboBox, View,
        AudioParamEditor) {
        "use strict";
            
	var instanceCounter = 0;
	function BiquadFilterNode(){
        p.Super.apply(this, arguments);
        
		this.name = "biquad filter "+(++instanceCounter);
		this.node = ack.ctx.createBiquadFilter();
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id);}, this);
		this.win.infoLink = this.w3cLink + "#BiquadFilterNode";
		this.aligner = new Aligner;
		
		this.typeCb = new ComboBox(types);
		this.typeCb.ps.sub(gui.evt.ON_SELECT, function(type){
			// this.node.type = type;
			this.node.type = types.indexOf(type);//DEPRECATED
		}, this);
		
		this.apFrequency = new AudioParamEditor("frequency", this.node.frequency, .01, "Hz");
		if(this.node.detune) {//DEPRECATED, the new chrome have detune
			this.apDetune = new AudioParamEditor("detune", this.node.detune, .01, "cent");
		}
		this.apQ = new AudioParamEditor("Q", this.node.Q, .01);
		this.apGain = new AudioParamEditor("gain", this.node.gain, .01,"dB");
		
		var guis = [this.typeCb, this.apFrequency];
		if(this.apDetune) guis.push(this.apDetune);//DEPRECATED, the new chrome have detune
		guis = guis.concat([this.apQ, this.apGain]);
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	};
	var p = utils.inherit(BiquadFilterNode, AudioNode);
    
	var types = ["lowpass", "highpass", "bandpass", "lowshelf", 
		"highshelf", "peaking", "notch", "allpass"];
    
	return BiquadFilterNode;
});