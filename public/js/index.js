function addProfile(profileData){
	$('#profile-pic')[0].src = profileData.pic;
	$('#currentId').val(profileData.id);
}
function clearContacts(){
	$('.list-chats').empty();
	$('.list-contacts').empty();
	$('.list-select-contacts').empty();
}
function loadChatContacts(contact){
	if(contact.lastMsg || contact.members){
		var today = getFormattedDate(new Date(), 'MMM DD, YYYY');
		var msgDate = getFormattedDate(new Date(contact.lastSeen), 'MMM DD, YYYY');
		if(new Date(today).getTime() === new Date(msgDate).getTime()){
			msgDate = getFormattedDate(new Date(contact.lastSeen), 'mm:ss');
		}
		var contactHtml = loadContactTemplate(contact,'onclick="showChat($(this),\''+contact.id+'\');"', msgDate, 2);
		$('.list-chats').append($(contactHtml));
	}
}

function loadContacts(contact){
	var contactHtml = loadContactTemplate(contact, 'onclick="showChat($(this),\''+contact.id+'\');"');
	$('.list-contacts').append($(contactHtml));
}
function loadGroupContacts(contact){
	if(contact.members){
		var currentUser = auth.currentUser;
		var isGroup = contact.members.indexOf(currentUser.uid);
		if(isGroup){
			var contactHtml = loadContactTemplate(contact, 'onclick="onSelectContact(this);"', '<span id="CID" style="display:none;">'+contact.id+'</span><i class="d-none fas fa-check-circle"></i>');
			$('.list-select-contacts').append($(contactHtml));
		}
	}
}
function loadContactTemplate(contact, onClickEvent, msgDate, msgCount){
	if(!contact.pic || contact.pic.indexOf('img/profile-img') > -1)
		contact.pic = getDefaultPhoto();
	let contactHtml = '';
	if(contact.event)
		contactHtml += '<span class="cursor-class" '+contact.event+'>';
	else if(onClickEvent)
		contactHtml += '<span class="cursor-class" '+onClickEvent+'>';
	else
		contactHtml += '<span class="cursor-class">';

	contactHtml += '<li class="list-group-item list-group-item-action chat-item">';
	if(contact.members)
		contactHtml += '<span id="info" style="display:none;">group</span>';
	else
		contactHtml += '<span id="info" style="display:none;">personal</span>';
	contactHtml += '<img id="contactPhoto" src="'+contact.pic+'" class="rounded-circle circled-image">';
	contactHtml += '<div class="chat-text">';
	contactHtml += '<div class="chat-head"><div class="user-name"><span>'+contact.name+'</span></div>';
	
	if(msgDate)
		contactHtml += '<div class="chat-time"><span class="font-weight-light">'+msgDate+'</span></div>';
	if(msgCount)
		contactHtml += '<span class="font-weight-light">'+msgCount+'</span>';
	contactHtml += '</div>';
	if(contact.lastMsg)
		contactHtml += '<div class="last-msg font-weight-light"><span>'+contact.lastMsg+'</span></div>';
	contactHtml += '</div>';
	contactHtml += '</li></span>';
	return contactHtml;
	//$('.list-group').append($(contactHtml));
}
//$('#chatbody').hide();
function showChat(event, id){
	var selectChat = event.find('li');
	if(!selectChat.hasClass('chat-select')){
		selectChat.addClass('chat-select');
	}
	var pic = event.find('img').attr('src');
	var name = event.find('.user-name').text();
	var info = event.find('#info').text();
	showChat2(pic, name, id, info);
	showContactChat();
}
function addChatHeader(pic, name){
	var hdrHtml = '';
	hdrHtml += '<div class="d-block d-sm-none" onclick="showContactPanel(\'#chatbody\');"><i class="fas fa-arrow-left p-2 mr-2 text-white" style="font-size: 1.0rem; cursor: pointer;"></i></div>';
	hdrHtml += '<span><img id="contactPhoto2" src="'+pic+'" alt="Profile Photo" class="img-fluid rounded-circle mr-2" style="height:50px;" id="pic"></span>';
	hdrHtml += '<div class="d-flex flex-column"><div class="text-white font-weight-bold" id="contactName2">'+name+'</div><div class="text-white small" id="details">at 5:28 PM</div></div>';
	hdrHtml += '<div class="d-flex flex-row align-items-center ml-auto"><span class="cursor-class"><i class="fas fa-phone mx-3 text-white d-md-block"></i></span><span class="cursor-class"><i class="fas fa-video mx-3 text-white d-md-block"></i></span><span class="cursor-class" data-toggle="dropdown"><i class="fas fa-ellipsis-v mr-2 mx-sm-3 text-white"></i></span><div id="chatMenu" class="dropdown-menu dropdown-menu-right cursor-class"></div></div>';
	return $(hdrHtml);
}
function showChat2(pic, name, id, info){
	$('#chatbody #navbar').empty();
	var chatHdr = addChatHeader(pic, name);
	$('#chatbody #navbar').append(chatHdr);
	//$('#chatbody #contactPhoto2').attr('src', pic);
	//$('#chatbody #contactName2').text(name);
	$('#chatbody #chatId').val(id);
	if(info === 'group'){
		$('#chatbody #chatMenu').empty();
		$('#chatbody #chatMenu').append($(getGroupChatMenuTemplate()));
	}else{
		$('#chatbody #chatMenu').empty();
		$('#chatbody #chatMenu').append($(getContactChatMenuTemplate()));
	}
	$('#chatbody').removeClass('d-none');
	
}
function getContactChatMenuTemplate(){
	var template = '';
	template += '<span class="dropdown-item">View Contact</span>';
	template += '<span class="dropdown-item">Search</span>';
	template += '<span class="dropdown-item">Change Wallpaper</span>';
	template += '<span class="dropdown-item">Clear Chat</span>';
	return template;
}
function getGroupChatMenuTemplate(){
	var template = '';
	template += '<span class="dropdown-item">Group Info</span>';
	template += '<span class="dropdown-item">Search</span>';
	template += '<span class="dropdown-item">Clear Chat</span>';
	template += '<span class="dropdown-item">Exit Group</span>';
	return template;
}
function showContactChat(){
	$('#chatbody .chat-window').empty();
	$('#chatbody .chat-window').css('overflow-y', 'hidden');
	var id = $('#chatbody #chatId').val();
	showChatPanel();
	/*var currentUser = auth.currentUser;
	var today = getFormattedDate(new Date(), 'MMM DD, YYYY');*/
	var database = firebase.database();

	database.ref('chat_messages').orderByKey().on('value', function(snapshot){
		var chatItem = snapshot.val();
		if(!chatItem)
			return;
		/*var chatList = [];
		for (const [key, value] of Object.entries(chatItem)) {
			if((value.from === id && value.to === currentUser.uid) || (value.to === id && value.from === currentUser.uid))
				chatList.push(value);
		}
		chatList.sort(function(a,b){
			if(a.msgDateTime < b.msgDateTime) { return -1; }
			if(a.msgDateTime > b.msgDateTime) { return 1; }
			return 0;
		}).forEach(function(item) {
			addScrollBar();
			var msgDate = getFormattedDate(new Date(item.msgDateTime), 'MMM DD, YYYY');
			  if(new Date(today).getTime() === new Date(msgDate).getTime()){
				msgDate = 'TODAY';
			  }
				addDateForChat(msgDate);
			  
			  if(currentUser.uid === item.from)
				addRightChat(item);
			  else
				addLeftChat(item);
			  $(".chat-window").scrollTop($(".chat-window")[0].scrollHeight);
		});	*/
		var currentUser = auth.currentUser;
		var today = getFormattedDate(new Date(), 'MMM DD, YYYY');
		for (const [key, value] of Object.entries(chatItem)) {
			addChatMessage(value, today, currentUser);
		}
	});
}
function addChatMessage(item, today, currentUser){
	addScrollBar();
	var msgDate = getFormattedDate(new Date(item.msgDateTime), 'MMM DD, YYYY');
	  if(new Date(today).getTime() === new Date(msgDate).getTime()){
		msgDate = 'TODAY';
	  }
		addDateForChat(msgDate);
	  
	  if(currentUser.uid === item.from)
		addRightChat(item);
	  else
		addLeftChat(item);
	  $(".chat-window").scrollTop($(".chat-window")[0].scrollHeight);
}
function detectmob() {
   if(window.innerWidth <= 600 && window.innerHeight <= 800) {
     return true;
   } else {
     return false;
   }
}
function addScrollBar(){
	var height = $('#chatbody .chat-window').height();
	if(detectmob() && height > 600)
		$('#chatbody .chat-window').css('overflow-y', 'scroll');
	else if(height > 300)
		$('#chatbody .chat-window').css('overflow-y', 'scroll');
}
function showContactPanel(id){
	if(id)
		$(id).addClass('d-none');
	$('#contactPanel').removeClass('d-none d-xl-none d-lg-block d-xl-block col-lg-4 left');
	$('#contactPanel').addClass('col-lg-4 col-sm-12 left');
	$('.fab').show();
	$('#chatads').addClass('d-none');
}
function showChatPanel(){
	$('#contactPanel').removeClass('col-sm-12');
	$('#contactPanel').addClass('d-none d-xl-none d-lg-block d-xl-block');
	$('.fab').hide();
}
function showProfilePanel2(){
	$('#contactPanel').addClass('d-none');
	$('#chgProfile').removeClass('d-none');
	$('.fab').hide();
	$('#chatbody').hide();
}
function getFormattedDate(dateTime, format){
	return moment(dateTime).format(format);
}
function removeMsg(event){
	var ids = $($($(event).parent).parent).find('#rm-list span');
	for(var idx=0; idx<ids.length; idx++){
		var msgId = ids[idx];
		var elem = $('#chatbody .chat-window').find('#'+$(msgId).text());
		elem.remove();
		var selected = $('.list-chats').find('.chat-select');
		if(selected.length > 0){
			var pic = selected.find('#contactPhoto').attr('src');
			var name = selected.find('.user-name span').text();
			$('#chatbody #navbar').empty();
			var chatHdr = addChatHeader(pic, name);
			$('#chatbody #navbar').append(chatHdr);
		}
	}
	console.log('Hi');
}
function addChatDelHeader(id){
	var hdrHtml = '';
	hdrHtml += '<div class="d-block d-sm-none" onclick="showContactPanel(\'#chatbody\');"><i class="fas fa-arrow-left p-2 mr-2 text-white" style="font-size: 1.0rem; cursor: pointer;"></i></div>';
	hdrHtml += '<div id="rm-count" class="text-white font-weight-bold">1</div>';
	hdrHtml += '<div id="rm-list" style="display:none"><span>'+id+'</span></div>';
	hdrHtml += '<div class="d-flex flex-row align-items-center ml-auto">';
	hdrHtml += '<span class="cursor-class"><i class="fas fa-arrow-circle-left mx-3 text-white d-md-block"></i></span>';
	hdrHtml += '<span class="cursor-class" onclick="removeMsg(this)"><i class="fas fa-trash mx-3 text-white d-md-block"></i></span>';
	hdrHtml += '<span class="cursor-class"><i class="fas fa-copy mx-3 text-white d-md-block"></i></span>';
	hdrHtml += '<span class="cursor-class"><i class="fas fa-arrow-circle-right mx-3 text-white d-md-block"></i></span>';
	hdrHtml += '</div>';
	return $(hdrHtml);
}
function addLeftChat(chatData){
	var elem = $('#chatbody .chat-window').find('#'+chatData.msgDateTime);
	if(elem.length > 0)
		return;
	var msgTime = moment(new Date(chatData.msgDateTime)).format('hh:mm A');
	var chatHtml = '';
	chatHtml += '<div id="'+chatData.msgDateTime+'" class="row user-chat"><div class="msg chat-item-left"><div class="d-flex flex-row"><div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
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
	$('#chatbody .chat-window').append($(chatHtml));
	$('#chatbody .chat-window #'+chatData.msgDateTime).bind("contextmenu", function (event) {
      fireContextMenu(event);
    });
}
function onSelectMsg(event){
	if($('#chatbody .chat-window').attr('msg-select')){
		$('#chatbody .chat-window #'+event.id).toggleClass('blackBg');
		$('#chatbody #rm-list').append($('<span>'+event.id+'</span>'));
		var count = ($('#chatbody #rm-list span').length);
		$('#chatbody #rm-count').text(count);
	}
}
function addRightChat(chatData){
	var elem = $('#chatbody .chat-window').find('#'+chatData.msgDateTime);
	if(elem.length > 0)
		return;
	var msgTime = moment(new Date(chatData.msgDateTime)).format('hh:mm A');
	var chatHtml = '';
	chatHtml += '<div id="'+chatData.msgDateTime+'" class="row my-chat" onclick="onSelectMsg(this)"><div class="msg chat-item-right"><div class="d-flex flex-row"><div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
	if(chatData.type.indexOf('image') > -1)
		chatHtml += '<div class="body m-1 mr-2"><div><img width="150" height="200" src="'+chatData.mediaData+'"></div><div><span>'+chatData.messageText+'</span></div></div>';
	else if(chatData.type.indexOf('audio') > -1)
		chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><audio controls><source src="'+chatData.mediaData+'" type="'+chatData.type+'"></audio></div></div>';
	else if(chatData.type.indexOf('video') > -1)
		chatHtml += '<div class="body m-1 mr-2"><div style="width: 230px; margin-bottom: 10px;"><video width="400" controls><source src="'+chatData.mediaData+'" type="'+chatData.type+'"></video></div></div>';
	else
		chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';

	
	//chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';
	chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">';
	chatHtml += msgTime;
	chatHtml += '</div></div></div></div>';
	$('#chatbody .chat-window').append($(chatHtml));
	$('#chatbody .chat-window #'+chatData.msgDateTime).bind("contextmenu", function (event) {      
		fireContextMenu(event);
    });
}
function fireContextMenu(event){
	$('#chatbody #navbar').empty();
	var chatHdr = addChatDelHeader(event.currentTarget.id);
	$('#chatbody #navbar').append(chatHdr);
    event.preventDefault();
	$('#chatbody .chat-window').attr('msg-select', '1');
	$('#chatbody .chat-window #'+event.currentTarget.id).addClass('blackBg');
}
function addDateForChat(lblDate){
	var lblDateKey = lblDate;
	if(lblDate !== 'TODAY')
		lblDateKey = new Date(lblDate).getTime();
	var elem = $('#chatbody .chat-window').find('#'+lblDateKey);
	if(elem.length > 0)
		return;
	var chatHtml = '';
	chatHtml += '<div id="'+lblDateKey+'" class="row user-chat"><div class="mx-auto my-2 bg-primary text-white small py-1 px-2 rounded">';
	chatHtml += lblDate;
	chatHtml += '</div></div>';
	$('#chatbody .chat-window').append($(chatHtml));
}
function flipControl(event){
	if(event.value.length === 0 && $('#inputControl').hasClass('fa-paper-plane')){
		$('#inputControl').removeClass('fa-paper-plane');
		$('#inputControl').addClass('fa-microphone');
	}
	if(event.value.length > 0 && $('#inputControl').hasClass('fa-microphone')){
		$('#inputControl').removeClass('fa-microphone');
		$('#inputControl').addClass('fa-paper-plane');
	}
}

