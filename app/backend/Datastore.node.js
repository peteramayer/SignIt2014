function Datastore () {

	var path = require('path'),
		pubsub = require('./pubsub.js'),
		topics = require('./topics.js'),
		config = require('./config.js'),
		db = {};

  	var MongoDB = require('mongodb').MongoClient;
  	db.signatures = null;

	
	function init ( ) {
		MongoDB.connect('mongodb://127.0.0.1:27017/signatures', function (err,mdb) {
			if (err) throw err;
			db.signatures = mdb.collection('signatures');
			pubsub.subscribe( topics.TWT_PIC_POSTED, onNewPicPosted );
			pubsub.subscribe( topics.TWT_DELETE, onRemoveSignature );
			console.log("Datastore inited.");
		});
	}

	function onNewPicPosted (topic, data) {
		if ( !!data.replyto && !!data.id ) {
			console.log("New Pick Posted. Add Sig.");
			addSignature( data.replyto, data.id, data.trackid );
		}	
	}

	function onRemoveSignature ( topic, data ) {
		db.signatures.remove({ id_str: data.id_str }, function (err,numremoved) {
			console.log("Tweets removed: " + numremoved);
		});
	}

	function addSignature ( name, tweetback, trackid ) {
		if ( !!name && !!tweetback && name != config.settings.targetHandle ) {
			db.signatures.find({ name: "@"+name }).toArray( function (err, docs) {
				if (err) throw err;
				console.log("Add Sig: ", docs);
				if ( docs.length === 0 || config.settings.allowMultiple ) {
					if ( (name[0]) !== "@" ) {
						name = "@"+name;
					}
					db.signatures.insert({ 
						name: name, 
						tweetback: "https://twitter.com/"+config.settings.targetHandle+"/status/"+tweetback, 
						id_str: tweetback,
						type: "signature", 
						trackid: trackid,
						time: Date.now() 
					}, function (err, newDoc) {
						if (err) throw err;
						console.log("Signature record added: " + name);
						getSignatures();
					});
				}
			});
		}
	}

	function getSignatures ( callback ) {
		db.signatures.find({ type: 'signature' }).sort({time:-1}).toArray(function (err, docs) {
			if (err) throw err;
			if ( !!callback ) {
				callback( docs );
			}
		});
	}

	function findNewSignatures ( latesttime, callback ) {
		var _time = parseInt( latesttime.replace(/[^0-9]/gi,''), 10 );
		if ( !!_time ) {
			db.signatures.find({ time: { $gt: _time } }).sort( {time:-1} ).limit(10).toArray(function (err, docs) {
				if (err) throw err;
				callback( err, docs );
			});
		}
	}

	function getOneSignature ( signame, callback ) {
		var _signame = signame.replace(/[^a-zA-Z0-9_\s]/gi,'');
		db.signatures.findOne({ name: '@'+_signame }, function (err, docs) {
			callback( docs );
		});
	}

	Datastore.prototype.addSignature = addSignature;
	Datastore.prototype.getSignatures = getSignatures;
	Datastore.prototype.getOneSignature = getOneSignature;
	Datastore.prototype.findNewSignatures = findNewSignatures;
	Datastore.prototype.init = init;

}

Datastore.instance = null;
Datastore.getInstance = function(){
    if(this.instance === null){
        this.instance = new Datastore();
    }
    return this.instance;
}

module.exports = Datastore.getInstance();
