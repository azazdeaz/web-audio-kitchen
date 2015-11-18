define(["ack/ack", "utils/utils", "ack/gui/gui", "ack/Lines", "ack/MainFrame",
    "utils/Sprite"], 
    function (ack, utils, gui, Lines, MainFrame,
        Sprite) {
    "use strict";
    
    return function () {
        utils.setupPrefixedApis();
        
        try {
            ack.ctx = new window.audioContext();
        } catch(e) {
            alert("HTML5 Web Audio API is not supported in your browser.\nPlease try in Google Chrome.");
        }


        ack.container = document.getElementById("container");
        window.addEventListener("resize", onWindowResize);
        ack.w = ack.container.offsetWidth;
        ack.h = ack.container.offsetHeight;

        function onWindowResize(){
            ack.w = ack.stage.canvas.width = ack.container.offsetWidth;
            ack.h = ack.stage.canvas.height = ack.container.offsetHeight;
            ack.ps.pub("resize", {w:ack.w, h:ack.h});
            ack.stage.change();
        }

        ack.stage = new Sprite();
        ack.stage.ctx = utils.createCtx(ack.w, ack.h);
        ack.stage.canvas = ack.stage.ctx.canvas;
        ack.stage.setToStage();
        ack.container.appendChild(ack.stage.canvas);

        function start() {
            Lines.init();
            MainFrame.init();
        }

        if(gui.ready.check()) { 
            start();
        }
        else {
            gui.ready.onReady(start);
        }
    }
})