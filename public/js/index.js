function clearContacts(){
	$('.list-chats').empty();
	$('.list-contacts').empty();
	$('.list-select-contacts').empty();
}
function loadContactChat(message){
	if(message.from !== getCurrentUserId() && message.to !== getCurrentUserId() && message.info !== 1)
		return;
	tharak.getContact(message, null, function(results){
		for(var idx=0; idx<results.rows.length; idx++){
			var contact = results.rows.item(idx);
			if(message.info === 1 && (!contact.members || contact.members.indexOf(getCurrentUserId()) === -1)){
				continue;
			}
			loadChatContacts2(contact, message);
		}
	});	
}
function removeContactChat(contactKey){
	var listOfContacts = $('.list-chats .cursor-class');
	for(var idx=0; idx<listOfContacts.length; idx++){
		var contact = $(listOfContacts[idx]);
		if(contactKey === contact.find('#contactId').text()){
			contact.empty();
		}
	}
}
function contactExists(id){
	var contacts = $('.list-chats #contactId');
	for(var idx=0; idx<contacts.length; idx++){
		var chatContact = $(contacts[idx]);
		if(id === chatContact.text()){
			return true;
		}
	}
	return false;
}
function loadChatContacts2(contact, message){
	var isGroup = false;
	var contactId = $('.list-chats #contactId').text();
	if(contactExists(contact.id)){
		if($('#chatbody').hasClass('d-none') && message.status === 0){
			var msgCntElem = $('.list-chats #msgCount');
			var count = msgCntElem.text();
			count = parseInt(count);
			count++;
			msgCntElem.text(count);
		}
		return;
	}
	if(contact.members){
		var currentUser = auth.currentUser;
		isGroup = contact.members.indexOf(currentUser.uid);
		if(isGroup === -1)
			return;
	}
	var msgDate = 'online';
	if(contact.lastSeen !== 'online'){
		var today = getFormattedDate(new Date(), DATE_FORMAT);
		msgDate = getFormattedDate(new Date(contact.lastSeen), DATE_FORMAT);
		if(new Date(today).getTime() === new Date(msgDate).getTime()){
			msgDate = getFormattedDate(new Date(contact.lastSeen), LAST_SEEN_FORMAT);
		}
	}
	var contactId = contact.id;
	var contactHtml = loadContactTemplate(contact,'onclick="showChat($(this),\''+contactId+'\', \'contactPanel\');"', msgDate, 0);
	$('.list-chats').append($(contactHtml));
}

