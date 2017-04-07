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
	popupSync:(o)=>ipc.sendSync("popup",o,true)
	
} ;