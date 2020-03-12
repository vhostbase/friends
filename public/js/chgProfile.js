class chgProfile extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('#chgRegister').click(this.doChgRegister.bind(this));
		this.getWidgetByPath('').on('click', this.adjustFields.bind(this));
		this.getWidgetByPath('.profile-section-info i').click(this.doEditName.bind(this));
		this.getWidgetByPath('.profile-section-about i').click(this.doEditAbout.bind(this));
		this.getWidgetByPath('.profile-section-pic img').click(this.doUploadPohoto.bind(this));
		//this.getWidgetByPath('#profilePhoto').attr('src', Utility.getDefaultPhoto());
		
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
		/*if(this.isRegister)
			this.getWidgetByPath('#profilePhoto').attr('alt', 'dProfile.png');*/
	}
	authCallback(response){
		console.log( "Logged in successfully." );
		var userName = localStorage.getItem("userName");
		if(userName)
			app.navigateTo(contactPanel, {});
	}
	authErrorCallback(){
	}
	postShow(){

		if(this.isCropped)
			return;
		this.adjustAllFields();
		this.loadProfile();
	}
	loadProfile(profileData){
		if(this.isRegister)
			return;
		var uid = this.getAuthUserId();
		if(profileData){
			if(profileData.id === uid){
				this.addProfile(profileData);
			}
		}else{
			var crit = {where : {id: uid}};
			storage.getAllContacts(crit, function(results){
				if(results.length > 0){
					this.addProfile(results.item(0));
				}else{
					this.addProfile({pic: Utility.getDefaultPhoto()});
				}
			}.bind(this));
		}
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
		app.navigateTo(ImageCropper);
	}
	loginCallback(callback, response){
		console.log( "Logged in successfully." );
		callback();
	}

	doChgRegisterold(){
		var authId = this.getAuthUserId();
		var data = this.getWidgetByPath('#profilePhoto').attr('src');
		var fileName = this.getWidgetByPath('#profilePhoto').attr('alt');
		if(fileName !== ""){
			Utility.uploadImage2Store(data, 'ProfileImages/'+authId, 'png', fileName, function(){
				storage.insertImage({'imgData': data, id: this.getAuthUserId(), 'fileName': 'ProfileImages/'+fileName}, function(){
					this.doChgRegister2(fileName);
				}.bind(this));
			}.bind(this));
		}else{
			this.doChgRegister2('ProfileImages/profile-img.png');
		}
	}
	doChgRegister(){
		var control = this.getWidgetByPath('#chgRegister');
		control.unbind('click');
		control.removeClass('fa-check');
		control.addClass('fa-spinner fa-pulse');
		var authId = this.getAuthUserId();
		var data = this.getWidgetByPath('#profilePhoto').attr('src');
		var fileName = this.getWidgetByPath('#profilePhoto').attr('alt');
		this.doChgRegister2({pic:data, picFile: fileName});
		/*if(fileName !== ""){
			storage.insertImage({'imgData': data, id: this.getAuthUserId(), 'fileName': 'ProfileImages/'+fileName}, function(){
				this.doChgRegister2(fileName);
			}.bind(this));
		}else{
			this.doChgRegister2('ProfileImages/profile-img.png');
		}*/
	}
	getAuthUserId(){
		if(app.isAppOnline()){
			var currentUser = auth.currentUser;
			return currentUser.uid;
		}else{
			return Utility.getCurrentUserId();
		}
	}
	doChgRegister2(profilePic){
		this.doEditName({force: true});
		this.doEditAbout({force: true});		
		var contactName = $('#lbl_contact_name').text();
		var contactDesc = $('#lbl_contact_desc').text();
		var loginId = this.getAuthUserId();
		var userId = this.userName;
		var userData = {
			id: loginId,
			name: contactName,
			number : userId,
			aboutMsg : contactDesc,
			lastSeen: "online"
		};
		userData.picFile = profilePic.picFile;
		userData.pic = profilePic.pic;
		provider.updateContact(userData.id, userData, function(){
			localStorage.setItem("userName", userId);
			localStorage.setItem("userId", loginId);
			userData.isRegister = this.isRegister;
			app.navigateTo(contactPanel, userData);
		}.bind(this));
	}
	
	addProfile(profileData){
		if(profileData.pic)
			this.getWidgetByPath('#profilePhoto').attr('src', profileData.pic);
		else
			this.getWidgetByPath('#profilePhoto').attr('src', Utility.getDefaultPhoto());
		if(profileData.fileName)
			this.getWidgetByPath('#profilePhoto').attr('alt', profileData.fileName);
		this.getWidgetByPath('#lbl_contact_name').text(profileData.name);
		var control = this.getWidgetByPath('#chgRegister');
		control.addClass('fa-check');
	}
}