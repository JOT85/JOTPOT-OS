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

let ipc = require("electron").ipcMain ;
let currentI = 0 ;
let os = new Array() ;
let resolvers = new Array() ;

ipc.on("Dialogue-Get",(m,id)=>{
	
	m.sender.send("do",os[id]) ;
	
}) ;

ipc.on("Dialogue-Got",(m,id,result)=>{
	
	resolvers[id](result) ;
	
}) ;

ipc.on("popup",(m,o,sync)=>{
	
	if (!sync) {
		
		let ID = module.exports.popup(o,false) ;
		m.returnValue = ID ;
		resolvers[ID] = result => {
			
			m.sender.send("popup-done-"+ID,result) ;
			
		} ;
		
	}
	
	else {
		
		module.exports.popup(o,true).then(val=>m.returnValue=val) ;
		
	}
	
}) ;

module.exports.popup =(o,returnPromise=false)=> {
	
	currentI++ ;
	let currentID = currentI ;
	os[currentID] = o ;
	main.webContents.send("newWindow",[`../dialogues.asar/main.html?${currentID}`,{node:true,autoShow:false,resize:false,onTop:true}]) ;
	
	if (returnPromise) {
		
		return new Promise(resolve=>{
			
			resolvers[currentID] = resolve ;
			
		}) ;
		
	}
	
	resolvers[currentID] =_=> {} ;
	return currentID ;
	
} ;