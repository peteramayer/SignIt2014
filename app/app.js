var express = require('express'),
	app = express(),
	pubsub = require('./backend/pubsub.js'),
	topics = require('./backend/topics.js'),
	config = require('./backend/config.js'),
	Datastore = require('./backend/Datastore.node.js');
	TwitterStream = require('./backend/TwitterStream.node.js'),
	RenderPic = require('./backend/RenderPic.node.js');

process.on('uncaughtException', function (exception) {
   console.log("\n\n ------ Error ------");
   console.log(exception);
   console.log("------ Error ------ \n\n");
});

app.set('view engine', 'ejs');
app.engine('.html', require('ejs').__express);

Datastore.init();
TwitterStream.init();
RenderPic.init();

app.get('/', function (req, res) {
	Datastore.getSignatures( function (signatures) {
		res.render('index.html', { 
			onesig: '',			
			sigcount: (signatures.length + 56),
			signatures: signatures,
			trackerURL: config.settings.trackerURL,
			tweetmessage: TwitterStream.getSignItMessage(),
			shareurl: config.settings.publicURL, 
			shareimage: config.settings.publicURL+'static/img/share.jpg', 
			signtitle: 'Sign the Declaration of Independence with Twitter',
			signdesc: 'Sign the Declaration of Independence with Twitter'
		} );
	});
});

app.get('/signed/:uid', function (req, res) {
	var _signame = req.params.uid.replace(/[^a-zA-Z0-9_]/gi,'');
	Datastore.getOneSignature( _signame, function (onesig) {
		if ( !!onesig ) {
			Datastore.getSignatures( function (signatures) {
				res.render('index.html', { 
					onesig: _signame,
					sigcount: (signatures.length + 56),
					signatures: signatures,
					trackerURL: config.settings.trackerURL,
					tweetmessage: TwitterStream.getSignItMessage(),
					shareurl: config.settings.publicURL+'signed/'+_signame, 
					shareimage: config.settings.publicURL+'static/savedsignatures/'+_signame+'.jpg', 
					signtitle: '@'+_signame+' signed the Declaration of Independence with Twitter.',
					signdesc: 'I just signed the Declaration of Independence alongside those who stood up for freedom. Add your name, too.'
				});
			});
		} else {
			console.log(onesig, _signame);
			res.redirect(302,'/');
		}
	})
});

app.get('/updatedsignatures/:latesttime', function (req, res) {
	if ( !!req.params && !!req.params.latesttime ) {
		Datastore.findNewSignatures( req.params.latesttime, function (err, data) {
			if ( !!err ) {
				res.send( '' );
			} else {
				res.send( data );
			}
		});
	} else {
		res.send( '' );
	}
});

app.get('/renderedimage/:yourname', function (req, res) {
	if ( !!req.params && !!req.params.yourname ) {
		if ( req.params.yourname.length < 19 ) {

/* remove for prod 
			var _d = new Date();
			var _did = ''+_d.getFullYear()+('0'+(_d.getMonth()+1)).slice(-2)+('0'+_d.getDay()).slice(-2);

			pubsub.publish( topics.IMG_REQUEST_RENDER, { 
				replyto: _name, 
				id: _did, 
				callback: function ( imagepath ) {
					
				}
			});
/* */

			var _name = req.params.yourname.replace(/[^a-zA-Z0-9_\s]/gi);
			Datastore.getOneSignature( _name, function (onesig) {
				if ( !!onesig ) {
					res.redirect(301, RenderPic.imageSaveWebRoot+_name+'.jpg');
				} else {
					res.status(404).send('');
				}
			});

		} else {
			res.send( 412, { error:'twitter handle too long' } );
		}
	} else {
		res.send( 412, { error:'incorrect image params' } );
		console.log( req.params );
	}
});

app.listen(3000);
