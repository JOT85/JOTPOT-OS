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