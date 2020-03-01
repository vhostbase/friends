class register extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('').on('click', this.adjustFields.bind(this));
		this.getWidgetByPath('.profile-section-info img').click(this.doEditMobile.bind(this));
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
		this.getWidgetByPath('#lbl_contact_nbr').hide();
		this.getWidgetByPath('#contact_nbr').show();
		this.getWidgetByPath('#contact_nbr').focus();
	}
	doRegister(){
		this.adjustFields();
		var userName = $('#lbl_contact_nbr').text();
		auth.createUserWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(function(response){
			app.navigateTo('chgProfile', {'userName': userName});
		}).catch(function(error) {
			if(error.code === "auth/email-already-in-use"){
				app.navigateTo('chgProfile', {'userName': userName});
			}
		}.bind(this));
		
	}
}