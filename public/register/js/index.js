function doRegister(){
	adjustFileds();
	var userName = $('#lbl_contact_nbr').text();
	auth.createUserWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(function(response){
		var currentUser = response.user;
	}).catch(function(error) {
		if(error.code === "auth/email-already-in-use")
			goToSettings(userName);
		console.log(error);
	});
	
}
function goToSettings(userName){
	localStorage.setItem("userName", userName);
	window.location.href="../profile-pic/profile-page.html";
}
function getProfilePhoto(){
	return $('#profilePhoto')[0].src;
}
function doEditMobile(){
	$('#lbl_contact_nbr').hide();
	//$('#contact_nbr').val($('#lbl_contact_nbr').text());
	$('#contact_nbr').show();
	$('#contact_nbr').focus();
}
function doEditName(){
	$('#lbl_contact_name').hide();
	$('#contact_name').show();
	$('#contact_name').focus();
}
function uploadPhoto(){
	$('#profile-pic-input').click();
}
$(document).on("click", "#mainDiv", function(){
	adjustFileds();
});
function adjustFileds(){
	var contactName = $('#contact_name').val();
	if(contactName){
		$('#lbl_contact_name').text(contactName);
		$('#lbl_contact_name').show();
		$('#contact_name').hide();
		$('#contact_name').val(null);
	}
	var contactNbr = $('#contact_nbr').val();
	if(contactNbr){
		$('#lbl_contact_nbr').text(contactNbr);
		$('#lbl_contact_nbr').show();
		$('#contact_nbr').hide();
		$('#contact_nbr').val(null);
	}
}