chgProfileShow = () =>{
	console.log('chgProfileShow Called');
};
$('#profile-pic-input').change(function(event){
	var image = $('#profilePhoto');
	image.attr('src', '');
	image.attr('alt', event.target.files[0].name);
	var reader = new FileReader();
	reader.onloadend = function(event) {
		 image.attr('src',reader.result);
	}
	reader.readAsDataURL(event.target.files[0]);
	
});
function uploadImage(data, msgType, fileName, callback){
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
function uploadPhoto(){
	$('#profile-pic-input').click();
}
function adjustFileds(){
	var contactName = $('#contact_name').val();
	if(contactName){
		$('#lbl_contact_name').text(contactName);
		$('#lbl_contact_name').show();
		$('#contact_name').hide();
		$('#contact_name').val(null);
	}
	var contactDesc = $('#contact_desc').val();
	if(contactDesc){
		$('#lbl_contact_desc').text(contactDesc);
		$('#lbl_contact_desc').show();
		$('#contact_desc').hide();
		$('#contact_desc').val(null);
	}
}
function doEditName(){
	$('#lbl_contact_name').hide();
	$('#contact_name').show();
	$('#contact_name').focus();
}
function doEditAbout(){
	$('#contact_desc').emoji({place: 'after'});
	$('#lbl_contact_desc').hide();
	$('#contact_desc').show();
	$('#contact_desc').focus();
}
$(document).on("click", "#mainDiv", function(){
	adjustFileds();
});
/*function doHome(){
	window.location.href="../chats/index.html";
}*/
function doChgRegister(){
	var data = $('#profilePhoto').attr('src');
	var fileName = $('#profilePhoto').attr('alt');
	uploadImage(data, 'png', fileName, function(url){
		doChgRegister2(url);
	});
}
function doChgRegister2(url){
	$('#chgProfile').addClass('d-none');
	adjustFileds();
	var userName = localStorage.getItem("userName");
	var currentUser = firebase.auth().currentUser;
	console.log(currentUser);
	var database = firebase.database();
	var userData = {
		id: currentUser.uid,
		name: $('#lbl_contact_name').text(),
		number: userName,
		//pic: "img/profile-img-new.PNG",
		lastSeen: "Apr 29 2018 17:58:02"
	};
	userData.pic = url;
	database.ref('chat_contacts/'+currentUser.uid).set(userData, function(error) {
		if(error){
			console.log(error);
		}else{
			console.log('Update successful');
			loadSelfProfile();
			//doHome();
			//window.location.href="../home.html";
			//goToHome(currentUser.uid);
		}
	});

	
}

function getProfilePhoto(){
	var data = $('#profilePhoto').attr('src');
	if(data.indexOf("img/profile-img-new.PNG") > -1){
		data = getDefaultPhoto();
	}
	return data;
}
function addChgProfile(profileData){
	$('#profilePhoto').attr('src', profileData.pic);
	$('#lbl_contact_name').text(profileData.name);
	//showProfilePanel2();
	//showProfilePanel();
	//unblock_screen();
}
function showProfilePanel(event){
	//block_screen();
	if(!event)
		$('#chgProfile #prfBack').show();
	var database = firebase.database();
	var currentUser = firebase.auth().currentUser;
	database.ref('chat_contacts/'+currentUser.uid).once('value', function(snapshot){
		var profileData = snapshot.val();
		if(profileData)
			addChgProfile(profileData);
		showProfilePanel2();
	});

}
function getGrpProfilePhoto(){
	var data = $('#groupPic').attr('src');
	if(data.indexOf("img/profile-img-new.PNG") > -1){
		data = getDefaultPhoto();
	}
	return data;
}
function getDefaultPhoto(){
	return "https://firebasestorage.googleapis.com/v0/b/friendship-d566b.appspot.com/o/ProfileImages%2Fprofile-img-new.PNG?alt=media&token=b421ad66-3ba8-4b80-8585-676289503755";
}
/*
	{
		id: 1,
		name: "Programmers",
		members: [0, 1, 3],
		pic: "images/0923102932_aPRkoW.jpg"
	}
*/
function createGroupProfile(callback){
	var creatorId = $('#currentId').val();
	var memberList = [creatorId];
	var mems = $('.list-group-contacts').find('.cursor-class');
	for(var idx=0; idx<mems.length; idx++){
		var member = $(mems[idx]);
		var cid = member.find('#CID');
		memberList.push($(cid).text());
	}
	var userName = localStorage.getItem("userName");
	var database = firebase.database();
	var grpUID = tharak.uuid();
	var userData = {
		id: grpUID,
		name: $('#group_name').val(),
		number: userName,
		members : memberList,
		lastSeen: "Apr 29 2018 17:58:02"
	};
	
	userData.pic = getGrpProfilePhoto();
	
	var insert = database.ref('chat_contacts/'+grpUID);
	//var insertRef = insert.push();
	insert.once('value', function(snapshot){
		//console.log(snapshot.key);
		callback();
	});
	insert.set(userData);
}
function showRegister(){
	$('.fab').hide();
	$('#mainDiv').removeClass('d-none');
	$('#chatads').addClass('d-none');
}
function doEditMobile(){
	$('#lbl_contact_nbr').hide();
	$('#contact_nbr').show();
	$('#contact_nbr').focus();
}
function doRegister(){
	$('#mainDiv').addClass('d-none');
	adjustContactNbr();
	var userName = $('#lbl_contact_nbr').text();
	auth.createUserWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(function(response){
		var currentUser = response.user;
	}).catch(function(error) {
		if(error.code === "auth/email-already-in-use"){
			$('#mainDiv').addClass('d-none');
			localStorage.setItem("userName", userName);
			initAuth();
		}
		console.log(error);
	});
	
}

$(document).on("click", "#mainDiv", function(){
	adjustContactNbr();
});
function adjustContactNbr(){
	var contactNbr = $('#contact_nbr').val();
	if(contactNbr){
		$('#lbl_contact_nbr').text(contactNbr);
		$('#lbl_contact_nbr').show();
		$('#contact_nbr').hide();
		$('#contact_nbr').val(null);
	}
}

function showChangeProfile(){
	$('#chgProfile #prfBack').hide();
	showProfilePanel(true);
}

async function addProfile(profileData){
	$('#profile-pic').attr('src', profileData.pic);
	$('#currentId').val(profileData.id);
}