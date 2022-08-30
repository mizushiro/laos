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
			const el_wrap = doc.querySelector('.mobile-gnb-wrap');
			const el_btns = el_wrap.querySelectorAll('.link-gnb');
			const len = el_btns.length;


			btn_open.addEventListener('click', laosUI.gnb.open);
			btn_close.addEventListener('click', laosUI.gnb.close);
			

			for (let i = 0; i < len; i++ ) {
				el_btns[i].addEventListener('click', laosUI.gnb.toggle);
			}
		},
		footer: function(){
			console.log('footer load');	
		},
		menuActive: function(v){
			const el_sub = doc.querySelectorAll('.link-sub-gnb');
			const len = el_sub.length;

			if (v === '') {
				return false;
			}

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
		},
		toggle: function(){
			console.log(this);
			this.closest('.gnb-item').classList.toggle('active')
		}
	};

	//기본실행
	doc.addEventListener("DOMContentLoaded", function(){
		laosUI.common.init();
	});


})(window, document);

var LaosUIBase = (function() {
		// layer popup
		var callLayer = function() {
			var btnLayer = document.querySelectorAll('[data-layer]');
			for (var i = 0; i < btnLayer.length; i++) {
				btnLayer[i].addEventListener('click', function(e) {
					var targetId = this.dataset.layer;
					var targetLayer = document.querySelector('#' + targetId);
					targetLayer.classList.add('showing');
					console.log(targetLayer);
					document.querySelector('html, body').classList.add('scroll-off');
				});
			}
			var btnLayerClose = document.querySelectorAll('.dialog_section .btn_dialog-close');
			for (var i = 0; i < btnLayerClose.length; i++) {
				btnLayerClose[i].addEventListener('click', function(e) {
					var targetElem = e.target;
					while (!targetElem.classList.contains('dialog_section')) {
						targetElem = targetElem.parentNode;
						if (targetElem.nodeName == 'BODY') {
							targetElem = null;
							return;
						}
					}
					targetElem.classList.remove('showing');
					document.querySelector('html, body').classList.remove('scroll-off');
				})
			}
		};

		return {
			callLayer: callLayer,
		}
	}
)();
