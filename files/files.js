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

let url = require("url") ;
let currentDir = defaultLocation = process.platform==="win32"?url.parse(process.cwd()).protocol.toUpperCase()+"\\":"/" ;
let path = require("path") ;
let JPOS = require("JPOS") ;
let clip = require("electron").clipboard ;
let fs = require("fs") ;
let fsp = require("fs+") ;
let ofs = require("original-fs") ;
let os = require("os") ;

let list = document.getElementById("list") ;
let locationInput = document.getElementById("location") ;
let box = document.getElementById("box") ;
let upButton = document.getElementById("up") ;

let sidebar = document.getElementById("sidebar") ;
let shortcuts = [
	
	["Root directory",defaultLocation],
	["Home directory",os.homedir()]
	
] ;

function giveMeErrors(err) {
	
	throw new Error(err) ;
	
}

let currentlySelectedFiles = new Array() ;
function addSelectListeners(elem,openFunc) {
	
	elem.addEventListener("click",_=>{
		
		if (currentlySelectedFiles.indexOf(elem) !== -1) {
			
			elem.classList.remove("selected") ;
			currentlySelectedFiles.splice(currentlySelectedFiles.indexOf(elem),1) ;
			
		}
		
		else {
			
			if (!ctrlDown) {
				
				for (let doing in currentlySelectedFiles) {
					
					currentlySelectedFiles[doing].classList.remove("selected") ;
					
				}
				currentlySelectedFiles = [] ;
				
			}
			
			elem.classList.add("selected") ;
			currentlySelectedFiles.push(elem) ;
			
		}
		
	}) ;
	
	if (typeof openFunc === "function") {
		
		elem.addEventListener("dblclick",openFunc) ;
		
	}
	
}

function makeSections(elem,sections,marker="") {
	
	for (let doing in sections) {
		
		let creating = document.createElement("div") ;
		creating.classList.add("segment") ;
		creating.classList.add(`segment-${doing}`) ;
		if (marker) {
			
			console.log("Adding marker") ;
			creating.classList.add(marker) ;
			
		}
		creating.innerText = sections[doing] ;
		elem.appendChild(creating) ;
		
	}
	
}

function pad(s,p="0",l=2) {
	
	s = String(s) ;
	while (s.length < l) {
		
		s = `${p}${s}` ;
		
	}
	return s ;
	
}

function formatTime(t) {
	
	t = new Date(t) ;
	return `${pad(t.getDate())}/${pad(t.getMonth())}/${pad(t.getFullYear())} ${pad(t.getHours())}:${pad(t.getMinutes())}` ;
	
}

let sizes = ["B","KB","MB","GB","TB","PB"] ;
function formatSize(size=0) {
	
	let current = 0 ;
	while (current < sizes.length && size > 1023) {
		
		size /= 1024 ;
		current++ ;
		
	}
	if (current > 0) {
		
		size = size.toFixed(3) ;
		
	}
	else {
		
		size = size.toFixed(0) ;
		
	}
	return `${size} ${sizes[current]}` ;
	
}

function renderDir(d) {
	
	console.log("Rendering",d) ;
	locationInput.value = d ;
	list.innerHTML = "" ;
	for (let doing in currentlySelectedFiles) {
		
		currentlySelectedFiles[doing].classList.remove("selected") ;
		
	}
	currentlySelectedFiles = [] ;
	fs.readdir(d,(err,dir)=>{
		
		if (err) {
			
			giveMeErrors(err) ;
			return ;
			
		}
		
		console.log("DIR contents:",dir) ;
		let x = new Array() ;
		let dirs = new Array() ;
		let files = new Array() ;
		
		let doing = -1 ;
		
		let next =_=> {
			
			doing++ ;
			if (doing >= dir.length) {
				
				for (let doing in x) {
					
					let creating = document.createElement("li") ;
					creating.classList.add("item") ;
					creating.classList.add("file-err") ;
					//creating.innerText = x[doing][0] ;
					makeSections(creating,x[doing],"err-segment") ;
					creating.jpos_path = path.join(d,x[doing][0]) ;
					creating.jpos_type = "err" ;
					addSelectListeners(creating) ;
					list.appendChild(creating) ;
					
				}
				for (let doing in dirs) {
					
					let creating = document.createElement("li") ;
					creating.classList.add("item") ;
					creating.classList.add("dir") ;
					//creating.innerText = dirs[doing] ;
					makeSections(creating,dirs[doing]) ;
					creating.jpos_path = path.join(d,dirs[doing][0]) ;
					creating.jpos_type = "dir" ;
					addSelectListeners(creating,_=>{
						
						currentDir = path.join(d,dirs[doing][0]) ;
						//locationInput.value = currentDir ;
						renderDir(currentDir) ;
						
					}) ;
					list.appendChild(creating) ;
					
				}
				for (let doing in files) {
					
					let creating = document.createElement("li") ;
					creating.classList.add("item") ;
					creating.classList.add("file") ;
					//creating.innerText = files[doing] ;
					makeSections(creating,files[doing]) ;
					creating.jpos_path = path.join(d,files[doing][0]) ;
					creating.jpos_type = "file" ;
					addSelectListeners(creating,_=>{
						
						JPOS.open(path.join(currentDir,files[doing][0])) ;
						
					}) ;
					list.appendChild(creating) ;
					
				}
				return ;
				
			}
			
			fs.stat(path.join(d,dir[doing]),(err,stats)=>{
				
				if (err) {
					
					x.push([dir[doing],"Error stating"]) ;
					next() ;
					giveMeErrors(err) ;
					return ;
					
				}
				
				else if (stats.isDirectory()) {
					
					dirs.push([dir[doing],formatTime(stats.mtime),"Directory"]) ;
					
				}
				
				else {
					
					files.push([dir[doing],formatTime(stats.mtime),formatSize(stats.size)]) ;
					
				}
				
				next() ;
				
			}) ;
			
		} ;
		next() ;
		
	}) ;
	
}

