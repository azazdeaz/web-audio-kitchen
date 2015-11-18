define (function () {
    function IsReady (){
        this._ready = false;
        this._cbList = [];
    }
    
    var p = IsReady.prototype;
    
	p.check = function(){ 
        return this._ready;
    };
    
	p.onReady = function(cb) {
		if(typeof(cb) !== "function") {
            return;
        }
		this._ready ? cb() : this._cbList.push(cb);
	};
    
	p.turnToReady = function(){
		this._ready = true;
        
		var i = this._cbList.length;
		while(i-- !== 0) { 
			this._cbList[i]();
			delete this._cbList[i];
		}
	};
    
    return IsReady;
});