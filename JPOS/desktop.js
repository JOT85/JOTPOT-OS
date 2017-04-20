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

let ipc = require("electron").ipcRenderer ;
let fs = require("fs") ;

let cs = JSON.parse(fs.readFileSync("./settings.json").toString()) ;
document.body.style.background = `${cs.bgcolor} url('${cs.wallpaper}') center center/${cs.wallpapersize[0]} ${cs.wallpapersize[1]} no-repeat` ;

let apps = JSON.parse(fs.readFileSync("./apps.json").toString()) ;

{
	
	let creating = document.createElement("div") ;
	creating.classList.add("app") ;
	creating.id = "exit" ;
	creating.style.backgroundImage = `url('x.png')` ;
	creating.addEventListener("click",_=>{
		
		ipc.send("closeall") ;
		
	}) ;
	let text = document.createElement("div") ;
	text.classList.add("app-label") ;
	text.innerText = "Back to command line" ;
	creating.appendChild(text) ;
	document.body.appendChild(creating) ;
	
}

{
	
	let creating = document.createElement("div") ;
	creating.classList.add("app") ;
	creating.id = "debugmode" ;
	creating.addEventListener("click",_=>{
		
		ipc.send("debugmode") ;
		
	}) ;
	let text = document.createElement("div") ;
	text.classList.add("app-label") ;
	text.innerText = "Debug Mode" ;
	creating.appendChild(text) ;
	document.body.appendChild(creating) ;
	
}

for (let doing in apps) {
	
	let creating = document.createElement("div") ;
	console.log(creating) ;
	creating.classList.add("app") ;
	creating.style.backgroundImage = `url('${apps[doing].icon}')` ;
	creating.addEventListener("click",_=>{
		
		ipc.send("newWindow",[apps[doing].start,{node:apps[doing].node}]) ;
		
	}) ;
	let text = document.createElement("div") ;
	text.classList.add("app-label") ;
	text.innerText = apps[doing].name ;
	creating.appendChild(text) ;
	document.body.appendChild(creating) ;
	
}