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

let fs ;
try {
	
	fs = require("original-fs")
	
}

catch (err) {
	
	fs = require("fs") ;
	
}
let path = require("path") ;
module.exports.copy = (file1,file2,overwrite=2) => {
	
	return new Promise((resolve,rejectA)=>{
		
		function reject(err,...fds) {
			
			console.log("Reject called:",fds) ;
			let doing = -1 ;
			function next() {
				
				doing++ ;
				if (doing >= fds.length) {
					
					rejectA(err) ;
					
				}
				
				else {
					
					fs.close(fds[doing],next) ;
					
				}
				
			}
			next() ;
			
		}
		
		fs.open(file1,"r",(err,fd1)=>{
			
			if (err) {
				
				reject(err,fd1) ;
				
			}
			
			else {
				
				fs.fstat(fd1,(err,stats1)=>{
					
					if (err) {
						
						reject(err,fd1) ;
						
					}
					
					else if (stats1.isDirectory()) {
						
						fs.close(fd1,err=>{
							
							if (err) {
								
								reject(err) ;
								
							}
							
							else {
								
								fs.open(file2,"r+",(err,fd2)=>{
									
									let go = (check=true) => {
										
										fs.fstat(fd2,(err,stats2)=>{
											
											if (err) {
												
												reject(err,fd2) ;
												return ;
												
											}
											
											else if (check) {
												
												if (stats2.isFile()) {
													
													reject("Dest is a file...") ;
													return ;
													
												}
												
											}
											
											console.log("Ya know, are you sure we can do this???") ;
											fs.futimes(fd2,stats1.atime,stats1.mtime,err=>{
												
												console.log("Yep!") ;
												if (err) {
													
													console.log("Erm, accualy, on second thoughts...") ;
													reject(err,fd2) ;
													
												}
												
												else {
													
													fs.fchmod(fd2,stats1.mode,err=>{
														
														if (err) {
															
															reject(err,fd2) ;
															
														}
														
														else {
															
															fs.fchown(fd2,stats1.uid,stats1.gid,err=>{
																
																if (err) {
																	
																	reject(err,fd2) ;
																	
																}
																
																else {
																	
																	fs.close(fd2,err=>{
																		
																		if (err) {
																			
																			reject(err) ;
																			
																		}
																		
																		else {
																			
																			fs.readdir(file1,(err,dir)=>{
																				
																				if (err) {
																					
																					reject(err) ;
																					
																				}
																				
																				else {
																					
																					let doing = -1 ;
																					let next =_=> {
																						
																						console.log("NEXT!") ;
																						doing++ ;
																						
																						if (doing >= dir.length) {
																							
																							console.log("Copy complete...") ;
																							resolve() ;
																							
																						}
																						
																						else {
																							
																							console.log("When I said fully...") ;
																							module.exports.copy(path.join(file1,dir[doing]),path.join(file2,dir[doing]),overwrite).then(next).catch(reject) ;
																							
																						}
																						
																					} ;
																					next() ;
																					
																				}
																				
																			}) ;
																			
																		}
																		
																	}) ;
																	
																}
																
															}) ;
															
														}
														
													}) ;
													
												}
												
											}) ;
											
										}) ;
										
									} ;
									
									if (err) {
												
										if (err.code === "ENOENT") {
											
											fs.mkdir(file2,err=>{
												
												if (err) {
													
													reject(err) ;
													
												}
												
												else {
													
													fs.open(file2,"r+",(err,fd)=>{
														
														if (err) {
															
															reject(err) ;
															
														}
														
														else {
															
															fd2 = fd ;
															go() ;
															
														}
														
													}) ;
													
												}
												
											}) ;
											
										}
										
										else {
											
											reject(err) ;
											
										}
										
									}
									
									else {
										
										go() ;
										
									}
									
								}) ;
								
							}
							
						}) ;
						
					}
					
					else {
						
						fs.open(file2,"wx",(err,fd2)=>{
							
							let go =_=> {
								
								let write = fs.createWriteStream(file2,{
									
									fd:fd2,
									autoClose:false
									
								}) ;
								
								let read = fs.createReadStream(file1,{
									
									fd:fd1,
									autoClose:false
									
								}) ;
								
								write.on("error",err=>reject(err,fd1,fd2)) ;
								read.on("error",err=>reject(err,fd1,fd2)) ;
								
								read.on("end",_=>{
									
									fs.close(fd1,err=>{
										
										if (err) {
											
											reject(err,fd2) ;
											
										}
										
										else {
											
											fs.futimes(fd2,stats1.atime,stats1.mtime,err=>{
												
												if (err) {
													
													reject(err,fd2) ;
													
												}
												
												else {
													
													fs.fchmod(fd2,stats1.mode,err=>{
														
														if (err) {
															
															reject(err,fd2) ;
															
														}
														
														else {
															
															fs.fchown(fd2,stats1.uid,stats1.gid,err=>{
																
																if (err) {
																	
																	reject(err,fd2) ;
																	
																}
																
																else {
																	
																	fs.close(fd2,err=>{
																		
																		if (err) {
																			
																			reject(err) ;
																			
																		}
																		
																		else {
																			
																			resolve() ;
																			
																		}
																		
																	}) ;
																	
																}
																
															}) ;
															
														}
														
													}) ;
													
												}
												
											}) ;
											
										}
										
									}) ;
									
								}) ;
								
								read.pipe(write) ;
								
							} ;
							
							if (err) {
								
								if (err.code === "EEXIST") {
									
									let getFDAndGo =_=> {
										
										fs.open(file2,"w",(err,fd)=>{
											
											if (err) {
												
												reject(err) ;
												
											}
											
											else {
												
												fd2 = fd ;
												go() ;
												
											}
											
										}) ;
										
									} ;
									
									if (overwrite > 1) {
										
										getFDAndGo() ;
										
									}
									
									else if (overwrite === 1) {
										
										resolve() ;
										
									}
									
									else if (typeof overwrite === "function") {
										
										let rv = overwrite(file1,file2,mode=>{
											
											if (mode > 1 || mode === true) {
												
												fd2 = fd ;
												go() ;
												
											}
											
											else if (mode === 1 || mode === false) {
												
												resolve() ;
												
											}
											
											else {
												
												reject() ;
												
											}
											
										}) ;
										
									}
									
									else {
										
										reject(err) ;
										
									}
									
								}
								
								else {
									
									reject(err) ;
									
								}
								
							}
							
							else {
								
								go() ;
								
							}
							
						}) ;
						
					}
					
				}) ;
				
			}
			
		}) ;
		
	}) ;
	
} ;

