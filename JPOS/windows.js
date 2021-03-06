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

let windowButtons = [
	
	{
		
		html:"_",
		bgcolor:"blue",
		color:"white",
		func:(winIndex,mini)=>{
			
			mini() ;
			
		}
		
	},
	
	{
		
		html:"<div class=\"arrow-button\"></div>",
		bgcolor:"blue",
		color:"white",
		func:winIndex=>{
			
			if (wins[winIndex].maximized) {
				
				/*wins[winIndex].maximized = false ;
				wins[winIndex].elem.style.width = wins[winIndex].elem.prePos[2] ;
				wins[winIndex].elem.style.height = wins[winIndex].elem.prePos[3] ;
				wins[winIndex].elem.top = wins[winIndex].elem.prePos[1] ;
				wins[winIndex].elem.left = wins[winIndex].elem.prePos[0] ;
				wins[winIndex].elem.querySelector(".arrow-button").classList.remove("acc-up-button") ;*/
				restore(winIndex) ;
				
			}
			
			else {
				
				wins[winIndex].maximized = true ;
				let windowArea = windows.getBoundingClientRect() ;
				console.log("Maximizng, button click") ;
				wins[winIndex].elem.prePos = [wins[winIndex].elem.left,wins[winIndex].elem.top,wins[winIndex].elem.style.width,wins[winIndex].elem.style.height] ;
				wins[winIndex].elem.style.width = windowArea.width + 10 ;
				wins[winIndex].elem.style.height = windowArea.height + 5 ;
				wins[winIndex].elem.top = 0 ;
				wins[winIndex].elem.left = -5 ;
				wins[winIndex].elem.querySelector(".arrow-button").classList.add("acc-up-button") ;
				
			}
			renderWindowPosition(winIndex) ;
			
		}
		
	},
	
	{
		
		html:"x",
		bgcolor:"red",
		color:"white",
		func:winIndex=>{
			
			/*windows.removeChild(wins[winIndex].elem) ;
			removeTask(wins[winIndex].task) ;
			wins[winIndex] = null ;
			currentlyFocused = -1 ;
			garbCollect() ;*/
			console.log(wins[winIndex].view.nodeintegration) ;
			wins[winIndex].view.send("window-close") ;
			
		}
		
	}
	
] ;

function garbCollect() {
	
	console.log("Collecteing garbige.") ;
	while (wins.lastIndexOf(null) === wins.length - 1 && wins.length > 0) {
		
		wins.pop() ;
		
	}
	
	while (tasks.lastIndexOf(null) === tasks.length - 1 && tasks.length > 0) {
		
		tasks.pop() ;
		
	}
	
}

let wins = new Array() ;

function renderWindowPosition(window) {
	
	//console.log(`translateX(${wins[window].elem.left}px) translateY(${wins[window].elem.top}px)`) ;
	console.log("Rerendering window border.") ;
	wins[window].elem.style.transform = `translateX(${wins[window].elem.left}px) translateY(${wins[window].elem.top}px)` ;
	
}

let defaults = {
	
	node: false,
	top: 10,
	left: 10,
	width: 500,
	height: 300,
	autoShow:true,
	onTop:false,
	resize:true
	
} ;
function addDefaults(ob) {
	
	for (let doing in defaults) {
		
		if (typeof ob[doing] === "undefined") {
			
			ob[doing] = defaults[doing] ;
			
		}
		
	}
	
}

