let DATE_FORMAT='MMM DD, YYYY';
let TIME_FORMAT='hh:mm A';
let LAST_SEEN_FORMAT='MMM DD, YYYY hh:mm A';
let frmStack = [];
let tharak = {};
$( document ).ready(function() {
	provider = new Provider();
	storage = new Storage();
	auth = provider.auth;
	app = new app();
	app.initialize();
	app.navigateTo('chatads', {});
});
class app
{
	initialize(){
		function onBack(frmObj, parent){
			var backCallback = function(event) {
				if(parent.frmStack.length > 1){
					var formId = parent.frmStack.pop();
					formId.onBack();
					formId.hide();
				}
				let oldFrm = this.frmStack[parent.frmStack.length-1];
				oldFrm.isBack = true;
				oldFrm.fromBack();
				oldFrm.show();
				
			};
			$('#'+frmObj.id+' .fa-arrow-left').unbind('click');
			$('#'+frmObj.id+' .fa-arrow-left').click(backCallback.bind(parent));
		}
		var registerForm = function(formList, formElem){
			var formObj = new formElem();
			formObj.id = formElem.name;
			var options = {root: document.documentElement};
			var callback = function(mutationsList, observer) {
				mutationsList.forEach(mutation => {
					if (mutation.attributeName === 'class' && mutation.target.className.indexOf('d-none') === -1) {
						delete formObj.isBack;
						onBack(formObj, this);
					}
				})
			}
			const mutationObserver = new MutationObserver(callback.bind(this));
			console.log('Called '+formObj.id);
			mutationObserver.observe($('#'+formObj.id)[0], { attributes: true });
			formList[formObj.id] = formObj;
		}.bind(this);
		this.frmStack = [];
		this.formList = {};
		registerForm(this.formList, ImageCropper);
		registerForm(this.formList, newGrpPanel);
		registerForm(this.formList, userProfile);
		registerForm(this.formList, register);
		registerForm(this.formList, createGroupPanel);
		registerForm(this.formList, allContactsPanel);
		registerForm(this.formList, grpProfile);
		registerForm(this.formList, contactPanel);
		registerForm(this.formList, chatbody);
		registerForm(this.formList, chgProfile);
		registerForm(this.formList, chatads);
	}
	
	navigateTo(id, input){
		var formObj = this.formList[id];
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
			if(!this.isBack)
				oldFrm.hide();
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
	getCurrentForm(){
		return this.frmStack[this.frmStack.length-1];
	}
}
function onLoggOff(){
	var uid = Utility.getCurrentUserId();
	if(uid){
		auth.signOut().then(function() {
			var today = Utility.getFormattedDate(new Date(), LAST_SEEN_FORMAT);
			provider.updateContacts({id: uid, lastSeen : today});
			console.log('Logg off');
		}).catch(function(error) {
			console.log(error);
		});
	}
}