var config = {
	apiKey: "AIzaSyD7Xp9dGNT2D7jMBopG9dN3nuL4BcFNX_g",
	authDomain: "friendship-d566b.firebaseapp.com",
	databaseURL: "https://friendship-d566b.firebaseio.com/",
	storageBucket: "friendship-d566b.appspot.com"
  };
firebase.initializeApp(config);
var isAttached = false;
var database = firebase.database();
inqContacts = (callback) =>{
	database.ref('chat_contacts').once('value', function(snapshot){
		var profileData = snapshot.val();
		callback(profileData);
	});
};

updateContacts =(data) =>{
	var source = 'chat_contacts/'+data.id;
	var insert = database.ref(source);
	insert.update(data);
};
insertMessage = (data, callback) =>{
	var source = 'chat_messages/'+data.msgDateTime;
	var insert = database.ref(source);
	insert.set(data);
	insert.once('value', function(snapshot){
		if(callback)
		callback(snapshot.key);
	});
	
};
updateMessage = (data, callback) =>{
	var source = 'chat_messages/'+data.msgDateTime;
	var insert = database.ref(source);
	insert.update(data);
};
messageCount = (from, to, callback) =>{
	database.ref('chat_messages').once('value', function(snapshot){
		var messages = snapshot.val();
		
	});
};
function attachMessages(){
	/*setInterval(function(){ 
		database.ref('chat_contacts').once('value', function(snapshot){
			console.log('Updating Contact Status.');
			var profileData = snapshot.val();
			updateContactStatus(profileData);
		});
	
	}, 3000);*/
	database.ref('chat_messages').on('child_added', function(snapshot){
		if(snapshot.val()){
			var currentUser = auth.currentUser;
			var uid = currentUser.uid;
			var message = snapshot.val();
			if((message.from === uid || message.to === uid) || message.info === 1){
				tharak.insertMessages(message, function(){
					loadContactChat(message);
					showContactChat4(message);
				});
			}else if(message.info === 1){
				dispatchGroup(message);
			}else{
				//database.ref('chat_messages').child(snapshot.key).set(null);
			}
		}
	});
	database.ref('chat_messages').on("child_changed", function(snapshot) {
		if(snapshot.val()){
			var message = snapshot.val();
			if(message.status === 1){
				tharak.insertMessages(message, function(){
					console.log('Updated');
				});
			}
		}
		//console.log(snapshot.key)
		/*tharak.removeMessages({msgDateTime: snapshot.key}, function(){
			
		});*/
		
	});
	database.ref('chat_messages').on("child_removed", function(snapshot) {
		if(snapshot.val()){
			tharak.removeMessages({msgDateTime: snapshot.key}, function(){
			
			});
		}
	});
}
function removeMsgs(id){
	database.ref('chat_messages').child(id).set(null);
}