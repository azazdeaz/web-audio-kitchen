define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils", "utils/Sprite", 
    "ack/gui/Window", "ack/gui/Aligner", "ack/gui/ComboBox", "ack/gui/Slider", 
    "ack/gui/Label", "ack/View"], 
    function(ack, gui, AudioNode, utils, Sprite, 
        Window, Aligner, ComboBox, Slider, 
        Label, View) {
        "use strict";
        
	var instanceCounter = 0;
	function AnalyserNode() {
        p.Super.apply(this, arguments);
		
        this.name = "analyser "+(++instanceCounter);
		this.node = ack.ctx.createAnalyser();
		
		this.win = new Window(this.name, this, undefined, undefined, {
			// inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
			inputs: 1, outputs: 1 });//hack
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id);}, this);
		this.win.infoLink = this.w3cLink + "#AnalyserNode";
		this.aligner = new Aligner;
		
		this.samplingTypeCb = new ComboBox(samplingTypes);
		this.samplingTypeCb.ps.sub(gui.evt.ON_SELECT, function(type){
			this.selectSamplingType(type);
		}, this);
		this.samplingTypeCb.select(samplingTypes[2]);
		
		this.vs = new Sprite();
		this.vs.name = "visualisator";
		this.vs.ctx = new utils.createCtx(gui.c.defaultItemW, gui.c.defaultItemW);
		this.vs.canvas = this.vs.ctx.canvas;
		this.vs.autoWH(true);
		this.vs.mouseEnabled = false;
		var self = this;
		this.vs.onDraw = function() {
			self.refreshSampleArrFunct.call(self.node, self.sampleArr); 
			// self.vs.ctx.clearRect(0, 0, self.vs.w, self.vs.h);
			self.vs.ctx.fillStyle = gui.c.colors.black;
			self.vs.ctx.fillRect(0, 0, self.vs.w, self.vs.h);
			self.vs.ctx.beginPath();
			self.vs.ctx.strokeStyle = gui.c.colors.pink;
			var l = self.sampleArr.length;
			var step = self.vs.w / l;
			var h = self.vs.h;
			for(var i=0; i < l; ++i) {
				self.vs.ctx.lineTo(step*i, h - self.sampleArr[i]);
			}
			self.vs.ctx.stroke();
			// self.vs.ctx.closePath();
			self.vs.ctx.beginPath();
			// self.vs.ctx.strokeStyle = gui.c.colors.black;
			// self.vs.ctx.rect(.5, .5, self.vs.w-1, self.vs.h-1);
			// self.vs.ctx.stroke();
			
			self.vs.change();
		};
		this.vs.change();
		
		this.fftSizeS = new Slider("fftSize", 6, 11, Math.log(this.node.fftSize)/Math.LN2, 1, "^2");
		this.fftSizeS.ps.sub(gui.evt.ON_CHANGE, function(value){
			this.node.fftSize = Math.pow(2, value);
			this.frequencyBinCountL.text = "frequencyBinCount - " + this.node.frequencyBinCount; 
			this.selectSamplingType();
		}, this);
		this.frequencyBinCountL = new Label("frequencyBinCount - " + this.node.frequencyBinCount);
		this.minDecS = new Slider("minDecibels", -200, 200, this.node.minDecibels, 1, "dB");
		this.minDecS.ps.sub(gui.evt.ON_CHANGE, function(value){
			this.node.minDecibels = value;
		}, this);
		this.maxDecS = new Slider("minDecibels", -200, 200, this.node.maxDecibels, 1, "dB");
		this.maxDecS.ps.sub(gui.evt.ON_CHANGE, function(value){
			this.node.maxDecibels = value;
		}, this);
		this.stcS = new Slider("smoothingTimeConstant", 0, 1, this.node.smoothingTimeConstant, .01);
		this.stcS.ps.sub(gui.evt.ON_CHANGE, function(value){
			this.node.smoothingTimeConstant = value;
		}, this);
		
		var guis = [this.samplingTypeCb, 
			this.fftSizeS, this.frequencyBinCountL, {sprite:this.vs}, 
			this.minDecS, this.maxDecS, this.stcS
		];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	};
	var samplingTypes = ["float frequency", "byte frequency", "byte time domain"];
	var p = utils.inherit(AnalyserNode, AudioNode);
    
	p.selectSamplingType = function(type) {
		if(!type) type = this.__selectedSamplingType;
		this.__selectedSamplingType = type;
		switch(type) {
			case samplingTypes[0]:
				this.sampleArr = new Float32Array(this.node.frequencyBinCount);
				this.refreshSampleArrFunct = this.node.getFloatFrequencyData;
				break;
			case samplingTypes[2]:
				this.sampleArr = new Uint8Array (this.node.frequencyBinCount);
				this.refreshSampleArrFunct = this.node.getByteFrequencyData;
				break;
			case samplingTypes[3]:
				this.sampleArr = new Uint8Array (this.node.frequencyBinCount);
				this.refreshSampleArrFunct = this.node.getByteTimeDomainData;
				break;
		}
	};
    
	return AnalyserNode;
});