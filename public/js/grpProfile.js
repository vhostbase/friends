class grpProfile extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('#searchHdr').empty();
		this.getWidgetByPath('#searchHdr').append(this.getContactPrfGrpMenuTemplate());
		this.getWidgetByPath('.container-group2 .fa-user-plus').click(this.addParticipants.bind(this));
		this.getWidgetByPath('.profile-section-top-text .fa-check').click(this.updParticipants.bind(this));
		this.getWidgetByPath('.profile-section-about img').click(this.doEditGroupName.bind(this));
		this.getWidgetByPath('').on('click', this.adjustFields.bind(this));
		this.getWidgetByPath('.profile-section-pic img').click(this.doUploadPohoto);
		this.getWidgetByPath('#profile-pic-input').change(this.changePhoto);
	}
	onNavigate(data){
		if(data.contacts){
			this.contacts = data.contacts;
			return;
		}
		this.chatterName = data.chatterName;
		this.chatterId = data.chatterId;
		this.chatterPic = data.chatterPic;
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
	adjustFields(){
		var contactNbr = this.getWidgetByPath('#group_name_desc').val();
		if(contactNbr){
			this.getWidgetByPath('#lbl_group_name').text(contactNbr);
			this.getWidgetByPath('#lbl_group_name').show();
			this.getWidgetByPath('#group_name_desc').hide();
			this.getWidgetByPath('#group_name_desc').val(null);			
		}
	}
	doEditGroupName(event){
		this.getWidgetByPath('#lbl_group_name').hide();
		this.getWidgetByPath('#group_name_desc').show();
		this.getWidgetByPath('#group_name_desc').focus();
	}
	updParticipants(){
		var data = this.getWidgetByPath('#profilePhoto').attr('src');
		var fileName = this.getWidgetByPath('#profilePhoto').attr('alt');
		this.uploadImage(data, 'png', fileName, function(url){
			this.updParticipants2(url);
		}.bind(this));
	}
	updParticipants2(chatterPic){
		var chatterId = this.chatterId;
		var chatterName = this.getWidgetByPath('.container-group2 #lbl_group_name').text();
		var contacts = this.getWidgetByPath('.list-contact-details li #contactId');

		var data = {
			name : chatterName,
			id : chatterId,
			pic : chatterPic,
			members: []
		};
		for(var idx=0; idx<contacts.length; idx++){
			data.members.push($(contacts[idx]).text());
		}
		provider.updateContact(data.id, data, function(){
			app.navigateTo(chatbody);
		}.bind(this));
	}
	addParticipants(){
		var contacts = this.getWidgetByPath('.list-contact-details li #contactId');
		app.navigateTo(createGroupPanel, {mode:1, chatterId : this.chatterId, contacts : contacts});
	}
	postShow(){
		var chatterName = this.chatterName;
		var chatterId = this.chatterId;
		var chatterPic = this.chatterPic;
		this.chatterId = chatterId;
		this.getWidgetByPath('.profile-section-top-text span').text('Group Profile');
		this.getWidgetByPath('#lbl_group_name').text(chatterName);
		
		this.addGroupPic(chatterPic);
		this.addGroupLabel(chatterName);
		if(this.contacts){
			var ids = '';
			for(var idx=0; idx<this.contacts.length; idx++){
				if(idx > 0)
					ids += ',';
				ids += '"'+this.contacts[idx]+'"';
			}
			this.fetchContacts(ids);
			return;
		}
		this.getWidgetByPath('.list-contact-details').empty();
		storage.getAllContacts({where : {id :chatterId}}, function(rows){
			if(rows.length>0){
				var value = rows.item(0);
				if(value.members){						
					var ids = '';
					var members = value.members.split(',');
					for(var idx=0; idx<members.length; idx++){
						if(idx > 0)
							ids += ',';
						ids += '"'+members[idx]+'"';
						
					}
					this.fetchContacts(ids);
				}
			}
		}.bind(this));
	}
	fetchContacts(ids){
		storage.getAllContacts({where : {id :{in : ids}}}, function(rows){
			for(var idx=0; idx<rows.length; idx++){
				var contact = rows.item(idx);
				if(contact.id === Utility.getCurrentUserId()){
					contact.name = 'You';
				}else{
					contact.event = 'onclick="grpProfile.selectContact(\''+contact.name+'\');"';
				}
				this.loadGrpContacts(contact);
			}
		}.bind(this));
	}
	loadProfile(){
		var chatterName = $('#contactPanel .chat-select .user-name span').text();
		var chatterType = $('#contactPanel .chat-select #info').text();
		var chatterId = $('#contactPanel .chat-select #contactId').text();
		var chatterPic = $('#contactPanel .chat-select img').attr('src');
		this.getWidgetByPath('.profile-section-top-text span').text('Group Profile');
		this.getWidgetByPath('#lbl_group_name').text(chatterName);
		this.getWidgetByPath('.list-contact-details').empty();
		this.addGroupPic(chatterPic);
		this.addGroupLabel(chatterName);
		var target = this;
		storage.getAllContacts({where : {id : chatterId}}, function(rows){
			if(rows.length>0){
				var value = rows.item(0);
				if(value.members){						
					var ids = '';
					var members = value.members.split(',');
					for(var idx=0; idx<members.length; idx++){
						if(idx > 0)
							ids += ',';
						ids += '"'+members[idx]+'"';
						
					}
					storage.getAllContacts({where : {id :{in : members}}}, function(rows){
						for(var idx=0; idx<rows.length; idx++){
							var contact = rows.item(idx);
							if(contact.id === Utility.getCurrentUserId()){
								contact.name = 'You';
							}else{
								contact.event = 'onclick="grpProfile.selectContact(\''+contact.name+'\');"';
							}
							this.loadGrpContacts(contact);
						}
					}.bind(this));
				}
			}
		}.bind(this));
	}
	selectContact(contactName){
		this.addPermissions(contactName);
		$('#dialogId').click();
	}
	addGroupLabel(contactName){
		var hdrHtml =''
		hdrHtml += '<li class="list-group-item list-group-item-action chat-item">';
		hdrHtml += '<div class="chat-text"><div class="chat-head">';
		hdrHtml += '<div class="user-name"><span>'+contactName+'</span><input type="text" id="contact_name" style="display:none;"></input></div>';
		hdrHtml += '<div class="user-name"><span class="text-black"><i class="fas fa-pen"></i></span></div>';
		hdrHtml += '</div></div>';
		hdrHtml +='</li>';
		$('#userProfile .list-contact-details').append($(hdrHtml));
	}
	addGroupPic(chatterPic){
		this.getWidgetByPath('.profile-section-pic img').attr('src', chatterPic);
	}
	addGroupPic2(chatterPic){
		var html =''
		html += '<li class="list-group-item list-group-item-action chat-item">';
		html += '<div class="row profile-section-pic"><input type="file" id="grpprofile-pic-input" class="d-none" accept="image/*">';
		html += '<img id="grpprofilePhoto" src="'+chatterPic+'" alt="" style="cursor:pointer;margin-left:40px;" class="rounded-circle circled-image-profile" onclick="uploadGrpPic();"></div>';
		html +='</li>';
		$('#userProfile .list-contact-details').append($(html));

		$('#grpprofile-pic-input').change(function(event){
		var image = $('#grpprofilePhoto');
		image.attr('src', '');
		image.attr('alt', event.target.files[0].name);
		var reader = new FileReader();
		reader.onloadend = function(event) {
			 image.attr('src',reader.result);
		}
		reader.readAsDataURL(event.target.files[0]);
		
		});
	}
	getContactPrfGrpMenuTemplate(){
		var hdrHtml = '';
		hdrHtml += '<div class="row icons d-flex searchHdrClass"><div class="p-2 profile-section-top-text" style="cursor:pointer;"><i class="fas fa-arrow-left text-white"></i></div>';
		hdrHtml += '<div class="d-flex flex-column">';
		hdrHtml += '<div class="text-white font-weight-bold"></div>';
		hdrHtml += '<div class="text-white small"></div>';
		hdrHtml += '</div>';
		hdrHtml += '<div class="p-2 profile-section-top-text cursor-class"><i class="fas fa-user-plus text-white"></i></div>';
		hdrHtml += '</div>';
		return $(hdrHtml);
	}
	loadGrpContacts(contact){
		var contactHtml = Utility.loadContactTemplate(contact);
		$('#grpProfile .list-contact-details').append($(contactHtml));
	}
	addPermissions(contactName){
		$('#myModal .list-group-perms').empty()
		var contactHtml = this.permissionTemplate(contactName)
		$('#myModal .list-group-perms').append($(contactHtml));
	}
	permissionTemplate(contactName){
		var hdrHtml = '';
		hdrHtml += '<li class="list-group-item list-group-item-action chat-item"><div class="chat-text"><div class="chat-head"><div class="user-name"><span>Message '+contactName+'</span></div></div></div></li>';
		hdrHtml += '<li class="list-group-item list-group-item-action chat-item"><div class="chat-text"><div class="chat-head"><div class="user-name"><span>View '+contactName+'</span></div></div></div></li>';
		hdrHtml += '<li class="list-group-item list-group-item-action chat-item"><div class="chat-text"><div class="chat-head"><div class="user-name"><span>Make group admin</span></div></div></div></li>';
		hdrHtml += '<li class="list-group-item list-group-item-action chat-item"><div class="chat-text"><div class="chat-head"><div class="user-name"><span>Remove '+contactName+'</span></div></div></div></li>';
		hdrHtml += '<li class="list-group-item list-group-item-action chat-item"><div class="chat-text"><div class="chat-head"><div class="user-name"><span>Verify security code</span></div></div></div></li>';
		return $(hdrHtml);
	}
	getContactPrfMenuTemplate(contactName){
		var hdrHtml = '';
		hdrHtml += '<div class="row icons d-flex searchHdrClass"><div class="p-2 profile-section-top-text" style="cursor:pointer;" onclick="goToChatBody();"><i class="fas fa-arrow-left text-white"></i></div>';
		hdrHtml += '<div class="d-flex flex-column">';
		hdrHtml += '<div class="text-white font-weight-bold">'+contactName+'</div>';
		hdrHtml += '<div class="text-white small">online</div>';
		hdrHtml += '</div>';
		hdrHtml += '<div class="p-2 profile-section-top-text cursor-class" data-toggle="dropdown"><i class="fas fa-ellipsis-v text-white"></i></div>';
		hdrHtml += '<div class="dropdown-menu dropdown-menu-right">';
		hdrHtml += '<a class="dropdown-item" href="#">Share</a>';
		hdrHtml += '<a class="dropdown-item" href="#">Edit</a>';
		hdrHtml += '<a class="dropdown-item" href="#">View in address book</a>';
		hdrHtml += '<a class="dropdown-item" href="#">Verify security code</a>';
		hdrHtml += '</div></div>';

		return $(hdrHtml);
	}
	uploadImage(data, msgType, fileName, callback){
		if(!fileName){
			callback(data);
			return;
		}
		var folder = 'ProfileImages/'
		var storageRef = firebase.storage().ref();
		var mountainsRef = storageRef.child(folder+fileName);
		var uploadTask = mountainsRef.putString(data, 'data_url');
		uploadTask.on('state_changed', function(snapshot){
		  // Observe state change events such as progress, pause, and resume
		  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		  console.log('Upload is ' + progress + '% done');
		  switch (snapshot.state) {
			case firebase.storage.TaskState.PAUSED: // or 'paused'
			  console.log('Upload is paused');
			  break;
			case firebase.storage.TaskState.RUNNING: // or 'running'
			  console.log('Upload is running');
			  break;
		  }
		}, function(error) {
		  // Handle unsuccessful uploads
		}, function() {
		  // Handle successful uploads on complete
		  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
		  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			console.log('File available at', downloadURL);
			callback(downloadURL);
		  });
		});
	}
}