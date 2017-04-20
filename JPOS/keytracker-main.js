//Replace false with true to enable the keytracker...
//Ensure you also do this in keytracker.js too

if (false) {

	const ipc = require("electron").ipcMain ;
	let currentID = 0 ;

	ipc.on("keydown",(e,key,id)=>{
		
		let thisID = currentID++ ;
		ipc.once("keydown-"+thisID,(e,keydown)=>{
			
			e.sender.send("keydown-"+id,keydown) ;
			
		}) ;
		main.send("keydown",key,thisID) ;
		
	}) ;

	ipc.on("keydownSync",(e,key)=>{
		
		let thisID = currentID++ ;
		ipc.once("keydown-"+thisID,(e2,keydown)=>{
			
			console.log("Returning",keydown) ;
			e.returnValue = keydown ;
			
		}) ;
		main.send("keydown",key,thisID) ;
		
	}) ;

}