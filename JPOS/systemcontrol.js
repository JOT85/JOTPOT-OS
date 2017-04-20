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