function newWindow(url,winOptions) {
	
	addDefaults(winOptions) ;
	
	let thisWin = document.createElement("div") ;
	
	let currentIndex ;
	
	{
		
		let index = wins.indexOf(null) ;
		
		if (index === -1) {
			
			currentIndex = wins.push({
				
				elem:thisWin,
				erm:true,
				url:url,
				task:null,
				maximized:false
				
			}) - 1 ;
			
		}
		
		else {
			
			currentIndex = index ;
			wins[index] = {
				
				elem:thisWin,
				erm:true,
				url:url,
				task:null,
				maximized:false
				
			} ;
			
		}
		
	}
	
	thisWin.classList.add("window") ;
	thisWin.style.top = "0px" ;
	thisWin.style.left = "0px" ;
	thisWin.left = winOptions.left ;
	thisWin.top = winOptions.top ;
	thisWin.style.transform = "translateX(10px) translateY(10px)" ;
	thisWin.style.height = winOptions.height ;
	thisWin.style.width = winOptions.width ;
	
	if (!winOptions.resize) {
		
		thisWin.style.resize = "none" ;
		
	}
	
	if (winOptions.onTop) {
		
		thisWin.classList.add("always-on-top") ;
		
	}
	
	let title = document.createElement("div") ;
	title.classList.add("window-title") ;
	title.addEventListener("mousedown",e=>{
		
		if (!e.target.classList.contains("window-title-item")) {
			
			currentlyMoving = currentIndex ;
			startDown(currentIndex,thisWin,e.pageX,e.pageY,thisWin.left,thisWin.top) ;
			
		}
		
	}) ;
	title.addEventListener("dblclick",_=>{
		
		let winIndex = currentIndex ;
		if (wins[winIndex].maximized) {
			
			/*wins[winIndex].maximized = false ;
			wins[winIndex].elem.style.width = wins[winIndex].elem.prePos[2] ;
			wins[winIndex].elem.style.height = wins[winIndex].elem.prePos[3] ;
			wins[winIndex].elem.top = wins[winIndex].elem.prePos[1] ;
			wins[winIndex].elem.left = wins[winIndex].elem.prePos[0] ;
			wins[winIndex].elem.querySelector(".arrow-button").classList.remove("acc-up-button") ;*/
			restore(winIndex) ;
			
		}
		
		else {
			
			wins[winIndex].maximized = true ;
			let windowArea = windows.getBoundingClientRect() ;
			console.log("Double click, maximizing...") ;
			wins[winIndex].elem.prePos = [wins[winIndex].elem.left,wins[winIndex].elem.top,wins[winIndex].elem.style.width,wins[winIndex].elem.style.height] ;
			wins[winIndex].elem.style.width = windowArea.width + 10 ;
			wins[winIndex].elem.style.height = windowArea.height + 5 ;
			wins[winIndex].elem.top = 0 ;
			wins[winIndex].elem.left = -5 ;
			wins[winIndex].elem.querySelector(".arrow-button").classList.add("acc-up-button") ;
			
		}
		renderWindowPosition(winIndex) ;
		
	}) ;
	
	let view ;
	if (winOptions.node === null) {
		
		view = document.createElement("div") ;
		let shadow = view.attachShadow({mode:"closed"}) ;
		shadow.innerHTML = require("fs").readFileSync(url).toString() ;
		
	}
	
	else {
		
		view = document.createElement("webview") ;
		view.nodeintegration = winOptions.node ;
		view.src = url ;
		setTimeout(_=>ipc.send("windowContents",view.getWebContents().id),1000) ;
		view.addEventListener("close",_=>{
			
			windows.removeChild(wins[currentIndex].elem) ;
			removeTask(wins[currentIndex].task) ;
			wins[currentIndex] = null ;
			currentlyFocused = -1 ;
			garbCollect() ;
			
		}) ;
		view.addEventListener("ipc-message",m=>{
			
			if (m.channel === "show") {
				
				wins[currentIndex].show() ;
				
			}
			
			else if (m.channel === "hide") {
				
				wins[currentIndex].hide() ;
				
			}
			
			else if (m.channel === "center") {
				
				let d = windows.getBoundingClientRect() ;
				thisWin.left = (d.width-parseInt(thisWin.style.width))/2 ;
				thisWin.top = (d.height-parseInt(thisWin.style.height))/2 ;
				renderWindowPosition(currentIndex) ;
				
			}
			
			else if (m.channel === "set-left") {
				
				thisWin.left = m.args[0] ;
				renderWindowPosition(currentIndex) ;
				
			}
			
			else if (m.channel === "set-top") {
				
				thisWin.top = m.args[0] ;
				renderWindowPosition(currentIndex) ;
				
			}
			
			else if (m.channel === "set-height") {
				
				thisWin.style.height = m.args[0] ;
				
			}
			
			else if (m.channel === "set-width") {
				
				thisWin.style.width = m.args[0] ;
				
			}
			
		}) ;
		
		{
			
			let creating = document.createElement("div") ;
			creating.classList.add("window-title-text") ;
			creating.innerText = url ;
			view.addEventListener("page-title-updated",e=>{
				
				creating.innerText = e.title ;
				wins[currentIndex].task.title = e.title ;
				
			}) ;
			title.appendChild(creating) ;
			
		}
		
	}
	view.classList.add("window-view") ;
	
	let titleInner = document.createElement("div") ;
	titleInner.classList.add("window-title-item-container") ;
	
	for (let doing in windowButtons) {
		
		let creating = document.createElement("div") ;
		creating.classList.add("window-title-item") ;
		creating.innerHTML = windowButtons[doing].html ;
		creating.style.backgroundColor = windowButtons[doing].bgcolor ;
		creating.style.color = windowButtons[doing].color ;
		creating.addEventListener("click",_=>windowButtons[doing].func(currentIndex,mini)) ;
		titleInner.appendChild(creating) ;
		
	}
	
	title.appendChild(titleInner) ;
	
	if (currentlyFocused !== -1) {
		
		tasks[currentlyFocused].up = 1 ;
		wins[tasks[currentlyFocused].pointer].elem.classList.remove("focused") ;
		
	}
	
	thisWin.classList.add("focused") ;
	
	let minied = false ;
	let mini =_=> {
		
		wins[currentIndex].task.up = 0 ;
		thisWin.classList.remove("focused") ;
		thisWin.classList.add("min") ;
		currentlyFocused = -1 ;
		minied = true ;
		
	} ;
	
	let unmini =_=> {
		
		if (currentlyFocused !== -1) {
			
			tasks[currentlyFocused].up = 1 ;
			wins[tasks[currentlyFocused].pointer].elem.classList.remove("focused") ;
			
		}
		
		wins[currentIndex].task.up = 2 ;
		thisWin.classList.remove("min") ;
		thisWin.classList.add("focused") ;
		currentlyFocused = wins[currentIndex].task.index ;
		minied = false ;
		
	} ;
	
	let focusFunc =e=> {
		
		if (currentlyFocused === wins[currentIndex].task.index) {
			
			if (e === "win") {
				
				return ;
				
			}
			
			mini() ;
			return ;
			
		}
		
		if (e === "task" && minied) {
			
			unmini() ;
			return ;
			
		}
		
		if (currentlyFocused !== -1) {
			
			tasks[currentlyFocused].up = 1 ;
			wins[tasks[currentlyFocused].pointer].elem.classList.remove("focused") ;
			
		}
		
		thisWin.classList.add("focused") ;
		currentlyFocused = wins[currentIndex].task.index ;
		wins[currentIndex].task.up = 2 ;
		
	} ;
	thisWin.addEventListener("mousedown",_=>focusFunc("win")) ;
	
	console.log(winOptions) ;
	console.log(winOptions.autoShow) ;
	console.log(!winOptions.autoShow) ;
	wins[currentIndex].task = addTask(2,url,focusFunc,currentIndex,!winOptions.autoShow) ;
	currentlyFocused = wins[currentIndex].task.index ;
	
	wins[currentIndex].view = view ;
	
	thisWin.appendChild(title) ;
	thisWin.appendChild(view) ;
	
	if (!winOptions.autoShow) {
		
		thisWin.classList.add("hidden") ;
		
	}
	wins[currentIndex].show =_=> {
		
		thisWin.classList.remove("hidden") ;
		wins[currentIndex].task.show() ;
		
	} ;
	wins[currentIndex].hide =_=> {
		
		thisWin.classList.add("hidden") ;
		wins[currentIndex].task.hide() ;
		
	} ;
	
	windows.appendChild(thisWin) ;
	
}

