function Script(){
	this.uuid = null;
	this.name = null;
	this.includeUrls = null;
	this.onloadJavaScrip = null;
}

Script.create = function(scriptJson){
	var script = new Script();
	script.name = scriptJson.name;
}