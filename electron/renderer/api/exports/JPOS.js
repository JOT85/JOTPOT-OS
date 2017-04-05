let ipc = require("electron").ipcRenderer ;

module.exports = {
	
	download:(...args)=>ipc.send("download",args),
	open:(...args)=>ipc.send("open",...args),
	popup:(...args)=>ipc.send("popup",...args)
	
} ;