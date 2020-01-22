var isDebug = false;
/*if(!isDebug){
	var config = {
		apiKey: "AIzaSyD7Xp9dGNT2D7jMBopG9dN3nuL4BcFNX_g",
		authDomain: "friendship-d566b.firebaseapp.com",
		databaseURL: "https://friendship-d566b.firebaseio.com/",
		storageBucket: "friendship-d566b.appspot.com"
	  };
  firebase.initializeApp(config);
}else{
	localStorage.setItem("userName", '9573725222');
	firebase = {
		auth : ()=>{ 
				return{
					//currentUser : {uid: 'dIezZlxv04fSmBLp7hJYUNQ7jwd2'},
					currentUser : {uid: 'BZULnlnZvISaWQKzymk8NapFYJD3'},
					signInWithEmailAndPassword : (user, pass)=>{
							var promise1 = new Promise(function(resolve, reject) {
							  resolve('Success!');
							});
							return promise1;
						}
					}
				},
		database : () =>{
			return {
				ref : (id)=>{
					if('chat_contacts' === id){
						return {
								once : (eventId, callback)=>{
									callback({val : ()=>{return chat_contacts}});
								}
							};
					}else if('chat_messages' === id){
						return {
							on : (eventId, callback)=>{
								callback({val : ()=>{return chat_messages}});
							}
						};
					}
				}
			}
		}
	}
}*/
var auth = firebase.auth();
var loadContacts, addProfile, clearContacts, showContactPanel, loadChatContacts, loadGroupContacts, showRegister;
let initAuth = () => {
	tharak.addPostShow('contactPanel');
	tharak.addPostShow('chgProfile');
	tharak.addPostShow('newGrpPanel');
	tharak.addPostShow('allContactsPanel');
	tharak.addPostShow('createGroupPanel');
	tharak.addPostShow('chatbody');
	tharak.addPostShow('chatImgbody');
	tharak.addPostShow('mainDiv');
	tharak.addPostShow('chatads');
	//block_screen();
	var register = localStorage.getItem("is_registration");
	var userName = localStorage.getItem("userName");
	if(!userName){
		if(!register){
			localStorage.setItem("is_registration", "y");
			if(showRegister)
				showRegister();
		}else{
			var path = tharak.getCurrentPath();
			if(path.indexOf('register/index.html') === -1){
				if(showRegister)
					showRegister();
			}
		}
		//unblock_screen();
		return;
	}
	auth.signInWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(function(response){
		console.log( "Logged in successfully." );
		if(register){
			localStorage.removeItem("is_registration");
			showChangeProfile();
		}else{
			loadSelfProfile();
		}
		unblock_screen();
	}).catch(function(error) {
		if(error.code == "auth/user-not-found"){
			localStorage.removeItem("userName");
			showRegister();
		}
	});
};

function loadSelfProfile(){
	block_screen();
	var currentUser = auth.currentUser;
	inqContacts((profileData)=>{
		loadContactData(profileData, currentUser);
	});
}

function loadContactData(profileData, currentUser){
	if(clearContacts)
		clearContacts();
	if(showContactPanel)
		showContactPanel();
	var lastContact;
	/*if(loadContacts){
		loadContacts({name:'New Group', event: 'onclick="createGroup();"'});
		loadContacts({name:'New Contact'});
	}*/
	for (const [key, value] of Object.entries(profileData)) {
		if(currentUser.uid === key){
			if(addProfile)
				addProfile(value);
			continue;
		}
		/*if(loadContacts){
			loadContacts(value);
			lastContact = value;
		}*/
		tharak.insertContact(value);
		if(loadGroupContacts)
			loadGroupContacts(value);
	}
	unblock_screen();
	attachMessages();
}