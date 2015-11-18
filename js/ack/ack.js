define (["utils/utils", "utils/PubSub", "utils/Sprite"], 
    function (utils, PubSub, Sprite) {
        
    var ack = {};
    ack.ps = new PubSub();

    ack.extraItems = function(){
        var o = {};
        o.logo = new Sprite(utils.createCtx().canvas);
        try{
            canvg(o.logo.canvas, ack.paths.svg + 'logo.svg', { 
                renderCallback: function() {o.logo.change();}
            });
        } catch(e) {console.log("svg renderer falied\n",e);}
        o.logo.x = 36;
        o.logo.y = 60;

        o.beta = new Sprite(utils.createCtx().canvas);
        try{
            canvg(o.beta.canvas, ack.paths.svg + 'beta.svg', { 
                renderCallback: function() {o.beta.change();}
            });
        } catch(e) {console.log("svg renderer falied\n",e);}
        o.beta.x = 36;

        return o;
    };

    ack.paths = {
        svg: "res/svg/",
        sampleSnd: "res/sfx/samples/",
    };

    return ack;
});