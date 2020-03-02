class chgProfile extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('.fa-check').click(this.doChgRegister.bind(this));
		this.getWidgetByPath('').on('click', this.adjustFields.bind(this));
		this.getWidgetByPath('.profile-section-info i').click(this.doEditName.bind(this));
		this.getWidgetByPath('.profile-section-about i').click(this.doEditAbout.bind(this));
		this.getWidgetByPath('.profile-section-pic img').click(this.doUploadPohoto.bind(this));
	}
	onNavigate(data){
		if(data.userName){
			this.userName = data.userName;
			this.isRegister = data.isRegister;
		}else if(data.item === 'cropped'){
			var image = this.getWidgetByPath('#profilePhoto');
			image.attr('src', '');
			image.attr('alt', data.fileName);
			image.attr('src',data.imageSrc);
			this.isCropped = true;
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
		if(this.isCropped)
			return;
		this.adjustAllFields();
		var uid = Utility.getCurrentUserId();
		if(uid && uid !== '' && !this.isRegister){
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
	doEditName(event){
		if(event.force){
			if(this.getWidgetByPath('#edit_name i').hasClass('fa-pencil-alt'))
				return;
		}
		if(this.getWidgetByPath('#edit_name i').hasClass('fa-pencil-alt')){
			this.getWidgetByPath('#edit_name i').removeClass('fa-pencil-alt');
			this.getWidgetByPath('#edit_name i').addClass('fa-times');
			var editName = this.getWidgetByPath('#lbl_contact_name').text();
			if(editName === 'Enter Your Name')
				editName = '';
			this.getWidgetByPath('#contact_name').val(editName);
			this.getWidgetByPath('#lbl_contact_name').hide();
			this.getWidgetByPath('#contact_name').show();
			this.getWidgetByPath('#contact_name').focus();
		}else{
			this.getWidgetByPath('#edit_name i').removeClass('fa-times');
			this.getWidgetByPath('#edit_name i').addClass('fa-pencil-alt');
			
			var contactName = this.getWidgetByPath('#contact_name').val();
			if(contactName === '')
				contactName = 'Enter Your Name';
			this.getWidgetByPath('#lbl_contact_name').text(contactName);
			this.getWidgetByPath('#lbl_contact_name').show();
			this.getWidgetByPath('#contact_name').hide();
			this.getWidgetByPath('#contact_name').val(null);
		}

	}
	doEditAbout(event){
		if(event.force){
			if(this.getWidgetByPath('#edit_name i').hasClass('fa-pencil-alt'))
				return;
		}
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

	doUploadPohoto(){
		app.navigateTo('ImageCropper');
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
		this.doEditName({force : true});
		this.doEditAbout({force : true});		
		var contactName = $('#lbl_contact_name').text();
		var contactDesc = $('#lbl_contact_desc').text();
		
		var userId = this.userName;
		var userData = {
			id: Utility.getCurrentUserId(),
			name: contactName,
			number : userId,
			aboutMsg : contactDesc,
			lastSeen: "online"
		};
		userData.pic = url;
		provider.updateContact(userData.id, userData, function(){
			localStorage.setItem("userName", userId);
			app.navigateTo('contactPanel', userData);
		});
	}
	
	addChgProfile(profileData){
		this.getWidgetByPath('#profilePhoto').attr('src', profileData.pic);
		this.getWidgetByPath('#lbl_contact_name').text(profileData.name);
	}
}