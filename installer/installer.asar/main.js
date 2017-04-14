let app = require("electron").app ;
let bw = require("electron").BrowserWindow ;
let win ;

function start() {
	
	let screen = require("electron").screen.getPrimaryDisplay().size ;
	win = new bw({frame:false,width:screen.width,height:screen.height,resizable:false,fullscreen:true,left:0,top:0}) ;
	win.setSize(screen.width,screen.height) ;
	win.setPosition(0,0) ;
	win.loadURL(`file://${__dirname}/index.html`) ;
	win.webContents.openDevTools() ;
	
}

app.on("ready",_=>{
	
	start() ;
	
}) ;

require("electron").ipcMain.on("force-restart",_=>{
	
	win.close() ;
	
	setTimeout(_=>{
		
		require("fs").writeFileSync("./current-stage","-1") ;
		start() ;
		
	},5000) ;
	
}) ;