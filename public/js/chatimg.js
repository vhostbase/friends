class chatimg extends BaseClass
{
	constructor(){
		super();
		this.getWidgetByPath('#ipControl').click(this.sendImgMessage.bind(this));
	}
	onNavigate(data){
		this.imgData = data;
	}
	postShow(){
		this.getWidgetByPath('#imgMsg').attr('src', this.imgData.src);
		this.getWidgetByPath('#imgMsg').attr('alt', this.imgData.alt);
	}

	fromBack(){
		this.getWidgetByPath('#imgMsg').attr('src', '');
	}
	sendImgMessage(){
		var messageData = this.getWidgetByPath('#imgMsg').attr('src');
		var fileName = this.getWidgetByPath('#imgMsg').attr('alt');
		var txtData = this.getWidgetByPath('#captionMsg').val();
		this.getWidgetByPath('#captionMsg').val("");
		app.navigateTo(chatbody, {'messageText':txtData, 'imgData': messageData, 'fileName': fileName, messageType : 'image'});
		//this.sendMessage(txtData, 'image', messageData);
	}
}