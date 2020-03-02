class createGroupPanel extends BaseClass
{
	onNavigate(data){
		this.mode = data.mode;
		this.chatterId = data.chatterId;
		this.contacts = data.contacts;
	}
	setMode(mode){
		this.mode = mode;
	}
	fromBack(){		
		if(this.mode){
			Utility.changFab('fa-check');
			$(".fab").unbind('click');
			$('.fab').click(this.addParticipant.bind(this));
		}else{
			$(".fab").unbind('click');
			$('.fab').click(this.createNewGroup.bind(this));
			Utility.changFab('fa-arrow-right');
		}
	}
	postShow(){		
		if(this.mode){
			this.getWidgetByPath('.list-select-contacts').empty();
				var uid = this.chatterId;
				var contacts = this.contacts;
				var conts = [];
				var target = this;
				for(var idx=0; idx<contacts.length; idx++){
					conts.push($(contacts[idx]).text());
				}
				var crit =' WHERE id NOT IN'+storage.convertToIn(conts);
				storage.getContactByCrit(crit, function(childs){
					for(var idx=0; idx<childs.length; idx++){
						var child = childs.item(idx);
						if(child.members)
							continue;
						conts.push(child);
						this.loadContacts(child);
					}
				}.bind(this));
			Utility.changFab('fa-check');
			$(".fab").unbind('click');
			$('.fab').click(this.addParticipant.bind(this));
			delete this.mode;
		}else{
			$('.fab').removeClass('d-none');
			Utility.changFab('fa-arrow-right');
			$('.list-select-contacts').empty();
			var uid = Utility.getCurrentUserId();
			var conts = [];
			var target = this;
			storage.getAllContacts(null, function(rows){
				for(var idx=0; idx<rows.length; idx++){
					var value = rows.item(idx);
					if(uid === value.id || (value.members && value.members.indexOf(uid) === -1) || value.members){
						continue;
					}
					conts.push(value);
					target.loadContacts(value);
				}
				$('#createGroupPanel #searchHdr #srchContact').click(function(){
					target.loadContactSrch(conts);
				});
			});
			$(".fab").unbind('click');
			$('.fab').click(this.createNewGroup.bind(this));
		}
		
	}
	createNewGroup(){
		var selected = this.collectParticipant();
		app.navigateTo('newGrpPanel', {contacts: selected});
	}
	loadContacts(contact){
		var contactHtml = $(Utility.loadContactTemplate(contact, null, '<span id="CID" style="display:none;">'+contact.id+'</span><i class="d-none fas fa-check-circle"></i>'));
		contactHtml.click(this.onSelectContact.bind(this));
		this.getWidgetByPath('.list-select-contacts').append(contactHtml);
	}
	onSelectContact(event){
		var control = $(event.currentTarget).find('i');
		control.toggleClass('d-none');
		$('.fab').removeClass('d-none');
	}
	addParticipant(){
		var selected = this.collectParticipant();
		if(selected.length === 0)
			return;
		this.loadGrpContacts(selected);
	}
	collectParticipant(){
		var selected = [];
		var mems = this.getWidgetByPath('.list-select-contacts li');
		for(var idx=0; idx<mems.length; idx++){
			var memElem = $(mems[idx]);
			if(!memElem.find('.fa-check-circle').hasClass('d-none')){
				var contactId = $(memElem.find('#contactId')).text();
				selected.push(contactId);
			}
		}
		return selected;
	}
	loadGrpContacts(selected){
		$('.fab').addClass('d-none');
		app.navigateTo('grpProfile', {contacts : selected});		
	}
}