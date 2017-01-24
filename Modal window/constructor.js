var Form = (function() {
	
    return function (form) {
	
	    var overlay;
		var form_hider;
		var formHtml;
		var modalHtml;
		
        this.makeForm = function() { 
		    overlay = document.createElement('div');
			overlay.className = 'overlay';
			modalHtml = document.createElement('div');
			modalHtml.className = 'modal';
		    formHtml = document.createElement('form');
			for(var element in form){
				if(element == 'fields'){
				    for(var i = 0; i < form[element].length; i++){
						var input = document.createElement('input');
						for(var subElement in form[element][i]){
							if(subElement == 'label'){
								var label = document.createElement('label');
								label.innerHTML = form[element][i][subElement];
							}else if(subElement !== 'validation'){
								input.setAttribute(subElement, form[element][i][subElement]);
							}else if(subElement == 'validation'){
								input.setAttribute('data-' + subElement, form[element][i][subElement]);
							}
						}
						formHtml.appendChild(label);
						label.appendChild(input);
					}
				}else if(element !== 'submit'){
					for(var subElement in form[element][i]){
						formHtml.setAttribute(element, form[element]);
					}
				}else{
					var button = document.createElement('input');
					button.setAttribute('type', 'submit');
					button.setAttribute('value', form[element]);
					formHtml.appendChild(button);
				}
			}
			modalHtml.appendChild(formHtml);
			overlay.appendChild(modalHtml);
			document.body.appendChild(overlay);
			formHtml.style.display = 'none';
			form_hider = document.createElement('span');
			form_hider.className = 'form_hider';
			formHtml.appendChild(form_hider);
        };
		
		this.attach = function(selector) { 
		    var selector = document.querySelector(selector);
		    selector.addEventListener('click', function() { 
				formHtml.style.display = 'block';
				overlay.style.display = 'block';
				var offsetModalWindowHeight = formHtml.offsetHeight;
				formHtml.style.top = -offsetModalWindowHeight/2 + 'px';
			});
			overlay.addEventListener('click', function() { 
				formHtml.style.display = 'none';
				overlay.style.display = 'none';
			}); 
			formHtml.addEventListener('click', function(event) { 
				event.stopPropagation();
			}); 
			form_hider.addEventListener('click', function() { 
				formHtml.style.display = 'none';
				overlay.style.display = 'none';
			}); 
		};
		
		
		this.validate = function() {
			
		    var elements = formHtml.elements;
		    var regMail = /^[A-Za-z0-9_\-\.]+\@[A-Za-z0-9_\-\.]+\.[A-Za-z]{2,4}$/;  
			var regTel = /^[0-9()\-+ ]{2,20}$/;  
			
			for(var i=0; i<elements.length; i++){
				var p = document.createElement('p');
				if (elements[i].getAttribute('type') !== 'submit'){
					console.log(elements[i].parentNode);
					formHtml.insertBefore(p, elements[i].parentNode.nextElementSibling);
				}
			}
				
		    formHtml.addEventListener('submit', function(e) { 
			
			    var sender = true;
		        e.preventDefault();
				
				for(var i=0; i<elements.length; i++){
					
					switch (elements[i].getAttribute('data-validation')){
						case('!empty'):{
							if(elements[i].value == '') {
								sender = false;
								elements[i].parentNode.nextElementSibling.classList.add('block');
								elements[i].parentNode.nextElementSibling.innerHTML = 'Поле не может быть пустым';
							}else{
								elements[i].parentNode.nextElementSibling.classList.remove('block');
							}
							break;
						}
						case('email'):{
							if(regMail.test(elements[i].value) == false) {
								sender = false;
								elements[i].parentNode.nextElementSibling.classList.add('block');
								elements[i].parentNode.nextElementSibling.innerHTML = 'Введите правильный email';
							}else{
								elements[i].parentNode.nextElementSibling.classList.remove('block');
							}
							break;
						}
						case('tel'):{
							if(regTel.test(elements[i].value) == false) {
								sender = false;
								elements[i].parentNode.nextElementSibling.classList.add('block');
								elements[i].parentNode.nextElementSibling.innerHTML = 'Введите правильный телефон';
							}else{
								elements[i].parentNode.nextElementSibling.classList.remove('block');
							}
							break;
						}
					}
					
				} 
				
				var iter_xml = 0;
				
				if(sender == true){
					
					// создать объект для формы
					var formData = new FormData(formHtml);

					// отослать
					var xhr = new XMLHttpRequest();

					xhr.open('POST', 'send.php', false);

					xhr.send(formData);

					if (xhr.status != 200) {
					  
					    if(iter_xml <2){
						  
						   xhr.send();
						   iter_xml++;
						  
					    }
					  
					} else {
					  
					    alert( xhr.responseText ); 
					  
					}
					
				}
			
			}); 
			
			for(i=0; i<elements.length; i++){
				
				elements[i].onfocus = function (){
					switch (this.getAttribute('data-validation')){
						case('!empty'):{
							if(this.value == '') {
								this.parentNode.nextElementSibling.classList.add('block');
								this.parentNode.nextElementSibling.innerHTML = 'Поле не может быть пустым';
							}else{
								this.parentNode.nextElementSibling.classList.remove('block');
							}
							break;
						}
						case('email'):{
							if(regMail.test(this.value) == false) {
								this.parentNode.nextElementSibling.classList.add('block');
								this.parentNode.nextElementSibling.innerHTML = 'Введите правильный email';
							}else{
								this.parentNode.nextElementSibling.classList.remove('block');
							}
							break;
						}
						case('tel'):{
							if(regTel.test(this.value) == false) {
								this.parentNode.nextElementSibling.classList.add('block');
								this.parentNode.nextElementSibling.innerHTML = 'Введите правильный телефон';
							}else{
								this.parentNode.nextElementSibling.classList.remove('block');
							}
							break;
						}
					}
				}
				
				elements[i].onblur = function (){
					this.parentNode.nextElementSibling.classList.remove('block');
				}
				
			}
		    
		};
		
    }
  
})();


    
	
	
	
	