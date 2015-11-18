define(["ack/ack", "ack/gui/gui", "ack/gui/Aligner", "ack/gui/Window",
    "ack/gui/Slider"], 
    function(ack, gui, Aligner, Window,
        Slider) {
        "use strict";
            
	function AudioListener(){
		
        this.name = "audio listener";
		this.node = ack.ctx.listener;
		
		this.win = new Window(this.name, this, undefined, undefined, {
			inputs: this.node.numberOfInputs, outputs: this.node.numberOfOutputs });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){gui.View.removeNode(this.id);}, this);
		this.win.infoLink = this.w3cLink + "#AudioListener";
		this.aligner = new Aligner;
		
		this.dopplerFactor = new Slider("dopplerFactor", 
			-3, 3, this.node.dopplerFactor, .001);
		this.dopplerFactor.ps.sub(gui.evt.ON_CHANGE, function(v){
			this.node.dopplerFactor = v;
		}, this);
		
		this.speedOfSound = new Slider("speedOfSound", 
			0, 1000, this.node.speedOfSound, .01);
		this.speedOfSound.ps.sub(gui.evt.ON_CHANGE, function(v){
			this.node.speedOfSound = v;
		}, this);
		
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
		
		var guis = [
			this.dopplerFactor, this.speedOfSound, 
			this.positionX, this.positionY, this.positionZ,
			this.orientationX, this.orientationY, this.orientationZ,
			this.velocityX, this.velocityY, this.velocityZ
		];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
	};
	var p = AudioListener.prototype;
    
	p.onPositionChange = function(e){
		this.node.setPosition(this.positionX.value, this.positionY.value, this.positionZ.value);
	};
    
	p.onOrientationChange = function(e){
		this.node.setOrientation(this.orientationX.value, this.orientationY.value, this.orientationZ.value);
	};
    
	p.onVelocityChange = function(e){
		this.node.setVelocity(this.velocityX.value, this.velocityY.value, this.velocityZ.value);
	};
	
    return AudioListener;
});