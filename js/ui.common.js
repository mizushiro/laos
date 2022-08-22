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
			
			console.log('------------------------------------------------------')
		},
		header: function(){
			console.log('header load');	
		}
		
	};

	

	//기본실행
	doc.addEventListener("DOMContentLoaded", function(){
		laosUI.common.init();
	});
})(window, document);
