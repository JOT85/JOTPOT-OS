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

let fs ;
try {
	
	fs = require("original-fs")
	
}

catch (err) {
	
	fs = require("fs") ;
	
}
let path = require("path") ;
module.exports.copy = (file1,file2) => {
	
	console.log("Copying",file2,"to",file2) ;
	return new Promise((resolve,reject)=>{
		
		fs.open(file1,"r",(err,fd1)=>{
			
			if (err) {
				
				reject(err) ;
				
			}
			
			else {
				
				fs.fstat(fd1,(err,stats1)=>{
					
					if (err) {
						
						reject(err) ;
						
					}
					
					else if (stats1.isDirectory()) {
						
						console.log("Is dir")
						fs.open(file2,"r",(err,fd2)=>{
							
							let go =_=> {
								
								fs.fstat(fd2,(err,stats2)=>{
										
									fs.futimes(fd2,stats1.atime,stats1.mtime,err=>{
										
										if (err) {
											
											reject(err) ;
											
										}
										
										else {
											
											fs.fchmod(fd2,stats1.mode,err=>{
												
												if (err) {
													
													reject(err) ;
													
												}
												
												else {
													
													fs.chown(file2,stats1.uid,stats1.gid,err=>{
														
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
																		
																		doing++ ;
																		
																		if (doing >= dir.length) {
																			
																			resolve() ;
																			
																		}
																		
																		else {
																			
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
						
						fs.open(file2,"w",(err,fd2)=>{
							
							if (err) {
								
								reject(err) ;
								
							}
							
							else {
								
								let write = fs.createWriteStream(file2,{
									
									fd:fd2
									
								}) ;
								
								let read = fs.createReadStream(file1,{
									
									fd:fd1
									
								}) ;
								
								read.on("end",_=>{
									
									fs.futimes(fd2,stats1.atime,stats1.mtime,err=>{
										
										if (err) {
											
											reject(err) ;
											
										}
										
										else {
											
											fs.chmod(file2,stats1.mode,err=>{
												
												if (err) {
													
													reject(err) ;
													
												}
												
												else {
													
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

module.exports.copySync = (file1,file2) => {
	
	let fd1 = fs.openSync(file1,"r") ;
	let stats1 = fs.fstatSync(fd1) ;
	
	if (stats1.isDirectory()) {
		
		let fd2 = fs.openSync(file2,"r+") ;
		
		let go =_=> {
			
			fs.futimesSync(fd2,stats1.atime,stats1.mtime) ;
			fs.fchmodSync(fd2,stats1.mode) ;
			fs.chownSync(file2,stats1.uid,stats1.gid) ;
			let dir = fs.readdirSync(file1) ;
			
			for (let doing in dir) {
				
				console.log("Doing",doing) ;
				module.exports.copySync(path.join(file1,dir[doing]),path.join(file2,dir[doing])) ;
				
			}
			
		} ;
		
		let stats2 ;
		try {
			
			stats2 = fs.fstatSync(fd2,"w") ;
			
		}
		
		catch(err) {
			
			if (err.code === "ENOENT") {
				
				fs.mkdirSync(file2) ;
				go() ;
				return ;
				
			}
			
			else {
				
				throw err ;
				return ;
				
			}
		
		}
		
		finally {
			
			if (stats2.isFile()) {
				
				throw "Dest is a file..." ;
				
			}
			
			else {
				
				go() ;
				return ;
				
			}
			
		}
		
	}
	
	else {
		
		let fd2 = fs.openSync(file2,"w") ;
		fs.writeSync(fd2,fs.readFileSync(file1)) ;
		fs.futimesSync(fd2,stats1.atime,stats1.mtime) ;
		fs.fchmodSync(fd2,stats1.mode) ;
		fs.chownSync(file2,stats1.uid,stats1.gid) ; 
		return ;
		
	}
	
} ;