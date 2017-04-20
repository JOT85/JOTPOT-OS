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