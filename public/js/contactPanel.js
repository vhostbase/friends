class contactPanel extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('.profile-img .cursor-class').click(function() {
			$('.fab').addClass('d-none');
			app.navigateTo(chgProfile, this.data);
		}.bind(this));
		this.getWidgetByPath('#contactSearch').keyup(this.searchContact.bind(this));
		app.registerSync(this);
	}
	onNavigate(data){
		this.data = data;
	}
	preShow(){

	}
	searchContact(){
		var input, filter, ul, li, a, i, txtValue;
		input = this.getWidgetByPath('#contactSearch');
		filter = input.val().toUpperCase();
		ul = this.getWidgetByPath('.list-chats');
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
			return;
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
		if(!profileData.isRegister){
			this.getWidgetByPath('#profile-pic').attr('src', profileData.pic);
		}else{
			this.getWidgetByPath('#profile-pic').attr('src', profileData.pic);
		}
		//this.getWidgetByPath('#profile-pic').attr('src', profileData.pic);
		this.getWidgetByPath('#currentName').val(profileData.name);
	}
	postShow(){
		if(this.data.isRegister){
			this.addProfile(this.data);
		}else{
			var userId = Utility.getCurrentUserId();
			storage.getAllContacts({where : {id : userId}}, function(results){
				if(results.length>0){
					var contact = results.item(0);
					this.addProfile(contact);
				}
			}.bind(this));
		}
		if(app.isAppOnline){
			//app.attacthMessages(this.fillMessages.bind(this));
			//provider.fillContacts(this);
			provider.fillMessages(this);
		}
		storage.getMessages(null, function(results){
			for(var idx=0; idx<results.length; idx++){
				this.loadContactChat(results.item(idx));
			}
		
		}.bind(this));
		
		//frmStack.splice(0, frmStack.length);
		//frmStack.push(this);
		this.fromBack();
		$(".fab").unbind('click');
		$('.fab').click(this.fabCallback);
		this.getWidgetByPath('.list-chats').find('.chat-select').removeClass('chat-select');
				this.onBack();
	}
	loadSync(){
		var crit = null;//{where:{viewStatus : 0}}
		storage.getMessages(crit, function(results){
			for(var idx=0; idx<results.length; idx++){
				var messageData = results.item(idx);
				if(messageData.viewStatus === 1){
					messageData.viewStatus = 2;
					provider.insertMessage(messageData, function(messageData){
						//this.updateStatusFlag(messageData);
						this.loadContactChat(messageData);
					}.bind(this, messageData));
				}
			}
		}.bind(this));		
	}
	fromBack(){
		Utility.changFab('fa-comment');
		$('.fab').removeClass('d-none');
	}
	fabCallback(){
		app.navigateTo(allContactsPanel);
	}
	removeChatContact(message){
		if(!message.deletedBy || message.deletedBy.indexOf(Utility.getCurrentUserId()) === -1)
			return;
		var crit = { where: { to:{ in: [message.from, message.to]}, from: { in: [message.from, message.to]} }, 
			order: { by: 'msgDateTime', type: 'desc' }};
		storage.getMessages(crit, function(results){
			var chatterId = message.from;
			if(chatterId === Utility.getCurrentUserId())
				chatterId = message.to;
			var contactItem = this.findContactItem(chatterId);
			if(results.length === 0){
				if(contactItem)
					contactItem.remove();
			}else{				
				if(contactItem){
					var msgTxt = contactItem.find('#lastMsg');
					var lastMessage = results.item(0);
					msgTxt.text(lastMessage.messageText);
				}
			}
			
		}.bind(this));
	}
	loadContactChat(message, contact){
		if(message.deletedBy && message.deletedBy.indexOf(Utility.getCurrentUserId()) > -1)
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
		var crit = {where :{id : message.to, or: {id : message.from}}};
		storage.getAllContacts(crit, function(results){
			for(var idx=0; idx<results.length; idx++){
				contact = results.item(idx);
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
			var id = item.find('.chat-head').val();
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
				if(message.viewStatus === 2 && message.from !== Utility.getCurrentUserId() && contactItem.msgId !== message.msgDateTime){
					var msgCntElem = contactItem.find('#msgNewCount');
					var count = msgCntElem.text();
					count = parseInt(count);
					if(Number.isNaN(count))
						count = 0;
						count++;
						msgCntElem.text(count);					
					msgTxt.addClass('highlight blue');
					contactItem.msgId = message.msgDateTime;
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
		var contactHtml = $(Utility.loadContactTemplate(contact,msgDate, msgCount, message.messageText));
		contactHtml.click(this.showChat.bind(this));
		$(contactHtml.find('.chat-head')).val(contactId);
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
		var info = selectChat.find('.group-chat').length>0?1:0;
		var id = selectChat.find('.chat-head').val();

		app.navigateTo(chatbody, {'pic':pic, 'name': name, 'info': info, 'id': id});
	}
	/*fromBack(){
		this.getWidgetByPath('.list-chats').empty();
		storage.getMessages(null, function(results){
			for(var idx=0; idx<results.length; idx++){
				this.loadContactChat(results.item(idx));
			}
		
		}.bind(this));
	}*/
}