function sendMessage(txtData, imgData, type){
	addDateForChat('TODAY');
	var msgDate = new Date();
	var today = moment(msgDate).format('hh:mm A');
	var msgTime = msgDate.getTime();
	var msgHtml = '';
	msgHtml += '<div class="row my-chat"><div class="msg chat-item-right"><div class="d-flex flex-row">';
	msgHtml += '<div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
	if(type.indexOf('image') > -1)
		msgHtml += '<div class="body m-1 mr-2"><div><img width="150" height="200" src="'+imgData+'"></div><div><span>'+txtData+'</span></div></div>';
	else if(type.indexOf('video') > -1)
		msgHtml += '<div class="body m-1 mr-2"><video width="400" controls><source src="'+imgData+'" type="'+type+'"></video></div>';
	else
		msgHtml += '<div class="body m-1 mr-2"><span>'+txtData+'</span></div>';

	msgHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;"><span>'+today+'</span><i id="'+msgTime+'" style="display:none;" class="fas fa-check"></i></div></div></div></div>';
	$('#chatbody .chat-window').append($(msgHtml));

	var id = $('#chatId').val();
	var currId = $('#currentId').val();
	var messageData = {};
	messageData.messageText = txtData;
	messageData.to = id;
	messageData.from = currId;
	messageData.type='text';
	messageData.msgDateTime = msgTime;
	if(type){
		messageData.type=type;
		messageData.mediaData = imgData;
	}
	//console.log(messageData);
	var source = 'chat_messages/'+msgTime;
	var database = firebase.database();
	var insert = database.ref(source);
	//var insertRef = insert.push();
	insert.once('value', function(snapshot){
		//console.log(snapshot.key);
		$('#'+snapshot.key).show();
	});
	insert.set(messageData);
	database.ref('chat_contacts/'+currId).update({'lastMsg':txtData});
	database.ref('chat_contacts/'+id).update({'lastMsg':txtData});
}
function showEmoji(){
	$('.emoji-menu').show();
}
$(window).resize(function(){
  addScrollBar();
});
function doHome(id){
	if(id)
		$(id).addClass('d-none');
	//$('#chgProfile').addClass('d-none');
	$('#contactPanel').removeClass('d-none');
	$('.fab').show();
}
function doAllContacts(){
	$('#createGroupPanel').addClass('d-none');
	$('#contactPanel').addClass('d-none');
	$('#allContactsPanel').removeClass('d-none');
	$('.fab').hide();
}
function fabCallback(fab){
	if(fab.className.indexOf('fa-comment') > -1){
		$('#contactPanel').addClass('d-none');
		$('#allContactsPanel').removeClass('d-none');
		$('.fab').hide();
	}else if(fab.className.indexOf('fa-arrow-right') > -1){
		collectGroup(function(){
			$('#createGroupPanel').addClass('d-none');
			$('#newGrpPanel').removeClass('d-none');
			changFab('fa-arrow-right', 'fa-check');		
		});
	}else if(fab.className.indexOf('fa-check') > -1){
		createGroupProfile(function(){
			$('#newGrpPanel').addClass('d-none');
			$('#contactPanel').removeClass('d-none');
			changFab('fa-check', 'fa-comment');
		});
		
	}
}
function changFab(lblOld, lblNew){
	var btnFab = $('.fab').find('.fas');
	btnFab.removeClass(lblOld);
	btnFab.addClass(lblNew);
	$('.fab').show();
}
function createGroup(){
	$('#contactPanel').addClass('d-none');
	$('#allContactsPanel').addClass('d-none');
	$('#createGroupPanel').removeClass('d-none');
	changFab('fa-comment', 'fa-arrow-right');
}
function callAttach(){
	$('#attachImg').attr('accept', 'audio/*,video/*,image/*');
	$('#attachImg').click();
}
$('#chatbody #attachImg').change(function(event){
	var file = event.target.files[0];
	var fileType = file.type;
	var msgType = fileType.substr(0, fileType.indexOf('/'))
	if(msgType === 'video'){
		uploadMedia(file, fileType);
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
			sendMessage('media', reader.result, msgType);
		}
	}
	reader.readAsDataURL(file, msgType);
});
function uploadMedia(file, msgType){
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
	}, function(error) {
	  // Handle unsuccessful uploads
	}, function() {
	  // Handle successful uploads on complete
	  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
	  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		console.log('File available at', downloadURL);
		sendMessage('media', downloadURL, msgType);
	  });
	});
}
function takePhoto(){
	$('#attachImg').attr('accept', 'image/*;capture=camera');
	$('#attachImg').click();
}
function recordVoice(){
	$('#attachImg').attr('accept', 'audio/*;capture=microphone');
	$('#attachImg').click();
}
function sendTxtMessage(event){
	if($('#inputControl').hasClass('fa-microphone')){
		recordVoice();
	}else{
		var txtData = $('#inputMsg').val();
		$('#inputMsg').val("");
		flipControl({value : ''});
		sendMessage(txtData);
	}
}
function sendImgMessage(){
	$('#chatImgbody').addClass('d-none');
	$('#chatbody').removeClass('d-none');
	sendMessage($('#inputMsg1').val(), $('#chatImgbody #imgMsg').attr('src'), 'image');
	$('#inputMsg1').val('');
}
function onSelectContact(event){
	var control = $(event).find('i');
	control.toggleClass('d-none');
	console.log(control);
}
function collectGroup(callback){
	$('.list-group-contacts').empty();
	var contacts = $('.list-select-contacts').find('.cursor-class');
	for(var idx=0; idx<contacts.length; idx++){
		var contact = $(contacts[idx]);
		var elem = contact.find('i');
		if(!elem.hasClass('d-none')){
			var cid = contact.find('#CID');
			var cimg = contact.find('img');
			var name = contact.find('.user-name');
			$('.list-group-contacts').append($(getMemberTemplate({name: $(name).text(), id : $(cid).text(), photo : cimg.attr('src')})));
		}
	}
	callback();
}
function getMemberTemplate(contact){
	var content = '';
	content += '<span class="cursor-class"><li class="list-group-item list-group-item-action chat-item">';
	content += '<img src="'+contact.photo+'" class="rounded-circle circled-image">';
	content += '<span id="CID" style="display:none;">'+contact.id+'</span>';
	content += '<div class="chat-text"><div class="chat-head"><div class="user-name">';
	content += '<span class="user-text">'+contact.name+'</span>';
	content += '</div></div></div></li></span>';
	return content;
}
