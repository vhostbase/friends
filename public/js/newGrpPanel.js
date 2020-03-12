class newGrpPanel extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('#groupPic').click(this.uploadPic.bind(this));
		this.getWidgetByPath('#group-pic-input').change(this.addPic.bind(this));
	}
	onNavigate(data){
		if(!data)
			return;
		this.contacts = data.contacts;
	}
	addPic(){
		var image = $('#groupPic');
		image.attr('src', '');
		image.attr('alt', event.target.files[0].name);
		var reader = new FileReader();
		reader.onloadend = function(event) {
			 image.attr('src',reader.result);
		}
		reader.readAsDataURL(event.target.files[0]);
	}
	uploadPic(){
		this.getWidgetByPath('#group-pic-input').click();
	}
	postShow(){
		Utility.changFab('fa-check');
		$(".fab").unbind('click');
		$('.fab').click(this.createGroupProfile.bind(this));
		this.collectGroup();
	}
	collectGroup(){
		this.getWidgetByPath('.list-group-contacts').empty();
		var crit = 'WHERE id IN'+storage.convertToIn(this.contacts);
		storage.getContactByCrit(crit, this.loadResultContacts.bind(this));
	}
	loadResultContacts(rows){
		for(var idx=0; idx<rows.length; idx++){
			var contact = rows.item(idx);
			var contactHtml = Utility.loadContactTemplate(contact);
			this.getWidgetByPath('.list-group-contacts').append($(contactHtml));
		}
	}
	collectGroup2(){
		this.getWidgetByPath('.list-group-contacts').empty();
		var contacts = this.contacts;
		for(var idx=0; idx<contacts.length; idx++){
			var contact = $(contacts[idx]);
			var elem = contact.find('i');
			if(!elem.hasClass('d-none')){
				var cid = contact.find('#CID');
				var cimg = contact.find('img');
				var name = contact.find('.user-name');
				this.getWidgetByPath('.list-group-contacts').append($(this.getMemberTemplate({name: $(name).text(), id : $(cid).text(), photo : cimg.attr('src')})));
			}
		}
	}
	createGroupProfile(){
		var data = this.getWidgetByPath('#groupPic').attr('src');
		var fileName = this.getWidgetByPath('#groupPic').attr('alt');
		Utility.uploadImage(data, 'ProfileImages', 'png', fileName, function(url){
			this.createGroupProfile2(url);
		}.bind(this));
	}
	createGroupProfile2(url){
		var creatorId = Utility.getCurrentUserId();
		var memberList = [creatorId];
		var mems = this.getWidgetByPath('.list-group-contacts li #CID');
		for(var idx=0; idx<mems.length; idx++){
			var cid = $(mems[idx]);
			memberList.push($(cid).text());
		}
		var userName = localStorage.getItem("userName");
		var grpUID = Utility.uuid();
		var userData = {
			id: grpUID,
			name: this.getWidgetByPath('#group_name').val(),
			number: userName,
			members : memberList,
			createdBy: creatorId,
			createdAt: Utility.getCurrentDateTime()
		};
		
		userData.pic = url;
		provider.updateContact(userData.id, userData, function(){
			app.navigateTo(contactPanel);
		}.bind(this));
	}
	getMemberTemplate(contact){
		var content = '';
		content += '<span class="cursor-class"><li class="list-group-item list-group-item-action chat-item">';
		content += '<img src="'+contact.photo+'" class="rounded-circle circled-image">';
		content += '<span id="CID" style="display:none;">'+contact.id+'</span>';
		content += '<div class="chat-text"><div class="chat-head"><div class="user-name">';
		content += '<span class="user-text">'+contact.name+'</span>';
		content += '</div></div></div></li></span>';
		return content;
	}
}