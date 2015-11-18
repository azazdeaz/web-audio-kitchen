define(["utils/utils", "ack/ack", "ack/gui/gui", "ack/View", "utils/MouseEvent",
    "ack/gui/Button"], 
    function (utils, ack, gui, View, MouseEvent,
        Button) {
        "use strict";
    
    var o = {};
    
    o.ON_SELECT_CONNECTOR = "onSelectConnector";
    o.ON_CONNECT_ME = "onConnectMe";
    o.ON_DISCONNECT = "onDisconnect";
    o.ON_CONNECT_TO_INPUT = "onConnectToInput";

    o.createPlugBtn = function (isInput, channel) {
        channel = channel || 0;
        var aType = isInput ? "input" : "output";
        var bType = isInput ? "output" : "input";
        var plugBtn = new Button(aType+" "+channel);
        plugBtn.sprite.draggable = true;
        plugBtn.sprite.ps.sub(MouseEvent.DRAG_START, function(e){
            ack.Lines.startWiring(this.win, isInput ? "in" : "out");
            e.setDragData({type: aType, ackNode: this, channel: channel});
        }, this);
        plugBtn.sprite.ps.sub(MouseEvent.DRAG_END, function(e){
            var dragData = e.getDragData();
            if(dragData && dragData.type === bType) {
                if(isInput) {
                    View.connectAs(this, dragData.ackNode, channel, dragData.channel);
                } else {
                    View.connectAs(dragData.ackNode, this, dragData.channel, channel);
                }
            }
        }, this);
        return plugBtn;
    };

    o.createDisconnectBtn = function () {
        var dcBtn = new Button("disconnect");
        dcBtn.ps.sub(gui.evt.ON_PRESS, function(){
            // this.disconnect();
        }, this);
        return dcBtn;
    };

    o.reconnectFunction = function () {
        var conSave = this.connections.concat();
        this.disconnect();
        for(var i in conSave) {
            var c = conSave[i];
            this.connect(c.ackNode, c.outChannel, c.inChannel);
        }
    };
    
    return o;
});
