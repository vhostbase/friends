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
	removeAuthUser(){
		if(snapshot.key === currentUser.uid){
			auth.signOut().then(function() {
				currentUser.delete().then(function() {
					localStorage.removeItem("userName");
					localStorage.removeItem("userId");
					location.reload();
				}).catch(function(error) {
				  console.log(error);
				});
			}).catch(function(error) {
				console.log(error);
			});
		}
	}
	fillContacts(){
		console.log('fill Contacts attached');
		var strUrl = 'chat_contacts';
		this.database.ref(strUrl).on('child_added', function(snapshot){
			if(snapshot.val()){
				var profileData = snapshot.val();
				storage.insertContact(profileData);
				if(app.getCurrentForm().id==='chgProfile'){
					app.getCurrentForm().loadProfile(profileData);
				}
			}
		});
		this.database.ref(strUrl).on('child_changed', function(snapshot){
			var profileData = snapshot.val();
			storage.insertContact(profileData);
			return;
		});
		this.database.ref(strUrl).on('child_removed', function(snapshot){
			console.log('Contact deleted');
			if(snapshot.val()){
				var profileData = snapshot.val();				
				var currentUser = auth.currentUser;
				storage.removeContact({id: snapshot.key});
				storage.removeImage({id: snapshot.key});			
				if(snapshot.key === currentUser.uid){
					Utility.deleteImage(profileData.picFile);
					auth.signOut().then(function() {
						currentUser.delete().then(function() {
							localStorage.removeItem("userName");
							localStorage.removeItem("userId");
							location.reload();
						}).catch(function(error) {
						  console.log(error);
						});
					}).catch(function(error) {
						console.log(error);
					});
				}
			}
		});
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
	inqContacts(callback, id){
		var strUrl = 'chat_contacts';
		if(id){
			strUrl += "/"+id;
		}
		this.database.ref(strUrl).once('value', function(snapshot){
			var profileData = snapshot.val();
			callback(profileData);
		});
	}
	updateContacts(data){
		var source = 'chat_contacts/'+data.id;
		var insert = this.database.ref(source);
		insert.update(data);
	}

	insertMessage(data, callback){
		var user = firebase.auth().currentUser;
		var source = 'chat_messages/'+data.msgDateTime;
		var insert = this.database.ref(source);
		delete data.id;
		insert.set(data);
		insert.once('value', function(snapshot){
			if(callback)
			callback(snapshot.key);
		});	
	}
	updateMessage(data, callback){
		delete data.id;
		var source = 'chat_messages/'+data.msgDateTime;
		var insert = this.database.ref(source);
		insert.update(data);
	}
	removeMessage(data, callback){
		var updData = {};
		delete data.id;
		var source = 'chat_messages/'+data.msgDateTime;
		var insert = this.database.ref(source);
		insert.update(updData);
	}
	fillMessages(target){
		console.log('fill Messages attached');
		this.database.ref('chat_messages').on('child_added', function(snapshot){
			if(snapshot.val()){
				var uid = Utility.getCurrentUserId();
				var message = snapshot.val();
				if(((message.from && message.from === uid) || (message.to && message.to === uid))){
					delete message.id;
					storage.insertMessages(message);
				}
			}
		}.bind(target));
		this.database.ref('chat_messages').on("child_changed", function(snapshot) {
			if(snapshot.val()){
				var message = snapshot.val();
				storage.insertMessages(message);
			}
		}.bind(target));
		this.database.ref('chat_messages').on("child_removed", function(snapshot) {
			console.log('deleted');
			var message = snapshot.val();
			if(snapshot.val()){
				storage.removeMessages({msgDateTime: snapshot.key});
			}
		});
	}
	
	appSignIn(userName, sucessCallback, failureCallback){
		var user = auth.currentUser;
		if(user){
			provider.fillContacts(this);
			sucessCallback(userName);
		}else{
			auth.signInWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(function(sucessCallback, result){
					localStorage.setItem("userId", result.user.uid);
					provider.fillContacts(this);
					sucessCallback(userName);
				}.bind(this, sucessCallback)).catch(function(failureCallback, error) {
				console.log(error)
				if(error.code == "auth/user-not-found"){
					localStorage.removeItem("userName");
					localStorage.removeItem("userId");
					failureCallback(error);
				}
			}.bind(this, failureCallback));
		}
	}
	insertImages(data){
		var source = 'chat_images/'+data.msgDateTime;
		var insert = this.database.ref(source);
		delete data.id;
		insert.set(data);
	}
	removeImages(data){
		var updData = {};
		delete data.id;
		var source = 'chat_images/'+data.msgDateTime;
		var insert = this.database.ref(source);
		insert.update(updData);
	}
	getImages(data, callback){
		var updData = {};
		delete data.id;
		var source = 'chat_images/'+data.msgDateTime;
		this.database.ref(source).once('child_added', function(snapshot){
			if(snapshot.val()){
				var message = snapshot.val();
				callback(message);
			}
		});
	}
}