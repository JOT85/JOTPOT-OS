console.log("JPOS Module Loading...") ;

let ipc = require("electron").ipcRenderer ;
let events = require("events") ;

module.exports = {
	
	download:(...args)=>ipc.send("download",args),
	open:(...args)=>ipc.send("open",...args),
	popup:(o)=>{
		
		return new Promise(resolve=>{
			
			let ID = ipc.sendSync("popup",o,false) ;
			console.log(`Waiting for popup ${ID}`) ;
			ipc.once(`popup-done-${ID}`,(m,value)=>{
				
				resolve(value) ;
				
			}) ;
			
		}) ;
		
	},
	popupSync:(o)=>ipc.sendSync("popup",o,true),
	window:new(class extends events {})(),
	close
	
} ;

Object.assign(module.exports.window,{
	
	show:_=>ipc.sendToHost("show"),
	hide:_=>ipc.sendToHost("hide"),
	center:_=>ipc.sendToHost("center"),
	setWidth:w=>ipc.sendToHost("set-width",w),
	setHeight:h=>ipc.sendToHost("set-height",h),
	setTop:t=>ipc.sendToHost("set-top",t),
	setLeft:l=>ipc.sendToHost("set-left",l),
	close:_=>window.close()
	
}) ;

ipc.on("window-close",_=>{
	
	console.log("Closing...") ;
	module.exports.window.emit("close") ;
	module.exports.window.close() ;
	
}) ;