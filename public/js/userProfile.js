class userProfile extends BaseClass
{
	onNavigate(data){
		var chatterName = data.chatterName;
		var chatterId = data.chatterId;
		var chatterPic = data.chatterPic;
		this.getWidgetByPath('#searchHdr').empty();
		this.getWidgetByPath('#searchHdr').append(this.getContactPrfMenuTemplate('Profile'));
		this.getWidgetByPath('#lbl_contact_name').text(chatterName);
		this.addProfilePic(chatterPic);
	}
	postShow(){

	}
	
	getContactPrfMenuTemplate(contactName){
		var hdrHtml = '';
		hdrHtml += '<div class="row icons d-flex searchHdrClass"><div class="p-2 profile-section-top-text" style="cursor:pointer;"><i class="fas fa-arrow-left text-white"></i></div>';
		hdrHtml += '<div class="d-flex flex-column">';
		hdrHtml += '<div class="text-white font-weight-bold">'+contactName+'</div>';
		hdrHtml += '</div>';
		hdrHtml += '<div class="p-2 profile-section-top-text cursor-class" data-toggle="dropdown"><i class="fas fa-ellipsis-v text-white"></i></div>';
		hdrHtml += '<div class="dropdown-menu dropdown-menu-right">';
		hdrHtml += '<a class="dropdown-item" href="#">Share</a>';
		hdrHtml += '<a class="dropdown-item" href="#">Edit</a>';
		hdrHtml += '<a class="dropdown-item" href="#">View in address book</a>';
		hdrHtml += '<a class="dropdown-item" href="#">Verify security code</a>';
		hdrHtml += '</div></div>';

		return $(hdrHtml);
	}
	addProfilePic(chatterPic){
		this.getWidgetByPath('.profile-section-pic img').attr('src', chatterPic);
	}
	addProfileLabel(contactName){
		var hdrHtml =''
		hdrHtml += '<li class="list-group-item list-group-item-action chat-item">';
		hdrHtml += '<div class="chat-text"><div class="chat-head">';
		hdrHtml += '<div class="user-name"><span>'+contactName+'</span><input type="text" id="contact_name" style="display:none;"></input></div>';
		hdrHtml += '<div class="user-name"><span class="text-black"><i class="fas fa-pen"></i></span></div>';
		hdrHtml += '</div></div>';
		hdrHtml +='</li>';
		this.getWidgetByPath('.list-contact-details').append($(hdrHtml));
	}
}