let isMoving = false ;
let currentlyMoving ;
function startDown(winIndex,elem,sX,sY,oX,oY) {
	
	isMoving = true ;
	let loop =_=> {
		
		if (!isMoving) {
			
			return ; 
			
		}
		
		if (wins[winIndex].maximized) {
			
			if (Math.abs(currentMousePos[0] - sX) > 10 || Math.abs(currentMousePos[1] - sY) > 10) {
				
				sX *= restore(winIndex) ;
				
			}
			
		}
		
		else {
			
			elem.left = currentMousePos[0] - sX + oX ;
			elem.top = currentMousePos[1] - sY + oY ;
			//elem.style.transform = `translate(${currentMousePos[0] - sX + oX}px ${currentMousePos[1] - sY + oY}px)` ;
			renderWindowPosition(winIndex) ;
			
		}
		requestAnimationFrame(loop) ;
		
	} ;
	requestAnimationFrame(loop) ;
	
}

function restore(winIndex) {
	
	console.log("Restore 2.0") ;
	wins[winIndex].maximized = false ;
	let rv =  parseInt(wins[winIndex].elem.prePos[2]) / parseInt(wins[winIndex].elem.style.width) ;
	wins[winIndex].elem.style.width = wins[winIndex].elem.prePos[2] ;
	wins[winIndex].elem.style.height = wins[winIndex].elem.prePos[3] ;
	wins[winIndex].elem.top = wins[winIndex].elem.prePos[1] ;
	wins[winIndex].elem.left = wins[winIndex].elem.prePos[0] ;
	wins[winIndex].elem.querySelector(".arrow-button").classList.remove("acc-up-button") ;
	return rv ;
	
}

