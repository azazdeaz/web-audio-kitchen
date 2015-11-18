define(["ack/View", "ack/ack", "ack/gui/gui", "ack/CreateBar", 
    "ack/node/AudioBufferSource", "ack/node/BiquadFilterNode", "ack/node/AnalyserNode"], 
    function (View, ack, gui, CreateBar, 
        AudioBufferSource, BiquadFilterNode, AnalyserNode) {
    "use strict";
        
    return {
        a: function(){
            var absId = View.addNode(AudioBufferSource);
            var abs = View.getAckNode(absId);
            var bfId = View.addNode(BiquadFilterNode);
            var bf = View.getAckNode(bfId);
            var aId = View.addNode(AnalyserNode);
            var a = View.getAckNode(aId);
            var d = View.getAckNode(0);
            View.connectAs(d, a, "in0", "out0", 0, 0);
            View.connectAs(a, bf, "in0", "out0", 0, 0);
            View.connectAs(bf, abs, "in0", "out0", 0, 0);
            var s = CreateBar.sprite.x + CreateBar.sprite.w + 100;
            var w = ack.w - s;
            var space = (w - gui.c.windowWidth*4) / 5;
            s+= space;
            space += gui.c.windowWidth;
            abs.win.setPos(s, (ack.h - abs.win.sprite.h) / 2);
            bf.win.setPos(s + space, (ack.h - bf.win.sprite.h) / 2);
            a.win.setPos(s + space * 2, (ack.h - a.win.sprite.h) / 2);
            d.win.setPos(s + space * 3, (ack.h - d.win.sprite.h) / 2);
            abs.addHelp();
            bf.apFrequency.manualSetValue(18900);
            ack.stage.change();
        }
    };
});