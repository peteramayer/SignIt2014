var runtestfor = 100;
function test () {
	if ( runtestfor-- ) {
		var href = $('li.usersig a')[ Math.floor( $('li.usersig a').length * Math.random() ) ];
		var obj = window.open( href, "_blank" );
		setTimeout(function () { 
			obj.close();
			test();
		}, 500);
	}
}
test();