var Videomodule = {};

Videomodule.videoplayer = function(videoWidth = 900, videoHeight = 675, videoSrc){
	
	window.onload = function(){		
		
		//constants	- dimensions
		const width = videoWidth;
		const height = videoHeight;
		
		//constants - dom
		const player = document.getElementById('player');
		const video = document.getElementById('video');
		const scale = document.getElementById('scale');
		const progress = document.getElementById('progress');
		const currenttimeSpan = document.getElementById('currenttime');
		const durationSpan = document.getElementById('duration');
		const volume = document.getElementById('volume');
		const play = document.getElementById('play');
		const music = document.getElementById('music');
		const controls = document.querySelector('.controls');
		const filters = document.querySelector('.filters');
		
		//filtersprop
		let filter, animationFrame, durHours, durMinutes, durSeconds
		let saturate = 100, contrast = 100, brightness = 100, hueRotate = 0, sepia = 0;
		let inversion = false;
		
		video.setAttribute("src", videoSrc);
		
		
		var computingTime = function(duration){
			let cHours = parseInt(duration/3600);
			let cMinutes = parseInt(duration/60);
			let cSeconds = parseInt(duration%60);
			return function(){
				(cHours>9)?cHours=cHours:cHours=`0${cHours}`;
				(cMinutes>9)?cMinutes=cMinutes:cMinutes=`0${cMinutes}`;
				(cSeconds>9)?cSeconds=cSeconds:cSeconds=`0${cSeconds}`;
				return [cHours, cMinutes, cSeconds];
			}
		}
		
		//videofile duration
		video.addEventListener('loadedmetadata', function() {
			[durHours, durMinutes, durSeconds] = computingTime(video.duration)();
			durationSpan.textContent = `${durHours}:${durMinutes}:${durSeconds}`;
		});
		
		video.width = width;
		video.height = height;
		video.volume = 0.5;
		currenttimeSpan.textContent = '00:00:00';
		
		player.style.width = `${width}px`;
		player.style.height = `${height}px`;
		
		let calculateCurrentTime = function(){
		    let hours, minutes, seconds;
			return function(){
				[hours, minutes, seconds] = computingTime(video.currentTime)();
				return `${hours}:${minutes}:${seconds}`;
			}
		};
		
		//scale
		
		let progressbar = function(){
		
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
					
					if(video.paused){
						video.play();
						progressbar();
						play.style.backgroundImage = 'url(img/pause.png)';
					}else{
						video.pause();
						play.style.backgroundImage = 'url(img/play.png)';
					}	
					
				}else if(e.target.id == 'scale' || e.target.id == 'progress'){
					
					let x = e.offsetX==undefined?e.layerX:e.offsetX;
					let playPoint = video.duration*(x/parseInt(getComputedStyle(scale).width)); 
					progress.style.width = `${parseInt((x/(parseInt(getComputedStyle(scale).width)/100)))}%`;
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
						play.style.backgroundImage = 'url(img/pause.png)'
						animationFrame = requestAnimationFrame(progressbar);
					}else{
						video.pause();
						play.style.backgroundImage = 'url(img/play.png)'
						cancelAnimationFrame(animationFrame);
					}
					durationSpan.textContent = `${durHours}:${durMinutes}:${durSeconds}`;
					
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
			
			video.style.filter = `saturate(${saturate}%) contrast(${contrast}%) brightness(${brightness}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`;
			video.style.WebkitFilter = `saturate(${saturate}%) contrast(${contrast}%) brightness(${brightness}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`;
			
		});
	
	};	
		
};