/*
	
	JOTPOT OS
	
	Copyright (c) 2017 Jacob O'Toole
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
	
*/

if (process.argv.indexOf("login") !== -1) {
	
	let {app} = require("electron") ;
	let bw = require("electron").BrowserWindow ;
	let ipc = require("electron").ipcMain ;
	let cp = require("child_process") ;
	let debugmode = false ;
	let win, screen ;
	
	function setOnServer(s,vara,val) {
		
		return new Promise((resolve,reject)=>{
			
			s.once("data",d=>{
				
				d = d.toString() ;
				console.log("Server resp",d) ;
				if (d === "OK") {
					
					resolve() ;
					
				}
				else {
					
					reject(d) ;
					
				}
				
			}) ;
			s.write(`${vara}=${val}`) ;
			
		}) ;
		
	}
	
	function go() {
		
		win = new bw({frame:false,width:screen.width,height:screen.height,resizable:false,fullscreen:true,left:0,top:0}) ;
		win.setSize(screen.width,screen.height) ;
		win.setPosition(0,0) ;
		win.loadURL("file://"+__dirname+"/login.html") ;
		
		if (debugmode) {
			
			win.webContents.openDevTools() ;
			
		}
		
	}
	
	app.on("ready",_=>{
		
		screen = require("electron").screen.getPrimaryDisplay().size ;
		go() ;
		
	}) ;
	
	ipc.on("go",(m,gui,usr)=>{
		
		let s = require("net").createConnection("11519") ;
		let fi =_=> {
			
			s.end() ;
			win.close() ;
			app.quit() ;
			
		} ;
		
		if (gui) {
			
			setOnServer(s,"gui",gui).then(_=>setOnServer(s,"usr",usr)).then(fi) ;
			
		}
		
		else {
			
			setOnServer(s,"usr",usr).then(fi) ;
			
		}
		
	}) ;
	
}

else {
	
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
	require(path.join(process.cwd(),"/resources/JPOS.asar/keytracker-main.js")) ;
	global.main = null ;
	let w = new Object() ;
	let debugmode = false ;

	app.on("ready",_=>{
		
		let screen = require("electron").screen.getPrimaryDisplay().size ;
		main = new bw({frame:false,width:screen.width,height:screen.height,resizable:false,fullscreen:true,top:0,left:0}) ;
		main.setSize(screen.width,screen.height) ;
		main.setPosition(0,0) ;
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
		
		if (doDefault && typeof defaults[ext] !== "undefined") {
			
			main.webContents.send("newWindow",[apps[defaults[ext]].start+"#"+file,{node:apps[defaults[ext]].node}]) ;
			return ;
			
		}
		
		let progs = new Object() ;
		
		for (let doing in apps) {
			
			if (apps[doing].files.indexOf(ext) !== -1) {
				
				progs[apps[doing].name] = doing ;
				
			}
			
		}
		
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

}
