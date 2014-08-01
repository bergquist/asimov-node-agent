module.exports = function(server, config) {
	var deployUnits = [ {
		name: 'Website',
		version: '1.0.0',
		branch: 'product',
		info: 'Hello from node agent',
		actions: [ 'Start', 'Stop', 'Verify' ]
	}, {
		name: 'Workers',
		version: '1.0.0',
		branch: 'master',
		info: 'I work in batches!',
		actions: [ 'Start', 'Stop', 'Verify' ]
	},
	{
		name: 'Puppet',
		version: '1.0.0',
		branch: 'master',
		info: 'I work in batches!',
		actions: [ 'Start', 'Stop', 'Puppet apply' ]
	}
]

	server.get('/units/list', function(req, res) {
		var deployUnits= [];

		var onComplete = function() {
			res.json(deployUnits); 
		};

		var keys = Object.keys(config.units);
		var tasksToGo = keys.length;
		if (tasksToGo === 0) {
			onComplete();
		} 
		else {
			config.units.forEach(function(unit, index) {
				var currentUnit = server.deployUnits.getUnitByName(unit.type);
				currentUnit = new currentUnit(server,unit.name);
				var deployunitInfo =  currentUnit.getDeployUnitInfo(function(result) {
					
					deployUnits.push(result);
					if (--tasksToGo === 0) {
					// No tasks left, good to go
						onComplete();
					}
				});
			});
		}			
	});

	server.get('/units/deploy-parameters/:unitName', function(req, res) {
		var params = server.config.getDeployParameters(req.params.unitName);
		res.json(params);
	});


}