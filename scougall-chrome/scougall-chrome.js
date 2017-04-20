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

let tabs = new Array() ;
let currentTab = -1 ;

let inject = require("fs").readFileSync(__dirname+"/inject.js").toString() ;

let tabsElem = document.getElementById("tabs") ;
let newtab = document.getElementById("newtab") ;
let views = document.getElementById("views") ;
let box = document.getElementById("box") ;

let inited = false ;

function garbCollect() {
	
	console.log("Collecteing garbige.") ;
	while (tabs.lastIndexOf(null) === tabs.length - 1 && tabs.length > 0) {
		
		tabs.pop() ;
		
	}
	
}

function newTab(url) {
	
	let title = url ;
	let t = {
		
		get url() {
			
			return url ;
			
		},
		set url(v) {
			
			url = v ;
			
			if (currentTab === thisTab) {
				
				box.value = v ;
				
			}
			
			
		},
		get title() {
			
			return title ;
			
		},
		set title(val) {
			
			t.tabText.innerText = val ;
			
		},
		tab:document.createElement("div"),
		tabText:document.createElement("span"),
		tabImage:document.createElement("img"),
		view:document.createElement("webview")
		
	} ;
	let thisTab = tabs.push(t) - 1 ;
	let closeThis =_=> {
		
		tabsElem.removeChild(t.tab) ;
		views.removeChild(t.view) ;
		tabs[thisTab] = null ;
		t = null ;
		garbCollect() ;
		currentTab = -1 ;
		
	} ;
	t.tab.classList.add("tab") ;
	t.tab.addEventListener("click",_=>goToTab(thisTab)) ;
	t.tab.addEventListener("mouseup",e=>{
		
		if (e.button === 1) {
			
			closeThis() ;
			
		}
		
	}) ;
	//t.tabImage.src = `${purl.protocol}//${purl.host}/favicon.ico` ;
	t.tabImage.classList.add("tab-image") ;
	t.tabText.innerText = url ;
	t.tab.appendChild(t.tabImage) ;
	t.tab.appendChild(t.tabText) ;
	tabsElem.insertBefore(t.tab,newtab) ;
	t.view.partition = "persist:scougallchrome" ;
	t.view.src = url ;
	t.view.autosize = true ;
	t.view.plugins = true ;
	views.appendChild(t.view) ;
	t.view.addEventListener("page-title-updated",e=>t.title=e.title) ;
	t.view.addEventListener("page-favicon-updated",e=>t.tabImage.src=e.favicons[0]) ;
	t.view.addEventListener("will-navigate",e=>t.url=e.url) ;
	t.view.addEventListener("did-navigate",e=>t.url=e.url) ;
	t.view.addEventListener("dom-ready",_=>{
		
		t.view.executeJavaScript(inject) ;
		
		if (!inited) {
			
			t.view.getWebContents().session.on("will-download",(e,download)=>{
				
				let downloadURL = download.getURL() ;
				let downloadName = download.getFilename() ;
				let downloadSize = download.getTotalBytes() ;
				download.cancel() ;
				
			}) ;
			
		}
		
		inited = true ;
		
	}) ;
	t.view.addEventListener("new-window",e=>newTab(e.url)) ;
	
	
	t.isLoading = false ;
	t.view.addEventListener("did-start-loading",_=>{
		
		t.isLoading = true ;
		t.tab.classList.add("loading") ;
		
		if (currentTab === thisTab) {
			
			nav.classList.add("loading") ;
			
		}
		
	}) ;
	t.view.addEventListener("did-stop-loading",_=>{
			
			t.isLoading = false ;
			t.tab.classList.remove("loading") ;
			
			if (currentTab === thisTab) {
				
				nav.classList.remove("loading") ;
				
			}
		
	}) ;
	
	t.view.classList.add("view") ;
	
	if (currentTab > -1) {
		
		tabs[currentTab].view.classList.remove("active") ;
		tabs[currentTab].tab.classList.remove("active") ;
		
	}
	
	t.view.classList.add("active") ;
	t.tab.classList.add("active") ;
	currentTab = thisTab ;
	
}

function goToTab(tab) {
	
	if (tab === currentTab) {
		
		return ;
		
	}
	
	if (currentTab > -1) {
		
		tabs[currentTab].view.classList.remove("active") ;
		tabs[currentTab].tab.classList.remove("active") ;
		
	}
	
	tabs[tab].view.classList.add("active") ;
	tabs[tab].tab.classList.add("active") ;
	if (tabs[tab].isLoading) {
		
		nav.classList.add("loading") ;
		
	}
	else {
		
		nav.classList.remove("loading") ;
		
	}
	box.value = tabs[tab].url ;
	
	currentTab = tab ;
	
}

