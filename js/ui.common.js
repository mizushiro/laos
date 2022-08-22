;(function(win, doc, undefined) {

	'use strict';
	
	laosUI.common = {
		init: function(){
			laosUI.ajax.init({ 
				area: document.querySelector('header.header'), 
				url:'/laos/html/inc/header.html', 
				page:true, 
				callback:laosUI.common.header 
			});
			laosUI.ajax.init({ 
				area: document.querySelector('footer.footer'), 
				url:'/laos/html/inc/footer.html', 
				page:true, 
				callback:laosUI.common.footer 
			});
			
			console.log('------------------------------------------------------')
		},
		header: function(){
			console.log('header load');	
		},
		footer: function(){
			console.log('footer load');	
		}
		
	};

	

	//기본실행
	doc.addEventListener("DOMContentLoaded", function(){
		laosUI.common.init();
	});
})(window, document);
