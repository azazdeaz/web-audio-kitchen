define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils", 'ack/View',
    "ack/gui/Window", "ack/gui/Aligner", "ack/gui/Slider", "ack/gui/ComboBox"], 
    function(ack, gui, AudioNode, utils, View,
        Window, Aligner, Slider, ComboBox) {
        "use strict";
            
	var instanceCounter = 0;
	function PannerNode() {
        p.Super.apply(this, arguments);
		
        this.name = "panner "+(++instanceCounter);
		this.node = ack.ctx.createPanner();
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id);}, this);
		this.win.infoLink = this.w3cLink + "#PannerNode";
		this.aligner = new Aligner;
		
		this.panningModelCb = new ComboBox(panningModelTypes);
		this.panningModelCb.ps.sub(gui.evt.ON_SELECT, function(type){
			// this.node.panningModel = type;
			this.node.panningModel = panningModelTypes.indexOf(type);
		}, this);
		this.panningModelCb.select(panningModelTypes[1]);
		
		this.positionX = new Slider("x position", -100, 100, 0, .1);
		this.positionX.ps.sub(gui.evt.ON_CHANGE, this.onPositionChange, this);
		this.positionY = new Slider("y position", -100, 100, 0, .1);
		this.positionY.ps.sub(gui.evt.ON_CHANGE, this.onPositionChange, this);
		this.positionZ = new Slider("z position", -100, 100, 0, .1);
		this.positionZ.ps.sub(gui.evt.ON_CHANGE, this.onPositionChange, this);
		
		this.orientationX = new Slider("x orientation", -100, 100, 1, .01);
		this.orientationX.ps.sub(gui.evt.ON_CHANGE, this.onPositionChange, this);
		this.orientationY = new Slider("y orientation", -100, 100, 0, .01);
		this.orientationY.ps.sub(gui.evt.ON_CHANGE, this.onPositionChange, this);
		this.orientationZ = new Slider("z orientation", -100, 100, 0, .01);
		this.orientationZ.ps.sub(gui.evt.ON_CHANGE, this.onOrientationChange, this);
		
		this.velocityX = new Slider("x velocity", -100, 100, 0, .1);
		this.velocityX.ps.sub(gui.evt.ON_CHANGE, this.onVelocityChange, this);
		this.velocityY = new Slider("y velocity", -100, 100, 0, .1);
		this.velocityY.ps.sub(gui.evt.ON_CHANGE, this.onVelocityChange, this);
		this.velocityZ = new Slider("z velocity", -100, 100, 0, .1);
		this.velocityZ.ps.sub(gui.evt.ON_CHANGE, this.onVelocityChange, this);
		
		this.distanceModelCb = new ComboBox(distanceModelTypes);
		this.distanceModelCb.ps.sub(gui.evt.ON_SELECT, function(type){
			// this.node.distanceModel = type;
			this.node.distanceModel = distanceModelTypes.indexOf(type);
		}, this);
		this.distanceModelCb.select(distanceModelTypes[1]);
		
		this.refDistance = new Slider("refDistance", -100, 100, 1, 1);
		this.refDistance.ps.sub(gui.evt.ON_CHANGE, function(v){
			this.node.refDistance = v;
		}, this);
		this.maxDistance = new Slider("maxDistance", 0, 10000, 10000, 1);
		this.maxDistance.ps.sub(gui.evt.ON_CHANGE, function(v){
			this.node.maxDistance = v;
		}, this);
		this.rolloffFactor = new Slider("rolloffFactor", 0, 100, 1, .01);
		this.rolloffFactor.ps.sub(gui.evt.ON_CHANGE, function(v){
			this.node.rolloffFactor = v;
		}, this);
		this.coneInnerAngle = new Slider("coneInnerAngle", 0, 360, 360, .01);
		this.coneInnerAngle.ps.sub(gui.evt.ON_CHANGE, function(v){
			this.node.coneInnerAngle = v;
		}, this);
		this.coneOuterAngle = new Slider("coneOuterAngle", 0, 360, 360, .01);
		this.coneOuterAngle.ps.sub(gui.evt.ON_CHANGE, function(v){
			this.node.coneOuterAngle = v;
		}, this);
		this.coneOuterGain = new Slider("coneOuterGain", 0, 1, 1, .001);
		this.coneOuterGain.ps.sub(gui.evt.ON_CHANGE, function(v){
			this.node.coneOuterGain = v;
		}, this);
		
		var guis = [this.panningModelCb, 
			this.positionX, this.positionY, this.positionZ,
			this.orientationX, this.orientationY, this.orientationZ,
			this.velocityX, this.velocityY, this.velocityZ,
			this.distanceModelCb,this.refDistance, this.maxDistance,
			this.rolloffFactor, this.coneInnerAngle,this.coneOuterAngle,
			this.coneOuterGain
		];
		for(var i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	};
	var p = utils.inherit(PannerNode, AudioNode);
	var panningModelTypes = ["equalpower", "HRTF", "soundfield"];
	var distanceModelTypes = ["linear", "inverse", "exponential"];
    
	p.onPositionChange = function(e){
		this.node.setPosition(this.positionX.value, this.positionY.value, this.positionZ.value);
	};
    
	p.onOrientationChange = function(e){
		this.node.setOrientation(this.orientationX.value, this.orientationY.value, this.orientationZ.value);
	};
    
	p.onVelocityChange = function(e){
		this.node.setVelocity(this.velocityX.value, this.velocityY.value, this.velocityZ.value);
	};
    
	return PannerNode;
});   