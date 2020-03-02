class BaseClass
{
	constructor(){
		this.id = this.constructor.name;
	}
	show(){
		let oldFrm;
		if(frmStack.length > 0){
			oldFrm = frmStack[frmStack.length-1];
			if(!this.isBack)
				oldFrm.hide();
			this.previous = oldFrm;
		}

		this.getWidgetByPath('').removeClass('d-none');
		console.log(this.id+' Show Called');
		
		if(!oldFrm)
			frmStack.push(this);
		else if(this.id !== oldFrm.id){
			frmStack.push(this);
		}
		this.postShow();

	}
	removeFromFromBack(id){
		var frmPos = -1;
		for(var idx=0; idx<frmStack.length; idx++){
			if(frmStack[idx].id === id){
				frmPos = idx;
				break;
			}
		}
		if(frmPos > -1)
			frmStack.splice(frmPos, 1);
	}
	preShow(){
	}
	postShow(){
		console.log('BaseClass postShow Called');
	}
	
	hide(){
		this.getWidgetByPath('').addClass('d-none');
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
}