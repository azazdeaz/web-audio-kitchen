define(["ack/ack", "ack/gui/gui", "utils/Sprite", 
    "ack/gui/Aligner", "ack/gui/ComboBox", "ack/gui/Separator", "ack/gui/Button",
    "ack/gui/Label", "utils/PubSub", "ack/SoundLoader"], 
    function(ack, gui, Sprite, 
        Aligner, ComboBox, Separator, Button,
        Label, PubSub, SoundLoader) {
        "use strict";
            
    var samples = [
		"woman-s_shoes_light_run.mp3",
		"surround_test_lynnemusic_com.mp3",
		"piano_funky_120bpm.mp3",
		"jump_004.wav",
		"frog_croaking.mp3",
		"female_singing_the_aphabet.mp3",
		"engine_bass_001.wav",
		"E_major_funk_riff_verse_140_Clean.mp3",
		"classic_guitar_overtones.mp3",
		"cicada_night_close.mp3"
	];
    
	function AudioBuffer() {
		this.sprite = new Sprite();
		this.aligner = new Aligner();
		this.ps = new PubSub();
		this.bufferSeparator = new Separator;
		this.bufferL = new Label("Buffer");
		this.sampleCb = new ComboBox();
		this.browseBtn = new Button("Browse...");
		this.browseBtn.ps.sub(gui.evt.ON_PRESS, this.clickBrowse, this);
		this.__aborter;
		this.sampleCb.ps.sub(gui.evt.ON_SELECT, function(name){
			this.selectedSnd = name;
			var self = this;
			if(this.__aborter) this.__aborter();
			this.__aborter = SoundLoader.load(
				ack.paths.sampleSnd + name, 
				function(b){self.sndLoaded(b);},
				function(e){self.onProgress(e);}
			);
		}, this);
		for(var i in samples) {
			this.sampleCb.addItem(samples[i]);
		}
		this.sampleRateL = new Label("sample rate: - ");
		this.lengthL = new Label("length: - ");
		this.durationL = new Label("duration: - ");
		this.numberOfChannelsL = new Label("number of channels: - ");
		
		var guis = [this.bufferSeparator, this.bufferL, this.sampleCb, this.browseBtn,
			this.sampleRateL, this.lengthL, this.durationL, this.numberOfChannelsL];
		for(i in guis) {
			this.aligner.add(guis[i].sprite);
			this.sprite.add(guis[i].sprite);
		}
		this.sprite.autoWH(true);
		
		var self = this;
		this.browseWinClosed = function(){
			$("#fileElem").off("change", self.onFileElemChangeScope);
			$(window).off("focus", self.browseWinClosed);
		};
		this.onFileElemChangeScope = function(e){
			self.onFileElemChange(e);
		};
		
	}
    
    var p = AudioBuffer.prototype;
    
	p.onProgress = function(e) {
		this.logTxt = " - ";
		switch(e.type) {
			case "loading":
				this.logTxt += e.type+" "+(~~e.precent);
				break;
			case "processing":
				this.logTxt += e.type+"...";
				break;
			case "error":
				this.logTxt += e.type;
				break;
			case "loaded":
				this.logTxt += e.name;
				break;
		}
		this.setHeaderText();
	};
    
	p.setHeaderText = function (e) {
		this.bufferL.text = "Buffer" + this.logTxt;
	};
    
	p.clickBrowse = function(e) {
		$("#fileElem").on("change", this.onFileElemChangeScope);
		$("#fileElem").click();
		$(window).on("focus", this.browseWinClosed);
		
	};
    
	p.onFileElemChange = function (e) {
		var file = e.target.files[0]; 
		if (file) {
			var self = this;
			SoundLoader.loadFile(file, 
				function(b){self.sndLoaded(b);},
				function(e){self.onProgress(e);}
			);
		}
	};
	
	p.sndLoaded = function(buffer) {
		delete this.__aborter;
		var node = buffer;
		if(node) {
			this.node = node;
			this.refreshStats();
			this.ps.pub("change");
		}
		this.logTxt = "";
		this.setHeaderText();
	};
    
	p.refreshStats = function() {
		this.sampleRateL.text = "sample rate: " + this.node.sampleRate;
		this.lengthL.text = "length: " + this.node.length;
		this.durationL.text = "duration: " + this.node.duration;
		this.numberOfChannelsL.text = "number of channels: " + this.node.numberOfChannels;
	};
    
	return AudioBuffer;
});