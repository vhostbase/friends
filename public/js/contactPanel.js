class contactPanel extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('.profile-img .cursor-class').click(function() {
			$('.fab').addClass('d-none');
			app.navigateTo('chgProfile', {});
		}.bind(this));
		this.getWidgetByPath('#contactSearch').keyup(this.searchContact.bind(this));
	}
	onNavigate(data){
		var uid = Utility.getCurrentUserId();
		if(!uid){ 
			auth.signInWithEmailAndPassword(data.userName+'@gmail.com', 'Test@123').then(this.authSuccessCallback.bind(this)).catch(function(error) {
				if(error.code == "auth/user-not-found"){
					localStorage.removeItem("userName");
					this.authErrorCallback();
				}
			}.bind(this));
		}else{
			this.addProfile(data);
			this.attachCallbacks();
		}
	}
	authSuccessCallback(response){
		console.log( "Logged in successfully." );
		provider.updateContact(Utility.getCurrentUserId(), {lastSeen: 'online'}, function(){
			this.attachCallbacks();	
		}.bind(this));
	}
	authErrorCallback(){
		location.reload();
	}
	attachCallbacks(){
		provider.attachContacts(this);
		provider.attachMessages(this);
	}
	preShow(){

	}
	searchContact(){
		var input, filter, ul, li, a, i, txtValue;
		input = $('#contactSearch');
		filter = input.val().toUpperCase();
		ul = $('.list-chats');
		li = ul.find("li");
		for (i = 0; i < li.length; i++) {
			a = $($(li[i]).find(".user-name span"));
			txtValue = a.text();
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				$(li[i]).show();
			} else {
				$(li[i]).hide();
			}
		}
	}
	loadUserContacts(contacts){
		
		if(Utility.getCurrentUserId() === contacts.id){
			this.addProfile(contacts);
		}
		if(contacts.members && contacts.members.indexOf(Utility.getCurrentUserId()) > -1){
			contacts.lastSeen = 'Jan 25, 2020 08:57 PM';
			var groupMsg = {from: contacts.createdBy,info: 1,messageText: "Group created",msgDateTime: contacts.createdAt,status: 0,to: contacts.id,type: "text"};
			this.loadContactChat(groupMsg, contacts);
		}
		storage.insertContact(contacts);
		this.updateStatus(contacts);
	}
	updateStatus(contact){
		var contactItem = this.findContactItem(contact.id);
		if(contactItem){
			contactItem.find('.chat-time span').text(contact.lastSeen);
		}
	}
	addProfile(profileData){
		this.getWidgetByPath('#profile-pic').attr('src', profileData.pic);		
		this.getWidgetByPath('#currentName').val(profileData.name);
	}
	postShow(){
		frmStack.splice(0, frmStack.length);
		frmStack.push(this);
		this.fromBack();
		$(".fab").unbind('click');
		$('.fab').click(this.fabCallback);
		this.getWidgetByPath('.list-chats').find('.chat-select').removeClass('chat-select');
				this.onBack();
	}
	fromBack(){
		Utility.changFab('fa-comment');
		$('.fab').removeClass('d-none');
	}
	fabCallback(){
		app.navigateTo('allContactsPanel');
	}
	loadContactChat(message, contact){
		if(message.from !== Utility.getCurrentUserId() && message.to !== Utility.getCurrentUserId() && message.info !== 1)
			return;
		if(contact){
			this.loadChatContacts2(contact, message);
			return;
		}
		if(app.getCurrentForm().id === 'chatbody'){
			var crit = 'msgdatetime = '+message.msgDateTime;
			if(message.info === 1){				
				app.getCurrentForm().showContactGroupChat(crit);
			}else{
				app.getCurrentForm().showContactChatMsg(crit);
			}
			return;
		}
		storage.getContact(message, null, function(results){
			for(var idx=0; idx<results.rows.length; idx++){
				contact = results.rows.item(idx);
				if(contact.id === Utility.getCurrentUserId())
					continue;
				if(message.info === 1 && (!contact.members || contact.members.indexOf(Utility.getCurrentUserId()) === -1)){
					continue;
				}
				this.loadChatContacts2(contact, message);
			}
		}.bind(this));
		
	}
	findContactItem(contactId){
		var items = this.getWidgetByPath('.list-chats li');
		for(var idx=0; idx<items.length; idx++){
			var item = $(items[idx]);
			var id = item.find('#contactId').text();
			if(contactId === id)
				return item;
		}
		return null;
	}
	loadChatContacts2(contact, message){
		var isGroup = false;
		if(app.getCurrentForm().id !== 'chatbody'){
			var contactItem = this.findContactItem(contact.id);
			if(contactItem){
				var msgTxt = contactItem.find('#lastMsg');
				if(message.viewStatus === 0 && message.from !== Utility.getCurrentUserId()){
					var msgCntElem = contactItem.find('#msgNewCount');
					var count = msgCntElem.text();
					count = parseInt(count);
					if(Number.isNaN(count))
						count = 0;
						count++;
						msgCntElem.text(count);					
					msgTxt.addClass('highlight blue');
				}
				msgTxt.text(message.messageText);
				return;
			}
		}
		if(contact.members){
			var currentUser = auth.currentUser;
			isGroup = contact.members.indexOf(currentUser.uid);
			if(isGroup === -1)
				return;
		}
		var msgDate = 'online';
		if(contact.lastSeen !== 'online'){
			var today = Utility.getFormattedDate(new Date(), DATE_FORMAT);
			msgDate = Utility.getFormattedDate(new Date(contact.lastSeen), DATE_FORMAT);
			if(new Date(today).getTime() === new Date(msgDate).getTime()){
				msgDate = Utility.getFormattedDate(new Date(contact.lastSeen), LAST_SEEN_FORMAT);
			}
		}
		var msgCount;
		if(message.viewStatus === 0 && message.from !== Utility.getCurrentUserId())
			msgCount = 1;
		var contactId = contact.id;
		var contactHtml = $(Utility.loadContactTemplate(contact,null, msgDate, msgCount, message.messageText));
		contactHtml.click(this.showChat.bind(this));
		this.getWidgetByPath('.list-chats').append(contactHtml);

	}
	showChat(event){		
		this.getWidgetByPath('.list-chats').find('.chat-select').removeClass('chat-select');
		var selectChat = $(event.currentTarget);
		if(!selectChat.hasClass('chat-select')){
			selectChat.addClass('chat-select');
		}
		var msgCntElem = selectChat.find('#msgNewCount');
		msgCntElem.text('');
		var msgTxt = selectChat.find('#lastMsg');
		msgTxt.removeClass('highlight blue');

		var pic = selectChat.find('img').attr('src');
		var name = selectChat.find('.user-name span').text();
		var info = selectChat.find('#info').text();
		var id = selectChat.find('#contactId').text();

		app.navigateTo('chatbody', {'pic':pic, 'name': name, 'info': info, 'id': id});
	}
}