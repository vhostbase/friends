var config = {
    apiKey: "AIzaSyD7Xp9dGNT2D7jMBopG9dN3nuL4BcFNX_g",
    authDomain: "friendship-d566b.firebaseapp.com",
    databaseURL: "https://friendship-d566b.firebaseio.com/",
    storageBucket: "friendship-d566b.appspot.com"
  };
  firebase.initializeApp(config);
var auth = firebase.auth();
var loadContacts, addProfile, clearContacts, showContactPanel;
let initAuth = () => {
	block_screen();
	var register = localStorage.getItem("is_registration");
	var userName = localStorage.getItem("userName");
	if(!userName){
		if(!register){
			localStorage.setItem("is_registration", "y");
			tharak.navigateUrl("../register/index.html");
		}else{
			var path = tharak.getCurrentPath();
			if(path.indexOf('register/index.html') === -1){
				tharak.navigateUrl("../register/index.html");
			}
		}
		unblock_screen();
		return;
	}
	auth.signInWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(function(response){
		console.log( "Logged in successfully." );
		localStorage.removeItem("is_registration");
		unblock_screen();
		loadSelfProfile();

	}).catch(function(error) {
		if(error.code == "auth/user-not-found"){
			localStorage.removeItem("userName");
			tharak.navigateUrl("../profile-pic/profile-page.html");
		}
	});
};

function loadSelfProfile(){
	block_screen();
	var currentUser = auth.currentUser;
	var database = firebase.database();
	database.ref('chat_contacts').once('value', function(snapshot){
		var profileData = snapshot.val();
		if(clearContacts)
			clearContacts();
		if(showContactPanel)
			showContactPanel();
		var lastContact;
		for (const [key, value] of Object.entries(profileData)) {
			if(currentUser.uid === key){
				if(addProfile)
					addProfile(value);
				continue;
			}
			if(loadContacts !== undefined){
				loadContacts(value);
				lastContact = value;
			}
		}
		//showChat2(lastContact.pic, lastContact.name, lastContact.id);
		unblock_screen();
	});
}