function reload() {
	
	tabs[currentTab].view.reload() ;
	
}

function back() {
	
	tabs[currentTab].view.goBack() ;
	
}

function forward() {
	
	tabs[currentTab].view.goForward() ;
	
}

let domains = ["ax","abogado","academy","accountant","accountants","actor","adult","xxx","af","africa","agency","airforce","com.al","al","com.dz","dz","as","ad","co.ao","com.ai","ai","aq","ag","com.ag","apartments","app","archi","com.ar","am","army","aw","com.aw","ac","asia","associates","associates","attorney","auction","audio","melbourne","sydney","net.au","com.au","tirol","wien","at","co.at","aero","com.az","az","baby","bs","com.bs","com.bh","band","com.bd","bank","bar","bb","bargains","eus","beer","by","brussels","vlaanderen","be","bz","bj","berlin","bm","best","bet","com.bt","bible","bid","bayern","bike","motorcycles","cam","bingo","bio","black","blackfriday","blog","blue","boats","bo","book","booking","ba","boston","co.bw","boutique","rio","br.com","com.br","net.br","io","broker","com.bn","org.bn","net.bn","budapest","build","builders","bg","bi","business","biz","buzz","cab","cafe","com.kh","camera","com.cm","co.cm","net.cm","cm","camp","quebec","ca","capetown","cv","capital","car","auto","cars","cards","care","career","careers","casa","cash","casino","barcelona","cat","catering","ky","center","cf","ceo","chat","cheap","cl","集团","在线","中文网","世界","移动","机构","公司","网络","我爱你","商标","网店","八卦","佛山","广东","信息","中国","cn.com","cn","com.cn","net.cn","org.cn","christmas","cx","church","city","claims","cleaning","click","clinic","clothing","cloud","club","coach","cc","codes","coffee","college","com.co","com","community","company","computer","condos","cd","construction","consulting","contractors","co.ck","cooking","cool","coop","co.cr","cr","country","coupons","courses","credit","creditcard","cricket","hr","com.hr","cruises","cu","cw","com.cy","cz","dance","date","dating","deals","degree","delivery","democrat","dk","dental","forex","dentist","desi","design","diamonds","diet","digital","direct","directory","discount","dj","doctor","dog","domains","dm","do","web.do","download","dubai","durban","earth","eco","com.ec","ec","education","edu","eg","com.eg","sv","com.sv","email","energy","engineer","engineering","enterprises","gq","equipment","estate","co.ee","ee","com.et","eu.com","eu","events","exchange","expert","exposed","express","fail","faith","co.fk","family","fans","farm","fo","fashion","feedback","com.fj","film","finance","financial","fi","fish","fishing","fit","fitness","flights","florist","flowers","fly","food","football","forsale","forum","foundation","corsica","bzh","sarl","alsace","fr","com.fr","free","gf","tf","fund","furniture","futbol","fyi","ga","gal","gallery","gm","game","游戏","games","garden","gay","co.com","co","gent","com.ge","ge","გე","reise","koeln","kaufen","jetzt","immobilien","cologne","hamburg","haus","reisen","versicherung","nrw","de.com","de","com.de","com.gh","com.gi","gift","gifts","gives","glass","global","gmbh","gold","golf","graphics","gratis","gr.com","gr","com.gr","green","com.gl","gl","gd","gripe","group","gp","com.gu","gt","net.gt","com.gt","gg","guide","com.gn","gw","guitars","guru","gy","ht","healthcare","help","helsinki","hiphop","hiv","hockey","holdings","holiday","home","homes","hn","hk","com.hk","net.hk","香港","horse","hospital","host","hosting","hotel","hotels","house","how","hu","co.hu","is","immo","inc","संगठन","in","co.in","id","co.id","industries","info","ink","institute","insurance","insure","international","investments","ir","co.ir","iq","irish","ie","islam","im","org.il","co.il","net.il","co.it","it","ci","com.jm","みんな","nagoya","yokohama","okinawa","ryukyu","osaka","コム","kyoto","jp","co.jp","je","jewelry","jobs","joburg","jo","com.jo","juegos","ҚАЗ","kz","co.ke","kim","com.ki","kitchen","kiwi","krd","com.kw","kg","land","lat","lv","com.lv","org.lv","law","lawyer","lease","com.lb","legal","co.ls","lgbt","com.lr","com.ly","ly","li","life","lighting","limited","limo","link","lt","live","loan","loans","lol","london","la","lotto","love","ltda","lu","com.mo","com.mk","mk","com.mg","mg","maison","mw","org.my","com.my","my","mv","ml","com.mt","management","market","marketing","markets","mq","mu","yt","mba","media","medical","meet","memorial","men","menu","com.mx","net.mx","mx","miami","fm","mobi","moda","moe","moi","md","mom","mc","money","mn","me","ms","المغرب","ma","mortgage","moscow","москва","movie","co.mz","music","name","com.na","nr","navy","com.np","net","amsterdam","frl","nl","co.nl","com.an","an","network","new","nz","org.nz","co.nz","net.nz","news","ong","ngo","ni","com.ni","ng","com.ng","ninja","nu","mp","no","co.no","now","om","com.om","one","onl","online","ooo","organic","org","com.pk","pk","ps","pa","com.pa","com.py","paris","partners","parts","party","pay","com.pe","pe","pet","pharmacy","org.ph","ph","com.ph","net.ph","photo","photography","photos","physio","pics","pictures","pink","pn","pizza","place","plumbing","plus","poker","biz.pl","pl","com.pl","org.pl","porn","com.pt","pt","press","productions","pro","pw","promo","properties","property","protection","pub","com.pr","pr","com.qa","qa","qpon","racing","radio","recipes","red","rehab","reit","ren","rent","rentals","repair","report","cg","republican","rest","restaurant","re","review","reviews","rip","rocks","rodeo","ro","com.ro","rugby","ruhr","run","онлайн","сайт","орг","tatar","РУС","com.ru","ru","рф","rw","saarland","sh","kn","lc","pm","vc","sale","salon","ws","sm","st","sa","school","schule","science","scot","secure","security","sn","com.sn","срб","rs","co.rs","services","sex","sexy","sc","shiksha","shoes","shop","商店","shopping","show","sl","sg","com.sg","singles","sx","site","ski","sk","si","soccer","social","software","solar","solutions","so","za.com","co.za","gs","닷넷","닷컴","kr","co.kr","space","soy","org.es","es","com.es","nom.es","sport","lk","srl","stockholm","storage","store","stream","studio","study","style","sd","supplies","supply","support","surf","surgery","sr","com.se","se","swiss","ch","com.sy","sy","systems","taipei","com.tw","tw","tj","co.tz","tattoo","tax","taxi","td","team","tech","technology","tel","tv","tennis","thai","co.th","theater","theatre","tickets","tienda","tl","tips","tires","today","tg","tk","tokyo","to","tools","top","tours","town","toys","trade","trading","training","travel","tt","co.tt","tube","com.tn","tn","istanbul","ist","com.tr","tm","tc","ug","co.ug","com.ua","ua","ae","emarat","uk.com","uk","uk.net","co.uk","org.uk","net.uk","nyc","vegas","us.org","us.com","us","university","uno","uy","com.uy","uz","vacations","vu","com.vu","com.ve","ventures","vet","viajes","video","vn","com.vn","villas","vip","vg","vision","vodka","vote","voting","voto","voyage","wales","cymru","wf","wang","watch","شبكة","webcam","website","موقع","网址","转发","wed","wedding","whoswho","wiki","win","wine","vin","work","works","world","wtf","xyz","yachts","yoga","co.zm","com.zm","co.zw","zone"] ;
let urlModule = require("url") ;

