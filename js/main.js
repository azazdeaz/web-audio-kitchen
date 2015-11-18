//$(document).ready(function() {
//	$(document.body).css("margin", "0px");
//	$('#container').css("background-image", "url(res/gfx/blackorchid.png)");
//	$('body').css("margin","0px");
//	$('body').css("height","100%");
//	$('html').css("height","100%");
//	ACK.init();
//});

requirejs.config({
    baseUrl: "js/"
});

require(["jquery", "ack/init"], function ($, init) {
    $(document).ready(function() {
        $(document.body).css("margin", "0px");
        $('#container').css("background-image", "url(res/gfx/blackorchid.png)");
        $('body').css("margin","0px");
        $('body').css("height","100%");
        $('html').css("height","100%");
        init();
    });
});