(function(){
	var data = [];
	var audio = new Audio();
	var currentSong = null;
	var currentIndex = -1;
	var format = null;
	var elements = {
		time: null,
		range: null,
		duration: null,
		mute: null,
	}
	
	function init(containerId, list){
		if(!containerId || !list)
			return new Error('container ID and list data are required!');
		
		data = list;
		console.log(data);
		var container = document.getElementById(containerId);
		
		var content = document.createElement('div');
		content.classList.add('row');
		var column1 = document.createElement('div');
		column1.classList.add('col-xs-11');
		var column2 = document.createElement('div');
		column2.classList.add('col-xs-1');
		
		var player = document.createElement('div');
		player.classList.add('row', 'player');
		
		var previousBtn = _composePlayerBtn('glyphicon-fast-backward', previus);
		var playBtn = _composePlayerBtn('glyphicon-play', _playBtnClick);
		var nextBtn = _composePlayerBtn('glyphicon-fast-forward', next);
		
		playBtn.classList.add('text-center');
		nextBtn.classList.add('text-right');
		
		player.appendChild(previousBtn);
		player.appendChild(playBtn);
		player.appendChild(nextBtn);
		
		column1.appendChild(player);
		column1.appendChild(_composeSlider());
		
		column2.appendChild(_composeVolume());
		
		content.appendChild(column1);
		content.appendChild(column2);
		
		container.appendChild(content)
		
		audio.addEventListener('durationchange', _durationchange);
		audio.addEventListener('timeupdate', _timeupdate);

		// for (var i = 0; i < data.length; i++) {
		// 	var ul = document.getElementById('listSong')
		// 	var li = document.createElement('li');
		// 	var p = document.createElement('p');
		// 	var pContent = document.createTextNode(list[i].name);

		// 	ul.appendChild(li);
		// 	li.appendChild(p);
		// 	p.appendChild(pContent);

		// 	li.addEventListener('click',function() {
		// 		_load(i);
		// 		play();
		// 	});

		// }		


		var ul = document.getElementById('listSong');
		data.forEach(function(song , index) {

			var li = document.createElement('li');
			var p = document.createElement('p');
			var pContent = document.createTextNode(song.name);
            
			ul.appendChild(li);
			li.appendChild(p);
			p.appendChild(pContent);

			li.addEventListener('click',function() {
				_load(index);
				play();
			});

		});

	}
	
	function _composePlayerBtn(iconClass, callback){
		var div = document.createElement('div');
		div.classList.add('col-xs-4');
		
		var icon = document.createElement('span');
		icon.classList.add('glyphicon', iconClass);
		icon.addEventListener('click', callback);
		
		div.appendChild(icon);
		return div;
	}
	
	function _composeSlider(){
		var slider = document.createElement('div');
		slider.classList.add('row', 'controls');
		
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');
		var div4 = document.createElement('div');
		var div5 = document.createElement('div');
		div1.classList.add('col-xs-1');
		div2.classList.add('col-xs-1');
		div3.classList.add('col-xs-8', 'text-center');
		div5.classList.add('col-xs-1', 'text-right');
		div4.classList.add('col-xs-1');
		
		
		var time = document.createElement('span');
		time.innerText = '0:00';
		
		var range = document.createElement('input');
		range.setAttribute('type', 'range');
		range.setAttribute('min', 0);
		range.setAttribute('style', 'width: 100%;');
		range.addEventListener('change', function(){
			_setCurrentTime(range.value);
		});
		
		var duration = document.createElement('span');
		duration.innerText = '0:00';
		
		var muteIcon = document.createElement('span');
		muteIcon.classList.add('glyphicon', 'glyphicon-volume-up');
		muteIcon.addEventListener('click', _muteIconClick);
		
		div2.appendChild(time);
		div3.appendChild(range);
		div4.appendChild(duration);
		div5.appendChild(muteIcon);
		
		slider.appendChild(div1);
		slider.appendChild(div2);
		slider.appendChild(div3);
		slider.appendChild(div4);
		slider.appendChild(div5);
		
		elements.time = time;
		elements.range = range;
		elements.duration = duration;
		elements.mute = muteIcon;
		
		return slider;
	}
	
	function _muteIconClick(){
		elements.mute.classList.toggle('glyphicon-volume-off');
		elements.mute.classList.toggle('glyphicon-volume-up');
		mute();
	}
	
	function _composeVolume(){
		var volumeRange = document.createElement('input');
		volumeRange.setAttribute('type', 'range');
		volumeRange.setAttribute('value', audio.volume * 100);
		volumeRange.setAttribute('min', 0);
		volumeRange.setAttribute('max', 100);
		volumeRange.classList.add('vertical-range');
		
		volumeRange.addEventListener('change', function(){
			setVolume(volumeRange.value);
		});
		
		return volumeRange;
	}
	
	function _playBtnClick(event){
		var element = event.target;
		
		element.classList.toggle('glyphicon-play');
		element.classList.toggle('glyphicon-pause');
		
		if(audio.paused) play();
		else pause();
	}
	
	function _load(index){

		currentIndex = index;
		currentSong = data[index];
		
		_canPlay();
		console.log(currentSong, index);
		audio.src = currentSong.src[format];
       
	}
	
	function _durationchange(){
		elements.duration.innerText = _toMinutes(audio.duration);
		elements.range.setAttribute('max', audio.duration);
	}
	
	function _timeupdate(){
		elements.time.innerText = _toMinutes(audio.currentTime);
		elements.range.value = audio.currentTime;
	}
	
	function _toMinutes(time){
		if(isNaN(time)) return '0:0';
		
		time /= 60;
		time = time.toFixed(2);
		time += '';
		return time.replace('.', ':')
	}
	
	function _canPlay(){
		var canPlay = {
			mp3: audio.canPlayType('audio/mp3'),
			ogg: audio.canPlayType('audio/ogg'),
			wav: audio.canPlayType('audio/wav')
		};
		
		if(canPlay.mp3 !== '') return format = 'mp3';
		if(canPlay.ogg !== '') return format = 'ogg';
		if(canPlay.wav !== '') return format = 'wav';
	}
	
	function _setCurrentTime(time){
		audio.currentTime = time;
	}
	
	function play(){
		if(!currentSong) _load(0);
		audio.play();
	}
	
	function pause(){
		audio.pause();
	}
	
	function previus(){
		var previousIndex = currentIndex-1;
		if(previousIndex < 0 ) return false;
		_load(previousIndex);
		play();
	}
	
	function next(){
		var nextIndex = currentIndex+1;
		if(currentIndex >= data.length) return false;
		_load(nextIndex);
		play();
	}
	
	function mute(){
		audio.muted = !audio.muted;
	}
	
	function setVolume(volume){
		audio.volume = volume > 0 ? volume/100 : 0;
	}
	
	window.Player = {
		init: init,
		play: play,
		pause: pause,
		mute: mute
	};

})()