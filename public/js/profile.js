$('#profile-pic-input').change(function(event){
	var image = $('#profilePhoto');
	image[0].src = ''
	var reader = new FileReader();
	reader.onloadend = function() {
		 image[0].src = reader.result;
	}
	reader.readAsDataURL(event.target.files[0]);
});
function uploadPhoto(){
	$('#profile-pic-input').click();
}
function adjustFileds(){
	var contactName = $('#contact_name').val();
	if(contactName){
		$('#lbl_contact_name').text(contactName);
		$('#lbl_contact_name').show();
		$('#contact_name').hide();
		$('#contact_name').val(null);
	}
	var contactDesc = $('#contact_desc').val();
	if(contactDesc){
		$('#lbl_contact_desc').text(contactDesc);
		$('#lbl_contact_desc').show();
		$('#contact_desc').hide();
		$('#contact_desc').val(null);
	}
}
function doEditName(){
	$('#lbl_contact_name').hide();
	$('#contact_name').show();
	$('#contact_name').focus();
}
function doEditAbout(){
	$('#contact_desc').emoji({place: 'after'});
	$('#lbl_contact_desc').hide();
	$('#contact_desc').show();
	$('#contact_desc').focus();
}
$(document).on("click", "#mainDiv", function(){
	adjustFileds();
});
/*function doHome(){
	window.location.href="../chats/index.html";
}*/
function doChgRegister(){
	adjustFileds();
	var userName = localStorage.getItem("userName");
	var currentUser = firebase.auth().currentUser;
	console.log(currentUser);
	var database = firebase.database();
	var userData = {
		id: currentUser.uid,
		name: $('#lbl_contact_name').text(),
		number: userName,
		pic: "img/profile-img-new.PNG",
		lastSeen: "Apr 29 2018 17:58:02"
	};
	userData.pic = getProfilePhoto();
	database.ref('chat_contacts/'+currentUser.uid).set(userData, function(error) {
		if(error){
			console.log(error);
		}else{
			console.log('Update successful');
			doHome();
			//window.location.href="../home.html";
			//goToHome(currentUser.uid);
		}
	});

	
}

