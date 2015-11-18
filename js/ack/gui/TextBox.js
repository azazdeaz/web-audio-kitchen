define(["ack/gui/gui", "ack/gui/GuiItem", "utils/utils", "ack/gui/Label", 
    "utils/Sprite"], 
    function (gui, GuiItem, utils, Label, 
        Sprite) {
        "use strict";

	function TextBox(str) {
        p.Super.apply(this, arguments);
		
        str = str || "";
		var baseH = 23;
		var arrowW = 5;
		this.sprite = new Sprite();
		this.sprite.mouseEnabled = false;
		this.sprite.name = "TextBox";
		this.box = new Sprite();
		this.label = new Label(str, {
			size: "14px",
			yOffset: 16,
			xMargin: 10,
			color: "#ffffff"
		});
		var labelW = this.label.sprite.w;
		this.label.sprite.y = (baseH - this.label.sprite.h) / 2;
		this.box.ctx = utils.createCtx(labelW + arrowW, baseH);
		this.box.canvas = this.box.ctx.canvas;
		this.box.x = -labelW - arrowW;
		this.box.y = -baseH/2;
		
		this.box.ctx.beginPath();
		this.box.ctx.moveTo(0, 0);
		this.box.ctx.lineTo(labelW, 0);
		this.box.ctx.lineTo(labelW + arrowW, baseH/2);
		this.box.ctx.lineTo(labelW, baseH);
		this.box.ctx.lineTo(0, baseH);
		this.box.ctx.closePath();
		this.box.ctx.fillStyle = gui.c.colors.grey1;
		this.box.ctx.fill();
		this.box.ctx.beginPath();
		
		this.sprite.add(this.box);
		this.box.add(this.label.sprite);
	};
	var p = utils.inherit(TextBox, GuiItem);
    
	return TextBox;
});