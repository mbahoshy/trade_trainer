
var HVAC = (function () {
			var level1;
			var multiMeter1;
			var stage;
			var layer;

			this.Create = function (width, height) {
				level1 = new Level();
				var $html = $("<div id='canvas'><div id='mycanvas'></div></div>");
				$('#level_container').append($html);
				$('#canvas').css({'width': width, 'height': height});
				$('#canvas').on('click', '.contact', contactClickHandler);
				
				multiMeter1 = new MultiMeter();
				$('.v_button').click(meterClickHandler);

				stage = new Kinetic.Stage({
					container: 'mycanvas',
					width: width,
					height: height
				});

				layer = new Kinetic.Layer();
			}

			this.DrawWire = function (wid, color, width, sarray){
				argLength = arguments.length;
				alert(argLength);

				wid = new Kinetic.Line({
					id: wid,
					points: sarray,
					stroke: color,
					strokeWidth: width,
					lineCap: 'round',
					lineJoin: 'round'
				});

				wid.on('click', function () { multiMeter1.Amps(this.getId());});

				layer.add(wid);
				stage.add(layer);

			}

			this.Contact = function (id, left, top) {
				var $html = $("<div id='" + id + "' class='contact'	></div>");
				$('#canvas').append($html);
				$('#' + id).css({'top': top, 'left': left});
			}


			this.SPSTSwitch = function (id1, id2, left, top, newswitch) {

				this.tmp_current_set = '';

				this.create = function (id1, id2, left, top, newswitch) {
					var $html = $("<div style='top:" + top + "px;left:" + left + "px' class='spstswitch'><div class='switch'></div><div id='" + id1 + "' class='contact'></div><div id='" + id2 + "' class='contact'></div></div>");
					$('#canvas').append($html);
					var that = this;
					$('.switch').on('click', function(){
						that.switch(newswitch);
					});
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


				}

				this.create(id1, id2, left, top, newswitch);
			}
			
			function Level () {
				this.current_problem = "problem_01";
				this.current_set = "switch";
			}

			function MultiMeter () {
				this.odd = true;

				this.p0 = '';
				this.p1 = '';

				this.d0 = '';
				this.d1 = '';
				this.mode='Volts';

				this.create = function () {
					var $html = $("<div id='multimeter'><div id='v_screen'><span id='answer'></span> <span id='unit'>Volts</span></div><div id='Volts' class='v_button active_mm'>Volts</div><div id='Ohms' class='v_button'>Ohms</div><div id='Amps' class='v_button'>Amps</div><div id='Ferads' class='v_button'>Ferads</div></div>");
					$('body').append($html);
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
					
					else if ((p0=='gon' && p1=='l1') || (p0=='l1' && p1=='gon')){
						txt.innerHTML = "120";	
					}
					
					else if ((p0=='gon' && p1=='l2') || (p0=='l2' && p1=='gon')){
						txt.innerHTML = "120";	
					}
					
					else if ((p0=='gon' && p1=='24h') || (p0=='24h' && p1=='gon')){
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
				$('.v_active').removeClass('v_active');
				$(this).addClass('v_active');

			}

			return this;
			
			
	})();


/*

Dependencies: jQuery, KineticJS
Reserved classes: contact
Reserved id's: level_containter, canvas
Reserved variables: HVAC

*/