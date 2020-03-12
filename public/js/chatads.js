class chatads extends BaseClass
{
	postShow1(){
			var crit = {where : {viewStatus : 0 }};
			storage.getMessages(crit, function(results){
				for(var idx=0; idx<results.length; idx++){
					var messageData = results.item(idx);
					messageData.viewStatus = 1;
					provider.insertMessage(messageData);
				}
			}.bind(this));
	}
	postShow(){
		var userName = localStorage.getItem("userName");
		if(!userName){
			if(app.isAppOnline()){
				app.navigateTo(register, {});
			}else{
				alert('App must be Online.');
			}
		}else{
			provider.appSignIn(userName, this.authSuccessCallback);
			/*app.registerCallbacks(function(userName){
				auth.signInWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(this.authSuccessCallback.bind(this, userName)).catch(function(error) {
					console.log(error)
					if(error.code == "auth/user-not-found"){
						localStorage.removeItem("userName");
						localStorage.removeItem("userId");
						this.authErrorCallback(error);
					}
				}.bind(this));			
			}.bind(this, userName));*/
			//this.authSuccessCallback(userName);
		}
		
	}

	authSuccessCallback(userName, result){
		app.navigateTo(contactPanel, {'userName': userName});
	}
	authErrorCallback(error){
		console.log(error);
	}
}