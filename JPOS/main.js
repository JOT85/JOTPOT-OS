let {app} = require("electron") ;
let bw = require("electron").BrowserWindow ;
let wc = require("electron").webContents ;
let ipc = require("electron").ipcMain ;
let main ;
let w = new Object() ;
let debugmode = false ;

app.on("ready",_=>{
	
	let screen = require("electron").screen.getPrimaryDisplay().size ;
	main = new bw({frame:false,width:screen.width,height:screen.height,resizable:false,fullscreen:true}) ;
	main.on("close",_=>app.quit()) ;
	main.loadURL("file://"+__dirname+"/container.html") ;
	
	if (debugmode) {
		
		main.webContents.openDevTools() ;
		
	}
	
}) ;

ipc.on("desktopContents",(m,d)=>{
	
	w.desktop = wc.fromId(d) ;
	
	if (debugmode) {
		
		w.desktop.openDevTools() ;
		
	}
	
}) ;

ipc.on("windowContents",(m,d)=>{
	
	if (debugmode) {
		
		wc.fromId(d).openDevTools() ;
		
	}
	
}) ;

ipc.on("newWindow",(m,d)=>main.webContents.send("newWindow",d)) ;
ipc.on("debugmode",_=>{
	
	debugmode = true ;
	if (debugmode) {
		
		main.webContents.openDevTools() ;
		w.desktop.openDevTools() ;
		
	}
	
}) ;
ipc.on("closeall",_=>app.quit()) ;
