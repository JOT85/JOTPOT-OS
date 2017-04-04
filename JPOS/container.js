let cs = JSON.parse(require("fs").readFileSync("./settings.json").toString()) ;

let ipc = require("electron").ipcRenderer ;

let taskbar = document.getElementById("taskbar") ;
let desktop = document.getElementById("desktop") ;
let windows = document.getElementById("windows") ;
desktop.addEventListener("dom-ready",_=>{
	
	desktop.shadowRoot.querySelector("object").style.width = "100%" ;
	desktop.shadowRoot.querySelector("object").style.height = "100%" ;
	ipc.send("desktopContents",desktop.getWebContents().id) ;

}) ;