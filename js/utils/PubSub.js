define(function() {
    
    function PubSub () {
        this.types = {};
    };
    
    var p = PubSub.prototype;
    
	p.sub = function(type, cb, context) {
        this.unsub(type, cb, context);
        
		if(typeof(cb) !== "function") {
            throw(new TypeError("callback is not a function!"));
        }
        
		var reg = {cb: cb, context:context};
		this.types[type] ? this.types[type].push(reg) : this.types[type] = [reg];
	};
    
	p.unsub = function(type, cb, context) {
		var list = this.types[type];
        
		if (list) {
            for(var i = 0; i < list.length; ++i) {
                if ((!cb || list[i].cb === cb) && 
                    (!context || list[i].context === context)) 
                {
                    list.splice(i--, 1);
                }
            }
        }
	};
    
	p.pub = function(type, data) {
		var list = this.types[type];
        
		if (list) {
			var cbs = [];
            
			for(var j = 0, l = list.length; j < l; ++j) {
				cbs.push(list[j]);
			}
            
			for(j = 0, l = cbs.length; j < l; ++j) {
				if(cbs[j].cb.call(cbs[j].context, data) === false) {
					return false;//stop propagation
				};
			}
		}
	};
    
	p.destroy = function() {
		for(var type in this.types){
			this.unsub(type);
			delete this.types[type];
		}
	};
    
    return PubSub;
});