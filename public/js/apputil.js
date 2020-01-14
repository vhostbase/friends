let tharak = window;
let DATE_FORMAT='MMM DD, YYYY';
let TIME_FORMAT='hh:mm A';
let LAST_SEEN_FORMAT='mm:ss';
$( document ).ready(function() {
	//tharak.db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
	initAuth();	
});

block_screen = () =>{
	//if(!isDebug)
		//$('.modal').modal('show');
};

unblock_screen = () =>{
	//if(!isDebug)
	//$('.modal').modal('hide');
};
tharak.navigateUrl = (url) =>{
	tharak.location.href = url;
};
tharak.getCurrentPath = () =>{
	return tharak.location.pathname;
};
tharak.uuid =() =>{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
tharak.addPostShow =(elementId) =>{
  var options = {root: document.documentElement}
  var observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
		if(entry.intersectionRatio > 0){
			var callback = window[elementId+'Show'];
			if(callback)
				callback();
		}
    });
  }, options);

  observer.observe($('#'+elementId)[0]);
};
tharak.getDatabase=()=>{
	let dbase;
	try{
		dbase = openDatabase('mydb1', '1.0', 'Test DB', 2 * 1024 * 1024);
	}catch(err){

		console.log(err);
	}
	return dbase;
}
tharak.insertMessages =(data, callback) =>{
	let db = tharak.getDatabase();
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS CHAT_MESSAGES(fromAddr, toAddr, msgType, messageText, msgDateTime, status)');
		tx.executeSql('DELETE FROM CHAT_MESSAGES WHERE msgDateTime='+data.msgDateTime);
		tx.executeSql('INSERT INTO CHAT_MESSAGES(fromAddr,toAddr,msgType, messageText, msgDateTime, status) VALUES ("'+data.from+'","'+data.to+'","'+data.type+'","'+data.messageText+'",'+data.msgDateTime+','+data.status+' )', [], callback);
	},function errorCB(tx, err) {
		console.log(tx);
	});
};
tharak.removeMessages =(data, callback) =>{
	let db = tharak.getDatabase();
	db.transaction(function (tx) {
		tx.executeSql('DELETE FROM CHAT_MESSAGES WHERE msgDateTime='+data.msgDateTime, [], function(status){
			callback(data);
		});
	},function errorCB(tx, err) {
		console.log(tx);
	});
};

tharak.getCount =(from, to, crit, callback) =>{
	let db = tharak.getDatabase();
	let query = 'SELECT COUNT(*) FROM CHAT_MESSAGES WHERE ((fromAddr="'+from+'" and toAddr="'+to+'") OR(toAddr="'+from+'" and fromAddr="'+to+'"))';
	if(crit){
		query +=' and '+crit;
	}
	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, results) {
			if(results.rows.length > 0)
				callback(results);
		});
	},function errorCB(tx, err) {
		console.log(tx);
	});
};
tharak.getMessages =(from, to, crit, callback) =>{
	let db = tharak.getDatabase();
	let query = 'SELECT * FROM CHAT_MESSAGES WHERE ((fromAddr="'+from+'" and toAddr="'+to+'") OR(toAddr="'+from+'" and fromAddr="'+to+'"))';
	if(crit){
		query +=' and '+crit;
	}
	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, results) {
			if(results.rows.length > 0)
				callback(results);
		});
	},function errorCB(tx, err) {
		console.log(tx);
	});
};
tharak.insertContact =(data) =>{
	let db = tharak.getDatabase();
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS CHAT_CONTACTS(id, lastSeen, name, number, pic)');
		tx.executeSql('DELETE FROM CHAT_CONTACTS WHERE id="'+data.id+'"');
		tx.executeSql('INSERT INTO CHAT_CONTACTS(id, lastSeen, name, number, pic) VALUES ("'+data.id+'","'+data.lastSeen+'","'+data.name+'","'+data.number+'","'+data.pic+'" )');
	},function errorCB(tx, err) {
		console.log(tx);
	});
};

tharak.getContact =(message, crit, callback) =>{
	let db = tharak.getDatabase();
	let query = 'SELECT * FROM CHAT_CONTACTS WHERE ((id="'+message.to+'") OR(id="'+message.from+'"))';
	if(crit){
		query +=' and '+crit;
	}
	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, results) {
			if(results.rows.length > 0)
				callback(results);
		});
	},function errorCB(tx, err) {
		console.log(tx);
	});
};