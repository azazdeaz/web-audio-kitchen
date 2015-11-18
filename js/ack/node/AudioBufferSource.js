define(["ack/ack", "ack/gui/gui", "ack/node/AudioNode", "utils/utils",
    "ack/gui/Window", "ack/gui/Aligner", "ack/gui/TextBox", "ack/View",
    "ack/node/node", "ack/gui/Button", "ack/gui/CheckBox", "ack/gui/Slider",
    "ack/node/AudioBuffer"], 
    function(ack, gui, AudioNode, utils,
        Window, Aligner, TextBox, View,
        node, Button, CheckBox, Slider,
        AudioBuffer) {
        "use strict";
            
	var instanceCounter = 0;
	var AudioBufferSource = function(id){
        p.Super.apply(this, arguments);
		
        this.name = "audio buffer source "+(++instanceCounter);
		this.selectedSnd = "";//draft
		this.node = undefined;
		this.buffer = undefined;
		

		this.win = new Window(this.name, this, undefined, undefined, {inputs:0, outputs:1 });
		this.win.ps.sub(gui.evt.ON_CLOSE, function(){View.removeNode(this.id);}, this);
		this.win.infoLink = this.w3cLink + "#AudioBufferSourceNode";
		this.aligner = new Aligner;
		this.playBtn = new Button("start(0)");
		this.playBtn.ps.sub(gui.evt.ON_PRESS, function(){
			this.start(0);
		}, this);
		this.stopBtn = new Button("stop(0)");
		this.stopBtn.ps.sub(gui.evt.ON_PRESS, function(){
			this.stop(0);
		}, this);
		this.loopXb = new CheckBox("loop");
		this.loopXb.ps.sub(gui.evt.ON_CHANGE, function(on){
			this.node.loop = on;
		}, this);
		this.loopStartS = new Slider("loopStart");
		this.loopStartS.ps.sub(gui.evt.ON_CHANGE, function(value){
			if(this.node) this.node.loopStart = value;
		}, this);
		this.loopStartS.tick = 1;
		this.loopEndS = new Slider("loopEnd");
		this.loopEndS.ps.sub(gui.evt.ON_CHANGE, function(value){
			if(this.node) this.node.loopEnd = value;
		}, this);
		this.loopEndS.tick = 1;
		
		this.buffer = new AudioBuffer(this.node);
		this.buffer.ps.sub("change", this.onBufferChange, this);
		
		var guis = [this.playBtn, this.stopBtn,
			this.loopXb, this.loopStartS, this.loopEndS, this.buffer
		];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.win.container.add(guis[i].sprite);
		}
		this.win.autoHeight();
		
		this.recreateNode();
	};
	var p = utils.inherit(AudioBufferSource, AudioNode);
    
	p.reconnect = node.reconnectFunction;
    
	p.addHelp = function() {
		this.help1 = new TextBox("1. Select a sound!");
		this.help2 = new TextBox("2. Let's play!");
		this.help1.sprite.y = 212;
		this.help2.sprite.y = 43;
		this.win.sprite.add(this.help1.sprite);
		this.win.sprite.add(this.help2.sprite);
		
		this.buffer.ps.sub("change", selectClick, this);
		function selectClick(e) {
			this.buffer.ps.unsub("change", selectClick, this);
			this.win.sprite.remove(this.help1.sprite);
			this.win.sprite.change();
			delete this.help1;
		}
		this.playBtn.ps.sub(gui.evt.ON_PRESS, playClick, this);
		function playClick(e) {
			if(this.help1) return;
			this.playBtn.ps.unsub(gui.evt.ON_PRESS, playClick, this);
			this.win.sprite.remove(this.help2.sprite);
			this.win.sprite.change();
			delete this.help2;
		}
	};
    
	p.start = function() {
		if(!this.node.buffer || this.onSoundFinishSetI) return;
		this.node.start(0);
		var self = this;
		var delay = ~~(this.buffer.node.duration * 1000) + 1;
		this.onSoundFinishSetI = setInterval(function(){self.onSoundFinish();}, delay);
	};
    
	p.stop = function() {
		this.node.stop(0);
		this.onSoundFinish(true);
	};
    
	p.onSoundFinish = function(manual){
		if(manual || !this.node.loop) {
			clearInterval(this.onSoundFinishSetI);
			delete this.onSoundFinishSetI;
			this.recreateNode();
			this.reconnect();
		}
	};
    
	p.recreateNode = function() {
		this.node = ack.ctx.createBufferSource();
		if(this.buffer.node) this.node.buffer = this.buffer.node;
		if(!this.node.start) this.node.start = this.node.noteOn;//old Chrome
		if(!this.node.stop) this.node.stop = this.node.noteOff;//old Chrome
		this.node.loopStart = this.loopStartS.value;
		this.node.loopEnd = this.loopEndS.value;
		this.node.loop = this.loopXb.checked;
	};
    
	p.onBufferChange = function(){
		this.node.buffer = this.buffer.node;
		var secLen = ~~(this.node.buffer.duration*1000)+1;
		this.loopStartS.setMinMax(0, secLen);
		this.loopStartS.setValue(0);
		this.loopEndS.setMinMax(0, secLen);
		this.loopEndS.setValue(secLen);
		this.loopXb.checked = this.node.loop;
	};
    
	p.destroy = function(){
		clearInterval(this.onSoundFinishSetI);
		p.Super.prototype.destroy.call(this);
	};
    
	return AudioBufferSource;
});