let ipc = require("electron").ipcMain ;
let currentI = 0 ;
let os = new Array() ;
let resolvers = new Array() ;

ipc.on("Dialogue-Get",(m,id)=>{
	
	m.sender.send("do",os[id]) ;
	
}) ;

ipc.on("Dialogue-Got",(m,id,result)=>{
	
	resolvers[id](result) ;
	
}) ;

ipc.on("popup",(m,o,sync)=>{
	
	if (!sync) {
		
		let ID = module.exports.popup(o,false) ;
		m.returnValue = ID ;
		resolvers[ID] = result => {
			
			m.sender.send("popup-done-"+ID,result) ;
			
		} ;
		
	}
	
	else {
		
		module.exports.popup(o,true).then(val=>m.returnValue=val) ;
		
	}
	
}) ;

module.exports.popup =(o,returnPromise=false)=> {
	
	currentI++ ;
	let currentID = currentI ;
	os[currentID] = o ;
	main.webContents.send("newWindow",[`../dialogues.asar/main.html?${currentID}`,{node:true,autoShow:false,resize:false}]) ;
	
	if (returnPromise) {
		
		return new Promise(resolve=>{
			
			resolvers[currentID] = resolve ;
			
		}) ;
		
	}
	
	resolvers[currentID] =_=> {} ;
	return currentID ;
	
} ;