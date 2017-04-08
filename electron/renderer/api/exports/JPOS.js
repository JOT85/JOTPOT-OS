let ipc = require("electron").ipcRenderer ;

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
	window:{
		
		show:_=>ipc.sendToHost("show"),
		hide:_=>ipc.sendToHost("hide"),
		center:_=>ipc.sendToHost("center"),
		setWidth:w=>ipc.sendToHost("set-width",w),
		setHeight:h=>ipc.sendToHost("set-height",h),
		setTop:t=>ipc.sendToHost("set-top",t),
		setLeft:l=>ipc.sendToHost("set-left",l)
		
	}
	
} ;