box.addEventListener("submit",e=>{
	
	e.preventDefault() ;
	currentDir = locationInput.value ;
	renderDir(currentDir) ;
	return false ;
	
}) ;

upButton.addEventListener("click",_=>{
	
	currentDir = currentDir.replace(/\\/g,"/").split("/") ;
	currentDir.pop() ;
	currentDir = currentDir.join("/") ;
	if (currentDir === "") {
		
		currentDir = defaultLocation ;
		
	}
	//locationInput.value = currentDir ;
	renderDir(currentDir) ;
	
}) ;

let ctrlDown = false ;
document.body.addEventListener("keydown",e=>{
	
	if (e.key === "Control") {
		
		ctrlDown = true ;
		
	}
	
}) ;
document.body.addEventListener("keyup",e=>{
	
	if (e.key === "Control") {
		
		ctrlDown = false ;
		
	}
	
}) ;

function copy() {
	
	let toAdd = new String() ;
	cutFiles = [] ;
	for (let doing in currentlySelectedFiles) {
		
		if (parseInt(doing) > 0) {
			
			toAdd += "\n" ;
			
		}
		toAdd += "file://" ;
		toAdd += currentlySelectedFiles[doing].jpos_path ;
		
	}
	clip.writeText(toAdd) ;
	
}

function copyPath() {
	
	let toAdd = new String() ;
	for (let doing in currentlySelectedFiles) {
		
		if (parseInt(doing) > 0) {
			
			toAdd += "\n" ;
			
		}
		toAdd += currentlySelectedFiles[doing].jpos_path ;
		
	}
	clip.writeText(toAdd) ;
	
}

function cut() {
	
	let toAdd = new String() ;
	cutFiles = [] ;
	for (let doing in currentlySelectedFiles) {
		
		if (parseInt(doing) > 0) {
			
			toAdd += "\n" ;
			
		}
		toAdd += "file://" ;
		toAdd += currentlySelectedFiles[doing].jpos_path ;
		cutFiles.push(currentlySelectedFiles[doing].jpos_path) ;
		
	}
	cutFilesClip = toAdd ;
	clip.writeText(toAdd) ;
	
}

function paste() {
	
	let todo = clip.readText() ;
	let doCut = Boolean(todo===cutFilesClip) ;
	todo = todo.split("\n") ;
	for (let doing in todo) {
		
		let purl = url.parse(todo[doing]) ;
		if (purl.protocol !== "file:") {
			
			alert("No files on the clipboard...","Error Pasting!") ;
			return ;
			
		}
		todo[doing] = purl.path ;
		if (process.platform === "win32") {
			
			todo[doing] = `${purl.host.toUpperCase()}:${purl.path}` ;
			
		}
		
	}
	for (let doing in todo) {
		
		console.log(`Copy ${todo[doing]} to ${path.join(currentDir,path.basename(todo[doing]))}`) ;
		userSaidGo = false ;
		userSaidNo = false ;
		fsp.copySync(todo[doing],path.join(currentDir,path.basename(todo[doing])),(path1,path2,callback)=>{
			
			if (userSaidNo) {
				
				return 1 ;
				
			}
			
			else if (userSaidGo) {
				
				return 2 ;
				
			}
			
			else {
				
				let woo = JPOS.popupSync({
					
					"title":"Overwrite?",
					"message":`Overwrite '${path2}' with '${path1}'?`,
					"options":["Overwrite all","Overwrite","Skip","Skip all","Cancel Paste"]
					
				}) ;
				
				if (woo === 0) {
					
					userSaidGo = true ;
					return 2 ;
					
				}
				
				else if (woo === 1) {
					
					return 2 ;
					
				}
				
				else if (woo === 2) {
					
					return 1 ;
					
				}
				
				else if (woo === 3) {
					
					userSaidNo = true ;
					return 1 ;
					
				}
				
				else {
					
					return 0 ;
					
				}
				
			}
			
		}) ;
		
	}
	if (doCut && confirm("Delete cut files?","Move?")) {for (let doing in cutFiles) {
		
		console.log(`Now deleting ${cutFiles[doing]}`) ;
		
	}}
	else {
		
		cutFiles = [] ;
		
	}
	renderDir(currentDir) ;
	
}

