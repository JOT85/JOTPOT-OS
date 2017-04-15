let fs = require("fs") ;
let path = require("path") ;
module.exports.copy = (file1,file2) => {
	
	console.log("Woo") ;
	return new Promise((resolve,reject)=>{
		
		console.log("Opeining 1...") ;
		fs.open(file1,"r",(err,fd1)=>{
			
			if (err) {
				
				reject(err) ;
				
			}
			
			else {
				
				console.log("Stating 1...") ;
				fs.fstat(fd1,(err,stats1)=>{
					
					if (err) {
						
						reject(err) ;
						
					}
					
					else if (stats1.isDirectory()) {
						
						console.log("Stating 2 (dir mode)...") ;
						fs.stat(file2,(err,stats2)=>{
							
							let go =_=> {
								
								console.log("Modding 2 (dir mode)...") ;
								fs.chmod(file2,stats1.mode,err=>{
									
									if (err) {
										
										reject(err) ;
										
									}
									
									else {
										
										console.log("Owning 2 (dir mode)...") ;
										fs.chown(file2,stats1.uid,stats1.gid,err=>{
											
											if (err) {
												
												reject(err) ;
												
											}
											
											else {
												
												console.log("Reading 1 (dir mode)...") ;
												fs.readdir(file1,(err,dir)=>{
													
													if (err) {
														
														reject(err) ;
														
													}
													
													else {
														
														console.log("Dir contents",dir) ;
														let doing = -1 ;
														let next =_=> {
															
															doing++ ;
															
															if (doing >= dir.length) {
																
																resolve() ;
																
															}
															
															else {
																
																console.log(`Copying ${path.join(file1,dir[doing])} to ${path.join(file2,dir[doing])}`) ;
																module.exports.copy(path.join(file1,dir[doing]),path.join(file2,dir[doing])).then(next) ;
																
															}
															
														} ;
														next() ;
														
													}
													
												}) ;
												
											}
											
										}) ;
										
									}
									
								}) ;
								
							} ;
							
							if (err) {
								
								if (err.code === "ENOENT") {
									
									fs.mkdir(file2,err=>{
										
										if (err) {
											
											reject(err) ;
											
										}
										
										else {
											
											go() ;
											
										}
										
									}) ;
									
								}
								
								else {
									
									reject(err) ;
									
								}
								
							}
							
							else {
								
								if (stats2.isFile()) {
									
									reject("Dest is a file...") ;
									
								}
								
								else {
									
									go() ;
									
								}
								
							}
							
						}) ;
						
					}
					
					else {
						
						console.log("Opening 2...") ;
						fs.open(file2,"w",(err,fd2)=>{
							
							if (err) {
								
								reject(err) ;
								
							}
							
							else {
								
								console.log("Piping...") ;
								let write = fs.createWriteStream(file2,{
									
									fd:fd2
									
								}) ;
								
								let read = fs.createReadStream(file1,{
									
									fd:fd1
									
								}) ;
								
								read.on("end",_=>{
									
									console.log("Setting mode...") ;
									fs.fchmod(fd2,stats1.mode,err=>{
										
										if (err) {
											
											reject(err) ;
											
										}
										
										else {
											
											console.log("Moding ownership...") ;
											fs.chown(file2,stats1.uid,stats1.gid,err=>{
												
												if (err) {
													
													reject(err) ;
													
												}
												
												else {
													
													resolve() ;
													
												}
												
											}) ;
											
										}
										
									}) ;
									
								}) ;
								
								read.pipe(write) ;
								
							}
							
						}) ;
						
					}
					
				}) ;
				
			}
			
		}) ;
		
	}) ;
	
} ;