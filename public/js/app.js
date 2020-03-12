let DATE_FORMAT='MMM DD, YYYY';
let TIME_FORMAT='hh:mm A';
let LAST_SEEN_FORMAT='MMM DD, YYYY hh:mm A';
let frmStack = [];
let tharak = {};
$( document ).ready(function() {
	provider = new Provider();
	storage = new Storage();
	auth = provider.auth;
	app = new appClass();
	app.initialize();
	app.navigateTo(chatads, {});
});
class appClass
{
	registerSync(formObj){
		this.syncObjects.push(formObj);
	}
	initialize(){
		this.frmStack = [];
		this.formList = {};
		this.callbacks = [];
		this.syncObjects = [];
		window.addEventListener('online',  function(event){
			this.isOnline = true;
			console.log('online');
			provider.fillContacts();
			//provider.fillMessages();
		}.bind(this));
		window.addEventListener('offline', function(event){
			this.isOnline = false;
			console.log('offline');
		}.bind(this));
		this.timerId = window.setInterval(function(){
			if(app.isAppOnline()){
				for(var idx=0; idx<this.syncObjects.length; idx++){
					var syncObject = this.syncObjects[idx];
					syncObject.loadSync();
				}
			}
		}.bind(this, ), 20*1000);// Forevery 2 secs
	}
	isAppOnline(){
		return navigator.onLine;
	}
	registerCallbacks(callback){
		if(navigator.onLine){
		  this.isOnline = true;
			callback();
		 } else {
			this.isOnline = false;
		 }
		this.callbacks.push(callback);
	}
	updDefaultBack(){
		this.onBack(app.getCurrentForm(), this);
	}
	onBack(frmObj, parent){
		var backCallback = function(event) {
			if(parent.frmStack.length > 1){
				var formId = parent.frmStack.pop();
				formId.onBack();
				parent.hide(formId);
			}
			let oldFrm = app.frmStack[parent.frmStack.length-1];
			oldFrm.isBack = true;
			oldFrm.fromBack();
			app.show(oldFrm);
			
		};
		this.updateBack(frmObj, backCallback.bind(parent));
		/*$('#'+frmObj.id+' .fa-arrow-left').unbind('click');
		$('#'+frmObj.id+' .fa-arrow-left').click(backCallback.bind(parent));*/
	}
	updateBack(frmObj, backCallback){
		$('#'+frmObj.id+' .fa-arrow-left').unbind('click');
		$('#'+frmObj.id+' .fa-arrow-left').click(backCallback);
	}
	registerForm(formList, formElem){
		var formObj = new formElem();
		formObj.id = formElem.name;
		var options = {root: document.documentElement};
		var callback = function(mutationsList, observer) {
			mutationsList.forEach(mutation => {
				if (mutation.attributeName === 'class' && mutation.target.className.indexOf('d-none') === -1) {
					delete formObj.isBack;
					this.onBack(formObj, this);
				}
			})
		}
		const mutationObserver = new MutationObserver(callback.bind(this));
		console.log('Called '+formObj.id);
		mutationObserver.observe($('#'+formObj.id)[0], { attributes: true });
		this.formList[formObj.id] = formObj;
	}
	findForm(frmClass){		
		if(this.formList.length === 0 || !this.formList[frmClass.name]){
			this.registerForm(this.formList, frmClass);
		}
		return this.formList[frmClass.name];
	}
	navigateTo(frmClass, input){
		var formObj = this.findForm(frmClass);
		formObj.preShow(input);
		if(input)
			formObj.onNavigate(input);
		this.show(formObj);
		formObj.postShow(input);
	}
	show(fromObj){
		let oldFrm;
		if(this.frmStack.length > 0){
			oldFrm = this.frmStack[this.frmStack.length-1];
			oldFrm.onHide();
			if(!this.isBack)
				this.hide(oldFrm);
			fromObj.previous = oldFrm;
		}

		fromObj.getWidgetByPath('').removeClass('d-none');
		console.log(fromObj.id+' Show Called');
		
		if(!oldFrm)
			this.frmStack.push(fromObj);
		else if(fromObj.id !== oldFrm.id){
			this.frmStack.push(fromObj);
		}
	}
	hide(fromObj){
		fromObj.getWidgetByPath('').addClass('d-none');
	}
	getCurrentForm(){
		return this.frmStack[this.frmStack.length-1];
	}
	stopTimer(){
		window.clearInterval(this.timerId);
	}
}
function onLoggOff(){
	var uid = Utility.getCurrentUserId();
	if(uid){
		auth.signOut().then(function() {
			var today = Utility.getFormattedDate(new Date(), LAST_SEEN_FORMAT);
			provider.updateContacts({id: uid, lastSeen : today});			
			app.stopTimer();
			console.log('Logg off');
		}).catch(function(error) {
			console.log(error);
		});
	}
}