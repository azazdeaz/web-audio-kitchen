define (["utils/Sprite", "ack/ack", "ack/node/Destination", "ack/CreateBar", 
    "ack/View", "ack/Lines", "ack/examples"], 
    function (Sprite, ack, Destination, CreateBar, 
        View, Lines, examples) {
            
    "use strict";
            
	var mf = {};
	mf.init = function() {
		mf.sWindows = new Sprite();
		ack.extraItems = ack.extraItems();
		
		// ack.stage.add(View.stats.sprite);
		ack.stage.add(ack.extraItems.logo);
		ack.stage.add(ack.extraItems.beta);
		ack.stage.add(mf.sWindows);
		mf.sWindows.add(Lines.sprite);
		ack.stage.add(CreateBar.sprite);
		
		CreateBar.sprite.x = 38;
		CreateBar.sprite.y = 120;
		
		View.ps.sub(View.ON_NODE_ADDED, mf.onNodeAdded);
		View.ps.sub(View.ON_NODE_REMOVED, mf.onNodeRemoved);
		
		//test//////////////////////////
		// View.addNode(AudioBufferSource);
		View.addNode(Destination);
		// View.addNode(GainNode);
		// View.addNode(DelayNode);
		// View.addNode(OscillatorNode);
		// View.addNode(PannerNode);
		// ack.stage.logHierarchy();
		examples.a();
	};
	mf.onNodeAdded = function(id) {
		var node = View.getAckNode(id);
		mf.sWindows.add(node.win.sprite);
		node.win.setPos(
			CreateBar.sprite.x + CreateBar.sprite.w + 23,
			CreateBar.sprite.y
		);
	};
	mf.onNodeRemoved = function(id) {
		mf.sWindows.remove(View.getAckNode(id).win.sprite);
	};
    
	return mf;
});