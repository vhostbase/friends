contactPanelShow = () =>{
	var currentUser = auth.currentUser;
	var uid = currentUser.uid;
	updateContacts({id: uid, lastSeen : 'online'});
	$('.fab').removeClass('d-none');
	console.log('contactPanelShow Called');
};
newGrpPanelShow =() =>{
	console.log('newGrpPanelShow Called');
};
findMessageCount =(contact) =>{

};
chatbodyShow =() =>{
	var id = $('#chatbody #chatId').val();
	//updateContactStatus({lastSeen: 'online'});
	console.log('chatbodyShow Called');
};
getChatterName =(message) =>{
	if(message.name)
		return message.name;
	return 'UnKnown';
};