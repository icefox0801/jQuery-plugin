requirejs.config({
	paths: {
		'jquery': '/lib/jquery-1.10.2',
		'plugin': '/src/plugin'
	}
});

require(['plugin','jquery'], function(plugin, $){
	plugin.initConfig({
		ajax: true,
		debug: false
	});
});