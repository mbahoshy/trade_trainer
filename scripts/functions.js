
/* CONTACT CLICK HANDLER */

	function contactClickHandler () {
		cid = $(this).attr('id');
		mode = multiMeter1.mode;


		p = (level1.pset).getElementsByTagName(cid)[0].getAttributeNode(mode).nodeValue;
		d = (level1.pset).getElementsByTagName(cid)[0].getAttributeNode("Device").nodeValue;

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

	function meterClickHandler () {
		mid = $(this).attr('id');
		multiMeter1.mode = mid;
		multiMeter1.clearMeter();
		$('#unit').html(mid);
		$('.v_active').removeClass('v_active');
		$(this).addClass('v_active');

	}
	
	/* LOAD XML FUNCTION */
	function loadXMLDoc(dname) {		
		if (window.XMLHttpRequest)
		  {
		  xhttp=new XMLHttpRequest();
		  }
		else
		  {
		  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
		  }
		xhttp.open("GET",dname,false);
		xhttp.send();
		return xhttp.responseXML;
		
		
	} 		
		
	/* LOAD XML DOC */	
	xmlDoc=loadXMLDoc("xml/variables.xml");
