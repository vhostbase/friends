class register extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('.profile-section-info .fa-pencil-alt').click(this.doEditMobile.bind(this));
		this.getWidgetByPath('.profile-section-top-text .fa-check').click(this.doRegister.bind(this));
	}
	adjustFields(){
		var contactNbr = this.getWidgetByPath('#contact_nbr').val();
		if(contactNbr){
			this.getWidgetByPath('#lbl_contact_nbr').text(contactNbr);
			this.getWidgetByPath('#lbl_contact_nbr').show();
			this.getWidgetByPath('#contact_nbr').hide();
			this.getWidgetByPath('#contact_nbr').val(null);
			this.getWidgetByPath('.profile-section-top-text .fa-check').focus();
		}
	}
	doEditMobile(){
		if(this.getWidgetByPath('#edit_mobile i').hasClass('fa-pencil-alt')){
			this.getWidgetByPath('#edit_mobile i').removeClass('fa-pencil-alt');
			this.getWidgetByPath('#edit_mobile i').addClass('fa-times');
			var editName = this.getWidgetByPath('#lbl_contact_nbr').text();
			if(editName === 'Enter Your Mobile Number')
				editName = '';
			this.getWidgetByPath('#contact_nbr').val(editName);
			this.getWidgetByPath('#lbl_contact_nbr').hide();
			this.getWidgetByPath('#contact_nbr').show();
			this.getWidgetByPath('#contact_nbr').focus();
		}else{
			this.getWidgetByPath('#edit_mobile i').removeClass('fa-times');
			this.getWidgetByPath('#edit_mobile i').addClass('fa-pencil-alt');
			
			var contactName = this.getWidgetByPath('#contact_nbr').val();
			if(contactName === '')
				contactName = 'Enter Your Mobile Number';
			this.getWidgetByPath('#lbl_contact_nbr').text(contactName);
			this.getWidgetByPath('#lbl_contact_nbr').show();
			this.getWidgetByPath('#contact_nbr').hide();
			this.getWidgetByPath('#contact_nbr').val(null);
		}

	}
	doEditMobile2(){
		this.getWidgetByPath('#lbl_contact_nbr').hide();
		this.getWidgetByPath('#contact_nbr').show();
		this.getWidgetByPath('#contact_nbr').focus();
	}
	doRegister(){
		
		var control = this.getWidgetByPath('.fa-check');
		control.unbind('click');
		control.removeClass('fa-check');
		control.addClass('fa-spinner fa-pulse');
		this.adjustFields();
		var userName = $('#lbl_contact_nbr').text();
		auth.createUserWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(this.authSuccessCallback.bind(this, userName, true)).catch(function(error) {
			if(error.code === "auth/email-already-in-use"){
				provider.appSignIn(userName, this.authSuccessCallback);
			}
		}.bind(this));
		
	}
	authErrorCallback(){
	}
	authSuccessCallback(userName, isRegister, response){
		app.navigateTo(chgProfile, {'userName': userName, 'isRegister': isRegister});
	}
}