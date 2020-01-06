$('#profile-pic-input').change(function(event){
	var image = $('#profilePhoto');
	image[0].src = ''
	var reader = new FileReader();
	reader.onloadend = function() {
		 image[0].src = reader.result;
	}
	reader.readAsDataURL(event.target.files[0]);
});
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
function doRegister(){
	adjustFileds();
	var userName = localStorage.getItem("userName");
	var currentUser = firebase.auth().currentUser;
	console.log(currentUser);
	var database = firebase.database();
	var userData = {
		id: currentUser.uid,
		name: $('#lbl_contact_name').text(),
		number: userName,
		pic: "img/profile-img-new.PNG",
		lastSeen: "Apr 29 2018 17:58:02"
	};
	if(getProfilePhoto() != null && getProfilePhoto().indexOf("img/profile-img-new.PNG") === -1){
		userData.pic = getProfilePhoto();
	}
	database.ref('chat_contacts/'+currentUser.uid).set(userData, function(error) {
		if(error){
			console.log(error);
		}else{
			console.log('Update successful');
			doHome();
			//window.location.href="../home.html";
			//goToHome(currentUser.uid);
		}
	});

	
}

function getProfilePhoto(){
	return $('#profilePhoto')[0].src;
}
function addChgProfile(profileData){
	$('#profilePhoto')[0].src = profileData.pic;
	$('#lbl_contact_name').text(profileData.name);
	showProfilePanel2();
	//unblock_screen();
}
function showProfilePanel(){
	//block_screen();
	var database = firebase.database();
	var currentUser = firebase.auth().currentUser;
	database.ref('chat_contacts/'+currentUser.uid).once('value', function(snapshot){
		var profileData = snapshot.val();
		addChgProfile(profileData);
	});

}