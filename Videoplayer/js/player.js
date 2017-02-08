(function(){
	
	window.onload = function(){
			
		var width = 900;
		var height = 675;

		var player = document.getElementsByClassName('player')[0];
		var video = document.getElementsByClassName('video')[0];
		var scale = document.getElementById('scale');
		var progress = document.getElementById('progress');
		var currenttimeSpan = document.getElementById('currenttime');
		var durationSpan = document.getElementById('duration');
		var volume = document.getElementById('volume');
		
		//filtersprop
		
		var saturate = 100, contrast = 100, brightness = 100, hueRotate = 0, sepia = 0;
		
		//buttons
		var play = document.getElementById('play');
		var music = document.getElementById('music');
		var controls = document.querySelector('.controls');
		var filters = document.querySelector('.filters');
		var filter;
		
		var inversion = false;
		
		var animationFrame;
		
		var durHours = parseInt(video.duration/3600);
		var durMinutes = parseInt(video.duration/60);
		var durSeconds = parseInt(video.duration%60);
		
		durationSpan.textContent = durHours +':'+ durMinutes +':'+ durSeconds;
		
		video.width = width;
		video.height = height;
		video.volume = 0.5;
		currenttimeSpan.textContent = '00:00:00';
		
		player.style.width = width + 'px';
		player.style.height = height + 'px';
		
		var calculateCurrentTime = function(){
		
			var hours = parseInt(video.currentTime/3600);
			var minutes = parseInt(video.currentTime/60);
			var seconds = parseInt(video.currentTime%60);
			
			return function(){
				(hours>9)?hours=hours:hours='0'+hours;
				(minutes>9)?minutes=minutes:minutes='0'+minutes;
				(seconds>9)?seconds=seconds:seconds='0'+seconds;
				
				return hours +':'+ minutes +':'+ seconds;
			}
			
		};
		
		//scale
		
		var progressbar = function(){
		
			progress.style.width = parseInt((video.currentTime/(video.duration/100))) + '%';
			
			currenttimeSpan.textContent = calculateCurrentTime()();
			
			if(!video.ended && !video.paused){
				requestAnimationFrame(progressbar);
			}else if(video.ended){
				play.style.backgroundImage = 'url(img/play.png)';
			}
			
		};
		
		//buttons
		
		player.addEventListener('click', function(e){
				e = e || window.event;
					
				if(e.target.id == 'video'){
					
					if(e.target.paused){
						e.target.play();
						progressbar();
						play.style.backgroundImage = 'url(img/play.png)';
					}else{
						e.target.pause();
						play.style.backgroundImage = 'url(img/pause.png)';
					}	
					
				}else if(e.target.id == 'scale' || e.target.id == 'progress'){
					
					var x = e.offsetX==undefined?e.layerX:e.offsetX;
					var playPoint = video.duration*(x/parseInt(getComputedStyle(scale).width)); 
					progress.style.width = parseInt((x/(parseInt(getComputedStyle(scale).width)/100))) + '%';
					video.currentTime = playPoint;
					currenttimeSpan.textContent = calculateCurrentTime()();
					
				}else if(e.target.id == 'fullscreen'){
					
					if (video.requestFullscreen) {
					  video.requestFullscreen();
					} else if (video.mozRequestFullScreen) {
					  video.mozRequestFullScreen();
					} else if (video.webkitRequestFullscreen) {
					  video.webkitRequestFullscreen();
					}
					
				}else if(e.target.id == 'play'){
					
					if(video.paused){
						video.play();
						e.target.style.backgroundImage = 'url(img/pause.png)'
						animationFrame = requestAnimationFrame(progressbar);
					}else{
						video.pause();
						e.target.style.backgroundImage = 'url(img/play.png)'
						cancelAnimationFrame(animationFrame);
					}
					durationSpan.textContent = durHours +':'+ durMinutes +':'+ durSeconds;
					
				}else if(e.target.id == 'music'){
					
					if(video.muted){
						video.muted = false;
						e.target.style.backgroundImage = 'url(img/music.png)'
						
					}else{
						video.muted = true;
						e.target.style.backgroundImage = 'url(img/nomusic.png)'
					}
					
				}else if(e.target.id == 'stop'){
					
					video.pause();
					video.currentTime = 0;
					play.textContent = 'play';
					currenttimeSpan.textContent = 0;
					cancelAnimationFrame(animationFrame);
					progress.style.width = 0;
					
					play.style.backgroundImage = 'url(img/play.png)';
					
				}else if(e.target.id == 'invert'){
					
					inversion = !inversion;
			
					if(inversion){
						video.style.filter = "invert(100%)";
						video.style.WebkitFilter = "invert(100%)";
						e.target.textContent = 'В норму';
					}else{
						video.style.filter = "invert(0%)";
						video.style.WebkitFilter = "invert(0%)";
						e.target.textContent = 'В негатив';
					}
					
				}
			}); 
		
		//filters
		
		player.addEventListener('change', function(e){
			e = e || window.event;
			
			if(e.target.id == 'volume'){
				video.volume = e.target.value;
				video.muted = false;
				music.style.backgroundImage = 'url(img/music.png)';
			}else if(e.target.id == 'saturate'){
				saturate = e.target.value * 2;
			}else if(e.target.id == 'contrast'){
				contrast = e.target.value * 2;
			}else if(e.target.id == 'brightness'){
				brightness = e.target.value * 2;
			}else if(e.target.id == 'hueRotate'){
				hueRotate = e.target.value;
			}else if(e.target.id == 'sepia'){
				sepia = e.target.value;
			}
			
			video.style.filter = "saturate("+ saturate +"%) contrast("+ contrast +"%) brightness("+ brightness +"%) hue-rotate("+ hueRotate +"deg) sepia("+ sepia +"%)";
			video.style.WebkitFilter = "saturate("+ saturate +"%) contrast("+ contrast +"%) brightness("+ brightness +"%) hue-rotate("+ hueRotate +"deg) sepia("+ sepia +"%)";
			
		});
		
	};
	
})()