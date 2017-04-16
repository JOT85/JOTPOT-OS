/*
	Copyright 2017 Jacob O'Toole
	
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	
	    http://www.apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

let app = require("electron").app ;
let bw = require("electron").BrowserWindow ;
let win ;

function start() {
	
	let screen = require("electron").screen.getPrimaryDisplay().size ;
	win = new bw({frame:false,width:screen.width,height:screen.height,resizable:false,fullscreen:true,left:0,top:0}) ;
	win.setSize(screen.width,screen.height) ;
	win.setPosition(0,0) ;
	win.loadURL(`file://${__dirname}/index.html`) ;
	//win.webContents.openDevTools() ;
	
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

require("electron").ipcMain.on("open-dev-tools",_=>{
	
	win.openDevTools() ;
	
}) ;