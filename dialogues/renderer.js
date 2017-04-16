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

if (window.location.search) {
	
	let JPOS = require("JPOS") ;
	let ipc = require("electron").ipcRenderer ;
	let id = window.location.search.substring(1,window.location.search.length) ;
	ipc.on("do",(m,o)=>{
		
		window.onunload =e=> {
			
			ipc.send("Dialogue-Got",id,null) ;
			
		} ;
		
		if (typeof o.title !== "undefined") {
			
			document.title = o.title ;
			
		}
		
		let elems = new Array() ;
		if (typeof o.message !== "undefined") {
			
			let creating = document.createElement("div") ;
			creating.classList.add("title") ;
			creating.innerText = o.message ;
			document.body.appendChild(creating) ;
			elems.push(creating) ;
			
		}
		
		if (typeof o.details !== "undefined") {
			
			let creating = document.createElement("div") ;
			creating.classList.add("message") ;
			creating.innerText = o.details ;
			document.body.appendChild(creating) ;
			elems.push(creating) ;
			
		}
		
		let bContainer ;
		if (typeof o.options === "object") {
			
			bContainer = document.createElement("div") ;
			
			for (let doing in o.options) {
				
				let creating = document.createElement("button") ;
				creating.type = "button" ;
				creating.classList.add("option") ;
				creating.innerText = o.options[doing] ;
				creating.addEventListener("click",_=>{
					
					ipc.send("Dialogue-Got",id,parseInt(doing)) ;
					window.close() ;
					
				}) ;
				bContainer.appendChild(creating) ;
				
			}
			
		}
		
		else if (typeof o.input === "object") {
			
			bContainer = document.createElement("form") ;
			
			let creating = document.createElement("input") ;
			creating.type = "text" ;
			creating.classList.add("option") ;
			creating.style.width = "80%" ;
			creating.value = o.input.value || "" ;
			creating.placeholder = o.input.placeholder || "" ;
			bContainer.appendChild(creating) ;
			creating.focus() ;
			
			bContainer.addEventListener("submit",e=>{
				
				e.preventDefault() ;
				ipc.send("Dialogue-Got",id,creating.value) ;
				window.close() ;
				e.returnValue = false ;
				return false ;
				
			}) ;
			
			let submiter = document.createElement("input") ;
			submiter.type = "submit" ;
			submiter.classList.add("option") ;
			submiter.value = o.input.button || "OK" ;
			bContainer.appendChild(submiter) ;
			
		}
		
		bContainer.classList.add("bContainer") ;
		elems.push(bContainer) ;
		document.body.appendChild(bContainer) ;
		
		JPOS.window.on("close",_=>{
			
			ipc.send("Dialogue-Got",id,o.closeButton||-1) ;
			
		}) ;
		
		JPOS.window.setWidth(510) ;
		let height = 0 ;
		for (let doing in elems) {
			
			height += elems[doing].getBoundingClientRect().height ;
			
		}
		JPOS.window.setHeight(height+30) ;
		JPOS.window.center() ;
		JPOS.window.show() ;
		
	}) ;
	ipc.send("Dialogue-Get",id) ;
	
}