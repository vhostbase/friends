class JSStorage
{
	constructor() {
		self = this;
		this.jsstoreCon = new JsStore.Connection(new Worker("jsstore/jsstore.worker.js"));
	}

	async insert(table, crit, data, callback){
		try {
			this.remove(table, crit, data, true, async function(table, rowsDeleted){
				try{
					var select = {
						into: table,
						values: [data]
					};
					var noOfDataInserted = await this.jsstoreCon.insert(select);
					if (noOfDataInserted > 0 && callback) {
						callback();
					}
				}catch(err){
					console.log(table+" :: "+err.message);
				}
			}.bind(this, table));

		} catch (ex) {
			console.log(table+" :: "+err.message);
		}
	}

	async remove(table, crit, data, ignore, callback){
		var rowsDeleted = 0;
		try{
		var select = { from: table };
		if(crit)
			select.where = crit;
			rowsDeleted = await this.jsstoreCon.remove(select);
			if((ignore || rowsDeleted > 0) && callback)
				callback(rowsDeleted);
		}catch(err){
			console.log(table+" :: "+err.message);
			callback(rowsDeleted);
		}
	}
	async initDb(tableList) {
		var isDbCreated;
		try{
			var	dbase = {
					name: 'mydb2',
					tables: tableList
				};
			isDbCreated = await this.jsstoreCon.initDb(dbase);
		}catch(error){
			console.log(error);
		}
		if (isDbCreated) {
			console.log('db created');
		}
		else {
			console.log('db opened');
		}

	}
	async query(table, crit, callback){
		try{
		var select = { from: table };
		if(crit && crit.where)
			select.where = crit.where;
		if(crit && crit.join)
			select.join = crit.join;
		if(crit && crit.order)
			select.order = crit.order;
		var results = await this.jsstoreCon.select(select);
		callback({
			length : results.length,
			item : function(idx){
				return results[idx];
			}
		});
		}catch(err){
			console.log(table+" :: "+err.message);
			callback({
				length : 0
			});
		}
	}
	
}