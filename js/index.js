/*let contactList = [];
function loadSelfProfile(){
	block_screen();
	var currentUser = auth.currentUser;
	var database = firebase.database();
	database.ref('chat_contacts').on('value', function(snapshot){
		var profileData = snapshot.val();
		for (const [key, value] of Object.entries(profileData)) {
			if(currentUser.uid === key){
				addProfilePic(value.pic);
				continue;
			}
		 loadContacts(value);
		}
		unblock_screen();
	});
}*/
function addProfile(profileData){
	$('#profile-pic')[0].src = profileData.pic;
}
function loadContacts(contact){
	if(!contact.pic)
		contact.pic = 'img/profile-img.png';
	let contactHtml = '<span style="cursor:pointer;" onclick="showChat();"><li class="list-group-item list-group-item-action chat-item">';
	contactHtml += '<img src="'+contact.pic+'" class="rounded-circle circled-image">';
	contactHtml += '<div class="chat-text">';
	contactHtml += '<div class="chat-head"><div class="user-name"><span>'+contact.name+'</span></div>';
	contactHtml += '<div class="chat-time"><span class="font-weight-light">'+contact.lastSeen+'</span></div></div>';
	contactHtml += '<div class="last-msg font-weight-light"><span>How are you?</span></div></div>';
	contactHtml += '</li></span>';
	$('#list-contacts').append($(contactHtml));
}
$('#chatbody').hide();
function showChat(uid){
	$('#chatads').hide();
	$('#chatbody').show();
}