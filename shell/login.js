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
