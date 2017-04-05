let ipc = require("electron").ipcMain ;
let currentD = 0 ;
let os = new Array() ;
let resolvers = new Array() ;

ipc.on("Dialogue-Get",(m,id)=>{
	
	m.sender.send("do",os[id]) ;
	
}) ;

ipc.on("Dialogue-Got",(m,id,result)=>{
	
	resolvers[id](result) ;
	
}) ;

ipc.on("popup",(m,...args)=>module.exports.popup(...args).then(console.log)) ;

module.exports.popup =o=> {
	
	currentD++ ;
	os[currentD] = o ;
	main.webContents.send("newWindow",[`../dialogues.asar/main.html?${currentD}`,true]) ;
	return new Promise(resolve=>{
		
		resolvers[currentD] = resolve ;
		
	}) ;
	
} ;