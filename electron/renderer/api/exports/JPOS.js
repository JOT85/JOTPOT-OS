let ipc = require("electron").ipcRenderer ;

module.exports = {
	
	download:(...args)=>ipc.send("download",args)
	
} ;