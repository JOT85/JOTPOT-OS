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

let ipc = require("electron").ipcMain ;
let currentI = 0 ;
let os = new Array() ;
let resolvers = new Array() ;

ipc.on("Dialogue-Get",(m,id)=>{
	
	m.sender.send("do",os[id]) ;
	
}) ;

ipc.on("Dialogue-Got",(m,id,result)=>{
	
	resolvers[id](result) ;
	
}) ;

ipc.on("popup",(m,o,sync)=>{
	
	if (!sync) {
		
		let ID = module.exports.popup(o,false) ;
		m.returnValue = ID ;
		resolvers[ID] = result => {
			
			m.sender.send("popup-done-"+ID,result) ;
			
		} ;
		
	}
	
	else {
		
		module.exports.popup(o,true).then(val=>m.returnValue=val) ;
		
	}
	
}) ;

module.exports.popup =(o,returnPromise=false)=> {
	
	currentI++ ;
	let currentID = currentI ;
	os[currentID] = o ;
	main.webContents.send("newWindow",[`../dialogues.asar/main.html?${currentID}`,{node:true,autoShow:false,resize:false,onTop:true}]) ;
	
	if (returnPromise) {
		
		return new Promise(resolve=>{
			
			resolvers[currentID] = resolve ;
			
		}) ;
		
	}
	
	resolvers[currentID] =_=> {} ;
	return currentID ;
	
} ;