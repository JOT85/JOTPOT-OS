let ipc = require("electron").ipcRenderer ;
let fs = require("fs") ;

let cs = JSON.parse(fs.readFileSync("./settings.json").toString()) ;
document.body.style.background = `${cs.bgcolor} url('${cs.wallpaper}') center center/${cs.wallpapersize[0]} ${cs.wallpapersize[1]} no-repeat` ;

let apps = JSON.parse(fs.readFileSync("./apps.json").toString()) ;

{
	
	let creating = document.createElement("div") ;
	creating.classList.add("app") ;
	creating.id = "exit" ;
	creating.style.backgroundImage = `url('x.png')` ;
	creating.addEventListener("click",_=>{
		
		ipc.send("closeall") ;
		
	}) ;
	let text = document.createElement("div") ;
	text.classList.add("app-label") ;
	text.innerText = "Back to command line" ;
	creating.appendChild(text) ;
	document.body.appendChild(creating) ;
	
}

{
	
	let creating = document.createElement("div") ;
	creating.classList.add("app") ;
	creating.id = "debugmode" ;
	creating.style.backgroundImage = `url('https://d30y9cdsu7xlg0.cloudfront.net/png/384791-200.png')` ;
	creating.addEventListener("click",_=>{
		
		ipc.send("debugmode") ;
		
	}) ;
	let text = document.createElement("div") ;
	text.classList.add("app-label") ;
	text.innerText = "Debug Mode" ;
	creating.appendChild(text) ;
	document.body.appendChild(creating) ;
	
}

for (let doing in apps) {
	
	let creating = document.createElement("div") ;
	console.log(creating) ;
	creating.classList.add("app") ;
	creating.style.backgroundImage = `url('${apps[doing].icon}')` ;
	creating.addEventListener("click",_=>{
		
		ipc.send("newWindow",[apps[doing].start,apps[doing].node]) ;
		
	}) ;
	let text = document.createElement("div") ;
	text.classList.add("app-label") ;
	text.innerText = apps[doing].name ;
	creating.appendChild(text) ;
	document.body.appendChild(creating) ;
	
}