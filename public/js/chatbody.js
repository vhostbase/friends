class chatbody extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('.enter-chat #inputMsg').keyup(this.flipControl.bind(this));
		this.getWidgetByPath('.fa-paperclip').click(this.callAttach.bind(this));
		this.getWidgetByPath('#ipControl').click(this.sendTxtMessage.bind(this));
		this.getWidgetByPath('#attachImg').change(this.uploadImageMsg.bind(this));
		this.getWidgetByPath('.fa-camera').click(this.takePhoto.bind(this));
		app.registerSync(this);
	}
	onNavigate(data){
		if(data.messageType === 'image'){
			this.imageMsgData = data;
			return;
		}
		this.data = data;		
	}
	loadSync(){
		var uid = Utility.getCurrentUserId();
		var crit = null;
		storage.getMessages(crit, function(results){
			for(var idx=0; idx<results.length; idx++){
				var messageData = results.item(idx);
				if(messageData.deletedBy && messageData.deletedBy.indexOf(uid) > -1){
					this.removeMsgExists(messageData, uid);
				}
				if(messageData.viewStatus === 0){
					messageData.viewStatus = 1;
					provider.insertMessage(messageData, function(messageData){
						this.updateStatusFlag(messageData);
					}.bind(this, messageData));
				}else if(messageData.viewStatus === 1){
					var today = Utility.getToday();
					var id = this.chatterId;
					this.addChatMessage3(messageData, today, id);
				}else if(messageData.viewStatus === 3 || messageData.viewStatus === 2){
					this.updateStatusFlag(messageData);
				}
			}		
		}.bind(this));
	}
	removeMsgExists(messageData, uid){
		var chatItem = this.getWidgetByPath('.chat-window #'+messageData.msgDateTime);
		if(chatItem.length > 0)
			chatItem.remove();
		if(messageData.deletedBy && messageData.deletedBy.indexOf(uid) > -1){
			provider.insertMessage(messageData);
		}
	}
	updateStatusFlag(messageData){
		if(messageData.viewStatus > 0){
			var chatItem = this.getWidgetByPath('.chat-window #'+messageData.msgDateTime+' i');
			if(chatItem.length > 0){
				if(messageData.viewStatus === 1){
					chatItem.removeClass('fa-pulse fa-spinner');
					chatItem.addClass('fa-check');
				}else if(messageData.viewStatus === 2){
					chatItem.removeClass('fa-check');
					chatItem.addClass('fa-check-double');
				}else if(messageData.viewStatus === 3){
					chatItem.addClass('fa-check-double icon-viewed');
				}
			}
		}
	}
	adjustHeader(data){
		var pic = data.pic;
		var name = data.name;		
		var id = data.id;
		this.chatterId = id;
		this.getWidgetByPath('#navbar').empty();
		var chatHdr = this.addChatHeader(pic, name);
		this.getWidgetByPath('#navbar').append(chatHdr);
		this.info = data.info;
		if(this.info === 1){
			this.getWidgetByPath('#chatMenu').empty();
			this.getWidgetByPath('#chatMenu').append($(this.getGroupChatMenuTemplate()));
			this.getWidgetByPath('#bodyProfile').click(this.loadGroupProfileData.bind(this));
		}else{
			this.getWidgetByPath('#chatMenu').empty();
			this.getWidgetByPath('#chatMenu').append($(this.getContactChatMenuTemplate()));
			this.getWidgetByPath('#bodyProfile').click(this.loadProfileData.bind(this));
		}
		this.showContactChat();
	}
	adjustFields(){
		this.getWidgetByPath("").scrollTop(this.getWidgetByPath("")[0].scrollHeight);
	}
	postShow(){		
		if(this.imageMsgData){
			this.sendMessage(this.imageMsgData.messageText, this.imageMsgData.messageType, this.imageMsgData.imgData);
		}else{
			this.adjustHeader(this.data);
		}
		$('.fab').addClass('d-none');		
		this.getWidgetByPath(".container").scrollTop(this.getWidgetByPath(".container")[0].scrollHeight);
	}
	uploadImageMsg(){
		var file = event.target.files[0];
		var fileType = file.type;
		var msgType = fileType.substr(0, fileType.indexOf('/'))
		var image = {src: '', alt: file.name};
		var reader = new FileReader();
		reader.onloadend = function() {
			if(msgType === 'image'){
				image.src = reader.result;
				 app.navigateTo(chatimg, image);
			}else{
				this.sendMessage('media', msgType, reader.result);
			}
		}.bind(this);
		reader.readAsDataURL(file, msgType);
	}
	takePhoto(){
		this.getWidgetByPath('#attachImg').attr('accept', 'image/*;capture=camera');
		this.getWidgetByPath('#attachImg').click();
	}
	uploadMedia(file, msgType){
		var folder = 'ShareVideo/'+new Date().getTime()+'/'
		var storageRef = firebase.storage().ref();
		var mountainsRef = storageRef.child(folder+file.name);
		var uploadTask = mountainsRef.put(file);
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
		}.bind(this), function(error) {
		  // Handle unsuccessful uploads
		}, function() {
		  // Handle successful uploads on complete
		  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
		  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			console.log('File available at', downloadURL);
			this.sendMessage('media', msgType, downloadURL);
		  }.bind(this));
		}.bind(this));
	}
	flipControl(event){
		var data = event.currentTarget.value;
		if(data.length === 0 && this.getWidgetByPath('#inputControl').hasClass('fa-paper-plane')){
			this.getWidgetByPath('#inputControl').removeClass('fa-paper-plane');
			this.getWidgetByPath('#inputControl').addClass('fa-microphone');
			this.getWidgetByPath('.fa-camera').removeClass('d-none');
		}
		if(data.length > 0 && this.getWidgetByPath('#inputControl').hasClass('fa-microphone')){
			this.getWidgetByPath('#inputControl').removeClass('fa-microphone');
			this.getWidgetByPath('#inputControl').addClass('fa-paper-plane');
			this.getWidgetByPath('.fa-camera').addClass('d-none');
		}
	}
	recordVoice(){
		this.getWidgetByPath('#attachImg').attr('accept', 'audio/*;capture=microphone');
		this.getWidgetByPath('#attachImg').click();
	}
	sendTxtMessage(event){
		if(this.getWidgetByPath('#inputControl').hasClass('fa-microphone')){
			recordVoice();
		}else{
			var imgData = '';
			var type;
			if(event.imgData){
				imgData = event.imgData;
				type = event.type;
			}
			var txtData = this.getWidgetByPath('#inputMsg').val();
			this.getWidgetByPath('#inputMsg').val("");
			this.flipControl({currentTarget: {value : ''}});
			this.sendMessage(txtData, type, imgData);
		}
	}
	sendMessage(txtData, type, imgData){
		var msgTime = Utility.getCurrentDateTime();
		var id = this.chatterId;
		var currId = Utility.getCurrentUserId();
		var info = this.info;
		var messageData = {};
		messageData.messageText = txtData;
		messageData.to = id;
		messageData.from = currId;
		messageData.type='text';
		messageData.msgDateTime = msgTime;
		messageData.viewStatus = 0;
		messageData.info = info;
		if(type){
			messageData.type=type;
			messageData.mediaData = imgData;
		}
		var chatDate = Utility.getFormattedDate(new Date(), DATE_FORMAT);
		this.addChatMessage2(messageData, chatDate, id);
		storage.insertMessages(messageData);
	}
	updMsgViewStatus(messageData){
		var status = this.getWidgetByPath('#'+messageData.msgDateTime+' i');
		status.removeClass('fa-spinner fa-pulse');
		status.addClass('fa-check');
	}
	callAttach(){
		$('#myModal .modal-body .list-group-perms').empty();
		Utility.attachmentItems(['Documents', 'Camera', 'Gallery'], $('#myModal .modal-body .list-group-perms'), this.onSelectAttachItem.bind(this));
		$('#dialogId').click();
	}
	onSelectAttachItem(event){
		var selected = $(event.currentTarget).text();
		if("Documents" === selected){
			this.getWidgetByPath('#attachImg').attr('accept', 'application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf');
		}else if('Camera' === selected){
			this.getWidgetByPath('#attachImg').attr('accept', 'image/*;capture=camera');
		}else if('Gallery' === selected){
			this.getWidgetByPath('#attachImg').attr('accept', 'image/*, video/*');
		}
		this.getWidgetByPath('#attachImg').click();
		$('#dialogId').click();
	}
	loadProfileData(){
		var chatterName = this.getWidgetByPath('#bodyProfile #contactName2').text();		
		var chatterId = this.chatterId;//this.getWidgetByPath('#chatId').val();
		var chatterPic = this.getWidgetByPath('#navbar #contactPhoto2').attr('src');
		app.navigateTo(userProfile, {'chatterName': chatterName, 'chatterId': chatterId, 'chatterPic': chatterPic});
	}
	loadGroupProfileData(){
		var chatterName = this.getWidgetByPath('#bodyProfile #contactName2').text();		
		var chatterId = this.chatterId;//this.getWidgetByPath('#chatId').val();
		var chatterPic = this.getWidgetByPath('#navbar #contactPhoto2').attr('src');
		app.navigateTo(grpProfile, {'chatterName': chatterName, 'chatterId': chatterId, 'chatterPic': chatterPic});
	}
	showContactChat(parent){
		this.getWidgetByPath('.chat-window').empty();
		this.getWidgetByPath('.chat-window').css('overflow-y', 'hidden');
		if(parent !== 'allContactsPanel'){
			if(this.info === 1){
				this.showContactGroupChat();
			}else{
				this.showContactChatMsg();
			}
		}
	}
	addChatHeader(pic, name){
		var hdrHtml = '';
		hdrHtml += '<div class="d-block d-sm-none"><i class="fas fa-arrow-left p-2 mr-2 text-white" style="font-size: 1.0rem; cursor: pointer;"></i></div>';
		hdrHtml += '<span><img id="contactPhoto2" src="'+pic+'" alt="Profile Photo" class="img-fluid rounded-circle mr-2 circled-image" style="height:50px;" id="pic"></span>';
		hdrHtml += '<div id="bodyProfile" class="d-flex flex-column"><div class="text-white font-weight-bold" id="contactName2">'+name+'</div><div class="text-white small" id="details">at 5:28 PM</div></div>';
		hdrHtml += '<div class="d-flex flex-row align-items-center ml-auto"><span class="cursor-class"><i class="fas fa-phone mx-3 text-white d-md-block"></i></span><span class="cursor-class"><i id="vcall" class="fas fa-video mx-3 text-white d-md-block"></i></span><span class="cursor-class" data-toggle="dropdown"><i class="fas fa-ellipsis-v mr-2 mx-sm-3 text-white"></i></span><div id="chatMenu" class="dropdown-menu dropdown-menu-right cursor-class"></div></div>';
		let hdrElem =  $(hdrHtml);
		hdrElem.find('#vcall').click(this.sendToVideoCall.bind(this));
		return hdrElem;
	}
	sendToVideoCall(){
		app.navigateTo(videoCall);
	}
	getContactChatMenuTemplate(){
		var template = '';
		template += '<span class="dropdown-item">View Contact</span>';
		template += '<span class="dropdown-item">Search</span>';
		template += '<span class="dropdown-item">Change Wallpaper</span>';
		template += '<span class="dropdown-item" onclick="clearChat(\'chatbody\');">Clear Chat</span>';
		return template;
	}
	getGroupChatMenuTemplate(){
		var template = '';
		template += '<span class="dropdown-item" onclick="fireMenu(this);">Group Info</span>';
		template += '<span class="dropdown-item" onclick="fireMenu(this);">Search</span>';
		template += '<span class="dropdown-item" onclick="fireMenu(this);">Clear Chat</span>';
		template += '<span class="dropdown-item" onclick="fireMenu(this);">Exit Group</span>';
		return template;
	}
	showContactChatMsg(crit){
		var id = this.chatterId;
		var uid = Utility.getCurrentUserId();	
		var crit = {where:{'info': 0, to:{ in: [uid, id]}, from: { in: [uid, id]}}, order: {by: 'msgDateTime', type:'asc'}};
		storage.getMessages(crit, this.showContactChatMsgCallback.bind(this, id, uid));
	}
	showContactChatMsgCallback(id, uid, results){
		var today = Utility.getToday();
		for(var idx=0; idx<results.length; idx++){
			var item = results.item(idx);
			if(item.deletedBy && item.deletedBy.indexOf(uid) > -1)
				continue;
			this.addChatMessage3(item, today, id);
			this.updateMsgViewStatus(item);
		}
		//this.adjustFields();
	}
	showContactGroupChat(crit){
		var id = this.chatterId;
		var currentUser = auth.currentUser;
		var uid = currentUser.uid;
		var crit = { 'info': 0, to:{ in: [uid, id]}, from: { in: [uid, id]} };
		storage.getMessages(crit, this.groupChatCallback.bind(this, id, currentUser));
	}
	groupChatCallback(id, currentUser, results){
		var today = Utility.getToday();
		for(var idx=0; idx<results.length; idx++){
			var item = results.item(idx);
			item.from = item.fromAddr;
			item.to = item.toAddr;
			item.type = item.msgType;

			this.addChatMessage3(item, today, id);
			this.updateMsgViewStatus(item);
		}
	}
	addChatMessage3(item, today, id){
		var chatItem = this.getWidgetByPath('.chat-window #'+item.msgDateTime);
		if(chatItem.length === 0)
			this.addChatMessage2(item, today, id);
	}
	addChatMessage2(item, today, id){
		if(((item.from === Utility.getCurrentUserId() || item.to === Utility.getCurrentUserId()) && (item.from === id || item.to === id)) || (item.info === 1)){
			Utility.addScrollBar();
			var msgDate = Utility.getFormattedDate(new Date(item.msgDateTime), DATE_FORMAT);
			  if(new Date(today).getTime() === new Date(msgDate).getTime()){
				msgDate = 'TODAY';
			  }
				this.addDateForChat(msgDate);
			  if(Utility.getCurrentUserId() === item.from)
				this.addRightChat(item);
			  else
				this.addLeftChat(item);
			  this.getWidgetByPath(".chat-window").scrollTop(this.getWidgetByPath(".chat-window")[0].scrollHeight);
			  return 1;
		}
		return 0;
	}
	updateMsgViewStatus(message){
		var uid = Utility.getCurrentUserId();
		if(message.to === uid){
			if(message.viewStatus < 3){
				message.viewStatus = 3;
				provider.updateMessage(message);
			}
		}
	}
	addDateForChat(lblDate){
		var lblDateKey = lblDate;
		if(lblDate !== 'TODAY')
			lblDateKey = new Date(lblDate).getTime();
		var elem = this.getWidgetByPath('.chat-window').find('#'+lblDateKey);
		if(elem.length > 0)
			return;
		var chatHtml = '';
		chatHtml += '<div id="'+lblDateKey+'" class="row user-chat" field="date"><div class="mx-auto my-2 bg-primary text-white small py-1 px-2 rounded">';
		chatHtml += lblDate;
		chatHtml += '</div></div>';
		this.getWidgetByPath('.chat-window').append($(chatHtml));
	}
	addLeftChat(chatData){
		var elem = this.getWidgetByPath('.chat-window').find('#'+chatData.msgDateTime);
		if(elem.length > 0)
			return;
		var msgTime = moment(new Date(chatData.msgDateTime)).format(TIME_FORMAT);
		var chatHtml = '';
		chatHtml += '<div id="'+chatData.msgDateTime+'" class="row user-chat" style="padding-left: 10px;"><div class="msg chat-item-left">';
		if(chatData.info === 1){
			chatHtml += '<div class="small font-weight-bold text-primary">'+Utility.getChatterName(chatData)+'</div>';
		}
		chatHtml += '<div class="d-flex flex-row">';
		if(chatData.type.indexOf('image') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div><img width="150" height="200" src="'+chatData.mediaData+'"></div><div><span>'+chatData.messageText+'</span></div></div>';
		else if(chatData.type.indexOf('audio') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><audio controls><source src="'+chatData.mediaData+'" type="'+chatData.type+'"></audio></div></div>';
		else if(chatData.type.indexOf('video') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><video width="400" controls><source src="'+chatData.mediaData+'" type="video/mp4"></video></div></div>';
		else
			chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';
		chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">';
		chatHtml += msgTime;
		chatHtml += '</div></div></div></div>';
		this.getWidgetByPath('.chat-window').append($(chatHtml));
		this.getWidgetByPath('.chat-window #'+chatData.msgDateTime).bind("contextmenu", function (event) {
		  this.fireContextMenu(event);
		}.bind(this));
		this.getWidgetByPath('.chat-window #'+chatData.msgDateTime).click(this.onSelectMsg.bind(this));
	}
	fireContextMenu(event){
		event.preventDefault();		
		this.getWidgetByPath('#navbar').empty();
		var chatHdr = this.addChatDelHeader(event.currentTarget.id);
		chatHdr.find('.fa-arrow-left').click(this.showChatBody.bind(this));
		chatHdr.find('.fa-trash').click(this.removeMsg.bind(this));
		this.getWidgetByPath('#navbar').append(chatHdr);    
		this.getWidgetByPath('.chat-window').attr('msg-select', '1');
		$('#chatbody .chat-window #'+event.currentTarget.id).addClass('blackBg');
	}
	showChatBody(event){
		this.adjustHeader(this.data);
		app.updDefaultBack();
	}
	addRightChat(chatData){
		var elem = this.getWidgetByPath('.chat-window').find('#'+chatData.msgDateTime);
		if(elem.length > 0)
			return;
		var msgTime = moment(new Date(chatData.msgDateTime)).format(TIME_FORMAT);
		var chatHtml = '';
		chatHtml += '<div id="'+chatData.msgDateTime+'" class="row my-chat"><div class="msg chat-item-right">';
		if(chatData.info === 1){
			chatHtml += '<div class="small font-weight-bold text-primary">'+Utility.getCurrentUserName()+'</div>';
		}
		chatHtml += '<div class="d-flex flex-row">';
		if(chatData.type.indexOf('image') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div><img width="150" height="200" src="'+chatData.mediaData+'"></div><div><span>'+chatData.messageText+'</span></div></div>';
		else if(chatData.type.indexOf('audio') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><audio controls><source src="'+chatData.mediaData+'" type="'+chatData.type+'"></audio></div></div>';
		else if(chatData.type.indexOf('video') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><video width="400" controls><source src="'+chatData.mediaData+'" type="video/mp4"></video></div></div>';
		else
			chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';
		chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">';
		chatHtml += msgTime;
		chatHtml += '</div>';
		if(chatData.viewStatus === 0)
			chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="padding-left: 4px;"><i class="fas fa-spinner fa-pulse"></i></i></div>';
		else if(chatData.viewStatus === 1)
			chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="padding-left: 4px;"><i class="fas fa-check"></i></div>';
		else if(chatData.viewStatus === 2)
			chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="padding-left: 4px;"><i class="fas fa-check-double"></i></div>';
		else if(chatData.viewStatus === 3)
			chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="padding-left: 4px;"><i class="fas fa-check-double icon-viewed"></i></div>';
		chatHtml += '</div></div></div>';
		$(chatHtml).click(this.onSelectMsg.bind(this));
		this.getWidgetByPath('.chat-window').append($(chatHtml));
		this.getWidgetByPath('.chat-window #'+chatData.msgDateTime).bind("contextmenu", function (event) {      
			this.fireContextMenu(event);
		}.bind(this));
	}
	onSelectMsg(event){
		if(this.getWidgetByPath('.chat-window').attr('msg-select')){
			if(!this.getWidgetByPath('.chat-window #'+event.currentTarget.id).hasClass('blackBg')){
				this.getWidgetByPath('.chat-window #'+event.currentTarget.id).toggleClass('blackBg');
				this.getWidgetByPath('#rm-list').append($('<span>'+event.currentTarget.id+'</span>'));
			}else{
				var count = this.getWidgetByPath('#rm-list span').length;
				for(var idx=0; idx<count; idx++){
					var id = $(this.getWidgetByPath('#rm-list span')[idx]).text();
					if(event.id === id){
						$(this.getWidgetByPath('#rm-list span')[idx]).remove();
						this.getWidgetByPath('.chat-window #'+event.currentTarget.id).toggleClass('blackBg');
					}
				}
			}
			var count = this.getWidgetByPath('#rm-list span').length;
			this.getWidgetByPath('#rm-count').text(count);
			if(count === 0){
				this.getWidgetByPath('.chat-window').removeAttr('msg-select');
				var pic = contactPanel.getWidgetByPath('.list-chats img').attr('src');
				var name = contactPanel.getWidgetByPath('.list-chats .user-name').text();
				this.getWidgetByPath('#navbar').empty();
				var chatHdr = addChatHeader(pic, name);
				this.getWidgetByPath('#navbar').append(chatHdr);
			}
		}
	}
	addChatDelHeader(id){
		var hdrHtml = '';
		hdrHtml += '<div id="delHdr" class="d-block d-sm-none"><i class="fas fa-arrow-left p-2 mr-2 text-white" style="font-size: 1.0rem; cursor: pointer;"></i></div>';
		hdrHtml += '<div id="rm-count" class="text-white font-weight-bold">0</div>';
		hdrHtml += '<div id="rm-list" style="display:none"><span>'+id+'</span></div>';
		hdrHtml += '<div class="d-flex flex-row align-items-center ml-auto">';
		hdrHtml += '<span class="cursor-class"><i class="fas fa-arrow-circle-left mx-3 text-white d-md-block"></i></span>';
		hdrHtml += '<span class="cursor-class"><i class="fas fa-trash mx-3 text-white d-md-block"></i></span>';
		hdrHtml += '<span class="cursor-class"><i class="fas fa-copy mx-3 text-white d-md-block"></i></span>';
		hdrHtml += '<span class="cursor-class"><i class="fas fa-arrow-circle-right mx-3 text-white d-md-block"></i></span>';
		hdrHtml += '</div>';
		return $(hdrHtml);
	}
	removeMsg(event){
		var msgSelects = this.getWidgetByPath('.chat-window').find('.blackBg');
		for(var idx=0; idx<msgSelects.length; idx++){
			var msgId = parseInt($(msgSelects[idx]).attr('id'));
			$(msgSelects[idx]).remove();

			var crit = {where : {msgDateTime : msgId}};
			storage.getMessages(crit, function(results){
				if(results.length>0){
					var msgItem = results.item(0);
					if(!msgItem.deletedBy){
						msgItem.deletedBy = [];
					}
					msgItem.deletedBy.push(Utility.getCurrentUserId());
					storage.insertMessages(msgItem);
				}
			});
			
		}		
		this.adjustHeader(this.data);
		app.updDefaultBack();
	}
}