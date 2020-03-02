class Utility
{
	static getFormattedDate(dateTime, format){
		return moment(dateTime).format(format);
	}
	static getDefaultPhoto(){
		return "https://firebasestorage.googleapis.com/v0/b/friendship-d566b.appspot.com/o/ProfileImages%2Fprofile-img-new.PNG?alt=media&token=b421ad66-3ba8-4b80-8585-676289503755";
	}
	static getDefaultGrpPhoto(){
		return "https://firebasestorage.googleapis.com/v0/b/friendship-d566b.appspot.com/o/ProfileImages%2Fprofile-img-new.PNG?alt=media&token=b421ad66-3ba8-4b80-8585-676289503755";
	}
	static detectmob() {
	   if(window.innerWidth <= 600 && window.innerHeight <= 800) {
		 return true;
	   } else {
		 return false;
	   }
	}
	static addScrollBar(){
		var height = $('#chatbody .chat-window').height();
		if(Utility.detectmob() && height > 600)
			$('#chatbody .chat-window').css('overflow-y', 'scroll');
		else if(height > 300)
			$('#chatbody .chat-window').css('overflow-y', 'scroll');
	}
	static getChatterName(message){
		if(message.name)
			return message.name;
		return 'UnKnown';
	}
	static getCurrentUserName(){
		return $('#currentName').val();
	}
	static getCurrentUserId(){
		var currentUser = auth.currentUser;
		if(currentUser)
			return currentUser.uid;
	}
	static getCurrentEmail(){
		var currentUser = auth.currentUser;
		if(currentUser)
			return currentUser.email;
	}
	static getCurrentUserAlias(){
		var currentUser = auth.currentUser;
		if(currentUser){
			var email = currentUser.email;
			return email.replace('@gmail.com', '');
		}
		return null;
	}
	static getCurrentTime(){
		var msgDate = new Date();
		var today = moment(msgDate).format(TIME_FORMAT);
		return msgDate.getTime();

	}
	static loadContactTemplate(contact, onClickEvent, msgDate, msgCount, lastMsg){
		if(!contact.pic || contact.pic === 'undefined' || contact.pic.indexOf('img/profile-img') > -1)
			contact.pic = Utility.getDefaultPhoto();
		let contactHtml = '';
		if(contact.event)
			contactHtml += '<li class="list-group-item list-group-item-action chat-item" '+contact.event+'>';
		else if(onClickEvent)
			contactHtml += '<li class="list-group-item list-group-item-action chat-item" '+onClickEvent+'>';
		else
			contactHtml += '<li class="list-group-item list-group-item-action chat-item">';
		if(contact.members)
			contactHtml += '<span id="info" style="display:none;">group</span>';
		else
			contactHtml += '<span id="info" style="display:none;">personal</span>';
		contactHtml += '<span id="contactId" style="display:none;">'+contact.id+'</span>';
		contactHtml += '<img id="contactPhoto" src="'+contact.pic+'" class="rounded-circle circled-image">';
		contactHtml += '<div class="chat-text">';
		contactHtml += Utility.chatHead(contact, msgDate, lastMsg);
		if(lastMsg)
			contactHtml += Utility.chatHeadMsg(lastMsg, msgCount);
		contactHtml += '</div>';
		contactHtml += '</li>';
		return contactHtml;
	}
	static chatHead(contact, msgDate){
		var contactHtml = '';
		contactHtml += '<div class="chat-head">';
		contactHtml += '<div class="user-name"><span>'+contact.name+'</span></div>';
		if(msgDate)
		contactHtml += '<div class="chat-time"><span class="font-weight-light">'+msgDate+'</span></div>';
		contactHtml += '</div>';
		return contactHtml;
	}
	static chatHeadMsg(lastMsg, msgCount){
		var contactHtml = '<div class="chat-head">';
		contactHtml += '<div class="last-msg"><span id="lastMsg">'+lastMsg+'</span></div>';
		if(msgCount)
			contactHtml += '<div class="last-msg font-weight-light"><span id="msgNewCount" class="step">'+msgCount+'</span></div>';
		else
			contactHtml += '<div class="last-msg font-weight-light"><span id="msgNewCount" class="step"></span></div>';
		contactHtml += '</div>';
		return contactHtml;
	}
	static changFab(lblNew){
		var btnFab = $('.fab').find('.fas');
		$(btnFab).attr('class','');
		//btnFab.removeClass(lblOld);
		btnFab.addClass('fas '+lblNew);
		$('.fab').show();
	}
	static getCurrentDateTime(){
		var msgDate = new Date();
		var today = moment(msgDate).format(TIME_FORMAT);
		var msgTime = msgDate.getTime();
		return msgTime;
	}
	static uuid =() =>{
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	  });
	};
	static uploadImage(data, msgType, fileName, callback){
		if(!fileName){
			callback(data);
			return;
		}
		var folder = 'ProfileImages/'
		var storageRef = firebase.storage().ref();
		var mountainsRef = storageRef.child(folder+fileName);
		var uploadTask = mountainsRef.putString(data, 'data_url');
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
			callback(downloadURL);
		  });
		});
	}
}