function load(url) {
	
	let ourl = url ;
	if (url.search(/http.*:\/\//gi) === 0 || url.search(/file:\/\//gi) === 0) {
		
		tabs[currentTab].view.loadURL(url) ;
		return ;
		//url = url.substring(url.indexOf("://")+3,url.length) ;
		
	}
	ext = url.split("/")[0].split(".").pop() ;
	if (domains.indexOf(ext) !== -1) {
		
		url = `http://${url}` ;
		
	}
	else {
		
		url = `https://www.google.co.uk/search?q=${url}` ;
		
	}
	console.log(url) ;
	tabs[currentTab].view.loadURL(url) ;
	
}

document.getElementById("back").addEventListener("click",back) ;
document.getElementById("forwards").addEventListener("click",forward) ;
document.getElementById("reload").addEventListener("click",reload) ;

let homePage = "https://www.google.co.uk/" ;
document.getElementById("home").addEventListener("click",_=>load(homePage)) ;
document.getElementById("notabs").addEventListener("click",_=>newTab(homePage)) ;
newtab.addEventListener("click",_=>newTab(homePage)) ;

box.addEventListener("keydown",e=>{
	
	if (e.key === "Enter") {
		
		load(box.value) ;
		
	}
	
}) ;

if (window.location.hash) {
	
	newTab(`file://${window.location.hash.substring(1,window.location.hash.length)}`) ;
	
}

else {
	
	newTab(homePage) ;
	
}