function del() {
	
	let toDel = new Array() ;
	for (let doing in currentlySelectedFiles) {
		
		toDel.push(currentlySelectedFiles[doing].jpos_path) ;
		
	}
	console.log(toDel) ;
	
	if (!Boolean(JPOS.popupSync({
		
		title:"Confirm Delete",
		message:"Are you sure you want to delete:",
		details:toDel.join("\n"),
		options:["Delete the files","CANCEL!!!"],
		closeButton:1
		
	}))) {
		
		for (let doing = 0 ; doing < toDel.length ; doing++) {
			
			try {
				
				console.log("Passing",toDel[doing]) ;
				fsp.deleteSync(toDel[doing]) ;
				
			}
			
			catch (err) {
				
				if (JPOS.popupSync({
					
					title:"File system error",
					message:`Error deleting "${toDel[doing]}: ${err.code}"`,
					options:["Retry","Skip"]
				
				}) === 0) {
					
					doing-- ;
					
				}
				
			}
			
		}
		renderDir(currentDir) ;
		
	}
	
}

function newFile() {
	
	let fileName = JPOS.popupSync({
		
		title:"New file",
		message:"Please enter the path of the new file:",
		input:{
			
			value:fs.realpathSync(path.join(currentDir))+path.sep,
			button:"Create"
			
		}
		
	}) ;
	if (fileName === -1 || !Boolean(fileName)) {
		
		return ;
		
	}
	fs.writeFileSync(fileName,"") ;
	renderDir(currentDir) ;
	
}

function newDir() {
	
	let fileName = JPOS.popupSync({
		
		title:"New directory",
		message:"Please enter the path of the new directory:",
		input:{
			
			value:fs.realpathSync(path.join(currentDir))+path.sep,
			button:"Create"
			
		}
		
	}) ;
	if (fileName === -1 || !Boolean(fileName)) {
		
		return ;
		
	}
	fs.mkdirSync(fileName) ;
	renderDir(currentDir) ;
	
}

function rename() {
	
	for (let doing in currentlySelectedFiles) {
		
		let newPath = JPOS.popupSync({
			
			title:"Rename/Mode",
			message:`Rename/Move '${currentlySelectedFiles[doing].jpos_path}' to:`,
			input:{
				
				value:fs.realpathSync(path.join(currentDir))+path.sep,
				button:"Rename/Move"
				
			}
			
		}) ;
		if (newPath === -1 || !Boolean(newPath)) {
			
			alert(`'${currentlySelectedFiles[doing].jpos_path}' not changed.`,"A file wasn't changed.") ;
			continue ;
			
		}
		fs.renameSync(currentlySelectedFiles[doing].jpos_path,newPath) ;
		renderDir(currentDir) ;
		
	}
	
}

document.getElementById("button-copy").addEventListener("click",copy) ;
document.getElementById("button-copy-path").addEventListener("click",copyPath) ;
let cutFiles = new Array() ;
let cutFilesClip = new String() ;
document.getElementById("button-cut").addEventListener("click",cut) ;
document.getElementById("button-paste").addEventListener("click",paste) ;
document.getElementById("button-delete").addEventListener("click",del) ;
document.getElementById("button-new-file").addEventListener("click",newFile) ;
document.getElementById("button-new-dir").addEventListener("click",newDir) ;
document.getElementById("button-rename").addEventListener("click",rename) ;

let kbShortcuts = {
	
	C:copy,
	X:cut,
	V:paste
	
} ;

document.body.addEventListener("keydown",e=>{
	
	console.log(`${e.ctrlKey?"ctrl+":""}${e.key} pressed.`) ;
	if (e.ctrlKey) {
		
		if (typeof kbShortcuts[e.key.toUpperCase()] === "function") {
			
			console.log("Calling func.") ;
			kbShortcuts[e.key.toUpperCase()]() ;
			
		}
		
	}
	
	else {
		
		if (e.key === "Delete") {
			
			del() ;
			
		}
		
	}
	
}) ;

for (let doing in shortcuts) {
	
	let creating = document.createElement("li") ;
	creating.classList.add("location") ;
	creating.innerText = shortcuts[doing][0] ;
	creating.addEventListener("click",_=>{
		
		currentDir = shortcuts[doing][1] ;
		renderDir(currentDir) ;
		
	}) ;
	sidebar.appendChild(creating) ;
	
}

renderDir(currentDir) ;