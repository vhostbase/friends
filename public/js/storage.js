class Storage
{
	constructor() {
		self = this;
	}
	getDatabase(){
		let dbase;
		try{
			dbase = openDatabase('mydb1', '1.0', 'Test DB', 2 * 1024 * 1024);
		}catch(err){

			console.log(err);
		}
		return dbase;
	}
	insertMessages(data, callback){
		let db = Storage.prototype.getDatabase();
		db.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS CHAT_MESSAGES(fromAddr, toAddr, msgType, messageText, msgDateTime, status, info)');
			tx.executeSql('DELETE FROM CHAT_MESSAGES WHERE msgDateTime='+data.msgDateTime);
			tx.executeSql('INSERT INTO CHAT_MESSAGES(fromAddr,toAddr,msgType, messageText, msgDateTime, status, info) VALUES ("'+data.from+'","'+data.to+'","'+data.type+'","'+data.messageText+'",'+data.msgDateTime+','+data.viewStatus+', '+data.info+' )', [], callback);
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
	removeMessages(data, callback){
		let db = Storage.prototype.getDatabase();
		db.transaction(function (tx) {
			tx.executeSql('DELETE FROM CHAT_MESSAGES WHERE msgDateTime='+data.msgDateTime, [], function(status){
				callback(data);
			});
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
	removeContact(data, callback){
		let db = Storage.prototype.getDatabase();
		db.transaction(function (tx) {
			tx.executeSql('DELETE FROM CHAT_CONTACTS WHERE id='+data.id, [], function(status){
				callback(data);
			});
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
	getCount(from, to, crit, callback){
		let db = Storage.prototype.getDatabase();
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
	}
	getMessages(from, to, crit, callback){
		let db = Storage.prototype.getDatabase();
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
	}
	getContactMessages(from, to, crit, callback){
		let db = Storage.prototype.getDatabase();
		let query = 'SELECT CC.name name,CM.fromAddr fromAddr, CM.toAddr toAddr, CM.msgType msgType, CM.messageText messageText, CM.msgDateTime msgDateTime, CM.status status, CM.info info FROM CHAT_MESSAGES CM LEFT JOIN CHAT_CONTACTS CC ON (CM.fromAddr = CC.id OR CM.toaddr = CC.id) WHERE CM.toAddr IN("'+from+'", "'+to+'") and CM.fromAddr IN("'+from+'", "'+to+'") AND CM.info = 0';
		if(crit){
			query +=' and '+crit;
		}
		db.transaction(function (tx) {
			tx.executeSql(query, [], function (tx, results) {
				if(results.rows.length > 0)
					callback(results.rows);
			});
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
	getGroupMessages(from, to, crit, callback){
		let db = Storage.prototype.getDatabase();
		let query = 'SELECT CC.name name,CM.fromAddr fromAddr, CM.toAddr toAddr, CM.msgType msgType, CM.messageText messageText, CM.msgDateTime msgDateTime, CM.status status, CM.info info FROM CHAT_MESSAGES CM LEFT JOIN CHAT_CONTACTS CC ON (CC.id = CM.fromAddr) WHERE CM.toaddr = "'+to+'"';
		if(crit){
			query +=' and '+crit;
		}
		db.transaction(function (tx) {
			tx.executeSql(query, [], function (tx, results) {
				if(results.rows.length > 0)
					callback(results.rows);
			});
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
	insertContact(data){
		let db = Storage.prototype.getDatabase();
		db.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS CHAT_CONTACTS(id, lastSeen, name, number, pic, members)');
			tx.executeSql('DELETE FROM CHAT_CONTACTS WHERE id="undefined"');
			tx.executeSql('DELETE FROM CHAT_CONTACTS WHERE id="'+data.id+'"');
			var currentUser = auth.currentUser;
			var uid = currentUser.uid;
			if(data.members){
				if(data.members.indexOf(uid) > -1)
					tx.executeSql('INSERT INTO CHAT_CONTACTS(id, lastSeen, name, number, pic, members) VALUES ("'+data.id+'","'+data.lastSeen+'","'+data.name+'","'+data.number+'","'+data.pic+'", "'+data.members+'" )');
			}else{
				tx.executeSql('INSERT INTO CHAT_CONTACTS(id, lastSeen, name, number, pic) VALUES ("'+data.id+'","'+data.lastSeen+'","'+data.name+'","'+data.number+'","'+data.pic+'")');
			}		
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
	getContact(message, crit, callback){
		let db = Storage.prototype.getDatabase();
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
	}
	convertToIn(list){
		var data = "(";
		var idx=0;
		list.forEach((item)=>{
			if(idx > 0)
				data = data.concat(',');
			data = data.concat('"').concat(item).concat('"');
			idx++;
		});
		data = data.concat(')');
		return data;
	}
	getContactByCrit(crit, callback){
		let db = Storage.prototype.getDatabase();
		let query = 'SELECT * FROM CHAT_CONTACTS ';
		if(crit)
			query +=crit;
		db.transaction(function (tx) {
			tx.executeSql(query, [], function (tx, results) {
				if(results.rows.length > 0)
					callback(results.rows);
			});
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
	getContactByNotInCrit(list, crit, callback){
		let db = Storage.prototype.getDatabase();
		let query = 'SELECT * FROM CHAT_CONTACTS';
		if(crit)
			query +=crit;
		else{
			if(list){
				if(Array.isArray(list)){
					if(list.length > 1)
						query +=' WHERE id NOT IN'+this.convertToIn(list);
					else if(list.length === 1)
						query +=' WHERE id !="'+list[0]+'"';
				}else{
					query +=' WHERE id !="'+list+'"';
				}
			}
		}
		db.transaction(function (tx) {
			tx.executeSql(query, [], function (tx, results) {
				if(results.rows.length > 0)
					callback(results);
			});
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
	getAllContacts(crit, callback){
		let db = Storage.prototype.getDatabase();
		let query = 'SELECT * FROM CHAT_CONTACTS';
		if(crit){
			query +=' where '+crit;
		}
		db.transaction(function (tx) {
			tx.executeSql(query, [], function (tx, results) {
				if(results.rows.length > 0)
					callback(results.rows);
			});
		},function errorCB(tx, err) {
			console.log(tx);
		});
	}
}