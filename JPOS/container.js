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