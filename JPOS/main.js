let {app} = require("electron") ;
let bw = require("electron").BrowserWindow ;
let wc = require("electron").webContents ;
let ipc = require("electron").ipcMain ;
let fs = require("fs") ;
let path = require("path") ;
let cd = __dirname.split(path.sep) ;
cd.pop() ;
cd.pop() ;
cd = cd.join(path.sep) ;
process.chdir(cd) ;
let dialogues = require(path.join(process.cwd(),"/resources/dialogues.asar/main.js")) ;
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
ipc.on("open",(m,file,doDefault=true)=>{
	
	let ext = path.extname(file).toLowerCase() ;
	//console.log("Opeining",ext,"file...") ;
	if (doDefault && typeof defaults[ext] !== "undefined") {
		
		//console.log("Default found...") ;
		//console.log(defaults[ext]) ;
		main.webContents.send("newWindow",[apps[defaults[ext]].start+"#"+file,{node:apps[defaults[ext]].node}]) ;
		return ;
		
	}
	let progs = new Object() ;
	//console.log(progs) ;
	for (let doing in apps) {
		
		//console.log(apps[doing].files) ;
		//console.log(ext) ;
		if (apps[doing].files.indexOf(ext) !== -1) {
			
			progs[apps[doing].name] = doing ;
			
		}
		
	}
	//console.log(progs) ;
	dialogues.popup({
		
		title:"Select a default programme.",
		message:"Please choose a default programme for opening " + ext + " files with.",
		options:Object.keys(progs)
		
	},true).then(toBeDefault=>{
		
		toBeDefault = progs[Object.keys(progs)[toBeDefault]] ;
		defaults[ext] = toBeDefault ;
		fs.writeFile("./defaults.json",JSON.stringify(defaults),_=>console.log("Saved...")) ;
		main.webContents.send("newWindow",[apps[defaults[ext]].start+"#"+file,{node:apps[defaults[ext]].node}]) ;
		
	}) ;
	
}) ;