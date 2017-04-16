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
let gui = null ;
let usr = "jp" ;
let open = true ;
let s = net.createServer(s=>{
	
	s.on("error",err=>console.warn("JPOS Server Error",err)) ;
	s.on("data",d=>{
		
		if (d.toString().split("=")[0] === "gui") {
			
			gui = d.toString().substring(4,d.toString().length) ;
			s.write("OK") ;
			
		}
		else if (d.toString().split("=")[0] === "usr") {
			
			usr = d.toString().substring(4,d.toString().length) ;
			s.write("OK") ;
			
		}
		else {
			
			s.write("BAD COMMAND") ;
			
		}
		
	}) ;
	
}).listen(11519) ;

let cp = require("child_process") ;
let p = cp.spawn("startx",["/JPOS/JPOS","login"],{
	
	stdio:["inherit","ignore","ignore"]
	
}) ;
function go() {
	
	if (open) {
		
		s.close() ;
		let args ;
		if (!gui) {
			
			args = ["-p","-f",usr] ;
			
		}
		else {
			
			args = ["-p","-f",usr,"jposgui=yes","jposguirun="+gui] ;
			
		}
		cp.spawn("/bin/login",args,{stdio:"inherit"}) ;
		setTimeout(_=>{},5000) ;
		
	}
	
}
p.on("exit",_=>{
	
	go() ;
	
}) ;
