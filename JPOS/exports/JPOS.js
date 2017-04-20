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