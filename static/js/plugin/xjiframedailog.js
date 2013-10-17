;(function(window,undefined,$){

	function xjIframeDailog(){
		this.opening = false ;
		this.themes = {
			default:{
				box:"<div id='dailog_${id}' class='xj-window xj-window-plain'></div>",
				header:"<div id='dailog_head_${id}' class='xj-window-tl'><div class='xj-window-tr'><div class='xj-window-tc'><div style='mozuserselect: none; khtmluserselect: none' class='xj-window-header' unselectable='on'><div class='xj-tool xj-tool-close'>&nbsp;</div><span class='xj-window-header-text'>${caption}</span></div></div></div></div>",
				body:"<div class='xj-window-bwrap'><div class='xj-window-ml'><div class='xj-window-mr'><div class='xj-window-mc'><div id='dailog_body_${id}' style='width: ${width}px; height: ${height}px' class='xj-window-body'>${iframehtml}</div></div></div></div><div class='xj-window-bl'><div class='xj-window-br'><div class='xj-window-bc'><div class='xj-window-footer'></div></div></div></div></div>",
				iframe:"<iframe id='dailog_iframe_${id}' border='0' frameBorder='0' src='${url}' style='border:none;width:${width}px;height:${height}px'></iframe>",
				wp:14
			},
			simple:{
				box:"<div id='dailog_${id}' class='xj-window xj-window-dailog'></div>",
				header:"<div id='dailog_head_${id}' class='xj-dailog-tl'></div>",
				body:"<div class='xj-window-bwrap'><div id='dailog_body_${id}' style='width: ${width}px; height: ${height}px' class='xj-window-body'>${iframehtml}</div></div>",
				iframe:"<iframe id='dailog_iframe_${id}' border='0' frameBorder='0' src='${url}' style='border:none;width:${width}px;height:${height}px'></iframe>",
				wp:0
			}
		}; 

	}
	function __escapeHTML__(htmlText){
		var div = document.createElement('div');
        div.appendChild(document.createTextNode(htmlText));
        return div.innerHTML;
	}
	
	function __Tp__(temp, dataarry) {
        return temp.replace(/\$\{([\w]+)\}/g, function(s1, s2) { var s = dataarry[s2]; if (typeof (s) != "undefined") { return s; } else { return s1; } });
    }

    function __getMargins__(element, toInteger){
    	var el = $(element);
        var t = el.css('marginTop') || '';
        var r = el.css('marginRight') || '';
        var b = el.css('marginBottom') || '';
        var l = el.css('marginLeft') || '';
        if (toInteger)
            return {
                t: parseInt(t) || 0,
                r: parseInt(r) || 0,
                b: parseInt(b) || 0,
                l: parseInt(l)
            };
        else
            return { t: t, r: r, b: b, l: l };
    }

    function __SetDocumentCenter__(el){
    	el = $(el);
        el.css({
            position: 'absolute',
            left: Math.max((document.documentElement.clientWidth - el.width()) / 2 + $(document).scrollLeft(), 0) + 'px',
            top: Math.max((document.documentElement.clientHeight - el.height()) / 2 + $(document).scrollTop(), 0) + 'px'
        });
    }
	xjIframeDailog.prototype ={
		Open:function(url,options){ //打开一个新的窗口
			var self = this;
			if(this.opening){
				return false;
			}		
			this.opening = true;
			this.options = options = $.extend({
				            width: 600,
				            height: 400,
				            caption: '无主题窗口',
				            enabledrag: true,
				            theme:"default",
				            onclose: null
			},options);			
        	options.id = (new Date()).valueOf();
        	options.caption = __escapeHTML__(options.caption);
        	options.url = url + (url.indexOf('?') > -1 ? '&' : '?') + '_=' + (new Date()).valueOf(); 
        	var theme = this.themes[options.theme];       	
	        var html = [];	        
	        options.iframehtml = __Tp__(theme.iframe, options);
	        html.push(__Tp__(theme.header, options));
	        html.push(__Tp__(theme.body, options));

	        var box = $(__Tp__(theme.box, options));
	        box.css({ width: options.width + theme.wp }).html(html.join(""));

	        var closebtn = box.find("div.xj-tool-close")
	        .hover(function(e) { $(this).addClass("hover") }, function(e) { $(this).removeClass("hover") })
	        .click(function(){self.Close();});
	        this.closebtn = closebtn;
	        var margins = __getMargins__(document.body, true);
	        var overlayer = $('<div></div>').css({
	            position: 'absolute',
	            left: 0,
	            top: 0,
	            width: Math.max(document.documentElement.clientWidth, document.body.scrollWidth),
	            height: Math.max(document.documentElement.clientHeight, document.body.scrollHeight + margins.t + margins.b),
	            zIndex: '998',
	            background: '#fff',
	            opacity: '0.5'
	        }).bind('contextmenu', function() { return false; }).appendTo(document.body);
	        this.overlayer = overlayer;
	        var isdrag = false;	       
	        if (options.enabledrag){
	            if ($.fn.easydrag) {
	                box.addClass("xj-window-draggable").easydrag(false)
	                //.setHandler("dailog_head_" + newid)
	                .ondrag(function(e) {
	                    if (isdrag == false) {
	                        isdrag = true;
	                        $("#dailog_body_" + options.id).css("visibility", "hidden");
	                    }
	                }).ondrop(function(e) {
	                    isdrag = false;
	                    $("#dailog_body_" + options.id).css("visibility", "visible");
	                });
	            }
	        }
	        box.appendTo(document.body);
	        __SetDocumentCenter__(box);
	        this.box = box;
	        if (!$.support.boxModel) {
	            $(document.body).addClass("hiddenselect");
	            document.getElementById("dailog_iframe_" + newid).src = options.url;
	        }
	      
		},
		Close : function(callback,d,userstate){		
            if (!$.support.boxModel) {
                $(document.body).removeClass("hiddenselect");
            }
            this.overlayer.remove();
            this.closebtn.remove();
            this.box.remove();
            this.opening = false;
            this.closebtn = this.overlayer = this.box = null;
            callback && callback();
            if (d && this.options.onclose) {
                this.options.onclose(userstate);
                this.options.onclose = null;
            }
		}
	};
	//一个页面一次只能打开一个dailog哦
	window.xjDailog = new xjIframeDailog();
})(window,undefined,jQuery);