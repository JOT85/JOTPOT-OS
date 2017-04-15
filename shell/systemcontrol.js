let net = require("net") ;
net.createServer(s=>{
	
	s.on("data",d=>{
		
		d = d.toString() ;
		if (d === "shutdown") {
			
			s.write("OK") ;
			s.end() ;
			require("child_process").execSync("shutdown -h 0") ;
			
		}
		else if (d === "hibernate") {
			
			s.write("OK") ;
			s.end() ;
			require("child_process").execSync("systemctl hibernate") ;
			
		}
		else if (d === "suspend") {
			
			s.write("OK") ;
			s.end() ;
			require("child_process").execSync("systemctl suspend") ;
			
		}
		else {
			
			s.write("ERROR") ;
			s.end() ;
			
		}
		
	}) ;
	
}).listen(31012) ;
