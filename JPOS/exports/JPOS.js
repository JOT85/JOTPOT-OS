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

const ipc = require("electron").ipcRenderer ;
const events = require("events") ;
let keyID = 0 ;

module.exports = {
	
	download:(...args)=>ipc.send("download",args),
	open:(...args)=>ipc.send("open",...args),
	popup:(o)=>{
		
		return new Promise(resolve=>{
			
			let ID = ipc.sendSync("popup",o,false) ;
			console.log(`Waiting for popup ${ID}`) ;
			ipc.once(`popup-done-${ID}`,(m,value)=>{
				
				resolve(value) ;
				
			}) ;
			
		}) ;
		
	},
	popupSync:(o)=>ipc.sendSync("popup",o,true),
	window:new(class extends events {})(),
	keydown:key=>{
		
		return new Promise(resolve=>{
			
			let thisID = keyID++ ;
			ipc.once(`keydown-${thisID}`,(e,status)=>resolve(status)) ;
			ipc.send("keydown",key,thisID) ;
			
		}) ;
		
	},
	keydownSync:key=>ipc.sendSync("keydownSync",key,keyID++)
	
} ;

Object.assign(module.exports.window,{
	
	show:_=>ipc.sendToHost("show"),
	hide:_=>ipc.sendToHost("hide"),
	center:_=>ipc.sendToHost("center"),
	setWidth:w=>ipc.sendToHost("set-width",w),
	setHeight:h=>ipc.sendToHost("set-height",h),
	setTop:t=>ipc.sendToHost("set-top",t),
	setLeft:l=>ipc.sendToHost("set-left",l),
	close:_=>window.close()
	
}) ;

ipc.on("window-close",_=>{
	
	module.exports.window.emit("close") ;
	module.exports.window.close() ;
	
}) ;