process.title = "JOTPOT OS JIT Packager" ;
console.log("JOTPOT OS JIT Packager.") ;
console.log("Loading packager...") ;
let asar = require("asar") ;
let fs = require("fs") ;

function package(in,out) {
	
	console.log(`Packaging ${in}...`) ;
	if (typeof out === "undefined") {
		
		out = `${in}.asar` ;
		
	}
	
	return new Promise(resolve=>asar.createPackage(`./${in}`,`../resources/${out}`,resolve)) ;
	
}

function copy(file) {
	
	console.log(`Copying ${file}...`) ;
	return new Promise(resolve=>{
		
		let reader = fs.createReadStream(`./${file}`) ;
		reader.on("end",resolve) ;
		reader.pipe(fs.createWriteStream(`../${file}`)) ;
		
	}) ;
	
}

package("electron").then(_=>package("JPOS")).then(_=>package("scougall-chrome")).then(_=>package("files")).then(_=>package("text-edit")).then(_=>copy("settings.json")).then(_=>copy("apps.json")).then(_=>{
	
	console.log("Booting JOTPOT OS...") ;
	require("child_process").spawnSync("JPOS") ;
	
}) ;