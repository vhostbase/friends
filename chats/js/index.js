function addProfile(profileData){
	$('#profile-pic')[0].src = profileData.pic;
	$('#currentId').val(profileData.id);
}
function clearContacts(){
	$('.list-group').empty();
}
function loadContacts(contact){
	var today = getFormattedDate(new Date(), 'MMM DD, YYYY');
	var msgDate = getFormattedDate(new Date(contact.lastSeen), 'MMM DD, YYYY');
	if(new Date(today).getTime() === new Date(msgDate).getTime()){
		msgDate = getFormattedDate(new Date(contact.lastSeen), 'mm:ss');
	}
	var lastMsg = 'How are you?';
	if(contact.lastMsg)
		lastMsg = contact.lastMsg;
	if(!contact.pic || contact.pic.indexOf('img/profile-img') > -1)
		contact.pic = '../img/profile-img.png';
	let contactHtml = '<span style="cursor:pointer;" onclick="showChat($(this),\''+contact.id+'\');"><li class="list-group-item list-group-item-action chat-item">';
	contactHtml += '<img id="contactPhoto" src="'+contact.pic+'" class="rounded-circle circled-image">';
	contactHtml += '<div class="chat-text">';
	contactHtml += '<div class="chat-head"><div class="user-name"><span>'+contact.name+'</span></div>';
	contactHtml += '<div class="chat-time"><span class="font-weight-light">'+msgDate+'</span></div>';
	contactHtml += '<span class="font-weight-light">2</span>';
	contactHtml += '</div>';
	contactHtml += '<div class="last-msg font-weight-light"><span>'+lastMsg+'</span></div>';
	contactHtml += '</div>';
	contactHtml += '</li></span>';
	$('.list-group').append($(contactHtml));
}
$('#chatbody').hide();
function showChat(event, id){
	var pic = event.find('img').attr('src');
	var name = event.find('.user-name').text();
	showChat2(pic, name, id);
	showContactChat();
}
function showChat2(pic, name, id){
	$('#contactPhoto2').attr('src', pic);
	$('#contactName2').text(name);
	$('#chatId').val(id);
	$('#chatbody').show();
}
function showContactChat(){
	$('.chat-window').empty();
	$('.chat-window').css('overflow-y', 'hidden');
	var id = $('#chatId').val();
	showChatPanel();
	var currentUser = auth.currentUser;
	var today = getFormattedDate(new Date(), 'MMM DD, YYYY');
	var database = firebase.database();
	database.ref('chat_messages').on('value', function(snapshot){
		var chatItem = snapshot.val();
		if(!chatItem)
			return;
		var chatList = [];
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
		});	
		$(".chat-window").scrollTop($(".chat-window")[0].scrollHeight);
	});
}
function detectmob() {
   if(window.innerWidth <= 600 && window.innerHeight <= 800) {
     return true;
   } else {
     return false;
   }
}
function addScrollBar(){
	var height = $('.chat-window').height();
	if(detectmob() && height > 600)
		$('.chat-window').css('overflow-y', 'scroll');
	else if(height > 300)
		$('.chat-window').css('overflow-y', 'scroll');
}
function showContactPanel(){
	$('#contactPanel').removeClass('d-none d-xl-none d-lg-block d-xl-block col-lg-4 left');
	$('#contactPanel').addClass('col-lg-4 col-sm-12 left');
	$('.fab').show();
}
function showChatPanel(){
	$('#contactPanel').removeClass('col-sm-12');
	$('#contactPanel').addClass('d-none d-xl-none d-lg-block d-xl-block');
	$('.fab').hide();
}
function getFormattedDate(dateTime, format){
	return moment(dateTime).format(format);
}
function addLeftChat(chatData){
	var elem = $('.chat-window').find('#'+chatData.msgDateTime);
	if(elem.length > 0)
		return;
	var msgTime = moment(new Date(chatData.msgDateTime)).format('hh:mm A');
	var chatHtml = '';
	chatHtml += '<div id="'+chatData.msgDateTime+'" class="row user-chat"><div class="msg chat-item-left"><div class="d-flex flex-row"><div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
	chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';
	chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">';
	chatHtml += msgTime;
	chatHtml += '</div></div></div></div>';
	$('.chat-window').append($(chatHtml));
}
function addRightChat(chatData){
	var elem = $('.chat-window').find('#'+chatData.msgDateTime);
	if(elem.length > 0)
		return;
	var msgTime = moment(new Date(chatData.msgDateTime)).format('hh:mm A');
	var chatHtml = '';
	chatHtml += '<div id="'+chatData.msgDateTime+'" class="row my-chat"><div class="msg chat-item-right"><div class="d-flex flex-row"><div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
	chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';
	chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">';
	chatHtml += msgTime;
	chatHtml += '</div></div></div></div>';
	$('.chat-window').append($(chatHtml));
}
function addDateForChat(lblDate){
	var lblDateKey = lblDate;
	if(lblDate !== 'TODAY')
		lblDateKey = new Date(lblDate).getTime();
	var elem = $('.chat-window').find('#'+lblDateKey);
	if(elem.length > 0)
		return;
	var chatHtml = '';
	chatHtml += '<div id="'+lblDateKey+'" class="row user-chat"><div class="mx-auto my-2 bg-primary text-white small py-1 px-2 rounded">';
	chatHtml += lblDate;
	chatHtml += '</div></div>';
	$('.chat-window').append($(chatHtml));
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

function sendMessage(){
	addDateForChat('TODAY');
	var msgDate = new Date();
	var today = moment(msgDate).format('hh:mm A');
	var msgTime = msgDate.getTime();

	var data = $('#inputMsg').val();
	$('#inputMsg').val("");
	flipControl({value : ''});
	var msgHtml = '';
	msgHtml += '<div class="row my-chat"><div class="msg chat-item-right"><div class="d-flex flex-row">';
	msgHtml += '<div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
	msgHtml += '<div class="body m-1 mr-2"><span>'+data+'</span></div>';
	msgHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;"><span>'+today+'</span><i id="'+msgTime+'" style="display:none;" class="fas fa-check"></i></div></div></div></div>';
	$('.chat-window').append($(msgHtml));

	var id = $('#chatId').val();
	var currId = $('#currentId').val();
	var messageData = {};
	messageData.messageText = data;
	messageData.to = id;
	messageData.from = currId;
	messageData.type='text';
	messageData.msgDateTime = msgTime;
	//console.log(messageData);
	var source = 'chat_messages';
	var database = firebase.database();
	var insert = database.ref(source);
	var insertRef = insert.push();
	insert.once('value', function(snapshot){
		//console.log(snapshot.key);
		$('#'+snapshot.key).show();
	});
	insertRef.set(messageData);
	database.ref('chat_contacts/'+currId).update({'lastMsg':data});
	database.ref('chat_contacts/'+id).update({'lastMsg':data});
}
function showEmoji(){
	$('.emoji-menu').show();
}
$(window).resize(function(){
  addScrollBar();
});