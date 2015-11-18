define(["fontdetect", "utils/IsReady"], function(fontdetect, IsReady) {
    "use strict";
    
    var GUI = {};

    GUI.c = {
        unit: 24,
        fontName: "TitilliumText25L250wt",
        fontSize: "12px",
        fontYOffset: 16,
        fillColor: "#333333",
        fontColor: "#ffffff",
        windowBgColor: "#1a1a1a",
        windowMargin: 10,
        windowWidth: 190,
        colors: {
            pink:"#ed1e79",
            input:"#00a99d",
            output:"#662d91",
            yellow:"#f7931e",
            white:"#ffffff",
            black:"#000000",
            grey1:"#1a1a1a",
            grey2 :"#333333",
            grey3 :"#4d4d4d",
            grey4 :"#999999"
        },
        baseSpace: 2
    }
    GUI.c.defaultItemW = GUI.c.windowWidth - (GUI.c.windowMargin * 2);
    GUI.c.buttonA = {
        height: 24,
        fontSize: "14px",
        fontYOffset: 16,
        xMargin: 10,
        width: 186,
        fillColorN: GUI.c.colors.grey2,
        fontColorN: GUI.c.colors.white,
        fillColorO: GUI.c.colors.grey4,
        fontColorO: GUI.c.colors.grey2,
        fillColorH: GUI.c.colors.white,
        fontColorH: GUI.c.colors.black,
    };
    GUI.c.buttonB = {
        height: 20,
        fontSize: "12px",
        fontYOffset: 15,
        xMargin: 3,
        width: GUI.c.defaultItemW,
        fillColorN: GUI.c.colors.black,
        fontColorN: GUI.c.colors.white,
        fillColorO: GUI.c.colors.grey3,
        fontColorO: GUI.c.colors.white,
        fillColorH: GUI.c.colors.white,
        fontColorH: GUI.c.colors.black,
    };

    GUI.evt = {};
    Object.defineProperties(GUI.evt, {
        ON_CHANGE:{value: "onChange"},
        ON_PRESS:{value: "onPress"},
        ON_CLOSE:{value: "onClose"},
        ON_METRICS_CHANGE:{value: "onMetricsChange"},
    });
    
    GUI.u = {};
    GUI.u.drawRect = function(ctx, x, y, w, h, fillColor) {
        // "#"+(~~(0xffffff*Math.random())).toString(16);
        if(!ctx) ctx = utils.createCtx(x+w, y+h);
        ctx.beginPath();
        ctx.fillStyle = fillColor===undefined ? GUI.c.fillColor : fillColor;
        // ctx.strokeStyle = borderColor===undefined ? GUI.c.borderColor : borderColor;
        // ctx.rect(x+.5, y+.5, w-1, h-1);
        ctx.rect(x, y, w, h);
        ctx.fill();
        // ctx.stroke();
        ctx.closePath();
        return ctx;
    };

    GUI.ready = new IsReady();

    fontdetect.onFontLoaded(GUI.c.fontName, function(){
        GUI.ready.turnToReady();
    });
    
    return GUI;
});