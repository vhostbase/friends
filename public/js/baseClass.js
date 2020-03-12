class BaseClass
{
	constructor(){
		this.id = this.constructor.name;		
	}
	setTable(appTable){
		this.table = appTable;
	}
	preShow(){
	}
	postShow(){
		console.log('BaseClass postShow Called');
	}
	
	onHide(){
		
	}
	getWidgetByPath(id){
		return $('#'+this.id+' '+id);
	}
	onHide(){
	}
	onBack(){
	}
	onNavigate(){
	}
	fromBack(){
	}
	loadSync(){
	}
}