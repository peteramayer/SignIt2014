(function() {
	var fs, path, request, twitter_update_with_media;
 
	fs = require('fs');
 
	path = require('path');
 
	request = require('request');
 
 
	twitter_update_with_media = (function() {
		function twitter_update_with_media(auth_settings) {
			this.auth_settings = {
				consumer_key: auth_settings.consumer_key,
				consumer_secret: auth_settings.consumer_secret,
				token: auth_settings.access_token_key,
				token_secret: auth_settings.access_token_secret
			}
			this.api_url = 'https://api.twitter.com/1.1/statuses/update_with_media.json';
		}
 
		twitter_update_with_media.prototype.post = function(statusObj, file_path, callback) {
			var form, r;
			r = request.post(this.api_url, {
				oauth: this.auth_settings
			}, callback);
			form = r.form();
			for ( var val in statusObj ) {
				if ( statusObj[val] !== undefined ) {
					form.append( val, statusObj[val] );
				}
			}
			if ( typeof file_path === "string" ) {
				return form.append('media[]', fs.createReadStream(path.normalize(file_path)));
			} else {
				return form.append('media[]', file_path );
			}
		};
 
		return twitter_update_with_media;
 
	})();
 
	module.exports = twitter_update_with_media;
 
}).call(this);