function getProfilePhoto(){
	var data = $('#profilePhoto').attr('src');
	if(data.indexOf("img/profile-img-new.PNG") > -1){
		data = getDefaultPhoto();
	}
	return data;
}
function addChgProfile(profileData){
	$('#profilePhoto').attr('src', profileData.pic);
	$('#lbl_contact_name').text(profileData.name);
	showProfilePanel2();
	//unblock_screen();
}
function showProfilePanel(){
	//block_screen();
	var database = firebase.database();
	var currentUser = firebase.auth().currentUser;
	database.ref('chat_contacts/'+currentUser.uid).once('value', function(snapshot){
		var profileData = snapshot.val();
		addChgProfile(profileData);
	});

}
function getGrpProfilePhoto(){
	var data = $('#groupPic').attr('src');
	if(data.indexOf("img/profile-img-new.PNG") > -1){
		data = getDefaultPhoto();
	}
	return data;
}
function getDefaultPhoto(){
	return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAwCAYAAABaHInAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALgSURBVGhD7ZqBbpswEIb3/i+5dV1KIZBkrTJK2tTji7BkscOcD4ctU076pArs8/1g7DunX3a7nfsfuQu7NbILq+rabcrKfS+e3bdN4b6O4Br3nvo2tJV85CCLsLpp3I/n8g8RGhBKX3xIvq0sEtb0wTwaBUngC5/SWKmYhRXVVgwuB0VViWOmYBKW8y1NwRjS2FqShfHhS4FcA8aSYtCQJGxNUR6rOLWwNabfFJZpqRJ2zYVCS+qCMiuM5VcaSEtRN267P7jm8NMV22W+UraCWWGWKfhQlG7/8urO57MbG9e4Rxupb4yUKRkVRjYgDRCDgLvTaZAxbbSxiNNmKFFhljSp7boh9Hlr3zrRRwxikmIdExUmJbEx+JZSjT6SrxhSrGMmhZF5S05jHNu3IVy90UfyFaNUVAWTwigrJKcxrCb5ikFZJMUcMinMkmVYTfIVQ5ONTApL/b7AapKvGMQmxRwyKUxyOEd3eh9C1Rt9JF9zSDGHZBXWHF6GcPVGH8nXHFLMIVmFseG+f3wMIc8bbS2bNEgxh2QVBpuq7tOmzyH0aaMNbSUfGqSYQ7IuHh4CjmUg3FsiatHikaOoJHgS3tfjr8tGzN9LBHkWLfeWDXotFm3QlpRqLRalVGD9zspmf5l2x7a9ZPAhXONe2dgXKCnWMVFhKWULlTLfUqrRh76ST4ksZYum0GQfsggaGz40e1qWQhNiRwOscFL5bzV8xVbNx164FKPErLCpw5zcorzFxGU9zAGOvsIBriXKmyTuKffxmyeckpYsPtU47PHjXe3A1MOOz5NcyxhLk2VIJAkDBuIARpPoWg3f7IVWUZAsDJgaPM2UEkVr+MS3ZfqFmIQBC8pD/0TJInK8PXzgi2/qr/3w52H55cmysRKU5Q3Sh774wFfKkh5jkTAP2YBPv5hGlPvUXFJN5q/Thrb0oa82o9CSRVgImbfm3yFoo8nSrWQX9q9wF3Zr3IXdFjv3G/EWPMFeJopvAAAAAElFTkSuQmCC";
}
/*
	{
		id: 1,
		name: "Programmers",
		members: [0, 1, 3],
		pic: "images/0923102932_aPRkoW.jpg"
	}
*/
function createGroupProfile(callback){
	//adjustFileds();
	var creatorId = $('#currentId').val();
	var memberList = [creatorId];
	var mems = $('.list-group-contacts').find('.cursor-class');
	for(var idx=0; idx<mems.length; idx++){
		var member = $(mems[idx]);
		var cid = member.find('#CID');
		memberList.push($(cid).text());
	}
	var userName = localStorage.getItem("userName");
	var database = firebase.database();
	var userData = {
		id: creatorId,
		name: $('#group_name').val(),
		number: userName,
		members : memberList,
		lastSeen: "Apr 29 2018 17:58:02"
	};
	
	userData.pic = getGrpProfilePhoto();
	
	var insert = database.ref('chat_contacts');
	var insertRef = insert.push();
	insert.once('value', function(snapshot){
		//console.log(snapshot.key);
		callback();
	});
	insertRef.set(userData);
}
function showRegister(){
	$('.fab').hide();
	$('#mainDiv').removeClass('d-none');
	$('#chatads').addClass('d-none');
}
function doEditMobile(){
	$('#lbl_contact_nbr').hide();
	$('#contact_nbr').show();
	$('#contact_nbr').focus();
}
function doRegister(){
	adjustContactNbr();
	var userName = $('#lbl_contact_nbr').text();
	auth.createUserWithEmailAndPassword(userName+'@gmail.com', 'Test@123').then(function(response){
		var currentUser = response.user;
	}).catch(function(error) {
		if(error.code === "auth/email-already-in-use"){
			$('#mainDiv').addClass('d-none');
			localStorage.setItem("userName", userName);
			initAuth();
		}
		console.log(error);
	});
	
}

$(document).on("click", "#mainDiv", function(){
	adjustContactNbr();
});
function adjustContactNbr(){
	var contactNbr = $('#contact_nbr').val();
	if(contactNbr){
		$('#lbl_contact_nbr').text(contactNbr);
		$('#lbl_contact_nbr').show();
		$('#contact_nbr').hide();
		$('#contact_nbr').val(null);
	}
}