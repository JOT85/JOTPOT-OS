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
