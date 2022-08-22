'use strict';




//utils module
;(function (win, doc, undefined) {

	'use strict';
	//TFUI
	var global = 'laosUI';

	win[global] = {};

	var Global = win[global];
	var UA = navigator.userAgent.toLowerCase();
	var deviceSize = [1920, 1600, 1440, 1280, 1024, 960, 840, 720, 600, 480, 400, 360];
	var deviceInfo = ['android', 'iphone', 'ipod', 'ipad', 'blackberry', 'windows ce', 'windows','samsung', 'lg', 'mot', 'sonyericsson', 'nokia', 'opeara mini', 'opera mobi', 'webos', 'iemobile', 'kfapwi', 'rim', 'bb10'];
	//var filter = "win16|win32|win64|mac|macintel";

	//requestAnimationFrame
	win.requestAFrame = (function () {
		return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame ||
			//if all else fails, use setTimeout
			function (callback) {
				return win.setTimeout(callback, 1000 / 60); //shoot for 60 fp
			};
	})();
	win.cancelAFrame = (function () {
		return win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame ||
			function (id) {
				win.clearTimeout(id);
			};
	})();

	//components state 
	Global.callback = {};

	Global.state = {
		device: {
			info: (function() {
				for (var i = 0, len = deviceInfo.length; i < len; i++) {
					if (UA.match(deviceInfo[i]) !== null) {
						return deviceInfo[i];
					}
				}
			})(),
			width: window.innerWidth,
			height: window.innerHeight,
			breakpoint: null,
			colClass: null,
			ios: (/ip(ad|hone|od)/i).test(UA),
			android: (/android/i).test(UA),
			app: UA.indexOf('appname') > -1 ? true : false,
			touch: null,
			mobile: null,
			os: (navigator.appVersion).match(/(mac|win|linux)/i)
		},
		browser: {
			ie: UA.match(/(?:msie ([0-9]+)|rv:([0-9\.]+)\) like gecko)/i),
			local: (/^http:\/\//).test(location.href),
			firefox: (/firefox/i).test(UA),
			webkit: (/applewebkit/i).test(UA),
			chrome: (/chrome/i).test(UA),
			opera: (/opera/i).test(UA),
			safari: (/applewebkit/i).test(UA) && !(/chrome/i).test(UA),	
			size: null
		},
		keys: { 
			tab: 9, 
			enter: 13, 
			alt: 18, 
			esc: 27, 
			space: 32, 
			pageup: 33, 
			pagedown: 34, 
			end: 35, 
			home: 36, 
			left: 37, 
			up: 38, 
			right: 39, 
			down: 40
		},
		scroll: {
			y: 0,
			direction: 'down'
		},
		pageName: function() {
			var page = document.URL.substring(document.URL.lastIndexOf("/") + 1);
			var pagename = page.split('?');

			return pagename[0]
		},
		breakPoint: [600, 905],
		effect: { //http://cubic-bezier.com - css easing effect
			linear: '0.250, 0.250, 0.750, 0.750',
			ease: '0.250, 0.100, 0.250, 1.000',
			easeIn: '0.420, 0.000, 1.000, 1.000',
			easeOut: '0.000, 0.000, 0.580, 1.000',
			easeInOut: '0.420, 0.000, 0.580, 1.000',
			easeInQuad: '0.550, 0.085, 0.680, 0.530',
			easeInCubic: '0.550, 0.055, 0.675, 0.190',
			easeInQuart: '0.895, 0.030, 0.685, 0.220',
			easeInQuint: '0.755, 0.050, 0.855, 0.060',
			easeInSine: '0.470, 0.000, 0.745, 0.715',
			easeInExpo: '0.950, 0.050, 0.795, 0.035',
			easeInCirc: '0.600, 0.040, 0.980, 0.335',
			easeInBack: '0.600, -0.280, 0.735, 0.045',
			easeOutQuad: '0.250, 0.460, 0.450, 0.940',
			easeOutCubic: '0.215, 0.610, 0.355, 1.000',
			easeOutQuart: '0.165, 0.840, 0.440, 1.000',
			easeOutQuint: '0.230, 1.000, 0.320, 1.000',
			easeOutSine: '0.390, 0.575, 0.565, 1.000',
			easeOutExpo: '0.190, 1.000, 0.220, 1.000',
			easeOutCirc: '0.075, 0.820, 0.165, 1.000',
			easeOutBack: '0.175, 0.885, 0.320, 1.275',
			easeInOutQuad: '0.455, 0.030, 0.515, 0.955',
			easeInOutCubic: '0.645, 0.045, 0.355, 1.000',
			easeInOutQuart: '0.770, 0.000, 0.175, 1.000',
			easeInOutQuint: '0.860, 0.000, 0.070, 1.000',
			easeInOutSine: '0.445, 0.050, 0.550, 0.950',
			easeInOutExpo: '1.000, 0.000, 0.000, 1.000',
			easeInOutCirc: '0.785, 0.135, 0.150, 0.860',
			easeInOutBack: '0.680, -0.550, 0.265, 1.550'
		}
	}
	
	Global.parts = {
		//resize state
		resizeState: function() {
			var timerWin;

			var act = function() {
				var browser = Global.state.browser;
				var device = Global.state.device;

				device.width = window.innerWidth;
				device.height = window.innerHeight;

				device.touch = device.ios || device.android || (doc.ontouchstart !== undefined && doc.ontouchstart !== null);
				device.mobile = device.touch && (device.ios || device.android);
				device.os = device.os ? device.os[0] : '';
				device.os = device.os.toLowerCase();

				device.breakpoint = device.width >= deviceSize[5] ? true : false;
				device.colClass = device.width >= deviceSize[5] ? 'col-12' : device.width > deviceSize[8] ? 'col-8' : 'col-4';

				
				if (browser.ie) {
					browser.ie = browser.ie = parseInt( browser.ie[1] || browser.ie[2] );
					// ( 11 > browser.ie ) ? support.pointerevents = false : '';
					// ( 9 > browser.ie ) ? support.svgimage = false : '';
				} else {
					browser.ie = false;
				}

				console.log(browser);

				var clsBrowser = browser.chrome ? 'chrome' : browser.firefox ? 'firefox' : browser.opera ? 'opera' : browser.safari ? 'safari' : browser.ie ? 'ie ie' + browser.ie : 'other';
				var clsMobileSystem = device.ios ? "ios" : device.android ? "android" : 'etc';
				var clsMobile = device.mobile ? device.app ? 'ui-a ui-m' : 'ui-m' : 'ui-d';
				var el_html = doc.querySelector('html');

				el_html.classList.remove('col-12', 'col-8', 'col-4');
				el_html.classList.add(device.colClass, clsBrowser, clsMobileSystem, clsMobile);
			
				var w = window.innerWidth;

				clearTimeout(timerWin);
				timerWin = setTimeout(function(){
					el_html.classList.remove('size-tabvar');
					el_html.classList.remove('size-desktop');
					el_html.classList.remove('size-mobile');
						el_html.classList.remove('size-desktop');

					if (w < Global.state.breakPoint[0]) {
						Global.state.browser.size = 'mobile';
						el_html.classList.add('size-mobile');
					} else if (w < Global.state.breakPoint[1]) {
						Global.state.browser.size = 'tabvar';
						el_html.classList.add('size-tabvar');
					} else {
						Global.state.browser.sizee = 'desktop';
						el_html.classList.add('size-desktop');
					}
				},200);
			}
			win.addEventListener('resize', act);
			act();
		},

		/**
		* append html : 지정된 영역 안에 마지막에 요소 추가하기
		* @param {object} el target element
		* @param {string} str 지정된 영역에 들어갈 값
		* @param {string} htmltag HTML tag element
		*/
		appendHtml: function(el, str, htmltag) {
			var _htmltag = !!htmltag ? htmltag : 'div';
			var div = doc.createElement(_htmltag);

			div.innerHTML = str;

			while (div.children.length > 0) {
				el.appendChild(div.children[0]);
			}
		},

		/**
		* devare parent tag : 지정된 요소의 부모태그 삭제
		* @param {object} child target element
		*/
		devareParent: function(child) {
			var parent = child.parentNode;

			parent.parentNode.removeChild(parent);
		},

		/**
		* wrap tag : 지정된 요소의 tag 감싸기
		* @param {object} child target element
		*/
		wrapTag: function(front, selector, back) {
			var org_html = selector.innerHTML;
			var new_html = front + org_html + back;

			console.log(selector);

			selector.innerHTML = '';
 			selector.insertAdjacentHTML('beforeend', new_html) ;
		},

		//숫자 세자리수마다 ',' 붙이기
		comma: function(n) {
			var parts = n.toString().split(".");

			return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
		},

		//숫자 한자리수 일때 0 앞에 붙이기
		add0: function(x) {
			return Number(x) < 10 ? '0' + x : x;
		},

		//주소의 파라미터 값 가져오기
		para: function(paraname) {
			var tempUrl = win.location.search.substring(1);
			var tempArray = tempUrl.split('&');
			var tempArray_len = tempArray.length;
			var keyValue;
	
			for (var i = 0, len = tempArray_len; i < len; i++) {
				keyValue = tempArray[i].split('=');
	
				if (keyValue[0] === paraname) {
					return keyValue[1];
				}
			}
		},

		//기본 선택자 설정
		selectorType: function(v) {
			var base = document.querySelector('body');

			if (v !== null) {
				if (typeof v === 'string') {
					base = document.querySelector(v);
				} else {
					base = v;
				} 
			}

			return base;
		},

		RAF: function(start, end, startTime, duration){
			var _start = start;
			var _end = end;
			var _duration = duration ? duration : 300;
			var unit = (_end - _start) / _duration;
			var endTime = startTime + _duration;

			var now = new Date().getTime();
			var passed = now - startTime;

			if (now <= endTime) {
				Global.parts.RAF.time = _start + (unit * passed);
				requestAnimationFrame(scrollTo);
			} else {
				!!callback && callback();
				console.log('End off.')
			}
		},

		getIndex: function (ele) {
			var _i = 0;

			while((ele = ele.previousSibling) != null ) {
				_i++;
			}

			return _i;
		},
		toggleSlide: function(opt) {
			var el = opt.el;
			var btnID = el.getAttribute('aria-labelledby');
			var el_btn = doc.querySelector('#' + btnID);
			var state = opt.state;
			var n;

			if (state === 'toggle') {
				(0 === el.offsetHeight) ? show() : hide();
			} else {
				(state === 'show') ? show() : hide();
			}

			function show(){
				el.setAttribute('aria-hidden', false);
				el.dataset.ing = 'true';
				el.style.height = "auto";
				n = el.offsetHeight;
				el.style.height = 0;
				void el.offsetHeight;
				el.style.height = n + 'px';
				
				Global.parts.toggleSlideTimer = setTimeout(function(){
					el.style.height = 'auto';
					el.dataset.ing = 'false';
					
				},300);
			}
			function hide(){
				if (el.dataset.ing !== 'true') {
					el.style.height = el.offsetHeight + 'px';

					setTimeout(function(){
						el.setAttribute('aria-hidden', true);
						el.style.height = 0;
						el_btn.setAttribute('aria-expanded', false);
						el_btn.dataset.selected = false;
					},0);
				} else {
					el_btn.setAttribute('aria-expanded', true);
					el_btn.dataset.selected = true;
				}
			}
		}
	}
	Global.parts.resizeState();

	Global.option = {
		join : function(org, add){
			console.log(org, add);

			var object1 = {};

			Object.defineProperties(object1, org, add);

			console.log(object1);
		}
	}

	Global.loading = {
		timerShow : {},
		timerHide : {},
		options : {
			selector: null,
			message : null,
			styleClass : 'orbit' //time
		},
		show : function(option){
			var opt = Object.assign({}, this.options, option);
			//var opt = {...this.options, ...option};
			//Global.option.join(this.options, option);
			var selector = opt.selector; 
			var styleClass = opt.styleClass; 
			var message = opt.message;
			var el = (selector !== null) ? selector : doc.querySelector('body');
			var el_loadingHides = doc.querySelectorAll('.ui-loading:not(.visible)');

			for (var i = 0, len = el_loadingHides.length; i < len; i++) {
				var that = el_loadingHides[i];

				that.remove();
			}
			// for (var that of el_loadingHides) {
			// 	that.remove();
			// }

			var htmlLoading = '';

			(selector === null) ?
				htmlLoading += '<div class="ui-loading '+ styleClass +'">':
				htmlLoading += '<div class="ui-loading type-area '+ styleClass +'">';
			htmlLoading += '<div class="ui-loading-wrap">';

			(message !== null) ?
				htmlLoading += '<strong class="ui-loading-message"><span>'+ message +'</span></strong>':
				htmlLoading += '';

			htmlLoading += '</div>';
			htmlLoading += '</div>';

			clearTimeout(this.timerShow);
			clearTimeout(this.timerHide);
			this.timerShow = setTimeout(showLoading, 300);
			
			function showLoading(){
				!el.querySelector('.ui-loading') && el.insertAdjacentHTML('beforeend', htmlLoading);
				htmlLoading = null;		

				var el_loadings = doc.querySelectorAll('.ui-loading');

				for (var i = 0, len = el_loadings.length; i < len; i++) {
					var that = el_loadings[i];

					that.classList.add('visible');
					that.classList.remove('close');
				}
				// for (var that of el_loadings) {
				// 	that.classList.add('visible');
				// 	that.classList.remove('close');
				// }
			}
		},
		hide: function(){
			clearTimeout(this.timerShow);
			this.timerHide = setTimeout(function(){
				var el_loadings = doc.querySelectorAll('.ui-loading');

				for (var i = 0, len = el_loadings.length; i < len; i++) {
					var that = el_loadings[i];

					that.classList.add('close');
					setTimeout(function(){
						that.classList.remove('visible')
						that.remove();
					},300);
				}
				// for (var that of el_loadings) {
				// 	that.classList.add('close');
				// 	setTimeout(function(){
				// 		that.classList.remove('visible')
				// 		that.remove();
				// 	},300);
				// }
			},300);
		}
	}

	Global.ajax = {
		options : {
			page: true,
			add: false,
			prepend: false,
			effect: false,
			loading:false,
			callback: false,
			errorCallback: false,
			type: 'GET',
			cache: false,
			async: true,
			contType: 'application/x-www-form-urlencoded',
			dataType: 'html'
		},
		init : function(option){
			if (option === undefined) {
				return false;
			}

			var opt = Object.assign({}, this.options, option);
			//var opt = {...this.options, ...option};
			var xhr = new XMLHttpRequest();
			var area = opt.area;
			var loading = opt.loading;
			var effect = opt.effect;
			var type = opt.type;
			var url = opt.url;
			var page = opt.page;
			var add = opt.add;
			var prepend = opt.prepend;
			var mimeType = opt.mimeType;
			var contType = opt.contType;
			var callback = opt.callback || false;
			var errorCallback = opt.errorCallback === undefined ? false : opt.errorCallback;
	
			loading && Global.loading.show();

			if (!!effect && !!document.querySelector(effect)) {
				area.classList.remove(effect + ' action');
				area.classList.add(effect);
			}

			xhr.open(type, url);
			xhr.setRequestHeader(mimeType, contType);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== XMLHttpRequest.DONE) {
					return;
				}

				if (xhr.status === 200) {
					loading && Global.loading.hide();

					if (page) {
						if (add){
							prepend ? 
								area.insertAdjacentHTML('afterbegin', xhr.responseText) : 
								area.insertAdjacentHTML('beforeend', xhr.responseText);
						} else {							
							area.innerHTML = xhr.responseText;
						}

						callback && callback();
						effect && area.classList.add('action');
					} else {
						callback && callback(xhr.responseText);
					}

				} else {
					loading && Global.loading.hide();
					errorCallback && errorCallback();
				}
			};
		}
	}

	/**
	 * intersection observer
	 */
	// Global.io = new IntersectionObserver(function (entries) {
	// 	entries.forEach(function (entry) {
	// 		if (entry.intersectionRatio > 0) {
	// 			entry.target.classList.add('tada');
	// 		} else {
	// 			entry.target.classList.remove('tada');
	// 		}
	// 	});
	// });

	Global.scroll = {
		options : {
			selector: document.querySelector('html, body'),
			focus: false,
			top: 0,
			left:0,
			add: 0,
			align: 'default',
			effect:'smooth', //'auto'
			callback: false,	
		},
		init: function(){
			var el_areas = document.querySelectorAll('.ui-scrollmove-btn[data-area]');

			for (var i = 0, len = el_areas.length; i < len; i++) {
				var that = el_areas[i];

				that.removeEventListener('click', this.act);
				that.addEventListener('click', this.act);
			}
			// for (var that of el_areas) {
			// 	that.removeEventListener('click', this.act);
			// 	that.addEventListener('click', this.act);
			// }
		},
		act: function(e){
			var el = e.currentTarget;
			var area = el.dataset.area;
			var name = el.dataset.name;
			var add = el.dataset.add === undefined ? 0 : el.dataset.add;
			var align = el.dataset.align === undefined ? 'default' : el.dataset.align;
			var callback = el.dataset.callback === undefined ? false : el.dataset.callback;
			var el_area = doc.querySelector('.ui-scrollmove[data-area="'+ area +'"]');
			var el_item = el_area.querySelector('.ui-scrollmove-item[data-name="'+ name +'"]');
			
			var top = (el_area.getBoundingClientRect().top - el_item.getBoundingClientRect().top) - el_area.scrollTop;
			var left = (el_area.getBoundingClientRect().left - el_item.getBoundingClientRect().left) - el_area.scrollLeft;

			if (align === 'center') {
				top = top - (el_item.offsetHeight / 2);
				left = left - (el_item.offsetWidth / 2);
			}

			Global.scroll.move({
				top: top,
				left: left,
				add: add,
				selector: el_area,
				align: align,
				focus: el_item,
				callback: callback
			});
		},
		move : function(option){
			var opt = Object.assign({}, this.options, option);
			//var opt = {...this.options, ...option};
			var top = opt.top;
			var left = opt.left;
			var callback = opt.callback;
			var align = opt.align;
			var add = opt.add;
			var focus = opt.focus;
			var effect = opt.effect;
			var selector = opt.selector;

			//jquery selector인 경우 변환
			// if (!!selector[0]) {
			// 	selector = selector[0];
			// }

			switch (align) {
				case 'default':
					selector.scrollTo({
						top: Math.abs(top) + add,
						left: Math.abs(left) + add,
						//behavior: effect
					});
					break;

				case 'center':				
					selector.scrollTo({
						top: Math.abs(top) - (selector.offsetHeight / 2) + add,
						left: Math.abs(left) - (selector.offsetWidth / 2) + add,
						behavior: effect
					});
					break;
			}

			this.checkEnd({
				selector : selector,
				nowTop : selector.scrollTop, 
				nowLeft : selector.scrollLeft,
				align : align,
				callback : callback,
				focus : focus
			});
		},
		checkEndTimer : {},
		checkEnd: function(opt){
			var el_selector = opt.selector;
			var align = opt.align
			var focus = opt.focus
			var callback = opt.callback
			
			var nowTop = opt.nowTop;
			var nowLeft = opt.nowLeft;

			Global.scroll.checkEndTimer = setTimeout(function(){
				//스크롤 현재 진행 여부 판단
				if (nowTop === el_selector.scrollTop && nowLeft === el_selector.scrollLeft) {
					clearTimeout(Global.scroll.checkEndTimer);
					//포커스가 위치할 엘리먼트를 지정하였다면 실행
 					if (!!focus ) {
						focus.setAttribute('tabindex', 0);
						focus.focus();
					}
					//스크롤 이동후 콜백함수 실행
					if (!!callback) {
						if (typeof callback === 'string') {
							Global.callback[callback]();
						} else {
							callback();
						}
					}
				} else {
					nowTop = el_selector.scrollTop;
					nowLeft = el_selector.scrollLeft;

					Global.scroll.checkEnd({
						selector: el_selector,
						nowTop: nowTop,
						nowLeft: nowLeft,
						align: align,
						callback: callback,
						focus: focus
					});
				}
			},100);
		},

		optionsParllax: {
			selector : null,
			area : null
		},
		parallax: function(option) {
			
			var opt = Object.assign({}, this.optionsParllax, option);
			//var opt = {...this.optionsParllax, ...option};
			var el_area = (opt.area === undefined || opt.area === null) ? window : opt.area;
			//Nullish coalescing operator
			//var el_area = opt.area ?? window;
			var el_parallax = (opt.selector === undefined || opt.selector === null) ? doc.querySelector('.ui-parallax') : opt.selector;
			//var el_parallax = opt.selector ?? doc.querySelector('.ui-parallax');

			//:scope >
			var el_wraps = el_parallax.querySelectorAll('.ui-parallax-wrap');

			act();
			el_area.addEventListener('scroll', act);

			function act() {
				var isWin = el_area === window;
				var areaH = isWin ? window.innerHeight : el_area.offsetHeight;
				var areaT = isWin ? Math.floor(window.scrollY) : Math.floor(el_area.scrollTop);
				var baseT = Math.floor(el_wraps[0].getBoundingClientRect().top);
				
				for (var i = 0, len = el_wraps.length; i < len; i++) {
					var that = el_wraps[i];
					var el_items = that.querySelectorAll('.ui-parallax-item');
					var attrStart = that.dataset.start === undefined ? 0 : that.dataset.start;
					var attrEnd = that.dataset.end === undefined ? 0 : that.dataset.end;
					var h = Math.floor(that.offsetHeight);
					var start = Math.floor(that.getBoundingClientRect().top);
					var end = h + start;
					var s = areaH * Number(attrStart) / 100;
					var e = areaH * Number(attrEnd) / 100;

					if (opt.area !== 'window') {
						start = (start + areaT) - (baseT + areaT);
						end = (end + areaT) - (baseT + areaT);
					}

					(areaT >= start - s) ? 
						that.classList.add('parallax-s') : 
						that.classList.remove('parallax-s');
					(areaT >= end - e) ? 
						that.classList.add('parallax-e') : 
						that.classList.remove('parallax-e');

					for (var i = 0, len = el_items.length; i < len; i++) {
						var that = el_items[i];
						var n = ((areaT - (start - s)) * 0.003).toFixed(2);
						var callbackname = that.dataset.act;

						//n = n < 0 ? 0 : n > 1 ? 1 : n;

						if (!!Global.callback[callbackname]) {
							Global.callback[callbackname]({
								el: that, 
								n: n
							});
						}

						that.setAttribute('data-parallax', n);
					}
					
				} 
			}
		}
	}

	Global.para = {
		get: function(paraname){
			var _tempUrl = win.location.search.substring(1);
			var _tempArray = _tempUrl.split('&');

			for (var i = 0, len = _tempArray.length; i < len; i++) {
				var that = _tempArray[i].split('=');

				if (that[0] === paraname) {
					return that[1];
				}
			}
		}
	}

	Global.focus = {
		options: {
			callback: false
		},
		loop : function(option){
			if (option === undefined) {
				return false;
			}
			
			var opt = Object.assign({}, Global.focus.options, option);
			//var opt = {...this.options, ...option};
			var el = opt.selector;
			var callback = opt.callback;
			// var $focusItem = $base.find('input, h1, h2, h3, a, button, label, textarea, select').eq(0);
			// $focusItem.attr('tabindex', 0).focus();

			if(!el.querySelector('[class*="ui-focusloop-"]')) {
				el.insertAdjacentHTML('afterbegin', '<div tabindex="0" class="ui-focusloop-start"><span>시작지점입니다.</span></div>');
				el.insertAdjacentHTML('beforeend', '<div tabindex="0" class="ui-focusloop-end"><span>마지막지점입니다.</span></div>');
			}

			var el_start = el.querySelector('.ui-focusloop-start');
			var el_end = el.querySelector('.ui-focusloop-end');
		
			el_start.addEventListener('keydown', keyStart);
			el_end.addEventListener('keydown', keyEnd);

			function keyStart(e) {
				if (e.shiftKey && e.keyCode == 9) {
					e.preventDefault();
					el_end.focus();
					// !!callback && callback();
				}
			}

			function keyEnd(e) {
				if (!e.shiftKey && e.keyCode == 9) {
					e.preventDefault();
					el_start.focus();
					// !!callback && callback();
				}
			}
		}
	}

	Global.scrollBar = {
		options : {
			selector: false,
			callback:false,
			infiniteCallback:false,
			space: false,
			remove: false
		},
		init: function(option){
			var opt = Object.assign({}, Global.scrollBar.options, option);
			var scrollBars = doc.querySelectorAll('.ui-scrollbar');

			(sessionStorage.getItem('scrollbarID') === null) && sessionStorage.setItem('scrollbarID', 0);

			if (!!option && !!option.selector) {
				scrollBars = option.selector;
				
				var that = scrollBars;
				var scrollId = that.dataset.scrollId;
				
				if (!that.dataset.ready || that.dataset.ready !== 'yes') {
					//selector로 개별 실행
					if (!scrollId) {
						var idN = Number(JSON.parse(sessionStorage.getItem('scrollbarID'))) + 1;
							
						sessionStorage.setItem('scrollbarID', idN);
						scrollId = 'item' + idN;
						that.dataset.scrollId = scrollId;
					} 
					
					scrollId = opt.id !== undefined ? opt.id : scrollId;

					setTimeout(function(){
						create(scrollId);
					},0);
				}
			} else {
				//기본 selector 없이 실행
				for (var i = 0, len = scrollBars.length; i < len; i++) {
					var that = scrollBars[i];
					var scrollId = that.dataset.scrollId;
					
					console.log('scrollBars: ', i);

					if (!that.dataset.ready || that.dataset.ready !== 'yes') {
						//data-scroll-id가 없다면 섹션스토리지에서 생성한 아이디를 가져와 +1 하여 넣어준다.

						if (!scrollId) {
							var idN = Number(JSON.parse(sessionStorage.getItem('scrollbarID'))) + 1;
								
							sessionStorage.setItem('scrollbarID', idN);
							scrollId = 'item' + idN;
							that.dataset.scrollId = scrollId;
							that.setAttribute('data-scroll-id',  scrollId);
						} 
						console.log('create1: '+ scrollId);
						scrollId = opt.id !== undefined ? opt.id : scrollId
						console.log('create2: '+ scrollId);
						// setTimeout(function(){
							create(scrollId);
						// },0);
					}
				}
			}

			function create(scrollId){
				var callback = opt.callback;
				var infiniteCallback = opt.infiniteCallback;
				var el_scrollbar = doc.querySelector('[data-scroll-id="' + scrollId +'"]');

				var timer;
				var prevHeightPercent = 0;
				var scrollDirection = 'keep';

				
				
				//+reset
				// if (!!el_scrollbar) {
				// 	if (el_scrollbar.dataset.ready === 'yes') {
				// 		return false;
				// 	}
				// } else {
				// 	return false;
				// }
				
				el_scrollbar.classList.remove('ready');
				el_scrollbar.dataset.ready = 'no';
				el_scrollbar.dataset.direction = scrollDirection;
				
				var wrapW = el_scrollbar.offsetWidth;
				var wrapH = el_scrollbar.offsetHeight;

				Global.parts.wrapTag('<div class="ui-scrollbar-item"><div class="ui-scrollbar-wrap">', el_scrollbar ,'</div></div>');

				//++make
				var el_item = el_scrollbar.querySelector('.ui-scrollbar-item');
				var el_itemWrap = el_item.querySelector('.ui-scrollbar-wrap');
				var _display = window.getComputedStyle(el_scrollbar).display;
				var _padding = window.getComputedStyle(el_scrollbar).padding;


				el_itemWrap.style.display = 'block';

				// el_itemWrap.style.display = _display;
				// el_itemWrap.style.padding = _padding;
				// if (_display === 'inline-block') {
				// 	el_itemWrap.style.display = 'block';
				// }

				el_itemWrap.style.width = '100%';
				el_item.style.width = '100%';
				el_scrollbar.style.overflow = 'hidden';

				var itemW = el_item.scrollWidth;
				var itemH = el_item.scrollHeight;

				el_scrollbar.dataset.itemH = itemH;
				el_scrollbar.dataset.itemW = itemW;
				el_scrollbar.dataset.wrapH = wrapH;
				el_scrollbar.dataset.wrapW = wrapW;
				
				if (el_scrollbar.dataset.ready === 'no') {
					el_scrollbar.dataset.ready = 'yes';
					el_scrollbar.classList.add('ready');
					el_item.setAttribute('tabindex', 0);
					el_scrollbar.style.height = wrapH + 'px';

					var html_barwrap = doc.createElement('div');
					var html_barwrapX = doc.createElement('div');
					var html_button = doc.createElement('button');
					var html_buttonX = doc.createElement('button');

					html_barwrap.classList.add('ui-scrollbar-barwrap');
					html_barwrap.classList.add('type-y');
					html_button.classList.add('ui-scrollbar-bar');
					html_button.setAttribute('type', 'button');
					html_button.setAttribute('aria-hidden', true);
					html_button.setAttribute('aria-label', 'vertical scroll button');
					html_button.setAttribute('tabindex', '-1');
					html_button.dataset.scrollxy = 'y';

					html_barwrapX.classList.add('ui-scrollbar-barwrap');
					html_barwrapX.classList.add('type-x');
					html_buttonX.classList.add('ui-scrollbar-bar');
					html_buttonX.setAttribute('type', 'button');
					html_buttonX.setAttribute('aria-hidden', true);
					html_buttonX.setAttribute('aria-label', 'vertical scroll button');
					html_buttonX.setAttribute('tabindex', '-1');
					html_buttonX.dataset.scrollxy = 'x';
					
					html_barwrap.append(html_button);
					html_barwrapX.append(html_buttonX);
					el_scrollbar.prepend(html_barwrap);
					el_scrollbar.prepend(html_barwrapX);

					(wrapH < itemH) ? 
						el_scrollbar.classList.add('view-y') : 
						el_scrollbar.classList.remove('view-y');

					(wrapW < itemW) ? 
						el_scrollbar.classList.add('view-x') : 
						el_scrollbar.classList.remove('view-x');

					var barH = Math.floor(wrapH / (itemH / 100));
					var barW = Math.floor(wrapW / (itemW / 100));
					var el_barY = el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-y .ui-scrollbar-bar');
					var el_barX = el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-x .ui-scrollbar-bar');

					!!el_barY ? el_barY.style.height = barH + '%' : '';
					!!el_barX ? el_barX.style.width = barW + '%' : '';
					!!el_barY ? el_barY.dataset.height = barH : '';
					!!el_barX ? el_barX.dataset.width = barW : '';

					el_scrollbar.classList.add('view-scrollbar');
					!!callback && callback(); 

					scrollEvent(false, el_item);
					scrollbarUpdate(el_scrollbar, wrapH, wrapW, itemH, itemW);
					eventFn(el_scrollbar);
				}

				function scrollbarUpdate(el_scrollbar, wrapH, wrapW, itemH, itemW){
					var _el_scrollbar = el_scrollbar;
					var el_item = _el_scrollbar.querySelector('.ui-scrollbar-item');
					
					if (!el_item) {
						return false;
					}

					var nWrapH = _el_scrollbar.offsetHeight;
					var nWrapW = _el_scrollbar.offsetWidth;
					var nItemH = el_item.scrollHeight;
					var nItemW = el_item.scrollWidth;
					var changeH = (itemH !== nItemH || wrapH !== nWrapH);
					var changeW = (itemW !== nItemW || wrapW !== nWrapW);

					//resizing
					if (changeH || changeW) {
						var barH = Math.floor(nWrapH / (nItemH / 100));
						var barW = Math.floor(nWrapW / (nItemW / 100));
						var el_barY = _el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-y .ui-scrollbar-bar');
						var el_barX = _el_scrollbar.querySelector('.ui-scrollbar-barwrap.type-x .ui-scrollbar-bar');

						if (changeH) {
							el_barY.style.height = barH + '%';
							el_barY.dataset.height = barH;
						} 
						if (changeW) {
							el_barX.style.width = barW + '%';
							el_barX.dataset.width = barW;
						}
						
						if (nWrapH < nItemH) {
							_el_scrollbar.classList.add('view-y');

							(nWrapW < (nItemW - 17)) ? 
							_el_scrollbar.classList.add('view-x') : 
							_el_scrollbar.classList.remove('view-x');

						} else {
							_el_scrollbar.classList.remove('view-y');

							(nWrapW < nItemW) ? 
							_el_scrollbar.classList.add('view-x') : 
							_el_scrollbar.classList.remove('view-x');

						}
							
						el_scrollbar.dataset.itemH = nItemH;
						el_scrollbar.dataset.itemW = nItemW;
						el_scrollbar.dataset.wrapH = nWrapH;
						el_scrollbar.dataset.wrapW = nWrapW;
					}

					setTimeout(function(){
						scrollbarUpdate(el_scrollbar, nWrapH, nWrapW, nItemH, nItemW);
					}, 300);
				}

				function eventFn(v){
					var _el_scrollbar = el_scrollbar;
					var el_item = _el_scrollbar.querySelector('.ui-scrollbar-item');
					var el_bar = _el_scrollbar.querySelectorAll('.ui-scrollbar-bar');
	
					el_item.addEventListener('scroll', scrollEvent);
					
					for (var i = 0, len = el_bar.length; i < len; i++) {
						var that = el_bar[i];

						that.addEventListener('mousedown', dragMoveAct);
					}
				}	
				
				function scrollEvent(event, el_item){
					var _el_item = !!event ? event.target : el_item;
					var el_scrollbar = _el_item.closest('.ui-scrollbar');
					var itemH = Number(el_scrollbar.dataset.itemH);
					var itemW = Number(el_scrollbar.dataset.itemW);
					var wrapH = Number(el_scrollbar.dataset.wrapH);
					var wrapW = Number(el_scrollbar.dataset.wrapW);
	
					//el_scrollbar.dataset 값이 없을 경우 4개의 값중 하나라도 없으면 중단
					if (wrapW === undefined) {
						return false;
					}
	
					var el_barY = el_scrollbar.querySelector('.type-y .ui-scrollbar-bar');
					var el_barX = el_scrollbar.querySelector('.type-x .ui-scrollbar-bar');
					var scrT = _el_item.scrollTop;
					var scrL = _el_item.scrollLeft;
					var barH = Number(el_barY.dataset.height);
					var barW = Number(el_barX.dataset.width);
					var hPer = Math.round(scrT / (itemH - wrapH) * 100);
					var wPer = Math.round(scrL / (itemW - wrapW) * 100);
					var _hPer = (barH / 100) * hPer;
					var _wPer = (barW / 100) * wPer;
					
					el_barY.style.top = hPer - _hPer + '%';
					el_barX.style.left = wPer - _wPer + '%';
					
					if (prevHeightPercent < scrT) {
						scrollDirection = 'down';
					} else if (prevHeightPercent > scrT) {
						scrollDirection = 'up';
					} else {
						scrollDirection = 'keep';
					}
	
					el_scrollbar.dataset.direction = scrollDirection;
					prevHeightPercent = scrT;
	
					if (hPer === 100 && scrollDirection === 'down') {
						clearTimeout(timer);
						timer = setTimeout(function() {
							!!infiniteCallback && infiniteCallback();
						},200);
					}
				}
				
				function dragMoveAct(event) {
					var body = doc.querySelector('body');
					var el_bar = event.target;
					var el_scrollbar = el_bar.closest('.ui-scrollbar');
					var el_barWrap = el_bar.closest('.ui-scrollbar-barwrap');
					var el_item = el_scrollbar.querySelector('.ui-scrollbar-item');
					var itemH = Number(el_scrollbar.dataset.itemH);
					var itemW = Number(el_scrollbar.dataset.itemW);
					var el_barWrapRect = el_barWrap.getBoundingClientRect();
					var off_t = el_barWrapRect.top + doc.documentElement.scrollTop;
					var off_l = el_barWrapRect.left + doc.documentElement.scrollLeft;
					var w_h = el_barWrapRect.height;
					var w_w = el_barWrapRect.width;
					var barH = el_bar.getAttribute('data-height');
					var barW = el_bar.getAttribute('data-width');
					var isXY = el_bar.getAttribute('data-scrollxy');
	
					body.classList.add('scrollbar-move');
	
					doc.addEventListener('mousemove', mousemoveAct);
					doc.addEventListener('mouseup', mouseupAct);
	
					function mousemoveAct(event){
						var y_m; 
						var x_m;
						
						if (event.touches === undefined) {
							if (event.pageY !== undefined) {
								y_m = event.pageY;
							} else if (event.pageY === undefined) {
								y_m = event.clientY;
							}
	
							if (event.pageX !== undefined) {
								x_m = event.pageX;
							} else if (event.pageX === undefined) {
								x_m = event.clientX;
							}
						}
	
						var yR = y_m - off_t;
						var xR = x_m - off_l;
	
						yR = yR < 0 ? 0 : yR;
						yR = yR > w_h ? w_h : yR;
						xR = xR < 0 ? 0 : xR;
						xR = xR > w_w ? w_w : xR;
	
						var yRPer = yR / w_h * 100;
						var xRPer = xR / w_w * 100;
						var nPerY = (yRPer - (barH / 100 * yRPer)).toFixed(2);
						var nPerX = (xRPer - (barW / 100 * xRPer)).toFixed(2);
	
						if (isXY === 'y') {
							el_bar.style.top = nPerY + '%';
							el_item.scrollTop = itemH * nPerY / 100;
						} else {
							el_bar.style.left = nPerX + '%';
							el_item.scrollLeft = itemW * nPerX / 100;
						}
					}
					function mouseupAct(){
						body.classList.remove('scrollbar-move');
						doc.removeEventListener('mousemove', mousemoveAct);
						doc.removeEventListener('mouseup', mouseupAct);
					}
				}
			}
		},
		destroy: function(v){
			var el_scrollbar = doc.querySelector('[data-scroll-id="' + v +'"]');
			var el_barwrap = el_scrollbar.querySelectorAll('.ui-scrollbar-barwrap');
			var el_item = el_scrollbar.querySelector('.ui-scrollbar-item');
			var el_wrap = el_item.querySelector('.ui-scrollbar-wrap');
			var wrapHtml = el_wrap.innerHTML;

			el_scrollbar.dataset.ready = 'no';
			el_scrollbar.classList.remove('ready');
			el_scrollbar.classList.remove('view-y');
			el_scrollbar.classList.remove('view-x');
			el_scrollbar.classList.remove('view-scrollbar');
			el_scrollbar.style.overflow = 'auto';

			el_barwrap.forEach(function(userItem) {
				el_scrollbar.removeChild(userItem);
			});
			el_scrollbar.removeChild(el_item);
			el_scrollbar.innerHTML = wrapHtml;
		},
		reset: function(v){
			Global.scrollBar.destroy(v);
			Global.scrollBar.init(v);
		}
	}
	
	Global.popup = {
		options: {
			name: 'new popup',
			width: 790,
			height: 620,
			align: 'center',
			top: 0,
			left: 0,
			toolbar: 'no',
			location: 'no',
			menubar: 'no',
			status: 'no',
			resizable: 'no',
			scrollbars: 'yes'
		},
		open: function(option){
			var opt = Object.assign({}, this.options, option);
			var name = opt.name;
			var width = opt.width;
			var height = opt.height;
			var align = opt.align;
			var toolbar = opt.toolbar;
			var location = opt.location;
			var menubar = opt.menubar;
			var status = opt.status;
			var resizable = opt.resizable;
			var scrollbars = opt.scrollbars;
			var link = opt.link;
			var top = opt.top;
			var left = opt.left;

			if (align === 'center') {
				left = (win.innerWidth / 2) - (width / 2);
				top = (win.innerHeight / 2) - (height / 2);
			}

			var specs = 'width=' + width + ', height='+ height + ', left=' + left + ', top=' + top + ', toolbar=' + toolbar + ', location=' + location + ', resizable=' + resizable + ', status=' + status + ', menubar=' + menubar + ', scrollbars=' + scrollbars;
			
			win.open(link, name , specs);
		}
	}

	Global.cookie = {
		set: function(opt){
			var name = opt.name;
			var value = opt.value;
			var term = opt.term;
			var path = opt.path;
			var domain = opt.domain;
			var cookieset = name + '=' + value + ';';
			var expdate;

			if (term) {
				expdate = new Date();
				expdate.setTime( expdate.getTime() + term * 1000 * 60 * 60 * 24 ); // term 1 is a day
				cookieset += 'expires=' + expdate.toGMTString() + ';';
			}
			(path) ? cookieset += 'path=' + path + ';' : '';
			(domain) ? cookieset += 'domain=' + domain + ';' : '';

			document.cookie = cookieset;
		},
		get: function(name){
			var match = ( document.cookie || ' ' ).match( new RegExp(name + ' *= *([^;]+)') );

			return (match) ? match[1] : null;
		},
		del: function(name){
			var expireDate = new Date();

			expireDate.setDate(expireDate.getDate() + -1);
			this.set({ 
				name: name, 
				term: '-1' 
			});
		}
	}

	Global.table = {
		sort: function(opt){
			var table = doc.querySelector('#' + opt.id);
			var switchcount = 0;
			var switching = true;
			var dir = "asc";
			var rows, o, x, y, shouldSwitch;

			while (switching) {
				switching = false;
				rows = table.getElementsByTagName('TR');
			}

			for (o = 1; o < rows.length - 1; o++) {
				shouldSwitch = false;
				x = rows[o].getElementsByTagName('TD')[opt.n];
				y = rows[o + 1].getElementsByTagName('TD')[opt.n];

				if (dir === 'asc') {
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				} else if(dir === 'desc') {
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				}
			}

			if (shouldSwitch) {
				rows[o].parentNode.insertBefore(rows[o + 1], rows[o]);
				switching = true;
				switchcount ++;
			} else {
				if (switchcount === 0 && dir === 'asc') {
					dir = 'desc';
					switching = true;
				}
			}
		},
		caption: function(){
			var el_captions = doc.querySelectorAll('.ui-caption');

			for (var i = 0, len = el_captions.length; i < len; i++) {
				var that = el_captions[i];
				var el_table = that.closest('table');
				var ths = el_table.querySelectorAll('th');

				var captionTxt = '';

				that.textContent = '';
	
				for (var i = 0, len = ths.length; i < len; i++) {
					var _that = ths[i];
					var isThead = (_that.parentNode.parentNode.tagName === 'THEAD');
					var isColSpan = _that.getAttribute('colspan');
					var isRowSpan = _that.getAttribute('rowspan');

					var txt = _that.textContent;
					txt = txt.trim();

					(captionTxt !== '') ?
						captionTxt += ', ' + txt:
						captionTxt += txt;
				}
				
				that.textContent = captionTxt + ' 정보입니다.';
			}
			
		},
		scrollOption: {
			callback:false
		},
		scroll: function(option){
			var opt = Object.assign({}, this.scrollOption, option);
			var callback = opt.callback;
			var el_wraps = doc.querySelectorAll('.ui-tablescroll');

			for (var i = 0, len = el_wraps.length; i < len; i++) {
				var that = el_wraps[i];
				var el_tblWrap = that.querySelector('.ui-tablescroll-wrap');
				var el_tbl = el_tblWrap.querySelector('table');
				var cloneTable = el_tbl.cloneNode(true);

				if (!el_tbl.querySelector('.ui-tablescroll-clone')) {
					that.prepend(cloneTable);

					//:scope >
					var clone_tbl = that.querySelector('table:first-child');

					var clone_ths = clone_tbl.querySelectorAll('th');
					var clone_caption = clone_tbl.querySelector('caption');
					var clone_tbodys = clone_tbl.querySelectorAll('tbody');

					clone_caption.remove();

					for (var i = 0, len = clone_tbodys.length; i < len; i++) {
						var that = clone_tbodys[i];

						that.remove();
					}

					clone_tbl.classList.add('ui-tablescroll-clone');
					clone_tbl.setAttribute('aria-hidden', true);

					for (var i = 0, len = clone_ths.length; i < len; i++) {
						var that = clone_ths[i];

						that.setAttribute('aria-hidden', true);
					}
				}
			}

			!!callback && callback();
		},
		fixTd : function() {
			var el_tbls = doc.querySelectorAll('.ui-fixtd');
			
			for (var i = 0, len = el_tbls.length; i < len; i++) {
				var that = el_tbls[i];
				var el_tblCols = that.querySelectorAll('col');
				var el_tblTrs = that.querySelectorAll('tr');

				var fix_n = Number(that.dataset.fix);
				var view_n = Number(that.dataset.view);
				var col_len = el_tblCols.length;
				var fix_sum = col_len - fix_n;
				var len = el_tblTrs.length;
				var tit = [];
	
				that.setAttribute('data-current', 1)
				that.setAttribute('data-total', col_len);
	
				for (var i = 0; i < len; i++) {
					for (var j = 0; j < fix_sum; j++) {
						var tr = el_tblTrs[i];
						var thead = tr.closest('thead');

						//:scope >
						var tds = tr.querySelectorAll('*');

						var td = tds[j + fix_sum - 1];
						var jj = (j + 1);
						
						el_tblCols[j + fix_sum - 1].classList.add('ui-fixtd-n' + jj);
						td.classList.add('ui-fixtd-n' + jj);
						td.dataset.n = j;

						if (!!thead) {
							tit.push(td.textContent);
							td.insertAdjacentHTML('beforeend', '<button type="button" class="ui-fixtd-btn prev" data-btn="prev" data-idx="'+ jj +'"><span class="a11y-hidden">previous</span></button>');
							td.insertAdjacentHTML('afterbegin', '<button type="button" class="ui-fixtd-btn next" data-btn="next" data-idx="'+ jj +'"><span class="a11y-hidden">next</span></button>');
						}
					}
				}

				var el_btns = that.querySelectorAll('.ui-fixtd-btn');

				for (var i = 0, len = el_btns.length; i < len; i++) {
					var that = el_btns[i];

					that.addEventListener('click', act);
				}
			}

			function act(e){
				var btn = e.currentTarget;
				var el_table = btn.closest('.ui-fixtd');
				var this_sum = Number(el_table.dataset.total - el_table.dataset.fix);
				var n = Number(el_table.dataset.current);
				
				(btn.dataset.btn === 'next') ? 
					el_table.dataset.current = (n + 1 > this_sum) ? n = 1 : n + 1:
					el_table.dataset.current = (n - 1 <= 0) ? n = this_sum : n - 1;
			}
		}
	}

	Global.form = {
		init: function(opt){
			var el_inps = doc.querySelectorAll('.inp-base');

			for (var i = 0, len = el_inps.length; i < len; i++) {
				var that = el_inps[i];
				var el_wrap = that.parentNode;
				var el_form = that.closest('[class*="ui-form"]');
				var unit = that.dataset.unit;
				var prefix = that.dataset.prefix;
				var el_label = el_form.querySelector('.form-item-label');
				var el_unit = el_wrap.querySelector('.unit');
				var el_prefix = el_wrap.querySelector('.prefix');
				var space = 0;

				that.removeAttribute('style');
				el_unit && el_unit.remove();
				el_prefix && el_prefix.remove();

				var pdr = parseFloat(doc.defaultView.getComputedStyle(that).getPropertyValue('padding-right'));
				var pdl = parseFloat(doc.defaultView.getComputedStyle(that).getPropertyValue('padding-left'));

				if (unit !== undefined) {
					el_wrap.insertAdjacentHTML('beforeend', '<div class="unit">'+unit+'</div>');
					el_unit = el_wrap.querySelector('.unit');
					space = Math.floor(el_unit.offsetWidth) + (pdr / 2) ;
				}

				that.style.paddingRight = Number(space + pdr);;
				that.dataset.pdr = space + pdr;
				that.setAttribute('pdr', space + pdr);
				space = 0;
				
				if (prefix !== undefined) {					
					el_wrap.insertAdjacentHTML('afterbegin', '<div class="prefix">'+prefix+'</div>');
					el_prefix = el_wrap.querySelector('.prefix');
					space = Math.floor(el_prefix.offsetWidth) + pdl;
					that.style.paddingLeft = (space + pdl) + 'px';
					that.dataset.pdl = space + pdl;
					el_label.style.marginLeft = space + 'px';
				}

				this.isValue(that, false);
				that.style.paddingLeft = space + pdl;
				that.dataset.pdl = space + pdl;

				var select_btns = doc.querySelectorAll('.ui-select-btn');
				var datepicker_btns = doc.querySelectorAll('.ui-datepicker-btn');

				for (var i = 0, len = select_btns.length; i < len; i++) {
					var that = select_btns[i];

					that.removeEventListener('click', this.actValue);
					that.addEventListener('click', this.actValue);
				}

				for (var i = 0, len = datepicker_btns.length; i < len; i++) {
					var that = datepicker_btns[i];

					that.removeEventListener('click', this.actValue);
					that.addEventListener('click', this.actValue);
					that.addEventListener('click', this.actDaterpicker);
				}

				that.removeEventListener('keyup', this.actValue);
				that.removeEventListener('focus', this.actValue);
				that.removeEventListener('blur', this.actUnValue);

				that.addEventListener('keyup', this.actValue);
				that.addEventListener('focus', this.actValue);
				that.addEventListener('blur', this.actUnValue);
			}
		},
		actDaterpicker: function(e){
			e.preventDefault();

			var that = e.currentTarget;
			var el_datepicker = that.closest('.ui-datepicker');
			var el_inp = el_datepicker.querySelector('.inp-base');

			Global.sheets.bottom({
				id: el_inp.id,
				callback: function(){
					Global.datepicker.init({
						id: el_inp.id,
						date: el_inp.value,
						min: el_inp.min,
						max: el_inp.max,
						title: el_inp.title,
						period: el_inp.dataset.period,
						callback: function(){
							console.log('callback init')
						}
					});
				}
			});

		},
		actValue: function (e){
			var that = e.currentTarget;
			
			Global.form.isValue(that, true);
		},
		actUnValue: function (e){
			var inp = e.currentTarget;
			var wrap = inp.parentNode;
			var el_clear = wrap.querySelector('.ui-clear');
			var pdr = Number(inp.dataset.pdr);

			Global.form.isValue(inp, false);

			setTimeout(function(){
				inp.style.paddingRight = pdr + 'px'; 
				el_clear && el_clear.remove();
			},100);
		},
		isValue: function (inp, value){
			var el_inp = inp;
			var el_wrap = el_inp.parentNode;
			var el_inner = el_inp.closest('.ui-form-inner');
			//var el_inp = el_wrap.querySelector('.inp-base');

			var el_clear = el_wrap.querySelector('.ui-clear');
			var pdr = Number(el_inp.dataset.pdr);
			
			if (!!el_inner) {
				if (value) {
					el_inner.classList.add('is-value');
				} else {
					(!!el_inp.value) ? 
						el_inner.classList.add('is-value'):
						el_inner.classList.remove('is-value');
				}
			}
			
			if (el_inp.readonly || el_inp.disabled || el_inp.type === 'date') {
				return false;
			}

			if (el_inp.value === undefined || el_inp.value === '') {
				el_inp.style.paddingRight = pdr + 'px'; 
				el_clear = el_wrap.querySelector('.ui-clear');
				
				!!el_clear && el_clear.removeEventListener('click', this.actClear);
				!!el_clear && el_clear.remove();
			} else {
				if (!el_clear) {
					if (el_inp.tagName === 'INPUT') { 
						el_wrap.insertAdjacentHTML('beforeend', '<button type="button" class="ui-clear icon-clear" tabindex="-1" aria-hidden="true"  style="margin-right:'+ pdr +'px"><span class="a11y-hidden">내용지우기</span></button>');

						el_clear = el_wrap.querySelector('.ui-clear');
						el_clear.addEventListener('click', this.actClear);

						el_inp.style.paddingRight = pdr + el_clear.offsetWidth + 'px'; 
					} else {
						el_inp.style.paddingRight = pdr + 'px'; 
					}
				} 
			}
		},
		actClear: function(e){
			var that = e.currentTarget;
			var el_wrap = that.parentNode;
			var el_inp = el_wrap.querySelector('.inp-base');
			var pdr = Number(el_inp.dataset.pdr);

			el_inp.style.paddingRight = pdr + 'px'
			el_inp.value = '';
			el_inp.focus();
			that.remove();
		},
		fileUpload: function() {
			var el_files = document.querySelectorAll('.ui-file-inp');
			var fivarypes = [
				"image/apng",
				"image/bmp",
				"image/gif",
				"image/jpeg",
				"image/pjpeg",
				"image/png",
				"image/svg+xml",
				"image/tiff",
				"image/webp",
				"image/x-icon"
			];

			for (var i = 0, len = el_files.length; i < len; i++) {
				var that = el_files[i];

				if (!that.dataset.ready) {
					that.addEventListener('change', updateImageDisplay);
					that.dataset.ready = true;
				}
			}
			
			function updateImageDisplay(e) {
				var el_file = e.currentTarget;
				var id = el_file.id;
				var preview = document.querySelector('.ui-file-list[data-id="'+ id +'"]');

				while(preview.firstChild) {
					preview.removeChild(preview.firstChild);
				}

				var curFiles = el_file.files;

				if(curFiles.length === 0) {
					var para = document.createElement('p');
					para.textContent = 'No files currently selected for upload';
					preview.appendChild(para);
				} else {
					var list = document.createElement('ul');
					var title = document.createElement('h4');
					var delbutton = document.createElement('button');

					delbutton.type = 'button';
					delbutton.classList.add('ui-file-del');
					delbutton.dataset.id = id;

					title.textContent = 'File upload list';
					title.classList.add('a11y-hidden');
					preview.classList.add('on');
					preview.appendChild(title);
					preview.appendChild(list);
					preview.appendChild(delbutton);

					var delbuttonSpan = document.createElement('span'); 

					delbuttonSpan.textContent = 'Devare attachment';
					delbuttonSpan.classList.add('a11y-hidden');
					delbutton.appendChild(delbuttonSpan);
					
					for (var i = 0, len = curFiles.length; i < len; i++) {
						var that = curFiles[i];
						var listItem = document.createElement('li');
						var para = document.createElement('p');

						if(validFivarype(that)) {
							para.textContent = that.name + ', ' + returnFileSize(that.size) + '.';
							
							var image = document.createElement('img');
							image.src = URL.createObjectURL(that);

							listItem.appendChild(image);
							listItem.appendChild(para);
							
						} else {
							para.textContent = that.name;
							listItem.appendChild(para);
						}
				
						list.appendChild(listItem);
					}

					delbutton.addEventListener('click', fileDevare);
				}
			}

			function fileDevare(e){
				var id = e.currentTarget.dataset.id;
				var list = document.querySelector('.ui-file-list[data-id="'+ id +'"]');
				var inp = document.querySelector('#'+ id);

				list.classList.remove('on');
				while(list.firstChild) {
					list.removeChild(list.firstChild);
				}
				inp.value = ''; 
			}

			function validFivarype(file) {
				return fivarypes.includes(file.type);
			}

			function returnFileSize(number) {
				if(number < 1024) {
					return number + 'bytes';
				} else if(number >= 1024 && number < 1048576) {
					return (number/1024).toFixed(1) + 'KB';
				} else if(number >= 1048576) {
					return (number/1048576).toFixed(1) + 'MB';
				}
			}
		},
		allCheck: function (opt) {
			var el_parents = document.querySelectorAll('[data-allcheck-parent]');
			var el_childs = document.querySelectorAll('[data-allcheck-child]');
			var opt_callback = opt.allCheckCallback;

			for (var i = 0, len = el_parents.length; i < len; i++) {
				var that = el_parents[i];

				if (!that.dataset.apply) {
					that.addEventListener('change', allCheckParent);
					isAllChecked({
						name: that.dataset.allcheckParent, 
						type: 'child'
					});
				}

				that.dataset.apply = '1';
			}

			for (var i = 0, len = el_childs.length; i < len; i++) {
				var that = el_childs[i];

				if (!that.dataset.apply) {
					that.addEventListener('change', allCheckChild);
				}

				that.dataset.apply = '1';
			}

			function allCheckParent() {
			   isAllChecked({
					name: this.dataset.allcheckParent, 
					type: 'parent'
				});
			}

			function allCheckChild() {
				isAllChecked({
					name: this.dataset.allcheckChild, 
					type: 'child'
				});
			}
			
			function isAllChecked(opt){
				var isType = opt.type;
				var isName = opt.name;
				var parent = document.querySelector('[data-allcheck-parent="' + isName + '"]');
				var childs = document.querySelectorAll('[data-allcheck-child="' + isName + '"]');
				var allChecked = parent.checked;
				var len = childs.length;
				var n_checked = 0;
				var n_disabled = 0;

				for (var i = 0; i < len; i++) {
					var child = childs[i];
					
					if (isType === 'parent' && !child.disabled) {
						child.checked = allChecked;
					} 
					
					n_checked = child.checked && !child.disabled ? ++n_checked : n_checked;
					n_disabled = child.disabled ? ++n_disabled : n_disabled;
				}

				parent.checked = (len !== n_checked + n_disabled) ? false : true;

				opt_callback({
					group: isName,
					allChecked: parent.checked
				});
			}
		}
		
	}

	Global.rangeSlider = {
		init: function(opt){
			var id = opt.id;
			var el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			var el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			var el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');

			if (el_from && el_to) {
				//range
				Global.rangeSlider.rangeFrom({
					id: id
				});
				Global.rangeSlider.rangeTo({
					id: id
				});
				el_from.addEventListener("input", function(){
					Global.rangeSlider.rangeFrom({
						id: id
					});
				});
				el_to.addEventListener("input", function(){
					Global.rangeSlider.rangeTo({
						id: id
					});
				});

			} else {
				//single
				Global.rangeSlider.rangeFrom({
					id: id,
					type: 'single'
				});
				el_from.addEventListener("input", function(){
					Global.rangeSlider.rangeFrom({
						id: id,
						type: 'single'
					});
				});
			}
		},
		rangeFrom: function(opt){
			var id = opt.id;
			var v = opt.value;
			var el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			var el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			var el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');
			var el_left = el_range.querySelector(".ui-range-btn.left");
			var el_right = el_range.querySelector(".ui-range-btn.right");
			var el_bar = el_range.querySelector(".ui-range-bar");
			var inp_froms = document.querySelectorAll('[data-'+ id +'="from"]');
			var percent;
			var value = el_from.value;
			var min = el_from.min;
			var max = el_from.max;

			if (v) {
				el_from.value = v;
			}

			var from_value = +el_from.value;
			
			if (opt.type !== 'single') {
				if (+el_to.value - from_value < 0) {
					from_value = +el_to.value - 0;
					el_from.value = from_value;
				}

				percent = ((from_value - +min) / (+max - +min)) * 100;

				el_right.classList.remove('on');
				el_to.classList.remove('on');
				el_left.style.left = percent + '%';
				el_bar.style.left = percent + '%';
			} else {
				if (from_value < 0) {
					from_value = 0;
				}
				percent = ((from_value - +min) / (+max - +min)) * 100;
				el_left.style.left = percent + '%';
				el_bar.style.right = (100 - percent) + '%';
			}

			el_left.classList.add('on');
			el_from.classList.add('on');
			
			for (var i = 0, len = inp_froms.length; i < len; i++) {
				var that = inp_froms[i];

				if (that.tagName === 'INPUT') {
					that.value = from_value;
				} else {
					that.textContent = from_value;
				}
			}
		},
		rangeTo: function(opt){
			var id = opt.id;
			var v = opt.value;
			var el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			var el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			var el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');
			var el_left = el_range.querySelector(".ui-range-btn.left");
			var el_right = el_range.querySelector(".ui-range-btn.right");
			var el_bar = el_range.querySelector(".ui-range-bar");
			var inp_tos = document.querySelectorAll('[data-'+ id +'="to"]');
			var value = el_to.value;
			var min = el_to.min;
			var max = el_to.max;

			if (v) {
				el_to.value = v;
			}

			var to_value = +el_to.value;

			if (+value - +el_from.value < 0) {
				to_value = +el_from.value + 0;
				el_to.value = to_value;
			}

			var percent = ((to_value - +min) / (+max - +min)) * 100;

			el_right.classList.add('on');
			el_left.classList.remove('on');
			el_to.classList.add('on');
			el_from.classList.remove('on');
			el_right.style.right = (100 - percent) + '%';
			el_bar.style.right = (100 - percent) + '%';

			for (var i = 0, len = inp_tos.length; i < len; i++) {
				var that = inp_tos[i];

				if (that.tagName === 'INPUT') {
					that.value = el_to.value;
				} else {
					that.textContent = el_to.value;
				}
			}
		}
	}

	Global.datepicker = {
		destroy: function(opt){
			var is_dim = !!doc.querySelector('.sheet-dim');
			var callback = opt === undefined || opt.callback === undefined ? false : opt.callback;
			var el_dp;

			if (is_dim) {
				Global.sheets.dim(false);
			}
			
			if (!opt) {
				el_dp = document.querySelectorAll('.datepicker');

				for (var i = 0, len = el_dp.length; i < len; i++) {
					var that = el_dp[i];

					that.remove();
				}
			} else {
				el_dp = document.querySelector('.datepicker[data-id="'+ opt.id +'"]');

				el_dp.remove();
			}

			!!callback && callback();
		},
		open: function(id) {
			var base = doc.querySelector('#' + id);

			Global.sheets.bottom({
				id: base.id,
				callback: function(){
					Global.datepicker.init({
						id: base.id,
						date: base.value,
						min: base.min,
						max: base.max,
						title: base.title,
						period: base.dataset.period,
						callback: function(){
							console.log('callback init')
						}
					});
				}
			});
		},
		init: function(opt) {
			var setId = opt.id;
			var currentDate = opt.date;
			var endDate = opt.date;
			var title = opt.title;
			var el_inp = document.querySelector('#' + setId);
			var el_uidp = el_inp.closest('.ui-datepicker');
			var el_start = el_uidp.querySelector('[data-period="start"]');
			var el_end = el_uidp.querySelector('[data-period="end"]');
			var setDate = (opt.date === '' || opt.date === undefined) ? new Date(): opt.date;
			var period = (opt.period === '' || opt.period === undefined) ? false : opt.period;
			var area = (opt.area === '' || opt.area === undefined) ? document.querySelector('body') : opt.area;
			var date = new Date(setDate);
			var _viewYear = date.getFullYear();
			var _viewMonth = date.getMonth();
			var el_dp = document.querySelector('.datepicker[data-id="'+setId+'"]');
			var yyyymm = _viewYear + '-' + Global.parts.add0(_viewMonth + 1);
			var callback = opt === undefined || opt.callback === undefined ? false : opt.callback;
			var _dpHtml = '';
			
			Global.datepicker.destroy();

			if (!!period || !!el_end) {
				period = true;
				endDate = el_end.value;
			}
			if (!el_dp) {
				if (period) {
					_dpHtml += '<section class="datepicker" data-id="'+setId+'" data-date="'+yyyymm+'" data-start="'+currentDate+'" data-end="'+endDate+'" data-period="start">';
				} else {
					_dpHtml += '<section class="datepicker" data-id="'+setId+'" data-date="'+yyyymm+'" data-start="'+currentDate+'">';
				}
				
				_dpHtml += '<div class="datepicker-wrap">';

				_dpHtml += '<div class="datepicker-header">';
				_dpHtml += '<h3 class="datepicker-title">'+title+'</h3>';
				_dpHtml += '<button type="button" class="ui-prev-y" data-dpid="'+setId+'"><span class="a11y-hidden">이전 년도</span></button>';
				_dpHtml += '<div class="datepicker-yy"></div>';
				_dpHtml += '<button type="button" class="ui-next-y" data-dpid="'+setId+'"><span class="a11y-hidden">다음 년도</span></button>';
				_dpHtml += '<button type="button" class="ui-prev-m" data-dpid="'+setId+'"><span class="a11y-hidden">이전 월</span></button>';
				_dpHtml += '<div class="datepicker-mm"></div>';
				_dpHtml += '<button type="button" class="ui-next-m" data-dpid="'+setId+'"><span class="a11y-hidden">다음 월</span></button>';
				_dpHtml += '<button type="button" class="ui-today" data-dpid="'+setId+'"><span class="a11y-hidden">오늘</span></button>';
				_dpHtml += '</div>';

				_dpHtml += '<div class="datepicker-body">';
				_dpHtml += '<table>';
				_dpHtml += '<caption>'+title+'</caption>';
				_dpHtml += '<colgroup>';
				_dpHtml += '<col span="7">';
				_dpHtml += '</colgroup>';
				_dpHtml += '<thead>';
				_dpHtml += '<tr>';
				_dpHtml += '<th scope="col">일</th>';
				_dpHtml += '<th scope="col">월</th>';
				_dpHtml += '<th scope="col">화</th>';
				_dpHtml += '<th scope="col">수</th>';
				_dpHtml += '<th scope="col">목</th>';
				_dpHtml += '<th scope="col">금</th>';
				_dpHtml += '<th scope="col">토</th>';
				_dpHtml += '</tr>';
				_dpHtml += '</thead>';
				_dpHtml += '<tbody class="datepicker-date"></tbody>';
				_dpHtml += '</table>';
				_dpHtml += '</div>';

				_dpHtml += '<div class="datepicker-footer">';
				_dpHtml += '<div class="wrap-btn">';
				_dpHtml += '<button type="button" class="btn-mix-outlined ui-confirm" data-confirm="'+ setId +'"><span>확인</span></button>';
				_dpHtml += '</div>';
				_dpHtml += '</div>';

				_dpHtml += '</div>';
				_dpHtml += '</section>';

				area.insertAdjacentHTML('beforeend',_dpHtml);
				//document.querySelector('#' + setId).parentNode.insertAdjacentHTML('beforeend',_dpHtml);
				el_dp = document.querySelector('.datepicker[data-id="'+setId+'"]');

				this.dateMake({
					setDate: date,
					currentDate: currentDate, 
					setId: setId,
					period: period
				});

				_dpHtml = null;

				!!callback && callback();
				
				//event
				var nextY = el_dp.querySelector('.ui-next-y');
				var prevY = el_dp.querySelector('.ui-prev-y');
				var nextM = el_dp.querySelector('.ui-next-m');
				var prevM = el_dp.querySelector('.ui-prev-m');
				var today = el_dp.querySelector('.ui-today');
				var confirm = el_dp.querySelector('.ui-confirm');

				nextY.addEventListener('click', Global.datepicker.nextYear);
				prevY.addEventListener('click', Global.datepicker.prevYear);
				nextM.addEventListener('click', Global.datepicker.nextMonth);
				prevM.addEventListener('click', Global.datepicker.prevMonth);
				today.addEventListener('click', Global.datepicker.goToday);
				confirm.addEventListener('click', function(){
					Global.datepicker.confirm({
						id: this.dataset.confirm
					});
				});
			}
		},
		confirm: function(opt){
			console.log(opt.id)
			var el_btn = document.querySelector('.ui-confirm[data-confirm="'+opt.id+'"]');
			var el_dp = el_btn.closest('.datepicker');
			var startDay = el_dp.dataset.start;
			var endDay = el_dp.dataset.end;
			var id = el_dp.dataset.id;
			var el_inp = document.getElementById(id);

			var el_uidp = el_inp.closest('.ui-datepicker');	
			var el_start = el_uidp.querySelector('[data-period="start"]');
			var el_end = el_uidp.querySelector('[data-period="end"]');
			var callback = opt === undefined || opt.callback === undefined ? false : opt.callback;

			el_inp.value = startDay;

			!!callback && callback();

			if (!!el_end) {
				el_end.value = endDay;
			}

			if (el_dp.classList.contains('sheet-bottom')) {
				Global.sheets.bottom({
					id: id,
					state: false,
					callback: function(){
						Global.datepicker.destroy({
							id : id
						});
					}
				});
			} else {
				Global.datepicker.destroy({
					id : id
				});
			}
		},
		dateMake: function(opt){
			var setDate = opt.setDate;

			var setId = opt.setId;
			var el_dp = document.querySelector('.datepicker[data-id="' + setId + '"]');
			var el_inp = document.querySelector('#' + setId);
			var el_uidp = el_inp.closest('.ui-datepicker');	
			var el_start = el_uidp.querySelector('[data-period="start"]');
			var el_end = el_uidp.querySelector('[data-period="end"]');

			if (!!el_dp.dataset.period) {
				if (el_dp.dataset.end !== '' && (el_dp.dataset.end !== el_dp.dataset.start)) {
					el_dp.dataset.period = 'end';
				}
			}

			var period = el_dp.dataset.period;
			var min = el_inp.getAttribute('min');
			var max = el_inp.getAttribute('max');

			if (period === 'end') {
				min = el_end.getAttribute('min');
				max = el_end.getAttribute('max');
			}

			var date = setDate;
			var today = new Date();
			var min_day = new Date(min);
			var max_day = new Date(max);
			var startDay = el_dp.dataset.start;
			var startDate = null;
			var endDay = null;
			var endDate = null;

			if (period === 'end') {
				endDay = el_dp.dataset.end;
			}

			//설정된 날
			var viewYear = date.getFullYear();
			var viewMonth = date.getMonth();
			var viewDay = date.getDate();
			//오늘
			var _viewYear = today.getFullYear();
			var _viewMonth = today.getMonth();
			var _viewDay = today.getDate();
			//선택한 날
			var start_viewYear = null;
			var start_viewMonth = null;
			var start_viewDay = null;
			//선택한 날
			var end_viewYear = null;
			var end_viewMonth = null;
			var end_viewDay = null;
			//최소
			var min_viewYear = min_day.getFullYear();
			var min_viewMonth = min_day.getMonth();
			var min_viewDay = min_day.getDate();
			//최대
			var max_viewYear = max_day.getFullYear();
			var max_viewMonth = max_day.getMonth();
			var max_viewDay = max_day.getDate();
			
			//설정일자가 있는 경우
			if (!!setDate) {
				date = new Date(setDate);

				viewYear = date.getFullYear();
				viewMonth = date.getMonth();
				viewDay = date.getDate();	
			}

			//선택일자가 있는 경우
			if (startDay !== '') {
				startDate = new Date(startDay);
				start_viewYear = startDate.getFullYear();
				start_viewMonth = startDate.getMonth();
				start_viewDay = startDate.getDate();
			}
			if (endDay !== '') {
				endDate = new Date(endDay);
				end_viewYear = endDate.getFullYear();
				end_viewMonth = endDate.getMonth();
				end_viewDay = endDate.getDate();
			}

			//지난달 마지막 date, 이번달 마지막 date
			var prevLast = new Date(viewYear, viewMonth, 0);
			var thisLast = new Date(viewYear, viewMonth + 1, 0);
			var PLDate = prevLast.getDate();
			var PLDay = prevLast.getDay();
			var TLDate = thisLast.getDate();
			var TLDay = thisLast.getDay();
			var prevDates = [];
			var nextDates = [];
			var thisDates = [];
			//var thisDates = [...Array(TLDate + 1).keys()].slice(1);
			for (var i = 0, len = TLDate; i < len; i++) {
				thisDates.push(i + 1);
			}

			//prevDates 계산
			if (PLDay !== 6) {
				for(var i = 0; i < PLDay + 1; i++) {
					prevDates.unshift('');
				}
			}

			//nextDates 계산
			for(var i = 1; i < 7 - TLDay; i++) {
				nextDates.unshift('');
			}

			//dates 합치기
			var dates = prevDates.concat(thisDates, nextDates);
			var _dpHtml = '';

			//dates 정리
			dates.forEach(function(date,i) {
				var _class = '';
				var _disabled = false;

				// _class = (i % 7 === 0) ? 'hday' : '';
				// _class = (i % 7 === 0) ? 'hday' : _class;

				//오늘날짜 설정
				_class = (date === _viewDay && viewYear === _viewYear && viewMonth === _viewMonth) ? _class + 'today' : _class;

				//max date
				if (viewYear === max_viewYear) {
					if (viewMonth === max_viewMonth) {
						if (date > max_viewDay) {
							_disabled = true;
						}
					} else if (viewMonth > max_viewMonth) {
						_disabled = true;
					}
					
				} else if (viewYear > max_viewYear ) {
					console.log('>');
					_disabled = true;
				}

				//min date
				if (viewYear === min_viewYear) {
					console.log('===', viewMonth,  min_viewMonth);
					if (viewMonth === min_viewMonth) {
						if (date < min_viewDay) {
							_disabled = true;
						}
					} else if (viewMonth < min_viewMonth) {
						_disabled = true;
					}
					
				} else if (viewYear < min_viewYear ) {
					console.log('<');
					_disabled = true;
				}

				//selected date
				var _day = (date === start_viewDay && viewYear === start_viewYear && viewMonth === start_viewMonth) ? 
					_class + ' selected-start' : 
					(date === end_viewDay && viewYear === end_viewYear && viewMonth === end_viewMonth) ? _class + ' selected-end' : _class;
				
				if (!!endDay) {
					_class = _class + ' during';

					if (viewYear < start_viewYear || viewYear > end_viewYear) {
						_class = _class.replace(' during', '');
					}

					if (viewYear === start_viewYear && viewMonth < start_viewMonth) {
						_class = _class.replace(' during', '');
					}

					if (viewYear === start_viewYear && viewMonth === start_viewMonth && date <=  start_viewDay) {
						_class = _class.replace(' during', '');
					}

					if (viewYear === end_viewYear && viewMonth > end_viewMonth) {
						_class = _class.replace(' during', '');
					}

					if (viewYear === end_viewYear && viewMonth === end_viewMonth && date >=  end_viewDay) {
						_class = _class.replace(' during', '');
					}
				}

				//row
				if (!(i % 7)) {
					_dpHtml += (i !== 0) ? '</tr><tr>' : '<tr>';
				
				} else {
					_dpHtml += '';
				}

				_dpHtml += '<td class="'+ _class +'">';

				if (date === '') {
					//빈곳
				} else {
					if (!_disabled) {
						_dpHtml += '<button type="button" class="datepicker-day '+ _day +'" data-date="'+ viewYear +'-'+ Global.parts.add0(viewMonth + 1)+'-'+ Global.parts.add0(date)+ '">';
					} else {
						_dpHtml += '<button type="button" class="datepicker-day '+ _day +'" data-date="'+ viewYear +'-'+ Global.parts.add0(viewMonth + 1)+'-'+ Global.parts.add0(date)+ '" disabled>';
					}
				}
				
				_dpHtml += '<span>' + date +'</span>';
				_dpHtml += '</button>';
				_dpHtml += '</td>';
			});

			var dp_tbody = el_dp.querySelector('.datepicker-date');
			var dp_y = el_dp.querySelector('.datepicker-yy');
			var dp_m = el_dp.querySelector('.datepicker-mm');
			var getData = el_dp.dataset.date.split('-');
			
			dp_y.innerHTML = getData[0];
			dp_m.innerHTML = getData[1];
			dp_tbody.innerHTML = _dpHtml;

			var dayBtn = dp_tbody.querySelectorAll('.datepicker-day');

			for (var i = 0, len = dayBtn.length; i < len; i++) {
				var that = dayBtn[i];

				that.addEventListener('click', Global.datepicker.daySelect);
				that.dataset.n = i;
				that.addEventListener('keydown', keyMove);
			}

			// for (var dayBtns of dayBtn) {
			// 	dayBtns.addEventListener('click', Global.datepicker.daySelect);
			// 	console.log(dayBtns);
			// 	dayBtns.addEventListener('keydown', keyMove);
			// }

			function keyMove(e) {
				e.preventDefault();

				var isShift = !!window.event.shiftKey;
				var n = Number(e.currentTarget.dataset.n);
				var keycode = e.keyCode;
				var keys = Global.state.keys;

				var current = n;

				switch (keycode) {
					case keys.up:
						current = (n - 7 < 0) ? 0 : n - 7;
						dp_tbody.querySelector('.datepicker-day[data-n="'+current+'"]').focus();
						break;
					case keys.left:
						current = (n - 1 < 0) ? 0 : n - 1;
						dp_tbody.querySelector('.datepicker-day[data-n="'+current+'"]').focus();
						break;
					case keys.down:
						current = (n + 7 > len - 1) ? len - 1 : n + 7;
						dp_tbody.querySelector('.datepicker-day[data-n="'+current+'"]').focus();
						break;
					case keys.right:
						current = (n + 1 > len - 1) ? len - 1 : n + 1;
						dp_tbody.querySelector('.datepicker-day[data-n="'+current+'"]').focus();
						break;
					case keys.tab:
						isShift ?
							el_dp.querySelector('.datepicker-header .datepicker-title').focus(): 
							el_dp.querySelector('.ui-confirm').focus();
						break;
					case keys.enter:
						Global.datepicker.daySelect(e);
						break;
				}
			}
		},
		daySelect: function(event) {
			var el_btn = event.currentTarget;
			var el_dp = el_btn.closest('.datepicker');
			var dayBtn = el_dp.querySelectorAll('.datepicker-day');
			var selectDay = el_btn.dataset.date;
			var period = el_dp.dataset.period;
			var n = 0;
			var id = el_dp.dataset.id;
			var date = new Date(el_dp.dataset.date);
			var el_inp = document.querySelector('#' + id);
			var el_uidp = el_inp.closest('.ui-datepicker');
			var el_start = el_uidp.querySelector('[data-period="start"]');
			var el_end = el_uidp.querySelector('[data-period="end"]');

			period = (!!el_dp.dataset.end) ? 'end' : period;

			if (!period) {
				//single mode
				el_dp.dataset.start = selectDay;

				for (var i = 0, len = dayBtn.length; i < len; i++) {
					var that = dayBtn[i];

					that.classList.remove('selected-start');
				}
				el_btn.classList.add('selected-start');
			} else {
				//period mode
				if (period === 'start') {
					//start
					el_dp.dataset.start = selectDay;
					el_dp.dataset.period = 'end';
					el_btn.classList.add('selected-start');
					//el_end.min = selectDay;
				} else {
					//end
					if (el_dp.dataset.start > selectDay) {
						el_dp.dataset.start = selectDay;
						el_dp.dataset.end = '';
						el_btn.classList.add('selected-start');
						el_dp.querySelector('.selected-start') && el_dp.querySelector('.selected-start').classList.remove('selected-start');
						el_dp.querySelector('.selected-end') && el_dp.querySelector('.selected-end').classList.remove('selected-end');
					} else {
						if (!el_dp.dataset.end) {
							//end 
							if (el_dp.dataset.start === selectDay) {
								el_dp.dataset.start = '';
								el_dp.dataset.end = '';
								el_dp.dataset.period = 'start';
								el_dp.querySelector('.selected-start') && el_dp.querySelector('.selected-start').classList.remove('selected-start');
							} else {
								el_dp.dataset.end = selectDay;
								el_btn.classList.add('selected-end');
							}
						} else {
							//end값 수정`
							if (el_dp.dataset.start === selectDay) {
								el_dp.dataset.start = '';
								el_dp.dataset.end = '';
								el_dp.dataset.period = 'start';
								el_dp.querySelector('.selected-start') && el_dp.querySelector('.selected-start').classList.remove('selected-start');
								el_dp.querySelector('.selected-end') && el_dp.querySelector('.selected-end').classList.remove('selected-end');
							} else {
								if (el_dp.dataset.end === selectDay) {
									el_dp.dataset.end = '';
									el_dp.querySelector('.selected-end') && el_dp.querySelector('.selected-end').classList.remove('selected-end');
								} else {
									if (!!el_dp.querySelector('.selected-end')) {
										el_dp.querySelector('.selected-end').classList.remove('selected-end');
									}
									
									el_dp.dataset.end = selectDay;
									el_btn.classList.add('selected-end');
								}
							}
						}
					}
				}

				Global.datepicker.dateMake({
					setDate: date,
					setId: id
				});
			}
		},
		nextYear: function(event) {
			var dpId = event.target.dataset.dpid;
			var el_inp = document.querySelector('#' + dpId);
			var el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			var el_next = el_dp.querySelector('.ui-next-y');
			var el_prev = el_dp.querySelector('.ui-prev-y');
			var el_next_m = el_dp.querySelector('.ui-next-m');
			var el_prev_m = el_dp.querySelector('.ui-prev-m');

			var date = new Date(el_dp.dataset.date);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDay();

			var max = el_inp.getAttribute('max');
			var max_date = new Date(max);
			var max_year = max_date.getFullYear();
			var max_month = max_date.getMonth() + 1;
			var max_day = max_date.getDay();

			var min = el_inp.getAttribute('min');
			var min_date = new Date(min);
			var min_year = min_date.getFullYear();
			var min_month = min_date.getMonth() + 1;
			var min_day = min_date.getDay();

			// if (year + 1 <= min_year) {
			// 	//el_prev.disabled = true;
			// } else {
			// 	//el_prev.disabled = false;
			// }

			// el_prev_m.disabled = false;
			// if (year + 1 === max_year) {
			// 	if (month > max_month) {
			// 		month = max_month;
			// 		//el_next_m.disabled = true;
			// 	}
			// 	date.setMonth(month - 1);
			// 	//el_next.disabled = true;
			// } else if (year > max_year) {
			// 	//return false;
			// }
			
			date.setFullYear(year + 1);

			el_dp.dataset.date = (year + 1) +'-'+ Global.parts.add0(month); 
			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		prevYear: function(event) {
			var dpId = event.target.dataset.dpid;
			var el_inp = document.querySelector('#' + dpId);
			var el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			var el_next = el_dp.querySelector('.ui-next-y');
			var el_prev = el_dp.querySelector('.ui-prev-y');
			var el_next_m = el_dp.querySelector('.ui-next-m');
			var el_prev_m = el_dp.querySelector('.ui-prev-m');

			var date = new Date(el_dp.dataset.date);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDay();

			var max = el_inp.getAttribute('max');
			var max_date = new Date(max);
			var max_year = max_date.getFullYear();
			var max_month = max_date.getMonth() + 1;

			var min = el_inp.getAttribute('min');
			var min_date = new Date(min);
			var min_year = min_date.getFullYear();
			var min_month = min_date.getMonth() + 1;

			// if (year - 1 >= max_year) {
			// 	el_next.disabled = true;
			// } else {
			// 	el_next.disabled = false;
			// }

			// el_next_m.disabled = false;
			// if (year - 1 === min_year) {
			// 	if (month < min_month) {
			// 		month = min_month;
			// 		el_prev_m.disabled = true;
			// 	}
			// 	date.setMonth(month - 1);
			// 	el_prev.disabled = true;
			// } else if (year < min_year) {
			// 	return false;
			// }
			
			date.setFullYear(year - 1);

			el_dp.dataset.date = (year - 1) +'-'+ Global.parts.add0(month); 

			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		nextMonth: function(event) {
			var dpId = event.target.dataset.dpid;
			var el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			var date = new Date(el_dp.dataset.date);
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			
			if (month > 11) {
				month = 0;
				year = year + 1;
				date.setFullYear(year);
			}

			date.setMonth(month);

			el_dp.dataset.date = year +'-'+ Global.parts.add0(month + 1); 

			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		prevMonth: function(event) {
			var dpId = event.target.dataset.dpid;
			var el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			var date = new Date(el_dp.dataset.date);
			var year = date.getFullYear();
			var month = date.getMonth();
			
			if (month < 1) {
				month = 12;
				year = year - 1;
				date.setFullYear(year);
			}

			date.setMonth(month - 1);

			el_dp.dataset.date = year +'-'+ Global.parts.add0(month); 

			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		},
		goToday: function(event) {
			var dpId = event.target.dataset.dpid;
			var el_dp = document.querySelector('.datepicker[data-id="'+dpId+'"]');
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			
			el_dp.dataset.date = year +'-'+ Global.parts.add0(month); 

			Global.datepicker.dateMake({
				setDate: date,
				setId: dpId
			});
		}
	}

	Global.sheets = {
		dim: function(opt){
			var show = opt.show;
			var callback = opt.callback;
			var dim;

 			if (show) {
				var sheet = doc.querySelector('.sheet-bottom[data-id="'+opt.id+'"]');
				sheet.insertAdjacentHTML('beforeend', '<div class="sheet-dim"></div>');

				dim = doc.querySelector('.sheet-dim');
				dim.classList.add('on');

				!!callback && callback();
			} else {
				dim = doc.querySelector('.sheet-dim');
				dim.classList.remove('on');
			}
		},
		bottom: function(opt){
			var id = opt.id;
			var state = opt.state;
			var callback = opt.callback;
			var el_base = doc.querySelector('#'+ id);
			var el_sheet = doc.querySelector('[data-id*="'+id+'"]');
			var scr_t = doc.documentElement.scrollTop;
			var win_w = win.innerWidth;
			var win_h = win.innerHeight;
			var off_t = el_base.getBoundingClientRect().top;
			var off_l = el_base.getBoundingClientRect().left;
			var base_w = el_base.offsetWidth;
			var base_h = el_base.offsetHeight;
			var is_expanded = !!el_sheet;
			var show = !is_expanded || is_expanded === 'false';

			if (state !== undefined) {
				show = state;
			}

			if (show) {
				!!callback && callback(); 
				
				el_sheet = doc.querySelector('[data-id*="'+ id +'"]');
				el_sheet.classList.add('sheet-bottom');

				var wrap_w = Number(el_sheet.offsetWidth.toFixed(2));
				var wrap_h = Number(el_sheet.offsetHeight.toFixed(2));

				Global.sheets.dim({
					id: id,
					show: true,
					callback: function(){
						var dim = doc.querySelector('.sheet-dim');

						dim.addEventListener('click', dimAct);

						function dimAct(){
							Global.sheets.bottom({
								id: id,
								state: false
							});
						}
					}
				});

				el_sheet.classList.add('on');
				el_sheet.style.left = ((wrap_w + off_l) > win_w) ? (off_l - (wrap_w - base_w))+ 'px' : off_l + 'px';
				el_sheet.style.top = (win_h - ((off_t - scr_t) + base_h) > wrap_h) ? (off_t + base_h) + scr_t + 'px' : (off_t - wrap_h) + scr_t + 'px';

				Global.focus.loop({
					selector: el_sheet
				});
			} else {
				//hide
				el_sheet.classList.remove('on');
				el_sheet.classList.add('off');
				
				setTimeout(function(){
					!!callback && callback();
					el_sheet.remove();

					doc.querySelector('#'+id).focus();
				},300);
			}
		}
	}

	Global.select = {
		options: {
			id: false, 
			current: null,
			customscroll: true,
			callback: false
		},
		init: function(option){
			var opt = Object.assign({}, this.options, option);
			var current = opt.current;
			var callback = opt.callback;
			var customscroll = opt.customscroll;
			var id = opt.id;
			var isId = !!id ? doc.querySelector('#' + opt.id) : false;
			var el_uiSelects = doc.querySelectorAll('.ui-select');
			var keys = Global.state.keys;
			var isMobile = Global.state.device.mobile;

			var el_select;
			var $selectCurrent;
			var selectID;
			var listID;
			var optionSelectedID;
			var selectN;
			var selectTitle;
			var selectDisabled;
			var btnTxt = '';
			var hiddenClass = '';
			var htmlOption = '';
			var htmlButton = '' ;
			var el_btn;
			var el_wrap;
			var el_dim ;
			//init
			Global.state.device.mobile ? customscroll = false : '';

			//reset
			var idN = JSON.parse(sessionStorage.getItem('scrollbarID'));

			//select set
			for (var i = 0, len = el_uiSelects.length; i < len; i++) {
				var that = el_uiSelects[i];

				el_btn = that.querySelector('.ui-select-btn');
				el_wrap = that.querySelector('.ui-select-wrap');
				el_dim = that.querySelector('.dim');

				el_btn && el_btn.remove();
				el_wrap && el_wrap.remove();
				el_dim && el_dim.remove();

				el_select = that.querySelector('select');

				selectID = el_select.id;

				if (!!id && selectID === id) {
					act(that, el_select, selectID);
				} else {
					act(that, el_select, selectID);
				}
			}

			function act(el_uiSelect, el_select, selectID){
				(selectID === undefined) ? el_select.id = 'uiSelect_' + idN : '';
				listID = selectID + '_list';
				selectDisabled = el_select.disabled;
				selectTitle = el_select.title;
				hiddenClass = '';

				//el_uiSelect.css('max-width', el_uiSelect.outerWidth());
				//callback 나중에 작업필요
				//(!el_select.data('callback') || !!callback) && el_select.data('callback', callback);

				if (customscroll) {
					htmlOption += '<div class="ui-select-wrap ui-scrollbar" scroll-id="uiSelectScrollBar_'+ idN +'">';
					idN = idN + 1;
					sessionStorage.setItem('scrollbarID', idN);
				} else {
					htmlOption += '<div class="ui-select-wrap" style="min-width:' + el_uiSelect.offsetWIdth + 'px">';
				}

				htmlOption += '<strong class="ui-select-title">'+ selectTitle +'</strong>';
				htmlOption += '<div class="ui-select-opts" role="listbox" id="' + listID + '" aria-hidden="false">';

				setOption(el_uiSelect, el_select.selectedIndex);
				
				htmlOption += '</div>';
				htmlOption += '<button type="button" class="ui-select-cancel"><span>취소</span></strong>';
				htmlOption += '<button type="button" class="ui-select-confirm"><span>확인</span></strong>';
				htmlOption += '</div>';
				htmlButton = '<button type="button" class="ui-select-btn '+ hiddenClass +'" id="' + selectID + '_inp" role="combobox" aria-autocompvare="list" aria-owns="' + listID + '" aria-haspopup="true" aria-expanded="false" aria-activedescendant="' + optionSelectedID + '" data-n="' + selectN + '" data-id="' + selectID + '" tabindex="-1"><span>' + btnTxt + '</span></button>';
				
				el_uiSelect.insertAdjacentHTML('beforeend', htmlButton);
				el_select.classList.add('off');
				el_select.setAttribute('aria-hidden', true)
				// el_select.setAttribute('tabindex', -1);
				el_uiSelect.insertAdjacentHTML('beforeend', htmlOption);

				if (selectDisabled) {
					var _btn = el_uiSelect.querySelector('.ui-select-btn');

					_btn.disabled = true;
					_btn.classList.add('disabled')
				}  
				
				// var _optwrap = el_uiSelect.querySelector('.ui-select-opts');
				// console.log(_optwrap);
				// var _btns = _optwrap.querySelectorAll('button');
				// for (var _btn of _btns) {
				// 	_btn.remove();
				// }
				
				eventFn();
				htmlOption = '';
				htmlButton = '';
			}
			
			function setOption(uiSelect, v){
				var _select = (uiSelect !== undefined) ? uiSelect.closest('.ui-select') : uiSelect;

				if (uiSelect !== undefined) {
					_select = _select.querySelector('select');
				}

				var _options = _select.querySelectorAll('option');
				var _optionID = _select.id + '_opt';
				var _optLen = _options.length;

				var _current = current;
				var _selected = false;
				var _disabled = false;
				var _hidden = false;
				var _val = false;
				var _hiddenCls;
				var _optionIdName;

				if (v !== undefined) {
					_current = v;
				}

				for (var i = 0; i < _optLen; i++) {
					var that = _options[i];

					_hidden = that.hidden;

					if (_current !== null) {
						if (_current === i) {
							_selected = true;
							that.selected = true;
						} else {
							_selected = false;
							that.selected = false;
						}
					} else {
						_selected = that.selected;
					}

					_disabled = that.disabled;
					_hiddenCls =  _hidden ? 'hidden' : '';

					if (_selected) {
						_val = that.value;
						btnTxt = that.textContent;
						optionSelectedID = _optionID + '_' + i;
						selectN = i;
					}

					_selected && _hidden ? hiddenClass = 'opt-hidden' : '';
					_optionIdName = _optionID + '_' + i;

					if (Global.state.device.mobile) {
						_disabled ?
							_selected ?
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled selected '+ _hiddenCls + '" value="' + that.value + '" disabled tabindex="-1">' :
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled '+ _hiddenCls + '" value="' + that.value + '" disabled tabindex="-1">' :
							_selected ?
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt selected '+ _hiddenCls + '" value="' + that.value + '" tabindex="-1">' :
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt '+ _hiddenCls + '" value="' + that.value + '" tabindex="-1">';
					} else {
						_disabled ?
							_selected ?
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled selected '+ _hiddenCls + '" value="' + that.value + '" disabled tabindex="-1">' :
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled '+ _hiddenCls + '" value="' + that.value + '" disabled tabindex="-1">' :
							_selected ?
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt selected '+ _hiddenCls + '" value="' + that.value + '" tabindex="-1">' :
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt '+ _hiddenCls + '" value="' + that.value + '" tabindex="-1">';
					}

					htmlOption += '<span class="ui-select-txt">' + that.textContent + '</span>';
					htmlOption += '</button>';
				}

				return htmlOption;
			}

			//event
			eventFn();
			function eventFn(){
				// $(doc).off('click.dp').on('click.dp', '.ui-select-btn', function(e){
					
				// 	var $this = $(this).closest('.ui-datepicker').find('.inp-base');
				// 	Global.sheets.bottom({
				// 		id: $this.attr('id'),
				// 		callback: function(){

				// 		}
				// 	});
				// });
				
				//var el_dims = doc.querySelectorAll('.dim-select');
				var el_confirms = doc.querySelectorAll('.ui-select-confirm');
				var el_cancels = doc.querySelectorAll('.ui-select-cancel');
				var el_btns = doc.querySelectorAll('.ui-select-btn');
				//var el_opts = doc.querySelectorAll('.ui-select-opt');
				//var el_wraps = doc.querySelectorAll('.ui-select-wrap');
				var el_labels = doc.querySelectorAll('.ui-select-label');
				var el_selects = doc.querySelectorAll('.ui-select select');

				// for (var el_dim of el_dims) {
				// 	el_dim.addEventListener('click', selectClick);
				// }

				for (var i = 0, len = el_confirms.length; i < len; i++) {
					var that = el_confirms[i];
					that.addEventListener('click', optConfirm);
				}

				for (var i = 0, len = el_cancels.length; i < len; i++) {
					var that = el_cancels[i];
					that.addEventListener('click', Global.select.hide);
				}

				for (var i = 0, len = el_btns.length; i < len; i++) {
					var that = el_btns[i];
					that.addEventListener('click', selectClick);
					// that.addEventListener('keydown', selectKey);
					// that.addEventListener('mouseover', selectOver);
					// that.addEventListener('focus', selectOver);
					// that.addEventListener('mouseleave', selectLeave);
				}

				for (var i = 0, len = el_labels.length; i < len; i++) {
					var that = el_labels[i];
					that.addEventListener('click', labelClick);
				}

				for (var i = 0, len = el_selects.length; i < len; i++) {
					var that = el_selects[i];
					that.addEventListener('change', Global.select.selectChange);
				}
			}

			function labelClick(e) {
				var that = e.currentTarget;
				var idname = that.getAttribute('for');
				var inp = doc.querySelector('#' + idname);
 
				setTimeout(function() {
					inp.focus();
				}, 0);
			}

			function selectLeave() {
				var body = doc.querySelector('body');

				body.dataset.selectopen = true;
			}
			
			
			function selectClick(e) {
				var that = e.currentTarget;
				var el_uiselect = that.closest('.ui-select');
				var el_select = el_uiselect.querySelector('select');
				var opts = el_uiselect.querySelectorAll('option');
				var n = el_select.selectedIndex;

				// for (var opt of opts) {
				// 	//console.log(a.selected && Global.parts.getIndex(a));
				// 	n = opt.selected && Global.parts.getIndex(opt);
				// }

				that.dataset.sct = doc.documentElement.scrollTop;

				doc.removeEventListener('click', Global.select.back);
				setTimeout(function(){
					doc.addEventListener('click', Global.select.back);
				},0);

				setOption(that, n);
				optExpanded(that, n);
			}

			function selectKey(e) {
				var el_btn = e.currentTarget;
				var id = el_btn.dataset.id;
				var el_list = doc.querySelector('#' + id + '_list');
				var el_wrap = el_list.closest('.ui-select-wrap');
				var el_optwrap = el_wrap.querySelector('.ui-select-opts');
				var el_opts = el_wrap.querySelectorAll('.ui-select-opt');
				var list_selected = el_list.querySelector('.selected');

				var n = Number(Global.parts.getIndex(list_selected));
				var nn = 0;
				var nnn = 0;
				var wrap_h = el_wrap.offsetHeight;
				var len = el_opts.length;
				var n_top = 0;

				if (e.altKey) {
					if (e.keyCode === keys.up) {
						optOpen(el_btn);
					}

					e.keyCode === keys.down && Global.select.hide();
					return;
				}

				switch (e.keyCode) {
					case keys.up:
					case keys.left:
						nn = n - 1 < 0 ? 0 : n - 1;
						nnn = Math.abs(el_optwrap.getBoundingClientRect().top);
						n_top = el_opts[nn].getBoundingClientRect().top + nnn;

						optScroll(el_wrap, n_top, wrap_h, 'up');
						optPrev(e, id, n, len);
						break;

					case keys.down:
					case keys.right:
						nn = n + 1 > len - 1 ? len - 1 : n + 1;
						nnn = Math.abs(el_optwrap.getBoundingClientRect().top);
						n_top = el_opts[nn].getBoundingClientRect().top + nnn;
						
						optScroll(el_wrap, n_top, wrap_h, 'down');
						optNext(e, id, n, len);
						break;
				}
			}

			function optBlur(e) {
				//if (doc.querySelector('body').dataset.selectopen) { .. }); dim
				//optClose();
			}

			function optExpanded(btn) {
				if (Global.state.device.mobile) {
					optOpen(btn);
				} else {
					if (btn.getAttribute('aria-expanded') === 'false') {
						Global.select.hide();
						optOpen(btn);
					} else {
						Global.select.hide();
					}
				}
			}

			function optScroll(el_wrap, n_top, wrap_h, key) {
				var dT = doc.documentElement.scrollTop;

				Global.scroll.move({ 
					top: Number(n_top), 

					//:scope >
					selector: customscroll ? el_wrap.querySelector('.ui-scrollbar-item') : el_wrap, 

					effect: 'auto', 
					align: 'default' 
				});
			}
			function optPrev(e, id, n, len) {
				e.preventDefault();
				var current = (n === 0) ?0 :n - 1;

				Global.select.act({ id: id, current: current });
			}
			function optNext(e, id, n, len) {
				e.preventDefault();
				var current = n === len - 1 ? len - 1 :n + 1;

				Global.select.act({ id: id, current: current });
			}
			function optOpen(btn) {
				var el_body = doc.querySelector('body');
				var el_uiselect = btn.closest('.ui-select');
				var el_wrap = el_uiselect.querySelector('.ui-select-wrap');
				var el_optwrap = el_wrap.querySelector('.ui-select-opts');
				var el_opts = el_optwrap.querySelectorAll('.ui-select-opt');
				var el_select = el_uiselect.querySelector('select');
				var el_option = el_select.querySelectorAll('option');

				//var el_opts = doc.querySelectorAll('.ui-select-opt');

				var offtop = el_uiselect.getBoundingClientRect().top;
				var scrtop = doc.documentElement.scrollTop;
				var wraph = el_wrap.offsetHeight;
				var btn_h = btn.offsetHeight;
				var opt_h = 40;
				var win_h = win.innerHeight;
				var className = win_h - ((offtop - scrtop) + btn_h) > wraph ? 'bottom' : 'top';
				var n = el_select.selectedIndex;

				el_body.classList.add('dim-select');
				btn.dataset.expanded = true;
				btn.setAttribute('aria-expanded', true);
				el_uiselect.classList.add('on');
				el_wrap.classList.add('on');
				el_wrap.classList.add(className);
				el_wrap.setAttribute('aria-hidden', false);
				el_opts[n].classList.add('selected');
				
				if (customscroll) {

					console.log(el_wrap);

					Global.scrollBar.init({
						selector: el_wrap
					});
				}
					
				setTimeout(function(){
					el_optwrap = el_wrap.querySelector('.ui-select-opts');
					el_opts = el_optwrap.querySelectorAll('.ui-select-opt');
					Global.scroll.move({ 
						top: Number(opt_h * n) , 

						//:scope >
						selector: customscroll ? el_wrap.querySelector('.ui-scrollbar-item') : el_wrap, 

						effect: 'auto', 
						align: 'default' 
					});

					for (var i = 0, len = el_opts.length; i < len; i++) {
						var that = el_opts[i];
			
						that.addEventListener('click', Global.select.optClick);
						that.addEventListener('mouseover',  Global.select.selectOver);
					}
					
					el_wrap.addEventListener('mouseleave', selectLeave);
					el_wrap.addEventListener('blur', optBlur);
				}, 0);

				openScrollMove(el_uiselect);

				el_wrap.removeEventListener('touchstart', Global.select.wrapTouch);
				el_wrap.addEventListener('touchstart', Global.select.wrapTouch);
			}

			function openScrollMove(el_uiselect){
				var el_html = doc.querySelector('html, body');
				var dT = Math.floor(doc.documentElement.scrollTop);
				var wH = win.innerHeight;
				var el_btn = el_uiselect.querySelector('.ui-select-btn');
				var elT = el_btn.getBoundingClientRect().top;
				var elH = el_btn.offsetHeight;
				var a = Math.floor(elT - dT);
				var b = wH - 240;

				el_uiselect.dataset.orgtop = dT;

				if (a > b) {
					el_html.scrollTo({
						top: a - b + elH + 10 + dT,
						behavior: 'smooth'
					});
				} 
			}

			function optConfirm(e) {
				var el_confirm = e.currentTarget;
				var el_uiSelect = el_confirm.closest('.ui-select');
				var el_body = doc.querySelector('body');
				var el_btn = el_uiSelect.querySelector('.ui-select-btn');
				var el_wrap = el_uiSelect.querySelector('.ui-select-wrap');
				var el_select = el_uiSelect.querySelector('select');
				var orgTop = el_uiSelect.dataset.orgtop;
				
				console.log(el_btn.dataset.id, el_select.selectedIndex);

				Global.select.act({ 
					id: el_btn.dataset.id, 
					current: el_select.selectedIndex
				});

				el_body.classList.remove('dim-select');
				el_btn.dataset.expanded = false;
				el_btn.setAttribute('aria-expanded', false)
				el_btn.focus();

				el_uiSelect.classList.remove('on');
				el_wrap.classList.remove('on');
				el_wrap.classList.remove('top');
				el_wrap.classList.remove('bottom');
				el_wrap.setAttribute('aria-hidden', true);

				console.log(el_select);
				//el_select.onchange();

				//$('html, body').scrollTop(orgTop);
			}

		},
		back: function(e){
			e.preventDefault();

			var isTure = '';

			console.log(e.path);

			for (var i = 0, len = e.path.length; i < len; i++) {
				var that = e.path[i];

				isTure = isTure + that.classList;
			}
			// for (var path of e.path) {
			// 	isTure = isTure + path.classList;
			// }

			(isTure.indexOf('ui-select-wrap') < 0) && Global.select.hide();
		},
		scrollSelect: function(v, el){
			var _opts = el.querySelectorAll('.ui-select-opt');
			var el_uiSelect = el.closest('.ui-select');
			var el_btn = el_uiSelect.querySelector('.ui-select-btn');

			el.scrollTo({
				top: 40 * v,
				behavior: 'smooth'
			});

			for (var i = 0, len = _opts.length; i < len; i++) {
				_opts[i].classList.remove('selected');

				if (v === i) {
					_opts[i].classList.add('selected');
					el_uiSelect.dataset.current = i;
				} 
			}

			// Global.select.act({ 
			// 	id: el_btn.dataset.id, 
			// 	current: v
			// });
		},
		wrapTouch: function(e){
			var that = e.currentTarget;
			var wrap = that.querySelector('.ui-select-opts');

			var timerScroll = null;
			var touchMoving = false;
			var wrapT = that.getBoundingClientRect().top;
			var getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);
			var currentN = 0;

			clearTimeout(timerScroll);
			
			that.addEventListener('touchmove', actMove);
			

			function actMove(){
				touchMoving = true;
				getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);

				that.addEventListener('touchcancel', actEnd);
				that.addEventListener('touchend', actEnd);
			}
			function actEnd(){
				var that = this;

				function scrollCompare(){
					timerScroll = setTimeout(function(){

						if (getScrollTop !== Math.abs(wrap.getBoundingClientRect().top - wrapT)) {
							getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);
							scrollCompare();
						} else {
							currentN = Math.floor((Math.floor(getScrollTop) + 20) / 40);
							Global.select.scrollSelect(currentN,  that);
						}
					},100);
				} 

				touchMoving && scrollCompare();
				that.removeEventListener('touchmove', actMove);
			}
		},
		optClick: function(e) {
			var _uiSelect = this.closest('.ui-select');
			var _btn = _uiSelect.querySelector('.ui-select-btn');
			var el_select = _uiSelect.querySelector('select');
			var _wrap = _uiSelect.querySelector('.ui-select-wrap');
			var idx = Global.parts.getIndex(this);
			var isMobile = Global.state.device.mobile;

			if (!isMobile) {
				Global.select.act({ 
					id: _btn.dataset.id, 
					current: idx 
				});
				_btn.focus();
				Global.select.hide();
				el_select.onchange();
			} else {
				Global.select.scrollSelect(idx, _wrap);
			}
		},
		selectOver: function() {
			var body = doc.querySelector('body');

			body.dataset.selectopen = false;
		},
		selectChange: function(e) {
			var that = e.target;
			var uiSelect = that.closest('.ui-select');
			
			uiSelect.dataset.fn;

			Global.select.act({
				id: that.id,
				current: that.options.selectedIndex,
				original:true
			});
		},
		hide: function(){
			var el_body = doc.querySelector('body');
			var el_selects = doc.querySelectorAll('.ui-select');
			var el_selectWraps = doc.querySelectorAll('.ui-select-wrap[aria-hidden="false"]');
			var el_btns = doc.querySelectorAll('.ui-select-btn[aria-expanded="true"]');
			var el_select;
			var el_wrap;
			var orgTop;

			el_body.classList.remove('dim-select');

			for (var i = 0, len = el_btns.length; i < len; i++) {
				var that = el_btns[i];

				el_select = that.closest('.ui-select');
				el_wrap = el_select.querySelector('.ui-select-wrap');
				orgTop = el_select.dataset.orgtop;

				that.dataset.expanded = false;
				that.setAttribute('aria-expanded', false);
				that.focus();
				el_select.classList.remove('on');

				el_wrap.classList.remove('on');
				el_wrap.classList.remove('top');
				el_wrap.classList.remove('bottom');
				el_wrap.setAttribute('aria-hidden', true);

				doc.querySelector('html, body').scrollTo({
					top: orgTop,
					behavior: 'smooth'
				});
			}

			doc.removeEventListener('click', Global.select.back);
		},
		act: function(opt){
			var id = opt.id;
			var el_select = doc.querySelector('#' + id);
			var el_opts = el_select.querySelectorAll('option');
			var el_uiSelect = el_select.closest('.ui-select');
			var el_btn = el_uiSelect.querySelector('.ui-select-btn');
			var el_text = el_btn.querySelector('span');
			var el_btnopts = el_uiSelect.querySelectorAll('.ui-select-opt');

			// var dataCallback = el_select.data('callback'),
			// 	callback = opt.callback === undefined ? dataCallback === undefined ? false : dataCallback : opt.callback,
			var current = opt.current;
			var org = opt.original === undefined ? false : opt.original;

			if (el_uiSelect.dataset.current !== undefined) {
				current = el_uiSelect.dataset.current;
				el_select.selectedIndex = el_uiSelect.dataset.current;
			} 

			//!org && el_uiSelect.find('option').prop('selected', false).eq(current).prop('selected', true);
			if (!org) {
				el_opts[current].selected = true;

				// el_uiSelect.find('option').prop('selected', false).eq(current).prop('selected', true).trigger('change');
			} 
			//trigger 오류 확인필요
			
			var optCurrent = el_opts[current];

			(optCurrent.hidden === true) ? 
				el_btn.classList.remove('opt-hidden'):
				el_btn.classList.add('opt-hidden');

			el_text.textContent = optCurrent.textContent;

			for (var i = 0, len = el_btnopts.length; i < len; i++) {
				var that = el_btnopts[i];
				that.classList.remove('selected');
			}

			el_btnopts[current].classList.add('selected');
			Global.state.device.mobile && el_btnopts[current].focus();

			// callback && callback({ 
			// 	id: id, 
			// 	current: current, 
			// 	val: optCurrent.val() 
			// });
		}
	}

	Global.accordion = {
		options: {
			current: null,
			autoclose: false,
			callback: false,
			effect: Global.state.effect.easeInOut,
			effTime: '.2'
		},
		init: function(option){
			var opt = Object.assign({}, Global.accordion.options, option);
			var accoId = opt.id;
			var callback = opt.callback;
			var current = opt.current;
			var autoclose = opt.autoclose;
			var el_acco = doc.querySelector('#' + accoId);

			//:scope >
			var el_wrap = el_acco.querySelectorAll('.ui-acco-wrap');

			var len = el_wrap.length;
			var para = Global.para.get('acco');
			var paras;
			var paraname;
			
			//set up : parameter > current
			if (!!para) {
				if (para.split('+').length > 1) {
					//2 or more : acco=exeAcco1*2+exeAcco2*3
					paras = para.split('+');
	
					for (var j = 0; j < paras.length; j++ ) {
						paraname = paras[j].split('*');
						opt.id === paraname[0] ? current = [Number(paraname[1])] : '';
					}
				} else {
					//only one : tab=1
					if (para.split('*').length > 1) {
						paraname = para.split('*');
						opt.id === paraname[0] ? current = [Number(paraname[1])] : '';
					} else {
						current = [Number(para)];
					}
				}
			}

			el_acco.dataset.n = len;

			//set up : parameter > current
			for (var i = 0; i < len; i++) {
				var that = el_wrap[i];

				//:scope >
				var el_tit = that.querySelector('.ui-acco-tit');
				var el_pnl = that.querySelector('.ui-acco-pnl');

				var el_btn = el_tit.querySelector('.ui-acco-btn');

				that.dataset.n = i;
				(el_tit.tagName !== 'DT') && el_tit.setAttribute('role','heading');

				el_btn.id = accoId + 'Btn' + i;
				el_btn.dataset.selected = false;
				el_btn.setAttribute('aria-expanded', false);
				el_btn.removeAttribute('data-order');
				el_btn.dataset.n = i;

				if (!!el_pnl) {
					el_pnl.id = accoId + 'Pnl' + i;
					el_btn.setAttribute('aria-controls', el_pnl.id);
					el_pnl.setAttribute('aria-labelledby', el_btn.id);
					el_pnl.dataset.height = el_pnl.offsetHeight;
					el_pnl.setAttribute('aria-hidden', true);
					el_pnl.dataset.n = i;
					Global.parts.toggleSlide({
						el: el_pnl, 
						state: 'hide'
					});

					if (current === 'all') {
						el_btn.dataset.selected = true;
						el_btn.setAttribute('aria-expanded', true);
						el_pnl.setAttribute('aria-hidden', false);
						Global.parts.toggleSlide({
							el: el_pnl, 
							state: 'show'
						});
						
					}
				}

				if (i === 0) {
					el_btn.dataset.order = 'first';
				}

				if (i === len - 1) {
					el_btn.dataset.order = 'last';
				}

				el_btn.removeEventListener('click', Global.accordion.evtClick);
				el_btn.removeEventListener('keydown', Global.accordion.evtKeys);
				el_btn.addEventListener('click', Global.accordion.evtClick);
				el_btn.addEventListener('keydown', Global.accordion.evtKeys);
			}

			var currentLen = current === null ? 0 : current.length;
			
			if (current !== 'all') {
				for (var i = 0; i < currentLen; i++) {
					var this_wrap = el_acco.querySelector('.ui-acco-wrap[data-n="'+ current[i] +'"]');
					
					//:scope >
					var _tit = this_wrap.querySelector('.ui-acco-tit');

					var _btn = _tit.querySelector('.ui-acco-btn');

					//:scope >
					var _pnl = this_wrap.querySelector('.ui-acco-pnl');
	
					if (!!_pnl) {
						_btn.dataset.selected = true;
						_btn.setAttribute('aria-expanded', true);
						_pnl.setAttribute('aria-hidden', false);
						Global.parts.toggleSlide({
							el: _pnl, 
							state: 'show'
						});
					}
				}
			}
			
			!!callback && callback();

			Global.accordion[accoId] = {
				callback: callback,
				autoclose: autoclose,
				current: current
			};
		},
		evtClick: function(e){
			var that = e.currentTarget;
			var btnId = that.id;
			var n = that.dataset.n;
			
			var accoId = btnId.split('Btn');
			accoId = accoId[0];

			if (!!btnId) {
				e.preventDefault();

				Global.accordion.toggle({ 
					id: accoId, 
					current: [n]
				});
			}
		},
		evtKeys: function(e){
			var that = e.currentTarget;
			var btnId = that.id;
			var n = Number(that.dataset.n);
			var keys = Global.state.keys;

			var accoId = btnId.split('Btn');
			accoId = accoId[0];

			var acco = doc.querySelector('#' + accoId);
			var len = Number(acco.dataset.n);

			switch(e.keyCode){
				case keys.up:	
				case keys.left: upLeftKey(e);
					break;

				case keys.down:
				case keys.right: downRightKey(e);
					break;

				case keys.end: endKey(e);
					break;

				case keys.home: homeKey(e);
					break;
			}
			
			function upLeftKey(e) {
				e.preventDefault();

				that.dataset.order !== 'first' ?
				acco.querySelector('#' + accoId + 'Btn' + (n - 1)).focus():
				acco.querySelector('#' + accoId + 'Btn' + (len - 1)).focus();
			}
			function downRightKey(e) {
				e.preventDefault();

				that.dataset.order !== 'last' ?
				acco.querySelector('#' + accoId + 'Btn' + (n + 1)).focus():
				acco.querySelector('#' + accoId + 'Btn0').focus();
			}
			function endKey(e) {
				e.preventDefault();
				
				acco.querySelector('#' + accoId + 'Btn' + (len - 1)).focus();
			}
			function homeKey(e) {
				e.preventDefault();

				acco.querySelector('#' + accoId + 'Btn0').focus();
			}
		},
		toggle: function(opt){
			var id = opt.id;
			var el_acco = doc.querySelector('#' + id);
			var current = opt.current === undefined ? null : opt.current;
			var callback = opt.callback === undefined ? opt.callback : Global.accordion[id].callback;
			var state = opt.state === undefined ? 'toggle' : opt.state;
			var autoclose = opt.autoclose === undefined ? Global.accordion[id].autoclose : opt.autoclose;

			//:scope >
			var el_wraps = el_acco.querySelectorAll('.ui-acco-wrap');

			var el_pnl;
			var el_tit;
			var el_btn;
			var len = el_wraps.length;
			var check = 0;
			
			var currentLen = current === null ? 0 : current.length;

			if (current !== 'all') {
				for (var i = 0; i < currentLen; i++) {
					var this_wrap = el_acco.querySelector('.ui-acco-wrap[data-n="'+ current[i] +'"]');

					//:scope >
					el_tit = this_wrap.querySelector('.ui-acco-tit');
					el_pnl = this_wrap.querySelector('.ui-acco-pnl');

					el_btn = el_tit.querySelector('.ui-acco-btn');
	
					if (!!el_pnl) {
						if (state === 'toggle') {
							(el_btn.dataset.selected === 'true') ? act('down') : act('up');
						} else {
							(state === 'open') && act('up');
							(state === 'close') && act('down');
						}
					}
				}
				!!callback && callback({ 
					id:id, 
					current:current
				});
			} else if (current === 'all') {
				checking();
			}
	
			function checking() {
				//state option 
				if (state === 'open') {
					check = 0;
					el_acco.dataset.allopen = false;
				} else if (state === 'close') {
					check = len;
					el_acco.dataset.allopen = true;
				}
				//all check action
				if (el_acco.dataset.allopen !== 'true') {
					el_acco.dataset.allopen = true;
					act('down');
				} else {
					el_acco.dataset.allopen = false;
					act('up');
				}
			}
			function act(v) {
				var isDown = !(v === 'down');

				//set up close
				if (!!autoclose) {
					for (var i = 0, len = el_wraps.length; i < len; i++) {
						var that = el_wraps[i];

						//:scope >
						var _tit = that.querySelector('.ui-acco-tit');
						var _btn = _tit.querySelector('.ui-acco-btn');

						//:scope >
						var _pnl = that.querySelector('.ui-acco-pnl');
						
						if (!!_pnl) {
							_btn.dataset.selected = false;
							_btn.setAttribute('aria-expanded', false);
							_pnl.setAttribute('aria-hidden', true);
						}
					}
				}
	
				if (current === 'all') {
					for (var i = 0, len = el_wraps.length; i < len; i++) {
						var that = el_wraps[i];

						//:scope >
						var _tit = that.querySelector('.ui-acco-tit');
						var _pnl = that.querySelector('.ui-acco-pnl');
						var _btn = _tit.querySelector('.ui-acco-btn');
						
						if (!!_pnl) {
							_btn.dataset.selected = isDown;
							_btn.setAttribute('aria-expanded', isDown);
							_pnl.setAttribute('aria-hidden', !isDown);
							Global.parts.toggleSlide({
								el: _pnl, 
								state: !isDown ? 'show' : 'hide'
							});
						}
					}
				} else {
					el_btn.dataset.selected = isDown;
					el_btn.setAttribute('aria-expanded', isDown);

					if (!!el_pnl) {
						el_pnl.setAttribute('aria-hidden', isDown);
						Global.parts.toggleSlide({
							el: el_pnl, 
							state: 'toggle'
						});
					}
				}
			}
		}
	}
	
	Global.dropdown = {
		options: {
			ps: 'BL',
			area: doc.querySelector('body'),
			src: false,
			offset: true,
			callback:false
		},
		init: function(option){
			var opt = Object.assign({}, Global.dropdown.options, option);
			var id = opt.id;
			var ps = opt.ps;
			var hold = opt.hold;
			var area = opt.area;
			var src = opt.src;
			var offset = opt.offset;
			var callback = opt.callback !== undefined ? opt.callback : false;

			//ajax 
			if (!!src && !doc.querySelector('[data-id="' + id + '"]')) {
				Global.ajax.init({
					area: area,
					url: src,
					add: true,
					callback: function(){
						setDropdown();
					}
				});
			} else {
				setDropdown();
			}
			
			//set
			function setDropdown(){
				var el_btn = doc.querySelector('#' + id);
				var el_pnl = doc.querySelector('[data-id="'+ id +'"]'); 
				var el_close = el_pnl.querySelector('.ui-drop-close');

				//set up
				el_btn.setAttribute('aria-expanded', false);
				el_btn.dataset.ps = ps;
				el_pnl.setAttribute('aria-hidden', true);
				el_pnl.setAttribute('aria-labelledby', id);
				el_pnl.dataset.id = id;
				el_pnl.dataset.ps = ps;

				//event
				el_btn.addEventListener('click', action);
				el_close.addEventListener('click', actionClose);

				function actionClose(){
					var id = this.closest('.ui-drop-pnl').dataset.id;

					Global.dropdown.toggle({ 
						id: id 
					});
					doc.querySelector('#' + id).focus();
				}
				function action(e) {
					e.preventDefault();
					var that = e.currentTarget;
	
					that.dataset.sct = doc.documentElement.scrollTop;
					Global.dropdown.toggle({ 
						id: that.id,
					});
				}

				!!callback && callback();
			}
		},
		back: function(e){
			e.preventDefault();

			var isTure = '';

			for (var i = 0, len = e.path.length; i < len; i++) {
				var that = e.path[i];
				isTure = isTure + that.classList;
			}
			// for (var path of e.path) {
			// 	isTure = isTure + path.classList;
			// }

			(isTure.indexOf('ui-drop-pnl') < 0) && Global.dropdown.hide();
		},
		toggle: function(opt) {
			var id = opt.id;
			var el_btn = doc.querySelector('#' + id);
			var el_pnl = doc.querySelector('.ui-drop-pnl[data-id="'+ id +'"]');
			var state = opt.state !== undefined ? opt.state : 'toggle';
			var btnExpanded =  el_btn.getAttribute('aria-expanded');

			var ps = el_btn.dataset.ps;
	
			if (!!el_btn.dataset.ps) {
				ps = el_btn.dataset.ps;
			}
			
			if (state === 'open') {
				btnExpanded = 'false';
			} else if (state === 'close') {
				btnExpanded = 'true';
			}
			
			btnExpanded === 'false' ? pnlShow(): pnlHide();

			function pnlShow(){
				var elBody = doc.querySelector('body');

				(!el_btn.closest('.ui-drop-pnl')) && Global.dropdown.hide();

				Global.focus.loop({
					selector: doc.querySelector('.ui-drop-pnl[data-id="'+ id +'"]'),
					callback:pnlHide
				});

				el_btn.setAttribute('aria-expanded', true);	
				el_pnl.setAttribute('aria-hidden', false)
				el_pnl.classList.add('on');

				var sT = Math.floor(doc.documentElement.scrollTop);
				var btn_w = Math.ceil(el_btn.offsetWidth);
				var btn_h = Math.ceil(el_btn.offsetHeight);
				var btn_t = Math.ceil(el_btn.getBoundingClientRect().top);
				var btn_l = Math.ceil(el_btn.getBoundingClientRect().left);
				var pnl_w = Math.ceil(el_pnl.offsetWidth);
				var pnl_h = Math.ceil(el_pnl.offsetHeight);

				switch (ps) {
					case 'BL': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l + 'px';
						break;
					case 'BC': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l - ((pnl_w - btn_w) / 2) + 'px';
						break;
					case 'BR': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l - (pnl_w - btn_w) + 'px';
						break;
					case 'TL': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left = btn_l + 'px';
						break;
					case 'TC': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left = btn_l + 'px';
						break;
					case 'TR': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left =  btn_l - (pnl_w - btn_w) + 'px';
						break;
					case 'RT': 
						el_pnl.style.top = btn_t + sT + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;
					case 'RM': 
					
						el_pnl.style.top = btn_t + sT - ((pnl_h - btn_h) / 2) + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;
					case 'RB': 
						el_pnl.style.top = btn_t + sT - (pnl_h - btn_h) + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;
					case 'LT': 
						el_pnl.style.top = btn_t + sT + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break;
					case 'LM': 
						el_pnl.style.top = btn_t + sT - ((pnl_h - btn_h) / 2) + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break;
					case 'LB': 
					el_pnl.style.top = btn_t + sT - (pnl_h - btn_h) + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break; 
					case 'CM': 
						el_pnl.style.top = '50%';
						el_pnl.style.left = '50%';
						el_pnl.style.marginTop = (pnl_h / 2 ) * -1 + 'px';
						el_pnl.style.marginLeft = (pnl_w / 2 ) * -1 + 'px';
						break;
				}
				
				setTimeout(function(){
					elBody.classList.add('dropdownOpened');
					setTimeout(function(){
						el_pnl.focus();
					},0);
				},0);

				doc.removeEventListener('click', Global.dropdown.back);
				setTimeout(function(){
					doc.addEventListener('click', Global.dropdown.back);
				},0);
			}
			function pnlHide(){
				var in_pnl = el_btn.closest('.ui-drop-pnl');
				var elBody = doc.querySelector('body');

				if (!in_pnl) {
					elBody.classList.remove('dropdownOpened');
				}
	
				el_btn.setAttribute('aria-expanded', false)
				el_btn.focus();
				el_pnl.setAttribute('aria-hidden', true)
				el_pnl.setAttribute('tabindex', -1)
				el_pnl.classList.remove('on');
			}
		}, 
		hide: function() {
			var elBody = doc.querySelector('body')
			var elDrops = doc.querySelectorAll('.ui-drop');
			var elDropPnls = doc.querySelectorAll('.ui-drop-pnl[aria-hidden="false"]');

			elBody.classList.remove('dropdownOpened');

			for (var i = 0, len = elDrops.length; i < len; i++) {
				var that = elDrops[i];
				that.setAttribute('aria-expanded', false);
			}

			for (var i = 0, len = elDropPnls.length; i < len; i++) {
				var that = elDropPnls[i];
				that.setAttribute('hidden', true);
				that.setAttribute('tabindex', -1);
				that.classList.remove('on');
			}

			doc.removeEventListener('click', Global.dropdown.back);
		}
	}	

	Global.modal = {
		/**
		 * options
		 * type: normal | system
		 * ps: center | top | bottom
		 */
		options : {
			type: 'normal', 
			ps: 'center',
			full: false,
			src: false,
			remove: false,
			width: false,
			height: false,
			callback:false,
			closeCallback:false,
			endfocus:false,
			mg: 20,

			sMessage: '',
			sBtnConfirmTxt: 'Ok',
			sBtnCancelTxt: 'Cancel',
			sClass: 'type-system',
			sZindex: false,
			sConfirmCallback: false,
			sCancelCallback: false
		},
		optionsClose : {
			remove: false,
			callback: false,
			endfocus: false
		},
		show: function(option){
			var opt = Object.assign({}, Global.modal.options, option);
			var elBody = doc.querySelector('body');
			var type = opt.type;
			var src = opt.src;
			var full = opt.full;
			var ps = opt.ps;
			var width = opt.width;
			var height = opt.height;
			var callback = opt.callback;
			var callbackClose = opt.callbackClose;
			var mg = opt.mg;
			var id = opt.id;
			var remove = opt.remove;
			var endfocus = opt.endfocus === false ? document.activeElement : opt.endfocus;
			var scr_t = doc.documentElement.scrollTop;
			var timer;
			
			//system
			var sMessage = opt.sMessage;
			var sBtnConfirmTxt = opt.sBtnConfirmTxt;
			var sBtnCancelTxt = opt.sBtnCancelTxt;
			var sZindex = opt.sZindex;
			var sClass = opt.sClass;
			var sConfirmCallback = opt.sConfirmCallback;
			var sCancelCallback = opt.sCancelCallback;

			//setting
			if (type === 'normal') {
				//modal
				if (!!src && !doc.querySelector('#' + opt.id)) {
					Global.ajax.init({
						area: elBody,
						url: src,
						add: true,
						callback: function(){
							act();
						}
					});
				} else {
					act();
				}
				endfocus.dataset.focus = id;
			} else {
				//system modal
				endfocus = null;
				remove = true;
				id = 'uiSystemModal';
				makeSystemModal();
			}

			function makeSystemModal(){
				var htmlSystem = '';
				
				htmlSystem += '<div class="ui-modal type-system '+ sClass +'" id="uiSystemModal" role="dialog" aria-modal="true" aria-live="polite">';
				htmlSystem += '<div class="ui-modal-wrap">';
				htmlSystem += '<div class="ui-modal-body">';
				htmlSystem += sMessage;
				htmlSystem += '</div>';
				htmlSystem += '<div class="ui-modal-footer">';
				htmlSystem += '<div class="wrap-btn">';

				if (type === 'confirm') {
					htmlSystem += '<button type="button" class="btn-mix-outlined-m text ui-modal-cancel"><span>'+ sBtnCancelTxt +'</span></button>';
				}

				htmlSystem += '<button type="button" class="btn-mix-outlined-m text primary ui-modal-confirm"><span>'+ sBtnConfirmTxt +'</span></button>';	
				htmlSystem += '</div>';
				htmlSystem += '</div>';
				htmlSystem += '</div>';
				htmlSystem += '</div>';

				elBody.insertAdjacentHTML('beforeend', htmlSystem);

				htmlSystem = '';
				act();
			}

			function act(){
				var elModal = doc.querySelector('#' + id);
				var elModals = doc.querySelectorAll('.ui-modal');

				for (var i = 0, len = elModals.length; i < len; i++) {
					var that = elModals[i];
					that.classList.remove('current');
					elBody.classList.add('scroll-no');
				}
				
				(!elModal.querySelector('.ui-modal-dim')) && elModal.insertAdjacentHTML('beforeend','<div class="ui-modal-dim"></div>');

				var elModalWrap = elModal.querySelector('.ui-modal-wrap');
				var elModalBody = elModalWrap.querySelector('.ui-modal-body');
				var elModalHeader = elModalWrap.querySelector('.ui-modal-header');
				var elModalFooter = elModalWrap.querySelector('.ui-modal-footer');
				var elModalTit = elModal.querySelector('.ui-modal-tit');
				var elModalDim = elModal.querySelector('.ui-modal-dim');
				var elModalCancel = elModal.querySelector('.ui-modal-cancel');
				var elModalConfirm = elModal.querySelector('.ui-modal-confirm');
				var elModalClose = elModal.querySelector('.ui-modal-close');
				var elModalOpen = doc.querySelectorAll('.ui-modal.open');
				var openLen = !!elModalOpen ? elModalOpen.length : 0;

				doc.querySelector('html').classList.add('is-modal');
				elModal.classList.add('n' + openLen);
				elModal.classList.remove('close');
				elModal.classList.remove('type-full');
				elModal.classList.remove('ps-center');
				elModal.classList.remove('ps-top');
				elModal.classList.remove('ps-bottom');
				elModal.classList.add('current');
				elModal.classList.add('ready');
				elModal.dataset.remove = remove;
				elModal.dataset.n = openLen;
				elModal.dataset.scrolltop = scr_t;
				elModal.setAttribute('role', 'dialog');
				!!elModalTit && elModalTit.setAttribute('tabindex', 0);
				elModalBody.style.overflowY = 'auto';

				var headerH = !!elModalHeader ? elModalHeader.offsetHeight : 0;
				var footerH = !!elModalFooter ? elModalFooter.offsetHeight : 0;
				var space = !!full ? 0 : mg;

				//[set] position
				switch (ps) {
					case 'center' :
						elModal.classList.add('ps-center');
						break;
					case 'top' :
						elModal.classList.add('ps-top');
						break;
					case 'bottom' :
						elModal.classList.add('ps-bottom');
						break;
					default :
						elModal.classList.add('ps-center');
						break;
				}
				
				//[set] full type / width & height
				(!!full) && elModal.classList.add('type-full');
				(!!width) ? elModalWrap.style.width = width : '';
				elModalBody.style.height = (!height) ? '100%' : height + 'px';
				elModalBody.style.maxHeight = win.innerHeight - (headerH + footerH + (space * 2))  + 'px';
				elModalBody.style.maxWidth = win.innerWidth - (space * 2) + 'px';
				
				clearTimeout(timer);
				timer = setTimeout(function(){
					Global.focus.loop({ 
						selector: elModal, 
					});

					elModal.classList.add('open');
					(!!sZindex) ? elModal.style.zIndex = sZindex : '';
					(win.innerHeight < elModalWrap.offsetHeight) ? 
						elModal.classList.add('is-over'):
						elModal.classList.remove('is-over');

					!!elModalTit && elModalTit.focus();
					!!callback && callback(id);

					//dim event
					elModalDim.addEventListener('click', Global.modal.dimAct);
				},150);

				//close button event
				if (!!elModalClose) {
					elModalClose.addEventListener('click', closeAct);
				}
				function closeAct(e){
					var elThis = e.currentTarget;
					var elThisModal = elThis.closest('.ui-modal');

					TFUI.modal.hide({ 
						id: elThisModal.id, 
						remove: remove,
						callbackClose: callbackClose
					});
				}

				//systyem modal confirm & cancel callback
				elModalConfirm && elModalConfirm.addEventListener('click', sConfirmCallback);
				elModalCancel && elModalCancel.addEventListener('click', sCancelCallback);
			
				//transition end event
				elModalWrap.addEventListener('transitionend', modalTrEnd);
				function modalTrEnd(){
					if (!!full) {
						elModal.classList.add('fix-header');
						elModalBody.style.paddingTop = (headerH + 10)  + 'px';
					}
				}

				//resize event
				var timerResize;
				win.addEventListener('resize', winResize);
				function winResize() {
					clearTimeout(timerResize);
					timerResize = setTimeout(function(){
						Global.modal.reset();
					}, 200);
				}
			}
		},
		dimAct: function() {
			var elOpens = doc.querySelectorAll('.ui-modal.open');
			var openN = [];

			for (var i = 0, len = elOpens.length; i < len; i++) {
				var that = elOpens[i];
				that.dataset.n && openN.push(that.dataset.n);
			}

			var elCurrent = doc.querySelector('.ui-modal.open[data-n="'+ Math.max.apply(null, openN) +'"]');
			var currentID = elCurrent.id;

			//system modal 제외
			if (currentID !== 'uiSystemModal') {
				TFUI.modal.hide({ 
					id: currentID, 
					remove: elCurrent.dataset.remove
				});
			}
		},
		reset: function() {
			var elModals = doc.querySelectorAll('.ui-modal.open.ps-center');

			for (var i = 0, len = elModals.length; i < len; i++) {
				var that = elModals[i];
				var elModalHead = that.querySelector('.ui-modal-header');
				var elModalBody = that.querySelector('.ui-modal-body');
				var elModalFoot = that.querySelector('.ui-modal-footer');
				var h_win = win.innerHeight;
				var h_head = elModalHead.outerHeight();
				var h_foot = elModalFoot.outerHeight();
				var h = h_win - (h_head + h_foot);

				if (Global.browser.size !== 'desktop') {
					elModalBody.style.minHeight = h + 'px';
					elModalBody.style.maxHeight = h + 'px';
				} else {
					elModalBody.style.minHeight = '';
					elModalBody.style.maxHeight = '';
				}
			}
		},
		hide: function(option){
			var opt = Object.assign({}, Global.modal.optionsClose, option);
			var id = opt.id;
			var type = opt.type;
			var remove = opt.remove;
			var callback = opt.callback;
			var elModal = doc.querySelector('#' + id);
			var elBody = doc.querySelector('body');
			var elHtml = doc.querySelector('html');
			var elModals = doc.querySelectorAll('.ui-modal');

			elModal.classList.add('close');
			elModal.classList.remove('open')
			elModal.classList.remove('fix-header');
			
			var elOpen = doc.querySelectorAll('.ui-modal.open');
			var len = (elOpen.length > 0) ? elOpen.length : false;

			var timer;
			var endfocus = opt.endfocus ;
			var elModalPrev = false;
			
			for (var i = 0, len = elModals.length; i < len; i++) {
				var that = elModals[i];
				that.classList.remove('current');
			}

			if (!!len) {
				elModalPrev = doc.querySelector('.ui-modal.open.n' + (len - 1));
				elModalPrev.classList.add('current');
			}

			//시스템팝업이 아닌 경우
			if (type !== 'system') {
				if (!len) {
					//단일
					endfocus = endfocus === false ? 
						doc.querySelector('[data-focus="'+id+'"]') : 
						opt.endfocus;

					//$('html').off('click.uimodaldim');
					elHtml.classList.remove('is-modal');
				} else {
					//여러개
					endfocus = endfocus === false ? 
						doc.querySelector('[data-focus="'+id+'"]') : 
						opt.endfocus;
				}
			}

			Global.scroll.move({
				top: Number(elModal.dataset.scrolltop)
			});
			
			clearTimeout(timer);
			timer = setTimeout(function(){
				var elWrap = elModal.querySelector('.ui-modal-wrap');
				var elOpen = doc.querySelectorAll('.ui-modal.open');
				var len = !!elOpen ? elOpen.length : false;
	
				elWrap.removeAttribute('style');
				elBody.removeAttribute('style');
				elModal.dataset.n = null;
				
				if (!len) {
					elHtml.classList.remove('scroll-no');
					elBody.classList.remove('scroll-no');
				}

				(remove === 'true') && elModal.remove();
				!!callback && callback(id);
				!!endfocus && endfocus.focus();
			},210);
		}, 
		hideSystem: function() {
			TFUI.modal.hide({ 
				id: 'uiSystemModal', 
				type: 'system', 
				remove: 'true'
			});
		}
	}

	Global.toast = {
		timer : null,
		/**
		 * options 
		 * delay: short[2s] | long[3.5s]
		 * status: assertive[중요도 높은 경우] | polite[중요도가 낮은 경우] | off[default]
		 */
		options : {
			delay: 'short',
			classname : '',
			conts: '',
			status: 'assertive' 
		},
		show : function(option) {
			var opt = Object.assign({}, this.options, option);
			var delay = opt.delay;
			var classname = opt.classname;
			var conts = opt.conts;
			var status = opt.status;
			var el_body = document.querySelector('body');
			var toast = '<div class="ui-toast toast '+ classname +'" aria-live="'+ status +'">'+ conts +'</div>';
			var time = (delay === 'short') ? 2000 : 3500;

			if (delay === 'short') {
				time = 2000;
			} else if(delay === 'long') {
				time = 3500;
			} else {
				time = delay;
			}

			if (!!doc.querySelector('.ui-toast-ready')) {
				clearTimeout(Global.toast.timer);
				el_body.classList.remove('ui-toast-show');
				el_body.classList.remove('ui-toast-ready');
				doc.querySelector('.ui-toast').removeEventListener('transitionend', act);
				doc.querySelector('.ui-toast').remove();
			} 

			el_body.insertAdjacentHTML('beforeend', toast);
			toast = null;
			
			var el_toast = doc.querySelector('.ui-toast');
			
			el_body.classList.add('ui-toast-ready');

			setTimeout(function(){
				el_body.classList.add('ui-toast-show');
				el_toast.addEventListener('transitionend', act);
			},0);

			function act(e){
				var that = e.currentTarget;

				that.removeEventListener('transitionend', act);
				that.classList.add('on');
				Global.toast.timer = setTimeout(Global.toast.hide, time);
			}
		},
		hide : function(){
			var el_body = doc.querySelector('body');
			var el_toast = doc.querySelector('.ui-toast');

			if (!!el_toast) {
				clearTimeout(Global.toast.timer);
				el_body.classList.remove('ui-toast-show');

				el_toast.removeEventListener('transitionend', act);
				el_toast.addEventListener('transitionend', act);

				
			}

			function act(e){
				var that = e.currentTarget;

				that.removeEventListener('transitionend', act);
				that.remove();
				el_body.classList.remove('ui-toast-ready');
			}
		}
	}

	Global.tooltip = {
		// options: {
		// 	visible: null,
		// 	id: false,
		// 	ps: false
		// },
		timerShow: null,
		timerHide: null,
		show: function(e){
			e.preventDefault();

			var elBody = doc.querySelector('body');
			var el = e.currentTarget;
			var elId = el.getAttribute('aria-describedby');
			var elSrc = el.dataset.src;
			var evType = e.type;

			var elTooltip = doc.querySelector('#' + elId);

			if (!!elSrc && !elTooltip) {	
				elBody.insertAdjacentHTML('beforeend', '<div class="ui-tooltip" id="'+ elId +'"><div class="ui-tooltip-arrow"></div>');
				Global.ajax.init({
					area: doc.querySelector('#' + elId),
					url: elSrc,
					add: true,
					callback: function(){						
						act();
					}
				});
			} else {
				if (el.dataset.view !== 'fix') {
					act();
				} else {
					if (evType === 'click') {
						el.dataset.view = 'unfix';
						Global.tooltip.hide(e);
					} else {
						act();
					}
				}
			}

			function act(){
				elTooltip = doc.querySelector('#' + elId);

				var tooltips = doc.querySelectorAll('.ui-tooltip');
				var btns = doc.querySelectorAll('.ui-tooltip-btn');
				var elArrow = elTooltip.querySelector('.ui-tooltip-arrow');
				var classToggle = evType !== 'click' ? 'add' : 'remove';
				
				if (evType === 'click' && el.dataset.view !== 'fix') {
					
					for (var i = 0, len = tooltips.length; i < len; i++) {
						var that = tooltips[i];

						if (that.id !== elId) {
							that.removeAttribute('style');
							that.setAttribute('aria-hidden', true);
						}
					}

					for (var i = 0, len = btns.length; i < len; i++) {
						var that = btns[i];
						that.dataset.view = 'unfix';
					}

					el.dataset.view = 'fix';

					doc.removeEventListener('click', Global.tooltip.back);
					setTimeout(function(){
						doc.addEventListener('click', Global.tooltip.back);
					},0);
				}

				for (var i = 0, len = tooltips.length; i < len; i++) {
					var that = tooltips[i];
					if (that.id !== elId) {
						that.classList.remove('hover');
					}
				}

				elTooltip.classList[classToggle]('hover');

				var elT = el.getBoundingClientRect().top;
				var elL = el.getBoundingClientRect().left;
				var elW = el.offsetWidth;
				var elH = el.offsetHeight;
				var wW = win.innerWidth;
				var wH = win.innerHeight;
				var dT = doc.documentElement.scrollTop;
				var dL = doc.documentElement.scrollLeft;

				clearTimeout(Global.tooltip.timerHide);
				Global.tooltip.timerShow = setTimeout(function(){
					var tW = Math.floor(elTooltip.offsetWidth);
					var left = (tW / 2 > (elL - dL) + (elW / 2)) ? 10 : elL - (tW / 2) + (elW / 2);
					wW < Math.floor(left) + tW ? elTooltip.style.right = '10px' : '';
					elTooltip.style.left = Math.floor(left) + 'px';

					var tH = Math.floor(elTooltip.offsetHeight);
					var top = (elT - dT > wH / 2) ? elT + dT - tH - 8 : elT + elH + dT + 8;
					elTooltip.style.top = Math.floor(top) + 'px';

					var arrow = (elT - dT > wH / 2) ? 'top' : 'bottom';
					elArrow.style.left = Math.floor(elL - left + (elW / 2)) + 'px';

					elTooltip.dataset.ps = arrow;
					elTooltip.setAttribute('aria-hidden', false);
					console.log(Math.floor(left) + tW, wW);
				},100);
				
				el.addEventListener('blur', Global.tooltip.hide);
				el.addEventListener('mouseleave', Global.tooltip.hide);
			}
		},
		back: function(e){
			e.preventDefault();

			var tooltips = doc.querySelectorAll('.ui-tooltip');
			var btns = doc.querySelectorAll('.ui-tooltip-btn');

			for (var i = 0, len = tooltips.length; i < len; i++) {
				var that = tooltips[i];
				that.setAttribute('aria-hidden', true);
			}

			for (var i = 0, len = btns.length; i < len; i++) {
				var that = btns[i];
				that.dataset.view = 'unfix';
			}

			doc.removeEventListener('click', Global.tooltip.back);
		},
		hide: function(e){
			e.preventDefault();

			var el = e.currentTarget;
			var elId = el.getAttribute('aria-describedby');
			var elTooltip = doc.querySelector('#' + elId);

			if (el.dataset.view !== 'fix') {
				clearTimeout(Global.tooltip.timerShow);
				elTooltip.classList.remove('hover');
				elTooltip.setAttribute('aria-hidden', true);
			}

			el.removeEventListener('blur', Global.tooltip.hide);
			el.removeEventListener('mouseleave', Global.tooltip.hide);
		},
		init: function() {
			//var opt = {...this.options, ...option};
			//var opt = Object.assign({}, Global.tooltip.options, option);
			var el_btn = doc.querySelectorAll('.ui-tooltip-btn');

			for (var i = 0, len = el_btn.length; i < len; i++) {
				var that = el_btn[i];

				that.addEventListener('mouseover', Global.tooltip.show);
				that.addEventListener('focus', Global.tooltip.show);
				that.addEventListener('click', Global.tooltip.show);
				win.addEventListener('resize',  Global.tooltip.back);
			}
		}
	}

	Global.floating = {
		init: function() {
			var el_body = document.body;
			var el_items = doc.querySelectorAll('.ui-floating');

			el_body.dataset.fixheight = 0;

			//setting
			for (var i = 0, len = el_items.length; i < len; i++) {
				var that = el_items[i];
				var fix = that.dataset.fix;
				var ps = that.dataset.ps;
				var el_wrap = that.querySelector('.ui-floating-wrap');
				var mg = Number(that.dataset.mg === undefined || that.dataset.mg === null ? 0 : that.dataset.mg);
				var elH = el_wrap.offsetHeight;
				var elT = that.getBoundingClientRect().top;
				var wH = win.innerHeight;

				that.style.height = elH + 'px';

				if (fix === 'true') {
					//고정으로 시작
					that.dataset.state = 'fix';
					if (ps === 'top') {
						if (elT >= 0 + mg && fix === 'true') {
							el_wrap.style.marginTop = mg + 'px';
						} else {
							that.dataset.state = 'normal';
						}
					} else {
						if ((elT - wH) + elH + mg >= 0 && fix === 'true') {
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						} else {
							that.dataset.state = 'normal';
						}
					}
				} else {
					that.dataset.state = 'normal';
				}
			}

			window.removeEventListener('scroll', this.scrollAct);
			window.addEventListener('scroll', this.scrollAct);
		},
		scrollAct: function(){
			var elBody = document.body;
			var el_items = doc.querySelectorAll('.ui-floating');
			
			for (var i = 0, len = el_items.length; i < len; i++) {
				var that = el_items[i];
				var fix = that.dataset.fix;
				var ps = that.dataset.ps;
				var state = that.dataset.state;
				var el_wrap = that.querySelector('.ui-floating-wrap');
				var mg = Number(that.dataset.mg === undefined || that.dataset.mg === null ? 0 : that.dataset.mg);
				var elH = el_wrap.offsetHeight;
				var elT = that.getBoundingClientRect().top;
				var wH = win.innerHeight;

				if (state === 'fix') {
					if (ps === 'top') {
						//현재 상단고정상태
						if (elT <= 0 + mg && fix === 'true') {
							that.dataset.state = 'normal';
							el_wrap.style.marginTop = 0;
						}

						if (elT >= 0 + mg && fix === 'false') {
							that.dataset.state = 'normal';
							el_wrap.style.marginTop = 0;
						}

					} else {
						//현재 하단고정상태
						if ((elT - wH) + elH + mg <= 0 && fix === 'true') {
							that.dataset.state = 'normal';
							el_wrap.style.transform = 'translateY(0)';
						}

						if ((elT - wH) + elH + mg >= 0 && fix === 'false') {
							that.dataset.state = 'normal';
							el_wrap.style.transform = 'translateY(0)';
						}
					}

				} else {

					if (ps === 'top') {
						//현재 상단고정상태
						if (elT >= 0 + mg && fix === 'true') {
							that.dataset.state = 'fix';
							el_wrap.style.marginTop = mg + 'px';
						}

						if (elT <= 0 + mg && fix === 'false') {
							that.dataset.state = 'fix';
							el_wrap.style.marginTop = mg + 'px';
						}
						
					} else {
						//현재 하단고정상태
						if ((elT - wH) + elH + mg >= 0 && fix === 'true') {
							that.dataset.state = 'fix';
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						}

						if ((elT - wH) + elH + mg <= 0 && fix === 'false') {
							that.dataset.state = 'fix';
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						}
					}
				}
			}
		},
		range: function() {
			var el_ranges = doc.querySelectorAll('.ui-floating-range');
			
			window.removeEventListener('scroll', act);
			window.addEventListener('scroll', act);
							
			function act(){
				for (var i = 0, len = el_ranges.length; i < len; i++) {
					var that = el_ranges[i];
					var el_item = that.querySelector('.ui-floating-range-item');
					var mg = Number(that.dataset.mg === undefined || that.dataset.mg === null ? 0 : that.dataset.mg);
					var itemH = el_item.offsetHeight;
					var wrapT = that.getBoundingClientRect().top;
					var wrapH = that.offsetHeight;
					var wT = win.pageYOffset;
					var top = mg;

					if (wT > (wrapT + wT - mg)) {
						if (wrapH - itemH >= wT - (wrapT + wT - mg)) {
							top = mg > (wT - (wrapT + wT - mg)).toFixed(0) ? mg : (wT - (wrapT + wT - mg)).toFixed(0);
							el_item.style.transform = 'translate(0, '+ top +'px)';
						}
					} else {
						top = mg;
						el_item.style.transform = 'translate(0, '+ top +'px)';
						//el_item.style.top = 0;
					}
				}
			}
		}
	}

	Global.tab = {
		options: {
			current: 0,
			onePanel: false,
			callback: false,
			effect: false,
			align : 'center'
		},
		init: function(option) {
			var opt = Object.assign({}, this.options, option);
			var id = opt.id;
			var effect = opt.effect;
			var current = isNaN(opt.current) ? 0 : opt.current;
			var onePanel = opt.onePanel;
			var callback = opt.callback;
			var align = opt.align;
			var el_tab = doc.querySelector('.ui-tab[data-id="' + id + '"]');

			//:scope >
			var el_btnwrap = el_tab.querySelector('.ui-tab-btns');
			var el_wrap = el_btnwrap.querySelector('.wrap-btn');

			var el_btns = el_btnwrap.querySelectorAll('.ui-tab-btn');

			//:scope >
			var el_pnlwrap = el_tab.querySelector('.ui-tab-pnls');
			var el_pnls = el_pnlwrap.querySelectorAll('.ui-tab-pnl');

			var keys = Global.state.keys;
			var para = Global.para.get('tab');

			var paras;
			var paraname;

			//set up
			if (!!para) {
				if (para.split('+').length > 1) {
					//2 or more : tab=exeAcco1*2+exeAcco2*3
					paras = para.split('+');

					for (var j = 0; j < paras.length; j++ ) {
						paraname = paras[j].split('*');
						opt.id === paraname[0] ? current = Number(paraname[1]) : '';
					}
				} else {
					//only one : tab=1
					if (para.split('*').length > 1) {
						paraname = para.split('*');
						opt.id === paraname[0] ? current = Number(paraname[1]) : '';
					} else {
						current = Number(para);
					}
				}
			}

			//set up
			!!effect && el_tab.classList.add(effect);
			// el_btnwrap.setAttribute('role','tablist');

			//setting
			for (var i = 0, len = el_btns.length; i < len; i++) {
				var el_btn = el_btns[i];
				var el_pnl = el_pnls[i];

				// el_btn.setAttribute('role','tab');

				if (!el_btn.dataset.tab) {
					el_btn.dataset.tab = i;
				}
				el_btn.dataset.len = len;
				el_btn.dataset.n = i;

				var n = Number(el_btn.dataset.tab);
				var isCurrent = Number(current) === n;
				var cls = isCurrent ? 'add' : 'remove';

				
				if (!el_btn.id) {
					el_btn.id = id + 'Btn' + n;
				} 

				if (!onePanel) {
					// el_pnl.setAttribute('role','tabpanel');

					if (!el_pnl.dataset.tab) {
						el_pnl.dataset.tab = i;
					}

					if (!el_pnl.id) {
						el_pnl.id = id + 'pnl' + n;
					} 
				} else {
					// el_pnls[0].setAttribute('role','tabpanel');
					el_pnls[0].dataset.tab = current;
					el_pnls[0].id = id + 'pnl' + current;
				}
  
				var btnID = el_btn.id;
				var pnlID = !onePanel ? el_pnl.id : el_pnls[0].id;

				el_btn.setAttribute('aria-controls', pnlID);
				el_btn.classList[cls]('selected');

				if (!onePanel) {
					el_pnl.setAttribute('aria-labelledby', btnID);

					if ((Number(current) === Number(el_pnl.dataset.tab))) {
						el_pnl.setAttribute('aria-hidden', false);
						el_pnl.classList.add('selected');
					} else {
						el_pnl.setAttribute('aria-hidden', true);
						el_pnl.classList.remove('selected');
					}
				} else {
					el_pnls[0].setAttribute('aria-labelledby', btnID);
					el_pnls[0].setAttribute('aria-hidden', false);
					el_pnls[0].classList[cls]('selected');
				}

				i === 0 && el_btn.setAttribute('tab-first', true);
				i === len - 1 && el_btn.setAttribute('tab-last', true);

				if (isCurrent) {
					Global.scroll.move({ 
						selector: el_btnwrap, 
						left: el_btn.getBoundingClientRect().left + el_btnwrap.scrollLeft, 
						add : 0,
						align: align 
					});
				}

				el_btn.addEventListener('click', evtClick);
				el_btn.addEventListener('keydown', evtKeys);
			}

			callback && callback(opt);
			
			//event
			function evtClick(e) {
				Global.tab.toggle({ 
					id: id, 
					current: Number(e.currentTarget.dataset.tab), 
					align:align,
					onePanel:onePanel,
					callback:callback
				}); 
			}
			function evtKeys(e) {
				var that = this;
				var n = Number(that.dataset.n);
				var m = Number(that.dataset.len);

				switch(e.keyCode){
					case keys.up: upLeftKey(e);
					break;

					case keys.left: upLeftKey(e);
					break;

					case keys.down: downRightKey(e);
					break;

					case keys.right: downRightKey(e);
					break;

					case keys.end: endKey(e);
					break;

					case keys.home: homeKey(e);
					break;
				}

				function upLeftKey(e) {
					e.preventDefault();
					!that.getAttribute('tab-first') ? 
					Global.tab.toggle({ id: id, current: n - 1, align:align }): 
					Global.tab.toggle({ id: id, current: m - 1, align:align});
				}
				function downRightKey(e) {
					e.preventDefault();
					!that.getAttribute('tab-last') ? 
					Global.tab.toggle({ id: id, current: n + 1, align:align }): 
					Global.tab.toggle({ id: id, current: 0, align:align });
				}
				function endKey(e) {
					e.preventDefault();
					Global.tab.toggle({ id: id, current: m - 1, align:align });
				}
				function homeKey(e) {
					e.preventDefault();
					Global.tab.toggle({ id: id, current: 0, align:align });
				}
			}
		},
		toggle: function(option) {
			var opt = Object.assign({}, this.options, option);
			var id = opt.id;
			var callback = opt.callback;
			var el_tab = doc.querySelector('.ui-tab[data-id="' + id + '"]');

			//:scope >
			var el_btnwrap = el_tab.querySelector('.ui-tab-btns');

			var el_btn = el_btnwrap.querySelectorAll('.ui-tab-btn');

			//:scope >
			var el_pnlwrap = el_tab.querySelector('.ui-tab-pnls');
			var el_pnls = el_pnlwrap.querySelectorAll('.ui-tab-pnl');

			var current = isNaN(opt.current) ? 0 : opt.current;
			var onePanel = opt.onePanel;
			var align = opt.align;
			var el_current = el_btnwrap.querySelector('.ui-tab-btn[data-tab="'+ current +'"]');
			var el_pnlcurrent = el_pnlwrap.querySelector('.ui-tab-pnl[data-tab="'+ current +'"]');
			var btnId = el_current.id;

			//:scope >
			var el_scroll = el_btnwrap.querySelector('.ui-scrollbar-item');

			for (var i = 0, len = el_btn.length; i < len; i++) {
				var that = el_btn[i];
				that.classList.remove('selected');
			}
			console.log(id);
			
			el_current.classList.add('selected')
			el_current.focus();

			if (!el_scroll) {
				el_scroll = el_btnwrap;
			}

			Global.scroll.move({ 
				selector: el_btnwrap, 
				left: el_current.getBoundingClientRect().left + el_scroll.scrollLeft, 
				add : 0,
				align: align 
			});

			if (!onePanel) {
				for (var i = 0, len = el_pnls.length; i < len; i++) {
					var that = el_pnls[i];
					that.setAttribute('aria-hidden', true);
					that.classList.remove('selected');
				}
				
				el_pnlcurrent.classList.add('selected');
				el_pnlcurrent.setAttribute('aria-hidden', false);
			} else {
				el_pnls[0].setAttribute('aria-hidden', false);
				el_pnls[0].setAttribute('aria-labelledby', btnId);
			}

			callback && callback(opt);
		}
	}

	
	

	
	

})(window, document);
