define(["utils/Sprite", "ack/gui/Aligner", "ack/gui/gui", "ack/View",
    "ack/gui/Button",
    "ack/node/AudioBufferSource", "ack/node/AnalyserNode", "ack/node/GainNode", 
    "ack/node/DelayNode", "ack/node/BiquadFilterNode", "ack/node/PannerNode",
    "ack/node/ConvolverNode", "ack/node/ChannelSplitterNode", "ack/node/ChannelMergerNode",
    "ack/node/DynamicsCompressorNode", "ack/node/OscillatorNode", "ack/node/AudioListener"], 
    function(
        Sprite, Aligner, gui, View,
        Button,
        AudioBufferSource, AnalyserNode, GainNode, 
        DelayNode, BiquadFilterNode, PannerNode,
        ConvolverNode, ChannelSplitterNode, ChannelMergerNode,
        DynamicsCompressorNode, OscillatorNode, AudioListener
    ) {
    "use strict";

    var o = {};
    
    o.sprite = new Sprite();
    o.aligner = new Aligner(undefined, 5);
    var nodes = [
        {n:"audio buffer source node", c:AudioBufferSource},
        // {n:"MediaElementAudioSourceNode", c:MediaElementAudioSourceNode},
        // {n:"MediaStreamAudioSourceNode", c:MediaStreamAudioSourceNode},
        // {n:"script processor node", c:ScriptProcessorNode},
        {n:"analyser node", c:AnalyserNode},
        {n:"gain node", c:GainNode},
        {n:"delay node", c:DelayNode },
        {n:"biquad filter node", c:BiquadFilterNode},
        // {n:"wave shaper node", c:WaveShaperNode},
        {n:"panner node", c:PannerNode},
        {n:"convolver node", c:ConvolverNode},
        {n:"channel splitter node", c:ChannelSplitterNode},
        {n:"channel merger node", c:ChannelMergerNode},
        {n:"dynamics compressor node", c:DynamicsCompressorNode},
        {n:"oscillator node", c:OscillatorNode},
        {n:"audio listener", c:AudioListener}
    ];
    for(var i in nodes) {
        add(nodes[i]);
    }

    function add(node) {
        var btn = new Button(node.n, gui.c.buttonA);
        btn.ps.sub(gui.evt.ON_PRESS, function(){
            View.addNode(node.c);
        });
        o.sprite.add(btn.sprite);
        o.aligner.add(btn.sprite);
    }
    o.sprite.autoWH(true);
    
    return o;
});