(function() {

	var pointer, pointerX = 0, pointerY = 0,
		frequencySpan, noteSpan,
		playing = false,
		audioContext, jsNode, theremin;

	function animate() {

		var y = (pointerY - 50);
		var x = (pointerX - 50);

		var transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
		pointer.style.transform = transform;
		pointer.style.webkitTransform = transform;

		if(playing) {
			updateDisplay();
		}
	}

	function updateDisplay() {
		frequencySpan.innerHTML = zeroPad(Math.round(theremin.frequency), 4) + ' Hz';
		noteSpan.innerHTML = frequencyToNote(theremin.frequency);

	}

	function zeroPad(v, num_digits) {
		var s = String(v);
		if(s.length < num_digits) {
			var dif = num_digits - s.length;
			for(var i = 0; i < dif; i++) {
				s = '<span class="inactive">0</span>' + s;
			}
		}
		return s;
	}

	function frequencyToNote(f) {
		return MIDIUtils.noteNumberToName(MIDIUtils.frequencyToNoteNumber(f));
	}


	function init() {

		pointer = document.getElementById('pointer');
		frequencySpan = document.querySelector('#frequency span');
		noteSpan = document.getElementById('note');

//		window.addEventListener('mousemove', function(e) {
//			moveTo(e.clientX, e.clientY);
//		}, false);

//		window.addEventListener('touchmove', function(e) {
//			var touch = e.touches[0];
//			moveTo(touch.clientX, touch.clientY);
//		}, false);

		var divToggle = document.getElementById('toggle'),
			spanToggle = document.querySelector('#toggle span'),
			on_msg = 'Turn it <strong>ON</strong>',
			off_msg = 'Turn it <strong>OFF</strong>';

		divToggle.addEventListener('click', function(e) {

			playing = !theremin.togglePlaying();

			if(playing) {
				controls.className = 'inactive';
				spanToggle.innerHTML = on_msg;
				pointer.className = 'inactive';
			} else {
				controls.className = 'active';
				spanToggle.innerHTML = off_msg;
				pointer.className = 'active';
			}

			playing = !playing;
		}, false);

		divToggle.style.opacity = 1;
		spanToggle.innerHTML = on_msg;

		initAudio();

		updateDisplay();

		animate();
                var evtSrc = new EventSource("http://46.101.168.163:5111/v1/simulator/stream"); // "/v1/simulator/stream");
                evtSrc.onmessage = new_data_from_sensor;

	}

	var sensorX = 0;
	var sensorY = 0;
	var max_sensor6 = 1000;
	var max_sensor4 = 1000;
	var min_sensor6 = 1000;
	var min_sensor4 = 1000;

	var window_size = 60;


	function new_data_from_sensor(e)
	{
	   var jsonData = JSON.parse(e.data);
	   var sensor3 = jsonData.values[0].value.measurments.sensor3;
	   var sensor4 = jsonData.values[0].value.measurments.sensor4;
	   var sensor5 = jsonData.values[0].value.measurments.sensor5;
	   var sensor6 = jsonData.values[0].value.measurments.sensor6;


	   sensorX = ((sensor4 - sensor3) / max_sensor4 ) * (window.innerWidth / 2) + (window.innerWidth / 2);
	   sensorY = ((sensor5 - sensor6) / max_sensor6 ) * (window.innerHeight / 2) + (window.innerHeight / 2);
	   console.log('sensor3: ' + sensor3);
	   console.log('sensor4: ' + sensor4);
	   console.log('sensor5: ' + sensor5);
	   console.log('sensor6: ' + sensor6);

	   console.log('sensorX: ' + sensorX);
	   console.log('sensorY: ' + sensorY);

	  theremin.setPitchBend( sensorX / window.innerWidth );
    theremin.setVolume( 1 - sensorY / window.innerHeight );
    animate();
}


	function moveTo(sensorX, sensorY) {
		pointerX = sensorX;
		pointerY = sensorY;
		theremin.setPitchBend( x / window.innerWidth );
		//theremin.setVolume( 1 - y / window.innerHeight );
                theremin.setVolume( y / window.innerHeight );
		animate();
	}

	function initAudio() {
		audioContext = new AudioContext();
		theremin = new Theremin(audioContext);
		theremin.connect( audioContext.destination );
	}

	window.onload = function() {

		if(AudioDetector.detects(['webAudioSupport'])) {
			init();
		}
	};

}());
