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

			const btn_open = doc.querySelector('.btn-gnb-open');
			const btn_close = doc.querySelector('.header .btn-close');

			btn_open.addEventListener('click', laosUI.gnb.open);
			btn_close.addEventListener('click', laosUI.gnb.close);
		},
		footer: function(){
			console.log('footer load');	
		},
		menuActive: function(v){
			const el_sub = doc.querySelectorAll('.link-sub-gnb');
			const len = el_sub.length;

			laosUI.common.pagename = v;

			if (!laosUI.common.isHeader) {
				setTimeout(function(){
					laosUI.common.menuActive(v);
				},100)
			} else {
				console.log(len);
				for (let i = 0; i < len; i++) {
					const txt = el_sub[i].innerText;
					console.log(el_sub[i].innerText,v);
					if (txt === v) {
						
						el_sub[i].classList.add('active');
						const el_wrap = el_sub[i].closest('.gnb-item');
						el_wrap.classList.add('active');
					}
				}
			}
		}
	};

	laosUI.gnb = {
		open: function(){
			console.log('open');
			const el_body = document.querySelector('.mobile-gnb-wrap');

			el_body.classList.add('active');
		},
		close: function(){ 
			console.log('close');
			const el_body = document.querySelector('.mobile-gnb-wrap');

			el_body.classList.remove('active');
		}
	};
	

	//기본실행
	doc.addEventListener("DOMContentLoaded", function(){
		laosUI.common.init();
	});
})(window, document);
