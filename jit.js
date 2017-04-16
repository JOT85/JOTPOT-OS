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

process.title = "JOTPOT OS JIT Packager" ;
console.log("JOTPOT OS JIT Packager.") ;
console.log("Loading modules...") ;
let fs = require("fs") ;
let cp = require("child_process") ;
console.log("Loading packager...") ;
let asar = require("asar") ;

function package(inf,out) {
	
	console.log(`Packaging ${inf}...`) ;
	if (typeof out === "undefined") {
		
		out = `${inf}.asar` ;
		
	}
	
	return new Promise(resolve=>asar.createPackage(`./${inf}`,`../resources/${out}`,resolve)) ;
	
}

function packageM(inf,out) {
	
	console.log(`Packaging ${inf} tp ${out}...`) ;
	return new Promise(resolve=>asar.createPackage(inf,out,resolve)) ;
	
}

function copy(file) {
	
	console.log(`Copying ${file}...`) ;
	return new Promise(resolve=>{
		
		let reader = fs.createReadStream(`./${file}`) ;
		reader.on("end",resolve) ;
		reader.pipe(fs.createWriteStream(`../${file}`)) ;
		
	}) ;
	
}

function copyM(file1,file2) {
	
	console.log(`Copying ${file1} to ${file2}...`) ;
	return new Promise(resolve=>{
		
		let reader = fs.createReadStream(file1) ;
		reader.on("end",resolve) ;
		reader.pipe(fs.createWriteStream(file2)) ;
		
	}) ;
	
}

function copyDir(dir) {
	
	console.log(`Copying (fully, and forcefully) directory ${dir}...`) ;
	//cp.execSync(`cp -r -f ./${dir}/* ../resources/${dir}/`) ;
	return require("./JPOS/exports/fs+").copy("./"+dir,"../resources/"+dir) ;
	
}

package("electron").then(_=>package("JPOS"))
.then(_=>package("scougall-chrome"))
.then(_=>package("files"))
.then(_=>package("text-edit"))
.then(_=>package("dialogues"))
.then(_=>copy("settings.json"))
.then(_=>copy("apps.json"))
.then(_=>copy("defaults.json"))
.then(_=>copyDir("shell"))
.then(_=>copyM("./installer/installer.sh","./web-directory/installer.sh"))
.then(_=>copyM("./installer/install-jpos","./web-directory/install-jpos"))
.then(_=>copyM("./apps.json","./web-directory/apps.json"))
.then(_=>copyM("./settings.json","./web-directory/settings.json"))
.then(_=>copyM("./defaults.json","./web-directory/defaults.json"))
.then(_=>packageM("./installer/installer.asar","./web-directory/installer.asar"))
.then(_=>{
	
	if (process.argv[2] === "packageonly") {
		
		console.log("Done") ;
		
	}
	
	else if (process.argv[2] === "startx") {
		
		console.log("Booting JOTPOT OS...") ;
		
		cp.spawn("startx",["/JPOS/JPOS",process.argv[3]],{
			
			stdio:"inherit"
			
		}) ;
		
	}
	
	else {
		
		console.log("Booting JOTPOT OS...") ;
		
		cp.spawn("../JPOS",[process.argv[3]],{
			
			stdio:"inherit"
			
		}) ;
		
	}
	
}) ;
