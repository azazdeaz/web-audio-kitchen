define(["ack/node/node", "ack/View", "utils/PubSub"], 
    function(node, View, PubSub) {
        "use strict";

	function AudioNode(id) {
		this.ps = new PubSub();
		this.connections = [];
		this.id = id;
	};
	var p = AudioNode.prototype;
    
	p.w3cLink = "https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html";
	
	p.connect = function(ackNode, outChannel, inChannel){
		outChannel = outChannel || 0;
		inChannel = inChannel || 0;
		
		for(var i in this.connections) {
			var c = this.connections[i];
			if (c.ackNode === ackNode &&
				c.outChannel === outChannel &&
				c.inChannel === inChannel)
			{ return; }
		}
		
		this.node.connect(ackNode.node, outChannel, inChannel);
		var conReg = {ackNode:ackNode, outChannel: outChannel, inChannel: inChannel};
		this.connections.push(conReg);
		ackNode.ps.pub(node.ON_CONNECT_TO_INPUT);
		// this.ps.pub(node.ON_CONNECTED, {
			// connector: ackNode,
			// connected: this,
		// });
	};
    
	p.disconnect  = function(marker, outChannel, inChannel) {
		outChannel = outChannel || 0;
		inChannel = inChannel || 0;
		if(marker instanceof AudioNode) {
			for(var i = 0; i < this.connections.length; ++i) {
				var c = this.connections[i];
				if (c.ackNode === marker &&
					c.outChannel === outChannel &&
					c.inChannel === inChannel)
				{
					this.connections.splice(i--, 1);
				}
			}
		}
		else if(typeof(marker) === "number") {
			this.connections.splice(~~marker, 1);
		}
		else if(!marker) {
			this.connections = [];
		}
		
		for(var oci = 0; oci < this.node.numberOfOutputs; ++oci) {
			this.node.disconnect(oci);
		}
		for(var i in this.connections) {
			var c = this.connections[i];
			this.node.connect(c.ackNode.node, c.outChannel, c.inChannel);
		}
	};
    
	p.destroy = function() {
		View.disconnectAs(this);
		View.disconnectAs(undefined, this);
		
		this.win.destroy();
		var i;
		if(this.guis) {
			for(var i in this.guis) {
				if(this.guis[i].destroy) this.guis[i].destroy();
				delete this.guis[i];
			}
		}
		for(var i in this) delete this[i];
	};
	return AudioNode;
});