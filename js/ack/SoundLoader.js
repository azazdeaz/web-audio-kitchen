define(["ack/ack"], function(ack) {
    "use strict";
    
	var o = {};
	var sounds = {};
	o.createLog = function(cb, progressCb) {
		var log = {
			ready: false,
			cbs: [],
			progressCbs: [],
			buffer: undefined
		}
		if(typeof(cb) === "function") log.cbs.push(cb);
		if(typeof(progressCb) === "function") log.progressCbs.push(progressCb);
		return log;
	}
	o.load = function(path, cb, progressCb) {
		if(sounds[path]) {
			if(typeof(cb) === "function") {
				if(sounds[path].ready) {
					o._complete(sounds[path], cb, progressCb);
				}
				else {
					sounds[path].cbs.push(cb);
					sounds[path].progressCbs.push(progressCb);
				}
			}
		}
		else {
			var request = new XMLHttpRequest();
			var log = o.createLog(cb, progressCb);
			log.name = path.split("/");
			log.name = log.name[log.name.length-1];
			log.abort = function() {
				log.cbs = [];
				log.progressCbs = [];
				request.abort();
			}
			sounds[path] = log;
			
			request.open('GET', path, true);
			request.responseType = 'arraybuffer';
			request.onload = function() {
				o.decodeAB(request.response, log);
			}
			request.onprogress = function(evt){
				var e = {type: "loading", precent: (evt.loaded / evt.total)*100};
				for(var i in log.progressCbs) {
					log.progressCbs[i](e);
				}
			}
			request.send();
			
			return function(){
				if(log.abort) log.abort();
			}
		}
	}
	o.loadFile = function (file, cb, progressCb) {
		if (file) {
			var log = o.createLog(cb, progressCb)
			log.name = file.name;
			var r = new FileReader();
			r.onload = function(e) { 
				o.decodeAB(e.target.result, log);
			}
			r.readAsArrayBuffer(file);
		}
	}
	o.decodeAB = function (ab, log) {
		ack.ctx.decodeAudioData(ab, 
			function(buffer) {
				log.buffer = buffer;
				o._complete(log);
			}, 
			function(error){
				console.log("audioProcessError: "+error);
				for(var i in log.progressCbs) {
					log.progressCbs[i]({type: "error"});
				}
			}
		);
		for(var i in log.progressCbs) {
			log.progressCbs[i]({type: "processing"});
		}
	}
	o._complete = function(log, cb, progressCb){
		var e = {type: "loaded", name:log.name};
		log.ready = true;
		for(var i in log.cbs) {
			log.cbs[i](log.buffer);
		}
		for(var i in log.progressCbs) {
			log.progressCbs[i](e);
		}
		delete log.cbs;
		delete log.progressCbs;
		
		if(cb) cb(log.buffer);
		if(progressCb) progressCb(e);
	}
	o.getBuffer = function (path) {
		if(sounds[path] && sounds[path].ready) {
			return sounds[path].buffer;
		}
		else {
			return undefined;
		}
	}
	return o;
});