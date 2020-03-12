class Utility
{
	static getFormattedDate(dateTime, format){
		return moment(dateTime).format(format);
	}
	static getDefaultPhoto(){
		return "data:image/png;base64,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";
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
		var loginId = localStorage.getItem("userId");
		return loginId;
		/*var currentUser = auth.currentUser;
		if(currentUser){
			return currentUser.uid;
		}*/
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
	static getToday(){
		return Utility.getFormattedDate(new Date(), DATE_FORMAT);
	}
	static loadContactTemplate(contact, msgDate, msgCount, lastMsg){
		if(!contact.pic || contact.pic === 'undefined' || contact.pic.indexOf('img/profile-img') > -1)
			contact.pic = Utility.getDefaultPhoto();
		let contactHtml = '';
		if(contact.members)
			contactHtml += '<li class="list-group-item list-group-item-action chat-item group-chat">';
		else
			contactHtml += '<li class="list-group-item list-group-item-action chat-item">';
		/*if(contact.members)
			contactHtml += '<span id="info" style="display:none;">group</span>';
		else
			contactHtml += '<span id="info" style="display:none;">personal</span>';*/
		//contactHtml += '<span id="contactId" style="display:none;">'+contact.id+'</span>';
		contactHtml += '<img id="contactPhoto" style="background:url(IWRL.gif) 50% no-repeat;background-size: 400%;" src="'+((contact.pic)?contact.pic:contact.imgData)+'" class="rounded-circle circled-image">';
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
	static uuid(){
	  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	  });
	};
	static updateProfileImage(profileData){

	}
	static uploadImage2Store(data, folder, msgType, fileName, callback){
		if(!fileName){
			callback(data);
			return;
		}
		folder += '/';
		//ProfileImages
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
		  /*uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			console.log('File available at', downloadURL);
			callback(downloadURL);
		  });*/
		  callback();
		});
	}
	static uploadImage(data, folder, msgType, fileName, callback){
		if(!fileName){
			callback(data);
			return;
		}
		folder += '/';
		//ProfileImages
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
	static deleteImage(fileName, callback){
		var storageRef = firebase.storage().ref();
		var mountainsRef = storageRef.child(fileName);
		mountainsRef.delete().then(function() {
		  // File deleted successfully
		  console.log('File deleted successfully');
		  callback();
		}).catch(function(error) {
		  // Uh-oh, an error occurred!
		  console.log(error);
		  callback();
		});
	}
	static downloadImage(data, folder, msgType, fileName, callback){
		if(!fileName){
			callback(data);
			return;
		}
		folder += '/';
		//ProfileImages
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
	static attachmentItems(items, target, itemSelectCallback){
		for(var idx=0; idx<items.length; idx++){
			var item = items[idx];
			var elem = $('<li id="'+item+'"class="list-group-item list-group-item-action chat-item"><div class="chat-text"><div class="chat-head"><div class="user-name"><span>'+item+'</span></div></div></div></li>');
			elem.click(itemSelectCallback);
			target.append(elem);
		}
	}
	static loadImage(image, strUrl, callback){
		image[0].style.background = 'url(IWRL.gif) 50% no-repeat';
		var downloadingImage = new Image();
		downloadingImage.onload = function(event){
			image[0].src = event.src;
			callback(this.src, strUrl);
			image[0].style.background = '';
		};
		downloadingImage.src = strUrl;
		//var imgContainer = document.getElementById('imgcont');
		//var progressBar = document.getElementById('progress');
		//var imageUrl = 'https://placekitten.com/g/2000/2000';
		//Utility.loadImageWithProgress(image[0], progressBar, strUrl);
	}
	static loadImageWithProgress(imgContainer, imageUrl, callback){
		Utility.loadImageWithProgress2(imageUrl, (ratio) => {
		  if (ratio == -1) {
			// Ratio not computable. Let's make this bar an undefined one.
			// Remember that since ratio isn't computable, calling this function
			// makes no further sense, so it won't be called again.
			//progressBar.removeAttribute('value');
		  } else {
			// We have progress ratio; update the bar.
			//progressBar.value = ratio;
		  }
		})
		.then(imgSrc => {
		  // Loading successfuly complete; set the image and probably do other stuff.
		  imgContainer.src = imgSrc;
		  callback(imgSrc, imageUrl);
		}, xhr => {
		  // An error occured. We have the XHR object to see what happened.
		});
	}
	static loadImageWithProgress2(imageUrl, onprogress){
	  return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		var notifiedNotComputable = false;

		xhr.open('GET', imageUrl, true);
		xhr.responseType = 'arraybuffer';

		xhr.onprogress = function(ev) {
		  if (ev.lengthComputable) {
			onprogress(parseInt((ev.loaded / ev.total) * 100));
		  } else {
			if (!notifiedNotComputable) {
			  notifiedNotComputable = true;
			  onprogress(-1);
			}
		  }
		}

		xhr.onloadend = function() {
		  if (!xhr.status.toString().match(/^2/)) {
			reject(xhr);
		  } else {
			if (!notifiedNotComputable) {
			  onprogress(100);
			}

			var options = {}
			var headers = xhr.getAllResponseHeaders();
			var m = headers.match(/^Content-Type\:\s*(.*?)$/mi);

			if (m && m[1]) {
			  options.type = m[1];
			}

			var blob = new Blob([this.response], options);

			resolve(window.URL.createObjectURL(blob));
		  }
		}

		xhr.send();
	  });
	}
}