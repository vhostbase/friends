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
	var contactHtml = loadContactTemplate(contact, 'onclick="onSelectContact(this);"', '<span id="CID" style="display:none;">'+contact.id+'</span><i class="d-none fas fa-check-circle"></i>');
	$('.list-select-contacts').append($(contactHtml));
}
function loadContactTemplate(contact, onClickEvent, msgDate, msgCount){
	if(!contact.pic || contact.pic.indexOf('img/profile-img') > -1)
		contact.pic = '../img/profile-img.png';
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
	var pic = event.find('img').attr('src');
	var name = event.find('.user-name').text();
	var info = event.find('#info').text();
	showChat2(pic, name, id, info);
	showContactChat();
}
function showChat2(pic, name, id, info){
	$('#chatbody #contactPhoto2').attr('src', pic);
	$('#chatbody #contactName2').text(name);
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
function addLeftChat(chatData){
	var elem = $('#chatbody .chat-window').find('#'+chatData.msgDateTime);
	if(elem.length > 0)
		return;
	var msgTime = moment(new Date(chatData.msgDateTime)).format('hh:mm A');
	var chatHtml = '';
	chatHtml += '<div id="'+chatData.msgDateTime+'" class="row user-chat"><div class="msg chat-item-left"><div class="d-flex flex-row"><div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
	chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';
	chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">';
	chatHtml += msgTime;
	chatHtml += '</div></div></div></div>';
	$('#chatbody .chat-window').append($(chatHtml));
}
function addRightChat(chatData){
	var elem = $('#chatbody .chat-window').find('#'+chatData.msgDateTime);
	if(elem.length > 0)
		return;
	var msgTime = moment(new Date(chatData.msgDateTime)).format('hh:mm A');
	var chatHtml = '';
	chatHtml += '<div id="'+chatData.msgDateTime+'" class="row my-chat"><div class="msg chat-item-right"><div class="d-flex flex-row"><div class="options"><a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a></div>';
	chatHtml += '<div class="body m-1 mr-2">'+chatData.messageText+'</div>';
	chatHtml += '<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">';
	chatHtml += msgTime;
	chatHtml += '</div></div></div></div>';
	$('#chatbody .chat-window').append($(chatHtml));
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
	$('#attach').click();
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
