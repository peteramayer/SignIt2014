function DBMaintainance () {

	var path = require('path'),
		db = {};
	
	//var NeDB = require('nedb');
  	//db.signatures = new NeDB({ filename: path.join(__dirname + '/../data/signatures'), autoload: true });

  	var MongoDB = require('mongodb').MongoClient;
  	db.signatures = null;

	
	function init ( ) {
		MongoDB.connect('mongodb://127.0.0.1:27017/signatures', function (err,mdb) {
			if (err) throw err;
			db.signatures = mdb.collection('signatures');
			console.log("DBMaintainance inited.");
			command();
		});
	}

	function command () {
		db.signatures.find().toArray( function (err,doc) {
			if (err) throw err;
			console.log("DB Maintenence.");
			console.log(doc);
			process.exit();
		});
	}

	function clearAll () {
		db.signatures.remove(function (err,doc) {
			if (err) throw err;
			console.log("DB Maintenence. Removing:");
			console.log(doc.name);
			process.exit();
		});
	}

	init();
}
DBMaintainance();
