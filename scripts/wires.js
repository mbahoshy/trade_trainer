		var stage = new Kinetic.Stage({
			container: 'canvas',
			width: 590,
			height: 600
		});

		var layer = new Kinetic.Layer();


		red = new Kinetic.Line({
			id : 'test',
			name: 'wireclick',
			points: [10, 0, 2, 2, 4, 1],
			stroke: red,
			strokeWidth: 20,
			lineCap: 'round',
			lineJoin: 'round',
			opacity:0
		});
				
		layer.add(red);
		stage.add(layer);