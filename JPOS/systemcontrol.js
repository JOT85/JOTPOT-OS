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

let net = require("net") ;
function doC(toDo) {
	
	return new Promise((resolve,reject)=>{
		
		s = net.createConnection(31012) ;
		s.on("connect",_=>{
			
			s.on("data",d=>{
				
				d = d.toString() ;
				if (d === "OK") {
					
					resolve(d) ;
					
				}
				else {
					
					reject(d) ;
					
				}
				
			}) ;
			s.write(toDo) ;
			
		}) ;
		
	}) ;
	
}

module.exports = {
	
	Shutdown:_=>doC("shutdown"),
	Reboot:_=>doC("reboot"),
	Hibernate:_=>doC("hibernate"),
	Suspend:_=>doC("suspend")
	
} ;
let options = Object.keys(module.exports) ;
module.exports.createMenu =(logoutFunc=false)=> {
	
	let menu = document.createElement("div") ;
	let rv = {
		
		menu: menu,
		options: new Array()
		
	} ;
	menu.classList.add("power-menu") ;
	for (let doing in options) {
		
		let creating = document.createElement("div") ;
		creating.classList.add("power-menu-item") ;
		creating.innerText = options[doing] ;
		creating.addEventListener("click",module.exports[options[doing]]) ;
		menu.appendChild(creating) ;
		rv.options.push(creating) ;
		
	}
	if (typeof logoutFunc === "function") {
		
		let creating = document.createElement("div") ;
		creating.classList.add("power-menu-item") ;
		creating.innerText = "Logout" ;
		creating.addEventListener("click",logoutFunc) ;
		menu.appendChild(creating) ;
		rv.options.push(creating) ;
	}
	return rv ;
	
} ;