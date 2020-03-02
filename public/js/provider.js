class Provider
{
	constructor() {
		if(!this.isInit){
			var config = {
				apiKey: "AIzaSyD7Xp9dGNT2D7jMBopG9dN3nuL4BcFNX_g",
				authDomain: "friendship-d566b.firebaseapp.com",
				databaseURL: "https://friendship-d566b.firebaseio.com/",
				storageBucket: "friendship-d566b.appspot.com"
			  };
			firebase.initializeApp(config);
			this.database = firebase.database();
			this.isInit = true;
			this.auth = firebase.auth();
		}
	}
	attachContacts(target){
		console.log('Contacts attached');
		var strUrl = 'chat_contacts';
		this.database.ref(strUrl).on('child_added', function(snapshot){
			if(snapshot.val()){
				var profileData = snapshot.val();
				target.loadUserContacts(profileData);
				return;
			}
		}.bind(target));
		this.database.ref(strUrl).on('child_changed', function(snapshot){
			var profileData = snapshot.val();
			target.loadUserContacts(profileData);
			return;
		}.bind(target));
		this.database.ref(strUrl).on('child_removed', function(snapshot){
			console.log('Contact deleted');
			if(snapshot.val()){
				var profileData = snapshot.val();				
				var currentUser = auth.currentUser;
				storage.removeContact({id: snapshot.key});
				if(snapshot.key === currentUser.uid){
					auth.signOut().then(function() {
						currentUser.delete().then(function() {
							localStorage.removeItem("userName");
							location.reload();
						}).catch(function(error) {
						  console.log(error);
						});
					}).catch(function(error) {
						console.log(error);
					});
				}
			}
		}.bind(target));
	}
	updateContact(path, data, callback){
		var source = 'chat_contacts/';
		if(path)
			source += path;
		var insert = this.database.ref(source);
		insert.update(data);
		insert.once('value', function(snapshot){
			if(callback)
			callback(snapshot.key);
		});	
	}
	inqContacts = (callback, id)=>{
		var strUrl = 'chat_contacts';
		if(id){
			strUrl += "/"+id;
		}
		this.database.ref(strUrl).once('value', function(snapshot){
			var profileData = snapshot.val();
			callback(profileData);
		});
	}
	updateContacts =(data) =>{
		var source = 'chat_contacts/'+data.id;
		var insert = this.database.ref(source);
		insert.update(data);
	}

	insertMessage = (data, callback) =>{
		var source = 'chat_messages/'+data.msgDateTime;
		var insert = this.database.ref(source);
		insert.set(data);
		insert.once('value', function(snapshot){
			if(callback)
			callback(snapshot.key);
		});	
	}
	updateMessage = (data, callback) =>{
		var source = 'chat_messages/'+data.msgDateTime;
		var insert = this.database.ref(source);
		insert.update(data);
	}
	messageCount = (from, to, callback) =>{
		this.database.ref('chat_messages').once('value', function(snapshot){
			var messages = snapshot.val();
			
		});
	}
	attachMessages(target){
		this.database.ref('chat_messages').on('child_added', function(snapshot){
			if(snapshot.val()){
				var uid = Utility.getCurrentUserId();
				var message = snapshot.val();
				if((message.from === uid || message.to === uid) || message.info === 1){
					storage.insertMessages(message, function(){
						target.loadContactChat(message);
						if(message.status === 1)
							message.status = 2;
						this.updateMessage(message);
					}.bind(this));
				}else if(message.info === 1){
				}else{
					//database.ref('chat_messages').child(snapshot.key).set(null);
				}
			}
		}.bind(this));
		this.database.ref('chat_messages').on("child_changed", function(snapshot) {
			if(snapshot.val()){
				var message = snapshot.val();
				/*storage.insertMessages(message, function(){
					console.log('Updated');
				});*/
			}
			//console.log(snapshot.key)
			/*tharak.removeMessages({msgDateTime: snapshot.key}, function(){
				
			});*/
			
		});
		this.database.ref('chat_messages').on("child_removed", function(snapshot) {
			console.log('deleted');
			if(snapshot.val()){
				storage.removeMessages({msgDateTime: snapshot.key}, function(){
				
				});
			}
		});	
	}
}