let {app} = require("electron") ;
let bw = require("electron").BrowserWindow ;
let wc = require("electron").webContents ;
let ipc = require("electron").ipcMain ;
let fs = require("fs") ;
let path = require("path") ;
let dialogues = require("J:/JOTPOT OS/resources/dialogues.asar/main.js") ;
global.main = null ;
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


let apps = JSON.parse(fs.readFileSync("./apps.json").toString()) ;
let defaults = JSON.parse(fs.readFileSync("./defaults.json").toString()) ;
ipc.on("open",(m,file,doDefault)=>{
	
	let ext = path.extname(file) ;
	if (doDefault && typeof defaults[ext] !== "undefined") {
		
		main.webContents.send("newWindow",[apps[defaults[ext]].start+"#"+file,apps[defaults[ext]].node]) ;
		return ;
		
	}
	let progs = new Array() ;
	for (let doing in apps) {
		
		if (apps[doing].files.indexOf(ext) !== -1) {
			
			progs.push(doing) ;
			
		}
		
	}
	console.log("Default not set, options:",progs.join(", ")) ;
	
}) ;