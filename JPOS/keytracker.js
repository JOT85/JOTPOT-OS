//Replace false with true to enable the keytracker...
//Ensure you also do this in keytracker-main.js too

if (false) {
	
	var keys = new Object() ;
	//Keys that should be tracked...
	let track = ["Control","Shift","Alt"] ;

	document.body.addEventListener("keydown",e=>{
		
		if (track.indexOf(e.key) !== -1) {
			
			keys[e.key] = true ;
			
		}
		
	}) ;
	
	document.body.addEventListener("keyup",e=>{
		
		if (track.indexOf(e.key) !== -1) {
			
			keys[e.key] = false ;
			
		}
		
	}) ;
	
	const ipc = require("electron").ipcRenderer ;
	ipc.on("keydown",(e,key,id)=>{
		
		if (typeof keys[key] !== 'boolean') {
			
			ipc.send("keydown-"+id,null) ;
			
		}
		
		else {
			
			ipc.send("keydown-"+id,keys[key]) ;
			
		}
		
	}) ;
	
}