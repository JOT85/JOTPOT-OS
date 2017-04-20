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

//	WARNING, this code will be injected into EVERY page loading in Scougall Chrome,
//	please remeber to respect the privicy of others,
//	and this can also have very negative performance impacts depending on what you are doing in this file...
//	Currently, it is used to implement the context menu, although this doesn't need to
//	be exposed, Scougall Chrome is designed to give the end-user as much power over everything as possible
//	and thus this file is exposed, have fun :)


let jotpot_scougall_chrome_object = {
	
	currentMenu:null,
	makeMenu(coords,items) {
		
		let menu = document.createElement("div") ;
		menu.style.position = "absolute" ;
		menu.style.left = coords[0] + "px" ;
		menu.style.top = coords[1] + "px" ;
		menu.style.width = "200px" ;
		menu.style.backgroundColor = "white" ;
		menu.style.borderStyle = "solid" ;
		menu.style.borderWidth = "2px" ;
		menu.style.borderColor = "black" ;
		menu.style.zIndex = "999999" ;
		for (let doing in items) {
			
			let item = document.createElement("div") ;
			item.innerHTML = items[doing].html ;
			item.style.backgroundColor = "white" ;
			item.style.color = "black" ;
			item.style.cursor = "default" ;
			item.addEventListener("mouseover",_=>item.style.backgroundColor="grey") ;
			item.addEventListener("mouseout",_=>item.style.backgroundColor="white") ;
			item.style.boxSizing = "border-box" ;
			item.style.padding = "4px" ;
			item.style.paddingLeft = "15px" ;
			item.addEventListener("click",items[doing].func) ;
			menu.appendChild(item) ;
			
		}
		if (this.currentMenu) {
			document.body.removeChild(this.currentMenu) ;
		}
		this.currentMenu = menu ;
		document.body.appendChild(menu) ;
		
	}
	
} ;

document.body.addEventListener("contextmenu",e=>{
	
	e.preventDefault() ;
	
	if (e.target.tagName.toLowerCase() === "a") {
		
		if (e.target.href) {
			
			jotpot_scougall_chrome_object.makeMenu([e.pageX,e.pageY],[
				
				{
					
					html:"Open link in new tab",
					func:_=>window.open(e.target.href,"_blank")
					
				},
				
				{
					
					html:`<a href=${e.target.href} style="text-decoration:none;color:black;display:inline-block;width:100%;height:100%;cursor:default;" download>Save link as...</a>`,
					func:_=>{}
					
				},
				
				{
					
					html:"Copy link address",
					func:_=>alert("Coming soon...")
					
				},
				
				{
					
					html:"Inspect",
					func:_=>alert("Coming soon...")
					
				}
				
			]) ;
			
		}
		
		else {
			
			jotpot_scougall_chrome_object.makeMenu([e.pageX,e.pageY],[
				
				{
					
					html:"Link has no href",
					func:_=>window.open(e.target.href,"_blank")
					
				},
				
				{
					
					html:"Inspect",
					func:_=>alert("Coming soon...")
					
				}
				
			]) ;
			
		}
		
	}
	
	else if (e.target.tagName.toLowerCase() === "img") {
		
		jotpot_scougall_chrome_object.makeMenu([e.pageX,e.pageY],[
			
			{
				
				html:"Open image in new tab",
				func:_=>window.open(e.target.src,"_blank")
				
			},
			
			{
				
				html:`<a href=${e.target.src} style="text-decoration:none;color:black;display:inline-block;width:100%;height:100%;cursor:default;" download>Save image as...</a>`,
				func:_=>{}
				
			},
			
			{
				
				html:"Copy image address",
				func:_=>alert("Coming soon...")
				
			},
			
			{
				
				html:"Inspect",
				func:_=>alert("Coming soon...")
				
			}
			
		]) ;
		
	}
	
	else {
		
		jotpot_scougall_chrome_object.makeMenu([e.pageX,e.pageY],[
			
			{
				
				html:"Back",
				func:_=>window.history.back()
				
			},
			
			{
				
				html:"Forward",
				func:_=>window.history.forward()
				
			},
			
			{
				
				html:"Reload",
				func:_=>window.location.reload()
				
			},
			
			{
				
				html:`<a href=${window.location.href} style="text-decoration:none;color:black;display:inline-block;width:100%;height:100%;cursor:default;" download>Save as...</a>`,
				func:_=>{}
				
			},
			
			{
				
				html:"View page source",
				func:_=>alert("Coming soon...")
				
			},
			
			{
				
				html:"Inspect",
				func:_=>alert("Coming soon...")
				
			}
			
		]) ;
		
	}
	
}) ;

document.body.addEventListener("mousedown",e=>{
	
	if (!jotpot_scougall_chrome_object.currentMenu) {
		
		return ;
		
	}
	
	if (e.pageX < parseInt(jotpot_scougall_chrome_object.currentMenu.style.left) || e.pageX > parseInt(jotpot_scougall_chrome_object.currentMenu.style.left) + parseInt(jotpot_scougall_chrome_object.currentMenu.style.width) || e.pageY < parseInt(jotpot_scougall_chrome_object.currentMenu.style.top) || e.pageY > parseInt(jotpot_scougall_chrome_object.currentMenu.style.top) + parseInt(jotpot_scougall_chrome_object.currentMenu.style.height)) {
		
		document.body.removeChild(jotpot_scougall_chrome_object.currentMenu) ;
		jotpot_scougall_chrome_object.currentMenu = null ;
		
	}
	
}) ;

document.addEventListener("scroll",e=>{
	
	if (jotpot_scougall_chrome_object.currentMenu) {
		
		document.body.removeChild(jotpot_scougall_chrome_object.currentMenu) ;
		jotpot_scougall_chrome_object.currentMenu = null ;
		
	}
	
},{passive:true}) ;