function endDown(winIndex) {
	
	if (!isMoving) {
		
		return ;
		
	}
	
	isMoving = false ;
	
	if (!wins[winIndex].maximized) {
		
		let windowArea = windows.getBoundingClientRect() ;
		if (currentMousePos[0] < 5) {
			
			console.log("Snapping left because of mouse position.") ;
			wins[winIndex].maximized = true ;
			wins[winIndex].elem.prePos = [wins[winIndex].elem.left,wins[winIndex].elem.top,wins[winIndex].elem.style.width,wins[winIndex].elem.style.height] ;
			wins[winIndex].elem.style.width = windowArea.width/2 + 5 ;
			wins[winIndex].elem.style.height = windowArea.height + 5 ;
			wins[winIndex].elem.top = 0 ;
			wins[winIndex].elem.left = -5 ;
			wins[winIndex].elem.querySelector(".arrow-button").classList.add("acc-up-button") ;
			renderWindowPosition(winIndex) ;
			
		}
		
		else if (currentMousePos[0] > windowArea.width - 5) {
			
			console.log("Snapping right because of mouse position.") ;
			wins[winIndex].maximized = true ;
			wins[winIndex].elem.prePos = [wins[winIndex].elem.left,wins[winIndex].elem.top,wins[winIndex].elem.style.width,wins[winIndex].elem.style.height] ;
			wins[winIndex].elem.style.width = windowArea.width/2 + 5 ;
			wins[winIndex].elem.style.height = windowArea.height + 5 ;
			wins[winIndex].elem.top = 0 ;
			wins[winIndex].elem.left = windowArea.width / 2 ;
			wins[winIndex].elem.querySelector(".arrow-button").classList.add("acc-up-button") ;
			renderWindowPosition(winIndex) ;
			
		}
		
		else if (currentMousePos[1] < 5) {
			
			console.log("Maxi cos mousi") ;
			wins[winIndex].maximized = true ;
			wins[winIndex].elem.prePos = [wins[winIndex].elem.left,wins[winIndex].elem.top,wins[winIndex].elem.style.width,wins[winIndex].elem.style.height] ;
			wins[winIndex].elem.style.width = windowArea.width + 10 ;
			wins[winIndex].elem.style.height = windowArea.height + 5 ;
			wins[winIndex].elem.top = 0 ;
			wins[winIndex].elem.left = -5 ;
			wins[winIndex].elem.querySelector(".arrow-button").classList.add("acc-up-button") ;
			renderWindowPosition(winIndex) ;
			
		}
		
	}
	
}

let currentMousePos = [0,0] ;
document.body.addEventListener("mousemove",e=>{
	
	currentMousePos = [e.pageX,e.pageY] ;
	
}) ;
document.body.addEventListener("mouseup",_=>endDown(currentlyMoving)) ;


ipc.on("newWindow",(m,d)=>newWindow(...d)) ;