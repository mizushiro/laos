;(function(win, doc, undefined) {

	'use strict';
	
	laosUI.common = {
		isHeader: false,
		init: function(){
			laosUI.ajax.init({ 
				area: document.querySelector('header.header'), 
				url:'./inc/header.html', 
				page:true, 
				callback:laosUI.common.header 
			});
			laosUI.ajax.init({ 
				area: document.querySelector('footer.footer'), 
				url:'./inc/footer.html', 
				page:true, 
				callback:laosUI.common.footer 
			});
			
			console.log('------------------------------------------------------')
		},
		header: function(){
			console.log('header load');	
			laosUI.common.isHeader = true;
		},
		footer: function(){
			console.log('footer load');	
		},
		menuActive: function(v){
			const el_sub = doc.querySelectorAll('.link-sub-gnb');
			const len = el_sub.length;

			if (!laosUI.common.isHeader) {
				setTimeout(function(){
					laosUI.common.menuActive(v);
				},100)
			} else {
				for (let i = 0; i < len; i++) {
					const txt = el_sub[i].innerText;

					if (txt === v) {
						el_sub[i].classList.add('active');
						const el_wrap = el_sub[i].closest('.gnb-item');
						el_wrap.classList.add('active');
					}
				}
			}
		}
	};

	

	//기본실행
	doc.addEventListener("DOMContentLoaded", function(){
		laosUI.common.init();
	});
})(window, document);
