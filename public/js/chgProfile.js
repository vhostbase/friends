class chgProfile extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('.fa-check').click(this.doChgRegister.bind(this));
		this.getWidgetByPath('').on('click', this.adjustFields.bind(this));
		this.getWidgetByPath('.profile-section-info i').click(this.doEditName.bind(this));
		this.getWidgetByPath('.profile-section-about i').click(this.doEditAbout.bind(this));
		this.getWidgetByPath('.profile-section-pic img').click(this.doUploadPohoto.bind(this));
		this.getWidgetByPath('#profile-pic-input').change(this.changePhoto.bind(this));
	}
	onNavigate(data){
		if(data.userName){
			auth.signInWithEmailAndPassword(data.userName+'@gmail.com', 'Test@123').then(this.authCallback.bind(this)).catch(function(error) {
				if(error.code == "auth/user-not-found"){
					localStorage.removeItem("userName");
					this.authErrorCallback();
				}
			}.bind(this));
		}
	}
	authCallback(response){
		console.log( "Logged in successfully." );
		var userName = localStorage.getItem("userName");
		if(userName)
			app.navigateTo('contactPanel', {});
	}
	authErrorCallback(){
	}
	postShow(){
		this.adjustAllFields();
		var uid = Utility.getCurrentUserId();
		if(uid && uid !== ''){
			provider.inqContacts((profileData)=>{
				this.addChgProfile(profileData);
			}, uid);
		}
	}
	validateProfile(userName, callback){
		auth.signInWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(this.loginCallback.bind(this, callback)).catch(function(error) {
			if(error.code == "auth/user-not-found"){
				localStorage.removeItem("userName");
				callback();
			}
		}.bind(this));
	}
	adjustAllFields(){
		this.getWidgetByPath('#lbl_contact_name').show();
		this.getWidgetByPath('#contact_name').hide();
		this.getWidgetByPath('#lbl_contact_desc').show();
		this.getWidgetByPath('#contact_desc').hide();
	}
	adjustFields(){
		this.getWidgetByPath("").scrollTop(this.getWidgetByPath("")[0].scrollHeight);
	}
	doEditName(){
		if(this.getWidgetByPath('#edit_name i').hasClass('fa-pencil-alt')){
			this.getWidgetByPath('#edit_name i').removeClass('fa-pencil-alt');
			this.getWidgetByPath('#edit_name i').addClass('fa-times');
			var editName = this.getWidgetByPath('#lbl_contact_name').text();
			this.getWidgetByPath('#contact_name').val(editName);
			this.getWidgetByPath('#lbl_contact_name').hide();
			this.getWidgetByPath('#contact_name').show();
			this.getWidgetByPath('#contact_name').focus();
		}else{
			this.getWidgetByPath('#edit_name i').removeClass('fa-times');
			this.getWidgetByPath('#edit_name i').addClass('fa-pencil-alt');
			
			var contactName = this.getWidgetByPath('#contact_name').val();
			this.getWidgetByPath('#lbl_contact_name').text(contactName);
			this.getWidgetByPath('#lbl_contact_name').show();
			this.getWidgetByPath('#contact_name').hide();
			this.getWidgetByPath('#contact_name').val(null);
		}

	}
	doEditAbout(){
		if(this.getWidgetByPath('#edit_about i').hasClass('fa-pencil-alt')){
			this.getWidgetByPath('#edit_about i').removeClass('fa-pencil-alt');
			this.getWidgetByPath('#edit_about i').addClass('fa-times');
			var editName = this.getWidgetByPath('#lbl_contact_desc').text();
			this.getWidgetByPath('#contact_desc').val(editName);
			//this.getWidgetByPath('#contact_desc').emoji({place: 'after'});
			this.getWidgetByPath('#lbl_contact_desc').hide();
			this.getWidgetByPath('#contact_desc').show();
			this.getWidgetByPath('#contact_desc').focus();
		}else{
			this.getWidgetByPath('#edit_about i').removeClass('fa-times');
			this.getWidgetByPath('#edit_about i').addClass('fa-pencil-alt');
			var contactDesc = this.getWidgetByPath('#contact_desc').val();
			this.getWidgetByPath('#lbl_contact_desc').text(contactDesc);
			this.getWidgetByPath('#lbl_contact_desc').show();
			this.getWidgetByPath('#contact_desc').hide();
			this.getWidgetByPath('#contact_desc').val(null);
		}
	}
	changePhoto(){
		var image = this.getWidgetByPath('#profilePhoto');
		image.attr('src', '');
		image.attr('alt', event.target.files[0].name);
		var reader = new FileReader();
		reader.onloadend = function(event) {
			 image.attr('src',reader.result);
		}
		reader.readAsDataURL(event.target.files[0]);
	}
	doUploadPohoto(){
		this.getWidgetByPath('#profile-pic-input').click();
	}
	loginCallback(callback, response){
		console.log( "Logged in successfully." );
		callback();
	}

	doChgRegister(){
		var data = this.getWidgetByPath('#profilePhoto').attr('src');
		var fileName = this.getWidgetByPath('#profilePhoto').attr('alt');
		Utility.uploadImage(data, 'png', fileName, function(url){
			this.doChgRegister2(url);
		}.bind(this));
	}
	doChgRegister2(url){
		this.doEditName();
		this.doEditAbout();
		var userName = localStorage.getItem("userName");
		if(!userName)
			userName = Utility.getCurrentUserAlias();
		var contactName = $('#lbl_contact_name').text();
		if(contactName === 'Enter Your Name')
			contactName = userName;
		var database = firebase.database();
		var userData = {
			id: Utility.getCurrentUserId(),
			name: contactName,
			number: userName,
			lastSeen: "Apr 29 2018 17:58:02"
		};
		userData.pic = url;
		provider.updateContact(userData.id, userData, function(){
			localStorage.setItem("userName", userName);
			app.navigateTo('contactPanel');
		});
	}

	addChgProfile(profileData){
		this.getWidgetByPath('#profilePhoto').attr('src', profileData.pic);
		this.getWidgetByPath('#lbl_contact_name').text(profileData.name);
	}
}