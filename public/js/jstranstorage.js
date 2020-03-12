class JSTranStorage
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
						values: [data],
						return: true
					};
					var noOfDataInserted = await this.jsstoreCon.transaction({
						tables : [table],
						logic: async function(ctx) { // async is used to make code more clear
							start(); // start the transaction
							const insertedRecs = await ctx.insert(select);
						}					
					});
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
		rowsDeleted = await this.jsstoreCon.transaction({
			tables : [table],
			logic: async function(ctx) { // async is used to make code more clear
				start(); // start the transaction
				const deletedRecs = await ctx.remove(select);
			}					
		});
		if((ignore || rowsDeleted > 0) && callback)
			callback(rowsDeleted);
		}catch(err){
			console.log(table+" :: "+err.message);
			callback(rowsDeleted);
		}
	}
	async initDb(tableList) {
		this.tableList = tableList;
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
		let results = await this.jsstoreCon.transaction({
			tables : [select.from],
			logic: async function(ctx) { // async is used to make code more clear
				start(); // start the transaction
				const selectedRecs = await ctx.select(select);
			}					
		});
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