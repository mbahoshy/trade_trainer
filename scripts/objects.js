
var HVAC = (function () {
			var level1;
			var multiMeter1;
			var stage;
			var layer;

			this.Create = function (width, height) {
				var styles = ["float:right"];
				level1 = new Level();
				multiMeter1 = new MultiMeter();
				var $html = $("<div style='float:right;'><div id='canvas'><div id='mycanvas'></div></div></div>");
				$('#level_container').append($html);
				$('#canvas').css({'width': width, 'height': height});
				$('#canvas').on('click', '.contact, .neutral, .l1, .l2, .contact-small', contactClickHandler);
				
				$('.multimeter_button').click(meterClickHandler);

				stage = new Kinetic.Stage({
					container: 'mycanvas',
					width: width,
					height: height
				});

				layer = new Kinetic.Layer();
			}

			this.LightBulb = function (id, cid, cid2, left, top) {		
				
				var canvas;
				var rrcanvas;
				var context;
				var bottom;
				var resistor;
				var grd;
				
				$(this).on('reset.LightBulb', resetLightBulb); //assign reset event
				
				//creates light bulb html and appends
				(function (){
					var $html = $("<div class='light-bulb' id='" + id + "' style='position:absolute;top:" + top + "px;left:" + left + "px'><canvas style='position:absolute' width=96 height=180 id='" + id + "_lcanvas'></canvas><canvas style='position:absolute' width=96 height=180 id='" + id + "_rescanvas'></canvas><div style='top:151px;left:0px' id = '" + cid + "' class='contact'></div><div style='top:151px;right:0px' id='" + cid2 + "'class='contact'></div></div>");
					$('#canvas').append($html);
				})();
				
				//draws light bulb
				(function () {
					canvas = document.getElementById(id + '_lcanvas');
					rrcanvas = document.getElementById(id + '_rescanvas');

					context = canvas.getContext('2d');
					bottom = canvas.getContext('2d');
					
					resistor = rrcanvas.getContext('2d');

					// begin custom shape
					bottom.beginPath();

					bottom.moveTo(28, 150);
					
					bottom.lineTo(28, 150);
					bottom.bezierCurveTo(28, 180, 68, 180, 68, 150);
					bottom.closePath();
					bottom.lineWidth = 3;
					bottom.strokeStyle = 'blue';
					bottom.fillStyle = 'blue';
					bottom.fill();
					bottom.stroke();

					
					
					resistor.beginPath();

					resistor.moveTo(42, 150);
					resistor.lineTo(42, 110);
					resistor.lineTo(27, 70);

					resistor.lineTo(30, 66);
					resistor.lineTo(36, 74);
					resistor.lineTo(42, 66);
					resistor.lineTo(48, 74);
					resistor.lineTo(54, 66);
					resistor.lineTo(60, 74);
					resistor.lineTo(66, 66);
					resistor.lineTo(69, 70);
		
				

					resistor.lineTo(69, 70);
					resistor.lineTo(53, 110);
					resistor.lineTo(53, 150);

					// complete custom shape
					resistor.closePath();
					resistor.lineWidth = 1;
					resistor.strokeStyle = 'blue';
					resistor.stroke();
					

					context.beginPath();

					context.moveTo(28, 150);
					context.lineTo(28, 125);
					context.bezierCurveTo(-72, -30, 168, -30, 68, 125);
					context.lineTo(68, 150);
					
					// complete custom shape
					context.closePath();
						grd = context.createRadialGradient(48, 70, 10, 48, 70, 30);
					  // light blue
						grd.addColorStop(0, '#FFFFFF');
					  // dark blue
						grd.addColorStop(1, '#F0FF5A');
					context.lineWidth = 3;
					context.strokeStyle = 'blue';
					context.stroke();
				})();
				
				//checks to see if light is on or off
				function resetLightBulb () {
					var on = problem_set[level1.current_problem][level1.current_set][id].on;
					if (on === false) {
						context.fillStyle = '#FFFFFF';
     					context.fill();
     					context.stroke();

     					
					} else if (on === true) {
     					context.fillStyle = grd;
     					context.fill();
     					context.stroke();
					}
				}
				
				resetLightBulb ();

			}

			this.DrawWire = function (wid, color, width, sarray){
				$(this).on('reset.DrawWire', resetDrawWire);
				
				function resetDrawWire () {
					var lines = stage.get('.selected');
					lines.each(function (line) {
						line.setName('linehover');
						line.on('mouseout', wire_mouseout);
						line.fire('mouseout');
					});
				}
				
				function wire_mouseover() {
					this.setOpacity(.6);
					layer.draw();
				}
				function wire_mouseout() {
					this.setOpacity(0);
					layer.draw();
				}

				var nsarray = $.map(sarray, function (x){return x + 15;});

				tmp = new Kinetic.Line({
					id: wid,
					points: nsarray,
					stroke: color,
					strokeWidth: width,
					lineCap: 'round',
					lineJoin: 'round'
				});

				wid = new Kinetic.Line({
					id: wid,
					name: 'linehover',
					points: nsarray,
					stroke: 'red',
					strokeWidth: 20,
					lineCap: 'round',
					lineJoin: 'round',
					opacity:0
				});
				
				

				wid.on('click', function () {
					var lines = stage.get('.selected');
					multiMeter1.clearMeter();
					lines.each(function (line) {
						if (line.getId() != wid.getId() ) {
							alert(line.getId());
							line.setName('linehover');
							line.on('mouseout', wire_mouseout);
							line.fire('mouseout');
						} else {

						}
					});
					wid.setName('selected');
					wid.off('mouseout');
					multiMeter1.Amps(this.getId());
					
				});
		
				wid.on('mouseover', wire_mouseover);
				wid.on('mouseout', wire_mouseout);

				layer.add(tmp);
				layer.add(wid);			
				stage.add(layer);

			}

			this.Contact = function (id, left, top) {
				var $html = $("<div id='" + id + "' class='contact'	></div>");
				$('#canvas').append($html);
				$('#' + id).css({'top': top, 'left': left});
			}

			this.ContactSmall = function (id, left, top) {
				var $html = $("<div id='" + id + "' class='contact-small'	></div>");
				$('#canvas').append($html);
				$('#' + id).css({'top': top, 'left': left});
			}

			this.Neutral = function (id, left, top) {
				var $html = $("<div id='" + id + "' class='neutral'	>N</div>");
				$('#canvas').append($html);
				$('#' + id).css({'top': top, 'left': left});
			}

			this.Line1 = function (id, left, top) {
				var $html = $("<div id='" + id + "' class='l1'	>L1</div>");
				$('#canvas').append($html);
				$('#' + id).css({'top': top, 'left': left});
			}

			this.Line2 = function (id, left, top) {
				var $html = $("<div id='" + id + "' class='l2'	>L2</div>");
				$('#canvas').append($html);
				$('#' + id).css({'top': top, 'left': left});
			}

			this.Relay = function (id, c0, c1, c2, c3, c4, left, top) {
				var $html = $("<div id ='" + id + "' class='relay'><canvas id='" + id + "_rcanvas' width=120 height=90></canvas><div id='" + c0 + "' style='top:5px;left:-5px' class='contact'></div><div id='" + c1 + "' style='top:5px;right:-5px' class='contact'></div><div id='" + c2 + "' style='top:40px;right:-5px' class='contact'></div><div id='" + c3 + "' style='top:90px;left:0px' class='contact-small-half'></div><div id='" + c4 + "' style='top:90px;right:0px' class='contact-small-half'></div></div>");
				$('#canvas').append($html);
				$('#' + id).css({'top': top, 'left': left});

				var canvas = document.getElementById(id + '_rcanvas');
				var context = canvas.getContext('2d');

				context.beginPath();
				context.moveTo(10, 18);
				context.lineTo(70, 18);

				context.moveTo(70, 8);
				context.lineTo(70, 28);

				context.moveTo(77, 8);
				context.lineTo(77, 28);

				context.moveTo(77, 18);
				context.lineTo(120, 18);

				context.moveTo(60, 18);
				context.lineTo(60, 55);
				context.lineTo(70, 55);

				context.moveTo(70, 45);
				context.lineTo(70, 65);

				context.moveTo(77, 45);
				context.lineTo(77, 65);

				context.moveTo(65, 63);
				context.lineTo(82, 47);

				context.moveTo(77, 55);
				context.lineTo(120, 55);
					  
				context.lineWidth = 2;
				context.strokeStyle = '#cfcfcf';
				context.stroke();

			}

			this.Transformer = function (id, c0, c1, c2, c3, left, top) {
				var $html = $("<div id='" + id + "' class='transformer'><div class='tr-left'><canvas id='" + id + "_trcanvas1' height=90 width=40 ></canvas><div id='" + c0 + "' style='top:0px;left:-15px' class='contact'></div><div id='" + c1 + "' style='bottom:0px;left:-15px' class='contact'></div></div><div class='tr-center'></div><div class='tr-right'><canvas id='" + id +"_trcanvas2' height=90 width=40></canvas><div style='top:5px;right:-10px;' id='" + c2 + "' class='contact-small'></div><div style='bottom:5px;right:-10px' id='" + c3 + "' class='contact-small'></div></div></div> ");
				$('#canvas').append($html);
				$('#' + id).css({'top': top, 'left': left});

				var canvas = document.getElementById(id + '_trcanvas1');
				var context = canvas.getContext('2d');

				context.beginPath();
				context.moveTo(0, 15);

				context.lineTo(21, 15);
				context.bezierCurveTo(36, 15, 36, 27, 21, 27);
				context.bezierCurveTo(36, 27, 36, 39, 21, 39);
				context.bezierCurveTo(36, 39, 36, 51, 21, 51);
				context.bezierCurveTo(36, 51, 36, 63, 21, 63);
				context.bezierCurveTo(36, 63, 36, 75, 21, 75);
				context.lineTo(0, 75);

				context.lineWidth = 2;
				context.strokeStyle = '#cfcfcf';
				context.stroke();

				var canvas2 = document.getElementById(id + '_trcanvas2');
				var context2 = canvas2.getContext('2d');

				context2.beginPath();
				context2.moveTo(40, 15);
				context2.lineTo(15, 15);
				context2.bezierCurveTo(6, 15, 6, 27, 15, 27);
				context2.bezierCurveTo(6, 27, 6, 39, 15, 39);
				context2.bezierCurveTo(6, 39, 6, 51, 15, 51);
				context2.bezierCurveTo(6, 51, 6, 63, 15, 63);
				context2.bezierCurveTo(6, 63, 6, 75, 15, 75);
				
				context2.lineTo(40, 75);

			

				context2.lineWidth = 2;
				context2.strokeStyle = '#cfcfcf';
				context2.stroke();
				//context.bezierCurveTo(-72, -30, 168, -30, 68, 125);
			}

			this.SPSTSwitch = function (id, c0, c1, left, top, newswitch) {

				this.tmp_current_set = ''; //keeps track of the current_set before the switch was hit
				
				function resetSPSTSwitch () {
					var on = problem_set[level1.current_problem][level1.current_set][id].on;
					if (on === false) {
						$('#' + id + ' > .switch').html("<div class='switch-off'><p>OFF</p></div>")
					} else if (on === true) {
						$('#' + id + ' > .switch').html("<div class='switch-on'><p>ON</p></div>")
					}	
				}
				
				$(this).on('reset.SPSTSwitch', resetSPSTSwitch);

				this.create = function (id, c0, c1, left, top, newswitch) {

					var $html = $("<div style='top:" + top + "px;left:" + left + "px' id = '" + id + "' class='spstswitch'><div class='switch'></div><div id='" + c0 + "' class='contact' style='top:0px;left:-10px'></div><div id='" + c1 + "' class='contact' style='top:91px;right:-10px;'></div></div>");
					$('#canvas').append($html);
					var that = this;
					$("#" + id).on('click', '.switch', function(){that.switch(newswitch);}); //assigns click event for newly created switch
				}


				this.switch = function (set1) {

					if (level1.current_set == set1 ) {
						level1.current_set = this.tmp_current_set;
						//level1.setPset();
						multiMeter1.clearMeter();
					} else {
						this.tmp_current_set = level1.current_set;
						level1.current_set = set1;
						//level1.setPset();
						multiMeter1.clearMeter();
					}
					
					$('#canvas').trigger('reset');

				}

				this.create(id, c0, c1, left, top, newswitch);
				
				resetSPSTSwitch ();
			}

			this.Set = function (problem, set) {
					level1.current_problem = problem;
					level1.current_set = set;
			}

			this.Heater = function (id, c0, c1, left, top) {
				var setint;
				
				//create html and append
				(function() {
					var $html = $("<div style='top:" + top + "px;left:" + left + "px' id='" + id + "' class='heater'><canvas id='" + id + "_hcanvas' width=220 height=50 id='" + id + "canvas'></canvas><div style='top:10px;left:-10px' id='" + c0 + "' class='contact'></div><div style='top:10px;right:-10px' id ='" + c1 + "' class='contact'></div></div>");
					$('#canvas').append($html);
				})();
				
				function glow () {
					$('#' + id + ' > .heater-on').fadeIn(2500);
					$('#' + id + ' > .heater-on').fadeOut(2500);
					console.log($('#' + id));
				}
				
				function resetHeater () {
					
					var on = problem_set[level1.current_problem][level1.current_set][id].on;
					if (on === false) {
						//$('#' + id + '_hon').removeClass('heater-on');
						
						clearInterval (setint);
						$('#' + id + '_hon').remove();
						//$('#' + id + ' > .heater-on').css("display:none");
						
						
					} else if (on === true) {
							$('#' + id + '_hon').remove();
							$('#' + id).prepend("<div id='" + id + "_hon' class='heater-on'></div>");
						
						glow();
						setint = setInterval(function(){glow()}, 5000);					
					}
				
				}
							
				$(this).on('reset.Heater', resetHeater); //sets reset event to object
		
				//draw resistor
				(function () {
					var canvas = document.getElementById(id + '_hcanvas');
					var context = canvas.getContext('2d');

					context.beginPath();
					context.moveTo(0, 25);
					context.lineTo(25, 25);

					context.lineTo(30, 38);
					context.lineTo(40, 12);
					context.lineTo(50, 38);
					context.lineTo(60, 12);
					context.lineTo(70, 38);
					context.lineTo(80, 12);
					context.lineTo(90, 38);
					context.lineTo(100, 12);
					context.lineTo(110, 38);
					context.lineTo(120, 12);
					context.lineTo(130, 38);
					context.lineTo(140, 12);
					context.lineTo(150, 38);
					context.lineTo(160, 12);
					context.lineTo(170, 38);
					context.lineTo(180, 12);
					context.lineTo(190, 38);
					context.lineTo(195, 25);
					context.lineTo(220, 25);

					context.lineWidth = 3;
					context.strokeStyle = '#585858';
					context.stroke();
				})();
		
				resetHeater();
			}

			
			function Level () {
				this.current_problem = "";
				this.current_set = "";
			}


			function MultiMeter () {
				this.odd = true;

				this.p0 = '';
				this.p1 = '';

				this.d0 = '';
				this.d1 = '';
				this.mode='Volts';

				this.create = function () {
					var $html = $("<div id='multimeter'><div id='multimeter_screen'><span id='answer'></span> <span id='unit'>Volts</span></div><div><div id='Volts' class='fleft multimeter_button multimeter_active'>Volts</div><div id='Ohms' class='fright multimeter_button'>Ohms</div></div><div><div id='Amps' class='fleft multimeter_button'>Amps</div><div id='Ferads' class='fright multimeter_button'>Ferads</div></div></div>");
					$('#level_container').append($html);
				}

				this.Volts = function () {
					var txt = document.getElementById("answer");
					p0 = multiMeter1.p0;
					p1 = multiMeter1.p1;


					if ((p0=='l1' && p1=='l2') || (p0=='l2' && p1=='l1')){
						txt.innerHTML = "240";	
					}

					else if (p0=='l1' && p1=='l1'){
						txt.innerHTML = "0";	
					}
					
					else if (p0=='l2' && p1=='l2'){
						txt.innerHTML = "0";	
					}

					else if ((p0=='24h' && p1=='24c') || (p0=='24c' && p1=='24h')){
						txt.innerHTML = "24";	
					}

					else if (p0=='24c' && p1=='24c'){
						txt.innerHTML = "0";	
					}
					
					else if (p0=='24h' && p1=='24h'){
						txt.innerHTML = "0";	
					}		
					
					else if ((p0=='g' && p1=='l1') || (p0=='l1' && p1=='g')){
						txt.innerHTML = "120";	
					}
					
					else if ((p0=='g' && p1=='l2') || (p0=='l2' && p1=='g')){
						txt.innerHTML = "120";	
					}
					
					else if ((p0=='g' && p1=='24h') || (p0=='24h' && p1=='g')){
						txt.innerHTML = "24";	
					}
					
					else {
						txt.innerHTML = "0";
					}
				}

					/* CHECK OHMS */
				this.Ohms = function() {
					var txt = document.getElementById("answer");
					p0 = multiMeter1.p0;
					p1 = multiMeter1.p1;

					d0 = multiMeter1.d0;
					d1 = multiMeter1.d1;

					if (d0==d1 && d0 !== '' && d1 !== '') {
						txt.innerHTML = +p0 + +p1;	
					} else {
						txt.innerHTML = "OL";
					}
					if ((d0 == 'none') || (d1 == 'none')) {
						txt.innerHTML = "OL";
					}
				}

				this.Ferads = function () {
					p0 = multiMeter1.p0;
					p1 = multiMeter1.p1;
					var txt = document.getElementById("answer");

					if (p0=='mfd_com' && isNaN(p1)==false){
							txt.innerHTML = p1;	
					} else if (isNaN(p0)==false && p1=='mfd_com'){
							txt.innerHTML = p0;	
					} else {
							txt.innerHTML = '';	
					}
				}

				this.Amps = function (wid) {
					if (multiMeter1.mode === 'Amps') {
						var txt = document.getElementById("answer");
						txt.innerHTML = problem_set[level1.current_problem][level1.current_set][wid].Amps;
					}
				}

				this.clearMeter = function () {
					var txt = document.getElementById("answer");
					txt.innerHTML = '';	
					multiMeter1.p0 = '';
					multiMeter1.p1 = '';
					multiMeter1.d0 = '';
					multiMeter1.d1 = '';
					$('.border-black').removeClass('border-black');
					$('.border-red').removeClass('border-red');
				}

				this.create();

			}


			// CONTACT CLICK HANDLER 
			function contactClickHandler () {
				$('#canvas').trigger('reset.DrawWire');
				cid = $(this).attr('id');
				mode = multiMeter1.mode;

				p = problem_set[level1.current_problem][level1.current_set][cid][mode];
				d = problem_set[level1.current_problem][level1.current_set][cid].Device;

				if (multiMeter1.odd==true) {
					$('.border-red').removeClass('border-red');
					$("#" + cid).addClass('border-red');
					multiMeter1.p0 = p;
					multiMeter1.d0 = d;
					multiMeter1.odd = false;
				} else {
					$('.border-black').removeClass('border-black');
					$("#" + cid).addClass('border-black');
					multiMeter1.p1 = p;
					multiMeter1.d1 = d;
					multiMeter1.odd = true;
				}
				
				multiMeter1[mode]();
			}

			// METER CLICK HANDLER
			function meterClickHandler () {
				mid = $(this).attr('id');
				multiMeter1.mode = mid;
				multiMeter1.clearMeter();
				$('#unit').html(mid);
				$('.multimeter_active').removeClass('multimeter_active');
				$(this).addClass('multimeter_active');

			}

			return this;
			
			
	})();


/*

Dependencies: jQuery, KineticJS
Reserved classes: contact
Reserved id's: level_containter, canvas
Reserved variables: HVAC

*/