function loadContacts(contact){
	var contactHtml = loadContactTemplate(contact, 'onclick="showChat($(this),\''+contact.id+'\', \'allContactsPanel\');"');
	$('.list-contacts').append($(contactHtml));
}
function loadGroupContacts(contact){
	var contactHtml = loadContactTemplate(contact, 'onclick="onSelectContact(this);"', '<span id="CID" style="display:none;">'+contact.id+'</span><i class="d-none fas fa-check-circle"></i>');
	$('.list-select-contacts').append($(contactHtml));
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
	contactHtml += '<span id="contactId" style="display:none;">'+contact.id+'</span>';
	contactHtml += '<img id="contactPhoto" src="'+contact.pic+'" class="rounded-circle circled-image">';
	contactHtml += '<div class="chat-text">';
	contactHtml += '<div class="chat-head"><div class="user-name"><span>'+contact.name+'</span></div>';
	if(msgDate)
		contactHtml += '<div class="chat-time"><span class="font-weight-light">'+msgDate+'</span></div>';
	if(msgCount)
		contactHtml += '<span id="msgCount" class="font-weight-light">'+msgCount+'</span>';
	contactHtml += '</div>';
	if(contact.lastMsg)
		contactHtml += '<div class="last-msg font-weight-light"><span>'+contact.lastMsg+'</span></div>';
	contactHtml += '</div>';
	contactHtml += '</li></span>';
	return contactHtml;
}
function showChat(event, id, parent){
	$('#'+parent).addClass('d-none');
	var selectChat = event.find('li');
	if(!selectChat.hasClass('chat-select')){
		selectChat.addClass('chat-select');
	}
	var pic = event.find('img').attr('src');
	var name = event.find('.user-name').text();
	var info = event.find('#info').text();
	showChat2(pic, name, id, info);
	showContactChat(id, parent, info);
}
function updateMsgStatus(){
	var viewIds = [];
	var msgs = $('#chatbody .chat-window div[isview=0]');
	for(var idx=0; idx<msgs.length; idx++){
		var msg = $(msgs[idx]);
		updateMessage({msgDateTime: msg.attr('id'), status : 1}, function(msgId){

		});
	}
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
	$('#chatbody #chatId').val(id);
	if(info === 'group'){
		$('#chatbody #info').val(1);
		$('#chatbody #chatMenu').empty();
		$('#chatbody #chatMenu').append($(getGroupChatMenuTemplate()));
	}else{
		$('#chatbody #info').val(0);
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
	template += '<span class="dropdown-item" onclick="clearChat(\'chatbody\');">Clear Chat</span>';
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
function showContactChat3(crit){
	var id = $('#chatbody #chatId').val();
	var currentUser = auth.currentUser;
	var uid = currentUser.uid;
	var today = getFormattedDate(new Date(), DATE_FORMAT);
	tharak.getMessages(uid, id, crit, function(results){
		for(var idx=0; idx<results.rows.length; idx++){
			var item = results.rows.item(idx);
			item.from = item.fromAddr;
			item.to = item.toAddr;
			item.type = item.msgType;
			addChatMessage2(item, today, currentUser, id);
		}
		updateMsgStatus();
		
	});
}
function showContactGroupChat(crit){
	var id = $('#chatbody #chatId').val();
	var currentUser = auth.currentUser;
	var uid = currentUser.uid;
	var today = getFormattedDate(new Date(), DATE_FORMAT);
	tharak.getGroupMessages(uid, id, crit, function(results){
		for(var idx=0; idx<results.rows.length; idx++){
			var item = results.rows.item(idx);
			item.from = item.fromAddr;
			item.to = item.toAddr;
			item.type = item.msgType;

			addChatMessage2(item, today, currentUser, id);
		}
		updateMsgStatus();
	});
}
function showContactChat4(message){
	if($('#chatbody').hasClass('d-none')){
		return;
	}
	message.status = 1;
	var chatDate = getFormattedDate(new Date(message.msgDateTime), DATE_FORMAT);
	addChatMessage2(message, chatDate, {uid:message.to}, message.from);
	updateMessage({msgDateTime: message.msgDateTime, status : 1}, function(msgId){
		console.log(msgId);
	});
}
function showContactChat(id, parent, info){
	$('#chatbody .chat-window').empty();
	$('#chatbody .chat-window').css('overflow-y', 'hidden');
	showChatPanel();
	if(parent !== 'allContactsPanel'){
		clearMsgCount(id, parent);
		if(info === 'group')
			showContactGroupChat();
		else
			showContactChat3();
	}
}
function clearMsgCount(id, parent){
	var contactId = $('.list-chats #contactId').text();
	if(contactId === id){
		var msgCntElem = $('.list-chats #msgCount');
		msgCntElem.text(0);
	}
}
function addChatMessage(item, currentUser, id){
	if((item.from === currentUser.uid || item.to === currentUser.uid) && (item.from === id || item.to === id)){
		return 1;
	}
	return 0;
}
function addChatMessage2(item, today, currentUser, id){
	if(((item.from === currentUser.uid || item.to === currentUser.uid) && (item.from === id || item.to === id)) || (item.info === 1)){
		addScrollBar();
		var msgDate = getFormattedDate(new Date(item.msgDateTime), DATE_FORMAT);
		  if(new Date(today).getTime() === new Date(msgDate).getTime()){
			msgDate = 'TODAY';
		  }
			addDateForChat(msgDate);
		  if(currentUser.uid === item.from)
			addRightChat(item);
		  else
			addLeftChat(item);
		  $(".chat-window").scrollTop($(".chat-window")[0].scrollHeight);
		  return 1;
	}
	return 0;
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
	$('#chatbody').addClass('d-none');
}
function getFormattedDate(dateTime, format){
	return moment(dateTime).format(format);
}
function removeMsg(event){
	var ids = $('#chatbody #rm-list span');
	for(var idx=0; idx<ids.length; idx++){
		var msgId = $(ids[idx]).text();
		var elem = $('#chatbody .chat-window').find('#'+msgId);
		elem.remove();
		removeMsgs(msgId);
		var selected = $('.list-chats').find('.chat-select');
		if(selected.length > 0){
			var pic = selected.find('#contactPhoto').attr('src');
			var name = selected.find('.user-name span').text();
			$('#chatbody #navbar').empty();
			var chatHdr = addChatHeader(pic, name);
			$('#chatbody #navbar').append(chatHdr);
		}
	}
}
function addChatDelHeader(id){
	var hdrHtml = '';
	hdrHtml += '<div class="d-block d-sm-none" onclick="showContactPanel(\'#chatbody\');"><i class="fas fa-arrow-left p-2 mr-2 text-white" style="font-size: 1.0rem; cursor: pointer;"></i></div>';
	hdrHtml += '<div id="rm-count" class="text-white font-weight-bold">0</div>';
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
	var msgTime = moment(new Date(chatData.msgDateTime)).format(TIME_FORMAT);
	var chatHtml = '';
	chatHtml += '<div id="'+chatData.msgDateTime+'" isview="'+chatData.status+'" class="row user-chat" onclick="onSelectMsg(this)"><div class="msg chat-item-left">';
	if(chatData.info === 1){
		chatHtml += '<div class="small font-weight-bold text-primary">'+getChatterName(chatData)+'</div>';
	}
	//chatHtml += '<div class="d-flex flex-row"><div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
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
	$('#chatbody .chat-window').append($(chatHtml));
	$('#chatbody .chat-window #'+chatData.msgDateTime).bind("contextmenu", function (event) {
      fireContextMenu(event);
    });
}
function onSelectMsg(event){
	if($('#chatbody .chat-window').attr('msg-select')){
		if(!$('#chatbody .chat-window #'+event.id).hasClass('blackBg')){
			$('#chatbody .chat-window #'+event.id).toggleClass('blackBg');
			$('#chatbody #rm-list').append($('<span>'+event.id+'</span>'));
		}else{
			var count = $('#chatbody #rm-list span').length;
			for(var idx=0; idx<count; idx++){
				var id = $($('#chatbody #rm-list span')[idx]).text();
				if(event.id === id){
					$($('#chatbody #rm-list span')[idx]).remove();
					$('#chatbody .chat-window #'+event.id).toggleClass('blackBg');
				}
			}
		}
		var count = $('#chatbody #rm-list span').length;
		$('#chatbody #rm-count').text(count);
		if(count === 0){
			$('#chatbody .chat-window').removeAttr('msg-select');
			var pic = $('#contactPanel .list-chats img').attr('src');
			var name = $('#contactPanel .list-chats .user-name').text();
			$('#chatbody #navbar').empty();
			var chatHdr = addChatHeader(pic, name);
			$('#chatbody #navbar').append(chatHdr);
		}
	}
}
function addRightChat(chatData){
	var elem = $('#chatbody .chat-window').find('#'+chatData.msgDateTime);
	if(elem.length > 0)
		return;
	var msgTime = moment(new Date(chatData.msgDateTime)).format(TIME_FORMAT);
	var chatHtml = '';
	chatHtml += '<div id="'+chatData.msgDateTime+'" isview="'+chatData.status+'" class="row my-chat" onclick="onSelectMsg(this)"><div class="msg chat-item-right">';
	if(chatData.info === 1){
		chatHtml += '<div class="small font-weight-bold text-primary">'+getCurrentUserName()+'</div>';
	}
	//chatHtml += '<div class="d-flex flex-row"><div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
	chatHtml += '<div class="d-flex flex-row">';
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
	event.preventDefault();
	$('#chatbody #navbar').empty();
	var chatHdr = addChatDelHeader(event.currentTarget.id);
	$('#chatbody #navbar').append(chatHdr);    
	$('#chatbody .chat-window').attr('msg-select', '1');
	$('#chatbody .chat-window #'+event.currentTarget.id).addClass('blackBg');
	//onSelectMsg({id : event.currentTarget.id});
}
function addDateForChat(lblDate){
	var lblDateKey = lblDate;
	if(lblDate !== 'TODAY')
		lblDateKey = new Date(lblDate).getTime();
	var elem = $('#chatbody .chat-window').find('#'+lblDateKey);
	if(elem.length > 0)
		return;
	var chatHtml = '';
	chatHtml += '<div id="'+lblDateKey+'" class="row user-chat" field="date"><div class="mx-auto my-2 bg-primary text-white small py-1 px-2 rounded">';
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

function sendMessage(txtData, type, imgData){
	var msgDate = new Date();
	var today = moment(msgDate).format(TIME_FORMAT);
	var msgTime = msgDate.getTime();
	var id = $('#chatId').val();
	var currId = $('#currentId').val();
	var info = parseInt($('#chatbody #info').val());
	var messageData = {};
	messageData.messageText = txtData;
	messageData.to = id;
	messageData.from = currId;
	messageData.type='text';
	messageData.msgDateTime = msgTime;
	messageData.status = 0;
	messageData.info = info;
	if(type){
		messageData.type=type;
		messageData.mediaData = imgData;
	}
	var chatDate = getFormattedDate(new Date(), DATE_FORMAT);
	insertMessage(messageData, function(msgTime){
		addChatMessage2(messageData, chatDate, {uid:currId}, id);
	});
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
function fabCallback(){
	var fabClass = $('.fab > i').attr("class").split(/\s+/);
	if(fabClass.indexOf('fa-comment') > -1){
		$('#contactPanel').addClass('d-none');
		$('#allContactsPanel').removeClass('d-none');
		$('#allContactsPanel #searchHdr').empty();
		$('.fab').hide();
		$('.list-contacts').empty();
		loadContacts({name:'New Group', event: 'onclick="createGroup();"'});
		loadContacts({name:'New Contact'});
		var currentUser = auth.currentUser;
		var uid = currentUser.uid;
		var conts = [];
		tharak.getAllContacts(function(rows){
			for(var idx=0; idx<rows.length; idx++){
				var value = rows.item(idx);
				if(uid === value.id || (value.members && value.members.indexOf(uid) === -1)){
					continue;
				}
				conts.push(value);
				loadContacts(value);
			}
			$('#allContactsPanel #searchHdr').append(addContactSrchHeader(conts));
			$('#allContactsPanel #searchHdr #srchContact').click(function(){
				loadContactSrch(conts);
			});
		});


	}else if(fabClass.indexOf('fa-arrow-right') > -1){
		collectGroup(function(){
			$('#createGroupPanel').addClass('d-none');
			$('#newGrpPanel').removeClass('d-none');
			changFab('fa-arrow-right', 'fa-check');		
		});
	}else if(fabClass.indexOf('fa-check') > -1){
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
			sendMessage('media', msgType, reader.result);
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
		sendMessage('media', msgType, downloadURL);
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
		sendMessage(txtData, '');
	}
}
function sendImgMessage(){
	$('#chatImgbody').addClass('d-none');
	$('#chatbody').removeClass('d-none');
	sendMessage($('#inputMsg1').val(), 'image', $('#chatImgbody #imgMsg').attr('src'));
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
function getCurrentUserId(){
	return $('#currentId').val();
}
function getCurrentUserName(){
	return $('#currentName').val();
}
function clearChat(chatbodyId){
	var id = $('#chatId').val();
	var from = $('#currentId').val();
	tharak.getMessages(from, id, null, function(results){
		for(var idx=0; idx<results.rows.length; idx++){
			var contact = results.rows.item(idx);
			tharak.removeMessages(contact, function(data){
				updateMessage({status : 1, msgDateTime: data.msgDateTime});
			});
		}
		$('#'+chatbodyId+' .chat-window').empty();
		removeContactChat(id);
	});
}
function addContactSrchHeader(conts){
	var hdrHtml = '';
	hdrHtml += '<div class="row icons d-flex searchHdrClass"><div class="p-2 profile-section-top-text" style="cursor:pointer;" onclick="doHome(\'#allContactsPanel\');"><i class="fas fa-arrow-left text-white"></i></div>';
	hdrHtml += '<div class="d-flex flex-column">';
	hdrHtml += '<div class="text-white font-weight-bold">Select Contact</div>';
	hdrHtml += '<div class="text-white small">'+conts.length+' contacts</div>';
	hdrHtml += '</div>';
	hdrHtml += '<div class="p-2 profile-section-top-text cursor-class" id="srchContact"><i class="fas fa-search text-white"></i></div>';
	hdrHtml += '<div class="p-2 profile-section-top-text cursor-class" data-toggle="dropdown"><i class="fas fa-ellipsis-v text-white"></i></div>';
	hdrHtml += '<div class="dropdown-menu dropdown-menu-right">';
	hdrHtml += '<a class="dropdown-item" href="#">Invite a Friend</a>';
	hdrHtml += '<a class="dropdown-item" href="#">Contacts</a>';
	hdrHtml += '<a class="dropdown-item" href="#">Refresh</a>';
	hdrHtml += '<a class="dropdown-item" href="#">Help</a>';
	hdrHtml += '</div></div>';

	return $(hdrHtml);
}
function loadContactSrch(conts){
	$('#allContactsPanel #searchHdr').empty();
	$('#allContactsPanel #searchHdr').append(addContactSrchHeader2(conts));
	$('#allContactsPanel #searchHdr #contSrch').keyup(function(event){
		searchContact(this, conts);
	});
}
function addContactSrchHeader2(conts){
	var hdrHtml = '';
	hdrHtml += '<div class="row justify-content-center">';
	hdrHtml += '<div class="col-12 col-md-10 col-lg-8">';
    hdrHtml += '<div class="card-body row no-gutters align-items-center">';
    hdrHtml += '<div class="col-auto" onclick="fabCallback()">';
	hdrHtml += '<i class="fas fa-arrow-left text-body"></i>';
	hdrHtml += '</div><!--end of col-->';
	hdrHtml += '<div class="col">';
	hdrHtml += '<input id="contSrch" class="form-control form-control-lg form-control-borderless" autofocus type="search" placeholder="Search topics or keywords">';
	hdrHtml += '</div><!--end of col-->';
	hdrHtml += '</div></div><!--end of col--></div>';
	
	return $(hdrHtml);
}
function searchContact(event, conts){
	var filtered = conts.filter(function(elem){
		return elem.name.toLowerCase().indexOf(event.value.toLowerCase()) > -1;
	})
	//console.log(filtered);
	$('.list-contacts').empty();
	filtered.forEach((value)=>{
		loadContacts(value);
	});
}