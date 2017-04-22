var Videomodule = {};

Videomodule.videoplayer = function(containerName, videoWidth = 900, videoHeight = 675, videoSrc){
	
	window.onload = function(){		
		
		//constants	- dimensions
		const width = videoWidth;
		const height = videoHeight;
		
		//player DOM generating
		
		//constants - dom
		const container = document.querySelector(containerName);
		const player = document.createElement("div");
		const video = document.createElement("video");
		const playicon = document.createElement("div");
		const controls = document.createElement("div");
		const time = document.createElement("div");
		const currenttimeSpan = document.createElement("span");
		const durationSpan = document.createElement("span");
		const scale = document.createElement("div");
		const progress = document.createElement("div");
		const volume = document.createElement("div");
		const volumeLabel = document.createElement("label");
		const volumeRange = document.createElement("input");
		const play = document.createElement("button");
		const fullscreen = document.createElement("button");
		const music = document.createElement("button");
		const stop = document.createElement("button");
		const filters = document.createElement("div");
		const filterNames = [
		    {name:"saturate", value: "Насыщенность"},
			{name:"contrast", value: "Контрастность"},
			{name:"brightness", value: "Яркость"},
			{name:"hueRotate", value: "ЛСД"},
			{name:"sepia", value: "Сепия"},
		];
		const norma = document.createElement("div");
		const normal = document.createElement("button");
		
		//set DOM classes
		player.className = "player";
		video.className = "video";
		playicon.className = "playicon"
		controls.className = "controls";
		play.className = "play";
		time.className = "time";
		progress.className = "progress";
		scale.className = "scale";
		volume.className = "volume";
		volumeRange.className = "volume-range";
		fullscreen.className = "fullscreen";
		stop.className = "stop";
		music.className = "music";
		filters.className = "filters";
		filters.classList.add("controls");
		norma.className = "norma";
		normal.className = "normal";
		durationSpan.className = "duration";
		currenttimeSpan.className = "currenttime";
		
		//filters generation	
		filterNames.forEach(function(item){
			let div = document.createElement("div");
			let label = document.createElement("label");
			let input = document.createElement("input");
			label.textContent = item.value;
			input.setAttribute("type","range");
			input.setAttribute("name",item.name);
			input.setAttribute("min", "0");
			if(item.name == "hueRotate"){
				input.setAttribute("max", "360");
			}else{
				input.setAttribute("max", "100");
			}
			input.setAttribute("step", "1");
			
			if(item.name == "hueRotate" || item.name == "sepia" ){
				input.setAttribute("value", "0");
			}else{
				input.setAttribute("value", "50");
			}
			
			input.className = item.name;
			filters.appendChild(div);
			div.appendChild(label);
			div.appendChild(input);
			
		});
		
		//set player`s elements into page
		filters.appendChild(norma);
		norma.appendChild(normal);
		container.appendChild(player);
		player.appendChild(video);
		player.appendChild(playicon);
		player.appendChild(controls);
		controls.appendChild(play);
		controls.appendChild(time);
		time.appendChild(durationSpan);
		time.appendChild(currenttimeSpan);
		controls.appendChild(scale);
		scale.appendChild(progress);
		controls.appendChild(volume);
		controls.appendChild(fullscreen);
		controls.appendChild(stop);
		controls.appendChild(music);
		volume.appendChild(volumeRange);
		player.appendChild(filters);
		
		//text on elements
		volumeLabel.textContent = "Громкость";
		normal.textContent = "В норму";
		
		//volume attributes
		volumeRange.setAttribute("type", "range");
		volumeRange.setAttribute("name", "volume");
		volumeRange.setAttribute("min", "0.0");
		volumeRange.setAttribute("max", "1.0");
		volumeRange.setAttribute("step", "0.1");
		volumeRange.setAttribute("value", "0.5");
		
		//END player DOM generating
		
		//filtersprop
		let filter, animationFrame, durHours, durMinutes, durSeconds
		let saturate = 100, contrast = 100, brightness = 100, hueRotate = 0, sepia = 0;
		
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
		durationSpan.textContent = '00:00:00';
		
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
					
				if(e.target.className == 'video'){
					
					if(video.paused){
						video.play();
						progressbar();
						play.style.backgroundImage = 'url(img/pause.png)';
					}else{
						video.pause();
						play.style.backgroundImage = 'url(img/play.png)';
						playicon.classList.remove('hidden')
					}	
					
				}else if(e.target.className == 'playicon'){
					
					if(video.paused){
						video.play();
						progressbar();
						play.style.backgroundImage = 'url(img/pause.png)';
						e.target.classList.add('hidden')
					}
						
				}else if(e.target.className == 'scale' || e.target.className == 'progress'){
					
					let x = e.offsetX==undefined?e.layerX:e.offsetX;
					let playPoint = video.duration*(x/parseInt(getComputedStyle(scale).width)); 
					progress.style.width = `${parseInt((x/(parseInt(getComputedStyle(scale).width)/100)))}%`;
					video.currentTime = playPoint;
					currenttimeSpan.textContent = calculateCurrentTime()();
					
				}else if(e.target.className == 'fullscreen'){
					
					if (video.requestFullscreen) {
					  video.requestFullscreen();
					} else if (video.mozRequestFullScreen) {
					  video.mozRequestFullScreen();
					} else if (video.webkitRequestFullscreen) {
					  video.webkitRequestFullscreen();
					}
					
				}else if(e.target.className == 'play'){
					
					if(video.paused){
						video.play();
						play.style.backgroundImage = 'url(img/pause.png)'
						animationFrame = requestAnimationFrame(progressbar);
						playicon.classList.add('hidden')
					}else{
						video.pause();
						play.style.backgroundImage = 'url(img/play.png)'
						cancelAnimationFrame(animationFrame);
						playicon.classList.remove('hidden')
					}
					durationSpan.textContent = `${durHours}:${durMinutes}:${durSeconds}`;
					
				}else if(e.target.className == 'music'){
					
					if(video.muted){
						video.muted = false;
						e.target.style.backgroundImage = 'url(img/music.png)'
						
					}else{
						video.muted = true;
						e.target.style.backgroundImage = 'url(img/nomusic.png)'
					}
					
				}else if(e.target.className == 'stop'){
					
					video.pause();
					video.currentTime = 0;
					play.textContent = 'play';
					currenttimeSpan.textContent = 0;
					cancelAnimationFrame(animationFrame);
					progress.style.width = 0;
					
					play.style.backgroundImage = 'url(img/play.png)';
					playicon.classList.remove('hidden')
					
				}else if(e.target.className == 'normal'){
					video.style.filter = "";
					video.style.WebkitFilter = "";
				}
			}); 
		
		//filters
		
		player.addEventListener('change', function(e){
			e = e || window.event;
			
			if(e.target.className == 'volume-range'){
				video.volume = e.target.value;
				video.muted = false;
				music.style.backgroundImage = 'url(img/music.png)';
			}else if(e.target.className == 'saturate'){
				saturate = e.target.value * 2;
			}else if(e.target.className == 'contrast'){
				contrast = e.target.value * 2;
			}else if(e.target.className == 'brightness'){
				brightness = e.target.value * 2;
			}else if(e.target.className == 'hueRotate'){
				hueRotate = e.target.value;
			}else if(e.target.className == 'sepia'){
				sepia = e.target.value;
			}
			
			video.style.filter = `saturate(${saturate}%) contrast(${contrast}%) brightness(${brightness}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`;
			video.style.WebkitFilter = `saturate(${saturate}%) contrast(${contrast}%) brightness(${brightness}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`;
			
		});
		
	};	
		
};