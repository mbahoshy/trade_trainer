	function Game () {
		level1 = new Level();
		var $html = $("<div id='canvas'></div>");
		$('#level_container').append($html);
		$('#canvas').on('click', '.contact', contactClickHandler);
		$('.v_button').click(meterClickHandler);
		multiMeter1 = new MultiMeter();

		/*
		var stage = new Kinetic.Stage({
			container: 'canvas',
			width: 590,
			height: 600
		});

		var layer = new Kinetic.Layer();
		*/
	}	


	function Level () {
		this.current_problem = "problem_01";
		this.current_set = "switch";

		//look into functional reactive programming
		this.setPset = function (){
			this.pset = this.proot.getElementsByTagName(this.current_set)[0];
		}

		this.root = xmlDoc.getElementsByTagName("problem_set")[0];
		this.proot = this.root.getElementsByTagName(this.current_problem)[0];
		this.pset = this.proot.getElementsByTagName(this.current_set)[0];

		this.cproot = '';
	}


	function Contact (id, left, top) {
		var $html = $("<div id='" + id + "' class='contact'	></div>");
		$('#canvas').append($html);
		$('#' + id).css({'top': top, 'left': left});
	}

	function Relay () {

	}

	function SPSTSwitch (id1, id2, left, top, newswitch) {

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
				level1.setPset();
				multiMeter1.clearMeter();
			} else {
				this.tmp_current_set = level1.current_set;
				level1.current_set = set1;
				level1.setPset();
				multiMeter1.clearMeter();
			}


		}

		this.create(id1, id2, left, top, newswitch);
	}

	function line (lid, points, color, stroke) {

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


			if (d0==d1) {
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