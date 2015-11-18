define(["ack/gui/gui", "ack/gui/Slider"], function (gui, Slider) {
    "use strict";
        
	function AudioParamEditor(name, src, tick, unitName) {
        
		this.valueS = new Slider(name);
		if(unitName) this.valueS.unitName = unitName;
		this.valueS.ps.sub(gui.evt.ON_CHANGE, function(value){
			this.src.value = value;
		}, this);
		this.valueS.tick = tick || 0.001;
		this.useSrc(src);
		this.sprite = this.valueS.sprite;
	};
    
    var p = AudioParamEditor.prototype;
    
	p.manualSetValue = function(v) {
		this.valueS.setValue(v);
	};
    
	p.useSrc = function(src) {
		var oldSrc = this.src;
		this.src = src;
		this.valueS.setMinMax(this.src.minValue, this.src.maxValue);
		this.valueS.setValue(oldSrc ? oldSrc.value : this.src.defaultValue);
	};
    
	return AudioParamEditor;
});