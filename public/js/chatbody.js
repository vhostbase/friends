class chatbody extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('.enter-chat .input-box #inputMsg').keyup(this.flipControl.bind(this));
		this.getWidgetByPath('.fa-paperclip').click(this.callAttach.bind(this));
		this.getWidgetByPath('#ipControl').click(this.sendTxtMessage.bind(this));
		this.getWidgetByPath('#attachImg').change(this.uploadImageMsg.bind(this));
		this.getWidgetByPath('.fa-camera').click(this.takePhoto.bind(this));
	}
	onNavigate(data){
		var pic = data.pic;
		var name = data.name;
		var info = data.info;
		var id = data.id;
		this.getWidgetByPath('#navbar').empty();
		var chatHdr = this.addChatHeader(pic, name, id, info);
		this.getWidgetByPath('#navbar').append(chatHdr);
		this.getWidgetByPath('#chatId').val(id);
		if(info === 'group'){
			this.getWidgetByPath('#info').val(1);
			this.getWidgetByPath('#chatMenu').empty();
			this.getWidgetByPath('#chatMenu').append($(this.getGroupChatMenuTemplate()));
			this.getWidgetByPath('#bodyProfile').click(this.loadGroupProfileData.bind(this));
		}else{
			this.getWidgetByPath('#info').val(0);
			this.getWidgetByPath('#chatMenu').empty();
			this.getWidgetByPath('#chatMenu').append($(this.getContactChatMenuTemplate()));
			this.getWidgetByPath('#bodyProfile').click(this.loadProfileData.bind(this));
		}
		this.showContactChat(id, parent, info);
	}
	adjustFields(){
		this.getWidgetByPath("").scrollTop(this.getWidgetByPath("")[0].scrollHeight);
	}
	onBack(){
	}
	postShow(){
		$('.fab').addClass('d-none');		
		this.getWidgetByPath(".container").scrollTop(this.getWidgetByPath(".container")[0].scrollHeight);
	}
	uploadImageMsg(){
		var file = event.target.files[0];
		var fileType = file.type;
		var msgType = fileType.substr(0, fileType.indexOf('/'))
		if(msgType === 'video'){
			this.uploadMedia(file, fileType);
		}
		var image = $('#chatImgbody #imgMsg');
		image.attr('src', '');
		var reader = new FileReader();
		reader.onloadend = function() {
			if(msgType === 'image'){
				image.attr('src', reader.result);
				 $('#chatImgbody').removeClass('d-none');
				 $('#chatbody').addClass('d-none');
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
		});
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
			var txtData = this.getWidgetByPath('#inputMsg').val();
			this.getWidgetByPath('#inputMsg').val("");
			this.flipControl({currentTarget: {value : ''}});
			this.sendMessage(txtData, '');
		}
	}
	sendMessage(txtData, type, imgData){
		var msgTime = Utility.getCurrentDateTime();
		var id = this.getWidgetByPath('#chatId').val();
		var currId = Utility.getCurrentUserId();
		var info = parseInt(this.getWidgetByPath('#info').val());
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
		provider.insertMessage(messageData, function(msgTime){
			this.addChatMessage2(messageData, chatDate, {uid:currId}, id);
		}.bind(this));
	}
	callAttach(){
		this.getWidgetByPath('#attachImg').attr('accept', 'audio/*,video/*,image/*');
		this.getWidgetByPath('#attachImg').click();
	}
	loadProfileData(){
		var chatterName = this.getWidgetByPath('#bodyProfile #contactName2').text();		
		var chatterId = this.getWidgetByPath('#chatId').val();
		var chatterPic = this.getWidgetByPath('#navbar #contactPhoto2').attr('src');
		app.navigateTo('userProfile', {'chatterName': chatterName, 'chatterId': chatterId, 'chatterPic': chatterPic});
	}
	loadGroupProfileData(){
		var chatterName = this.getWidgetByPath('#bodyProfile #contactName2').text();		
		var chatterId = this.getWidgetByPath('#chatId').val();
		var chatterPic = this.getWidgetByPath('#navbar #contactPhoto2').attr('src');
		app.navigateTo('grpProfile', {'chatterName': chatterName, 'chatterId': chatterId, 'chatterPic': chatterPic});
	}
	showContactChat(id, parent, info){
		this.getWidgetByPath('.chat-window').empty();
		this.getWidgetByPath('.chat-window').css('overflow-y', 'hidden');
		if(parent !== 'allContactsPanel'){
			if(info === 'group'){
				this.showContactGroupChat();
			}else{
				this.showContactChatMsg();
			}
		}
	}
	showContactChat4(message){
		if(this.getCurrentForm() === 'chatbody'){
			return;
		}
		if(message.from !== Utility.getCurrentUserId())
			message.status = 1;
		var chatDate = Utility.getFormattedDate(new Date(message.msgDateTime), DATE_FORMAT);
		this.addChatMessage2(message, chatDate, {uid:message.to}, message.from);
		if(message.from !== Utility.getCurrentUserId()){
			provider.updateMessage({msgDateTime: message.msgDateTime, status : 1}, function(msgId){
				console.log(msgId);
			});
		}
	}
	addChatHeader(pic, name, id, info){
		var hdrHtml = '';
		hdrHtml += '<div class="d-block d-sm-none"><i class="fas fa-arrow-left p-2 mr-2 text-white" style="font-size: 1.0rem; cursor: pointer;"></i></div>';
		hdrHtml += '<span><img id="contactPhoto2" src="'+pic+'" alt="Profile Photo" class="img-fluid rounded-circle mr-2" style="height:50px;" id="pic"></span>';
		hdrHtml += '<div id="bodyProfile" class="d-flex flex-column"><div class="text-white font-weight-bold" id="contactName2">'+name+'</div><div class="text-white small" id="details">at 5:28 PM</div></div>';
		hdrHtml += '<div class="d-flex flex-row align-items-center ml-auto"><span class="cursor-class"><i class="fas fa-phone mx-3 text-white d-md-block"></i></span><span class="cursor-class"><i class="fas fa-video mx-3 text-white d-md-block"></i></span><span class="cursor-class" data-toggle="dropdown"><i class="fas fa-ellipsis-v mr-2 mx-sm-3 text-white"></i></span><div id="chatMenu" class="dropdown-menu dropdown-menu-right cursor-class"></div></div>';
		return $(hdrHtml);
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
		var id = this.getWidgetByPath('#chatId').val();
		var uid = Utility.getCurrentUserId();		
		storage.getContactMessages(uid, id, crit, this.showContactChatMsgCallback.bind(this, id));
	}
	showContactChatMsgCallback(id, results){
		var today = Utility.getFormattedDate(new Date(), DATE_FORMAT);
		for(var idx=0; idx<results.length; idx++){
			var item = results.item(idx);
			if(item.fromAddr){
				item.from = item.fromAddr;
				item.to = item.toAddr;
				item.type = item.msgType;
			}			
			this.addChatMessage2(item, today, null, id);
			this.updateMsgViewStatus(item);
		}
	}
	showContactGroupChat(crit){
		var id = this.getWidgetByPath('#chatId').val();
		var currentUser = auth.currentUser;
		var uid = currentUser.uid;		
		storage.getGroupMessages(uid, id, crit, this.groupChatCallback.bind(this, id, currentUser));
	}
	groupChatCallback(id, currentUser, results){
		var today = Utility.getFormattedDate(new Date(), DATE_FORMAT);
		for(var idx=0; idx<results.length; idx++){
			var item = results.item(idx);
			item.from = item.fromAddr;
			item.to = item.toAddr;
			item.type = item.msgType;

			this.addChatMessage2(item, today, currentUser, id);
			this.updateMsgViewStatus(item);
		}
	}
	addChatMessage2(item, today, currentUser, id){
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
		message.viewStatus = 2;
		provider.updateMessage(message);
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
		chatHtml += '<div id="'+chatData.msgDateTime+'" isview="'+chatData.status+'" class="row user-chat" style="padding-left: 10px;"><div class="msg chat-item-left">';
		if(chatData.info === 1){
			chatHtml += '<div class="small font-weight-bold text-primary">'+Utility.getChatterName(chatData)+'</div>';
		}
		chatHtml += '<div class="d-flex flex-row">';
		if(chatData.type.indexOf('image') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div><img width="150" height="200" src="'+chatData.mediaData+'"></div><div><span>'+chatData.messageText+'</span></div></div>';
		else if(chatData.type.indexOf('audio') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><audio controls><source src="'+chatData.mediaData+'" type="'+chatData.type+'"></audio></div></div>';
		else if(chatData.type.indexOf('video') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><video width="400" controls><source src="'+chatData.mediaData+'" type="'+chatData.type+'"></video></div></div>';
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
		var chatHdr = addChatDelHeader(event.currentTarget.id);
		this.getWidgetByPath('#navbar').append(chatHdr);    
		this.getWidgetByPath('.chat-window').attr('msg-select', '1');
		this.getWidgetByPath('.chat-window #'+event.currentTarget.id).addClass('blackBg');
	}
	addRightChat(chatData){
		var elem = this.getWidgetByPath('.chat-window').find('#'+chatData.msgDateTime);
		if(elem.length > 0)
			return;
		var msgTime = moment(new Date(chatData.msgDateTime)).format(TIME_FORMAT);
		var chatHtml = '';
		chatHtml += '<div id="'+chatData.msgDateTime+'" isview="'+chatData.status+'" class="row my-chat" onclick="chatbody.onSelectMsg(this)"><div class="msg chat-item-right">';
		if(chatData.info === 1){
			chatHtml += '<div class="small font-weight-bold text-primary">'+Utility.getCurrentUserName()+'</div>';
		}
		chatHtml += '<div class="d-flex flex-row">';
		if(chatData.type.indexOf('image') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div><img width="150" height="200" src="'+chatData.mediaData+'"></div><div><span>'+chatData.messageText+'</span></div></div>';
		else if(chatData.type.indexOf('audio') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><audio controls><source src="'+chatData.mediaData+'" type="'+chatData.type+'"></audio></div></div>';
		else if(chatData.type.indexOf('video') > -1)
			chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><video width="400" controls><source src="'+chatData.mediaData+'" type="'+chatData.type+'"></video></div></div>';
		else
			chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';
		chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">';
		chatHtml += msgTime;
		chatHtml += '</div></div></div></div>';
		this.getWidgetByPath('.chat-window').append($(chatHtml));
		this.getWidgetByPath('.chat-window #'+chatData.msgDateTime).bind("contextmenu", function (event) {      
			this.fireContextMenu(event);
		}.bind(this));
	}
	onSelectMsg(event){
		if(this.getWidgetByPath('.chat-window').attr('msg-select')){
			if(!this.getWidgetByPath('.chat-window #'+event.id).hasClass('blackBg')){
				this.getWidgetByPath('.chat-window #'+event.id).toggleClass('blackBg');
				this.getWidgetByPath('#rm-list').append($('<span>'+event.id+'</span>'));
			}else{
				var count = this.getWidgetByPath('#rm-list span').length;
				for(var idx=0; idx<count; idx++){
					var id = $(this.getWidgetByPath('#rm-list span')[idx]).text();
					if(event.id === id){
						$(this.getWidgetByPath('#rm-list span')[idx]).remove();
						this.getWidgetByPath('.chat-window #'+event.id).toggleClass('blackBg');
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
}