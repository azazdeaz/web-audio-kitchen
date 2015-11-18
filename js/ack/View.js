define(["ack/ack", "utils/Sprite", "utils/PubSub", "ack/gui/Aligner", 
    "ack/gui/Label"], 
    function(ack, Sprite, PubSub, Aligner, 
    Label){
    "use strict";
        
	var v = {};
	v.ON_NODE_ADDED = "onNodeAdded";
	v.ON_NODE_REMOVED = "onNodeRemoved";
	v.ON_NODES_CONNECTED = "onNodesConnected";
	v.ON_NODES_DISCONNECTED = "onNodesDisconnected";
	
	var nodeIdCounter = 0;
	var nodes = {};
	var connections = [];
	v.ps = new PubSub();
	
	v.addNode = function(ackNodeClass){
		if(ackNodeClass) {
			var id = nodeIdCounter++;
			var node = new ackNodeClass(id);
			nodes[id] = node;
			v.ps.pub(v.ON_NODE_ADDED, id);
			return id;
		}
	};
    
	v.removeNode = function(id) {
		var ackNode = v.getAckNode(id);
		if(ackNode) {
			v.ps.pub(v.ON_NODE_REMOVED, id);
			ackNode.destroy();
			delete nodes[id];
		}
	};
    
	v.connectAs = function(mom, dad, conA, conB, chanA, chanB) {
		var conReg = {
			id1: v.getId(mom), c1: conA, ch1: chanA, ackNodeIn:mom, 
			id2: v.getId(dad), c2: conB, ch2: chanB, ackNodeOut:dad
		}
		connections.push(conReg);
		if(mom !== dad) {
			dad.connect(mom, chanB, chanA);
			v.ps.pub(v.ON_NODES_CONNECTED, conReg);
		}
	};
    
	v.disconnectAs = function(mom, dad, conA, conB, chanA, chanB) {
		for(var i = 0; i < connections.length; ++i) {
			var c = connections[i];
			if ((!mom || c.ackNodeIn === mom) &&
				(!dad || c.ackNodeOut === dad) &&
				(!conA || c.c1 === conA) &&
				(!conB || c.c2 === conB) &&
				(!chanA || c.ch1 === chanA) &&
				(!chanB || c.ch2 === chanB))
			{
				var conReg = connections.splice(i--, 1)[0];
				c.ackNodeOut.disconnect(c.ackNodeIn, c.ch2, c.ch1);
				v.ps.pub(v.ON_NODES_DISCONNECTED, conReg);
			}
		}
	};
    
	v.getAckNode = function (id) {
		return nodes[id] && nodes[id];
	};
    
	v.getId = function (ackNode) {
		for(var id in nodes){
			if(nodes[id] === ackNode) return id;
		}
		return -1;
	};
	
	v.stats = function () {
		var s = {};
		s.sprite = new Sprite();
		s.sprite.mouseEnabled = false;
		var aligner = new Aligner();
		var sampleRateL = new Label();
		var currentTimeL = new Label();
		var activeSourceCountL = new Label();
		var items = [sampleRateL, currentTimeL, activeSourceCountL];
		for(var i in items) {
			aligner.add(items[i].sprite);
			s.sprite.add(items[i].sprite);
		}
		
		s.refresh = function(){
			sampleRateL.text = "sampleRate - "+ack.ctx.sampleRate;
			currentTimeL.text = "currentTime - "+ack.ctx.currentTime;
			activeSourceCountL.text = "activeSourceCount - "+ack.ctx.activeSourceCount;
		};
		return s;
	}();
	
	return v;
});