module.exports.copySync = (file1,file2,overwrite=2) => {
	
	let fd2 = null ;
	
	try {
		
		let stats1 = fs.statSync(file1) ;
		
		if (stats1.isDirectory()) {
			
			let go = (checkDir=true) => {
				
				let stats2 = fs.fstatSync(fd2,"w") ;
				if (checkDir) {
					
					if (stats2.isFile()) {
						
						throw "Dest is a file..." ;
						
					}
					
				}
				fs.futimesSync(fd2,stats1.atime,stats1.mtime) ;
				fs.fchmodSync(fd2,stats1.mode) ;
				fs.fchownSync(fd2,stats1.uid,stats1.gid) ;
				fs.closeSync(fd2) ;
				let dir = fs.readdirSync(file1) ;
				
				for (let doing in dir) {
					
					module.exports.copySync(path.join(file1,dir[doing]),path.join(file2,dir[doing]),overwrite) ;
					
				}
				
			} ;
			
			try {
				
				fd2 = fs.openSync(file2,"r+") ;
				go() ;
				
			}
			
			catch(err) {
				
				if (err.code === "ENOENT") {
					
					fs.mkdirSync(file2) ;
					fd2 = fs.openSync(file2,"r+") ;
					go(false) ;
					return ;
					
				}
				
				else {
					
					throw err ;
					
				}
			
			}
			
		}
		
		else {
			
			try {
				
				fd2 = fs.openSync(file2,"wx") ;
				
			}
			
			catch (err) {
				
				fd2 = null ;
				if (err.code === "EEXIST") {
					
					if (overwrite > 1 || overwrite === true) {
						
						fd2 = fs.openSync(file2,"w") ;
						
					}
					
					else if (overwrite === 1 || overwrite === false) {
						
						return ;
						
					}
					
					else if (typeof overwrite === "function") {
						
						let mode = overwrite(file1,file2) ;
						
						if (mode > 1 || mode === true) {
							
							fd2 = fs.openSync(file2,"w") ;
							
						}
						
						else if (mode === 1 || mode === false) {
							
							return ;
							
						}
						
						else {
							
							throw err ;
							
						}
						
					}
					
					else {
						
						throw err ;
						
					}
					
				}
				
				else {
					
					throw err ;
					
				}
				
			}
			
			fs.writeSync(fd2,fs.readFileSync(file1)) ;
			fs.futimesSync(fd2,stats1.atime,stats1.mtime) ;
			fs.fchmodSync(fd2,stats1.mode) ;
			fs.fchownSync(fd2,stats1.uid,stats1.gid) ; 
			fs.closeSync(fd2) ;
			return ;
			
		}
		
	}
	
	catch (err) {
		
		if (fd2 !== null) {
			
			try {
				
				fs.closeSync(fd2) ;
				
			}
			
			catch (e) {
				
				console.warn(new Error(`Failed to close fd in error handler: ${e}`)) ;
				
			}
			
		}
		throw err ;
		
	}
	
} ;

module.exports.delete = toDel => {
	
	return new Promise((resolve,reject)=>{
		
		fs.stat(toDel,(err,stats)=>{
			
			if (err) {
				
				reject(err) ;
				
			}
			
			else {
				
				if (stats.isDirectory()) {
					
					fs.readdir(toDel,(err,dir)=>{
						
						if (err) {
							
							reject(err) ;
							
						}
						
						else {
							
							let doing = -1 ;
							let next =_=> {
								
								doing++ ;
								if (doing >= dir.length) {
									
									fs.rmdir(toDel,_=>{
										
										if (err) {
											
											reject(err) ;
											
										}
										
										else {
											
											resolve() ;
											
										}
										
									}) ;
									
								}
								
								else {
									
									module.exports.delete(path.join(toDel,dir[doing])).then(next).catch(reject) ;
									
								}
								
							} ;
							next() ;
							
						}
						
					}) ;
					
				}
				
				else {
					
					fs.unlink(toDel,err=>{
						
						if (err) {
							
							reject(err) ;
							
						}
						
						else {
							
							resolve() ;
							
						}
						
					}) ;
					
				}
				
			}
			
		}) ;
		
	}) ;
	
} ;

module.exports.deleteSync = toDel => {
	
	let stats = fs.statSync(toDel) ;
	
	if (stats.isDirectory()) {
		
		let dir = fs.readdirSync(toDel) ;
		
		for (let doing in dir) {
			
			module.exports.deleteSync(path.join(toDel,dir[doing])) ;
			
		}
		
		fs.rmdirSync(toDel) ;
		
	}
	
	else {
		
		fs.unlinkSync(toDel) ;
		
	}
	
} ;