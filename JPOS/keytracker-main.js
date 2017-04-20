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
//Ensure you also do this in keytracker.js too

if (false) {

	const ipc = require("electron").ipcMain ;
	let currentID = 0 ;

	ipc.on("keydown",(e,key,id)=>{
		
		let thisID = currentID++ ;
		ipc.once("keydown-"+thisID,(e,keydown)=>{
			
			e.sender.send("keydown-"+id,keydown) ;
			
		}) ;
		main.send("keydown",key,thisID) ;
		
	}) ;

	ipc.on("keydownSync",(e,key)=>{
		
		let thisID = currentID++ ;
		ipc.once("keydown-"+thisID,(e2,keydown)=>{
			
			console.log("Returning",keydown) ;
			e.returnValue = keydown ;
			
		}) ;
		main.send("keydown",key,thisID) ;
		
	}) ;

}