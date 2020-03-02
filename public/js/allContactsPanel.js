class allContactsPanel extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('#searchHdr').empty();
		this.getWidgetByPath('#searchHdr').append(this.addContactSrchHeader([]));
	}
	fireFab(){
		$('.fab').addClass('d-none');
	}
	callNewGroup(){
		app.navigateTo('createGroupPanel');
	}
	postShow(){
		this.fireFab();
		this.getWidgetByPath('.list-chats').empty();
		this.loadContacts({name:'New Group'}, this.callNewGroup.bind(this));
		this.loadContacts({name:'New Contact'});
		
		var uid = Utility.getCurrentUserId();
		var conts = [];
		var showCallback = this.showChat.bind(this);
		storage.getAllContacts(null, function(rows){
			for(var idx=0; idx<rows.length; idx++){
				var value = rows.item(idx);
				if(uid === value.id || (value.members && value.members.indexOf(uid) === -1)){
					continue;
				}
				conts.push(value);
				this.loadContacts(value, showCallback);
			}
			this.getWidgetByPath('#searchHdr .numConts').text(conts.length+' contacts');
			/*this.getWidgetByPath('#searchHdr #srchContact').click(function(){
				this.loadContactSrch(conts);
			}.bind(this));*/
		}.bind(this));
	}
	loadContacts(contact, callback){
		var contactHtml = $(Utility.loadContactTemplate(contact, null));
		contactHtml.click(callback);
		this.getWidgetByPath('.list-chats').append(contactHtml);
	}
	loadContactSrch(conts){
		this.getWidgetByPath('#searchHdr').empty();
		this.getWidgetByPath('#searchHdr').append(this.addContactSrchHeader2(conts));
		this.getWidgetByPath('#searchHdr #contSrch').keyup(function(event){
			this.searchContact(this, conts);
		}.bind(this));
	}
	addContactSrchHeader2(conts){
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
	addContactSrchHeader(conts){
		var hdrHtml = '';
		hdrHtml += '<div class="row icons d-flex searchHdrClass"><div class="p-2 profile-section-top-text" style="cursor:pointer;"><i class="fas fa-arrow-left text-white"></i></div>';
		hdrHtml += '<div class="d-flex flex-column">';
		hdrHtml += '<div class="text-white font-weight-bold">Select Contact</div>';
		hdrHtml += '<div class="text-white small numConts">'+conts.length+' contacts</div>';
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
	showChat(event){
		this.getWidgetByPath('.list-chats').find('.chat-select').removeClass('chat-select');
		var selectChat = $(event.currentTarget);
		if(!selectChat.hasClass('chat-select')){
			selectChat.addClass('chat-select');
		}		
		var pic = selectChat.find('img').attr('src');
		var name = selectChat.find('.user-name span').text();
		var info = selectChat.find('#info').text();
		var id = selectChat.find('#contactId').text();

		app.navigateTo('chatbody', {'pic':pic, 'name': name, 'info': info, 'id': id});
		//chatbody.show();
		//this.getWidgetByPath('.fa-arrow-left').click();
		//frmStack.pop();
	}
	fromBack(){
		this.fireFab();
		//this.getWidgetByPath('.fa-arrow-left').click();
	}
}