class Storage extends JSStorage
{
	constructor() {
		super();
		self = this;
		let tables = [];
		let CHAT_MESSAGES = {
			name: 'CHAT_MESSAGES',
			columns: {
				id: {
					primaryKey: true,
					autoIncrement: true
				},
				from: {
					notNull: false,
					dataType: 'string'
				},
				to: {
					notNull: false,
					dataType: 'string'
				},
				type: {
					notNull: true,
					dataType: 'string'
				},
				deletedBy:{
					notNull: false,
					dataType: 'array'
				},
				messageText: {
					dataType: 'string',
					notNull: true
				},
				msgDateTime: {
					dataType: 'number',
					notNull: true
				},
				viewStatus: {
					dataType: 'number',
					notNull: true
				},
				mediaData:{
					dataType: 'string',
					notNull: false
				},
				info: {
					dataType: 'number',
					notNull: false
				}
			}
		};
		tables.push(CHAT_MESSAGES);
		let CHAT_CONTACTS = {
			name: 'CHAT_CONTACTS',
			columns: {
				id: {
					primaryKey: true,
					dataType: 'string'
				},
				lastSeen: {
					notNull: true,
					dataType: 'string'
				},
				name: {
					dataType: 'string'
				},
				number: {
					notNull: true,
					dataType: 'string'
				},
				pic: {
					dataType: 'string',
					notNull: false
				},
				picFile: {
					dataType: 'string',
					notNull: false
				},				
				members: {
					dataType: 'string',
					notNull: false
				}
			}
		};
		tables.push(CHAT_CONTACTS);
		let CHAT_IMAGES = {
			name: 'CHAT_IMAGES',
			columns: {
				id: {
					primaryKey: true,
					dataType: 'string'
				},
				imgType : {
					dataType: 'string'
				},
				imgData: {
					notNull: true,
					dataType: 'string'
				},
				fileName: {
					notNull: false,
					dataType: 'string'
				}
			}
		};
		tables.push(CHAT_IMAGES);
		this.initDb(tables);
	}

	insertMessages(data, callback){
		var crit = {msgDateTime : parseInt(data.msgDateTime)};
		this.insert('CHAT_MESSAGES', crit, data, callback);
	}
	removeMessages(data, callback){
		var crit = {msgDateTime : parseInt(data.msgDateTime)};
		this.remove('CHAT_MESSAGES', crit, data, false, callback);
	}

	getMessages(crit, callback){
		this.query('CHAT_MESSAGES', crit, callback);
	}
	insertContact(data, callback){
		var crit = {id : data.id};
		this.insert('CHAT_CONTACTS', crit, data, callback);
	}
	removeContact(data, callback){
		var crit = {id : data.id};
		this.remove('CHAT_CONTACTS', crit, data, false, callback);
	}
	getAllContacts(crit, callback){
		this.query('CHAT_CONTACTS', crit, callback);
	}
	insertImage(data, callback){
		var crit = {id : data.id};
		this.insert('IMAGE_STORE', crit, data, callback);
	}
	removeImage(data, callback){
		var crit = {id : data.id};
		this.remove('IMAGE_STORE', crit, data, false, callback);
	}
	getImage(crit, callback){
		this.query('IMAGE_STORE', crit, callback);
	}
}