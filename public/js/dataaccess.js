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
inqMessages = (id, callback) =>{
	if(!isAttached){
		var ref = database.ref('chat_messages');
		ref.on("child_added", function(snapshot){
			if(snapshot.val()){
				var message = snapshot.val();
				tharak.insertMessages(message);
				//showContactChat3();
				/*if(message.from === id || message.to === id){
					callback(message);
				}*/
			}
		});
		isAttached = true;
	}
	var deleteRef = ref.once("child_removed");
	
};
fetchMessages = (id, callback) =>{
	  var crits = [];
	  crits.push({name: 'from', value: id});
	  crits.push({name: 'to', value: id});
	var promises = crits.map(function(item) {
		return database.ref('chat_messages').orderByChild(item.name).equalTo(item.value).once("value");
	});
	Promise.all(promises).then(function(snapshots) {
		var messages = [];
	  snapshots.forEach(function(snapshot) {
		if(snapshot.val())
		for (const [key, value] of Object.entries(snapshot.val())) {
			messages.push(value);
		}
	  });
	 
		callback(messages);
	});
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
	database.ref('chat_messages').on('child_added', function(snapshot){
		if(snapshot.val()){
			var currentUser = auth.currentUser;
			var uid = currentUser.uid;
			var message = snapshot.val();
			if(message.from === uid || message.to === uid){
				tharak.insertMessages(message, function(){
					loadContactChat(message);
					showContactChat4(message);
				});
			}else{
				database.ref('chat_messages').child(snapshot.key).set(null);
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
}
