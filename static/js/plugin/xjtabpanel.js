;(function(window,undefined,$){

  	function xjTabPanel(id,options){		
	    var headerheight = 29;

	    options = $.extend({
	        items: [], //选项卡数据项 {id,text,classes,disabled,closeable,content,url,cuscall,onactive}
	        width: 500,
	        height: 400,
	        showcloseall: 5, //当item数量大于5个时，显示关闭所有的按钮
	        scrollwidth: 100, //如果存在滚动条，点击按钮次每次滚动的距离
	        autoscroll: true, //当选项卡宽度大于容器时自动添加滚动按钮
	        onfullscreen: false,
	        onrestorescreen: false
	    }, options);
	    options.elid= id;
	    options.el = $("#"+id).width(options.width);     

        var innerwidth = options.width - 2;
        //构建Tab的Html    
        var tcs = options.autoscroll ? "x-tab-scrolling-top" : "";
        var header = $("<div class='x-tab-panel-header x-unselectable " + tcs + "' unselectable='on' style='width:" + innerwidth + "px;MozUserSelect:none;KhtmlUserSelect:none;'></div>");
        var stripwrap = $("<div class='x-tab-strip-wrap'/>");
        var scrollerright = $("<div class='x-tab-scroller-right x-unselectable' style='height: 24px; visibility: hidden; mozuserselect: none; khtmluserselect: none;' unselectable='on'/>");
        var scrollerleft = $("<div class='x-tab-scroller-left x-unselectable' style='height: 24px; visibility: hidden; mozuserselect: none; khtmluserselect: none;' unselectable='on'/>");
        var ulwrap = $("<ul class='x-tab-strip x-tab-strip-top'></ul>");
        var stripspacer = $("<div class='x-tab-strip-spacer'/>");
        var litemp = [];
        for (var i = 0, l = options.items.length; i < l; i++) {
            var item = options.items[i];
            __BuildItemLiHtml__(item, litemp);
        }
        if (options.items.length >= options.showcloseall) {
            __BuildCloseAllBTNHtml__(litemp);
        }
        litemp.push("<li class='x-tab-edge'/><div class='x-clear'></div>");

        ulwrap.html(litemp.join(""));
        litemp = null;
        stripwrap.append(ulwrap);
        if (options.autoscroll) {
            header.append(scrollerright).append(scrollerleft);
        }
        header.append(stripwrap).append(stripspacer);
        var bodyheight = options.height - headerheight;
        var bodywrap = $("<div class='x-tab-panel-bwrap'/>");
        var body = $("<div class='x-tab-panel-body x-tab-panel-body-top'/>").css({ width: innerwidth, height: bodyheight });
        var bodytemp = [];
        for (var i = 0, l = options.items.length; i < l; i++) {
            var item = options.items[i];
            __BuildItemBodyHtml__(item, bodytemp);
        }

        //var awrap = [];
        //awrap.push("<a href='javascript:void(0)' id='tab_fa_", item.id, "'  class='x-tab-fullscreen-a' title='点击切换全屏状态'><img alt='点击切换全屏状态' src='../static/image/icons/s.gif'/></a>");

        body.html(bodytemp.join("")).appendTo(bodywrap);
        me.append(header).append(bodywrap);//.append(awrap.join(""));
        options.scrollerright = scrollerright;
        options.scrollerleft = scrollerleft;
        __InitEvents__(ulwrap,options);
  	}
  	function __InitEvents__(ulwrap,options){
		__ResetScoller__(options); //设置默认是否出现滚动掉
		__ScollerClick__(options); //滚动条的点击事件，如果存在的话
		ulwrap.find("li:not(.x-tab-edge)").each(function(i) {
			__InitItemEvents__(this,options); //给每个选项卡 添加事件
		});
  	}
  	function __InitItemEvents__(liitem,options){
		if (liitem.id == "tab_li_closeall") {
           return;
        }
        __LiswapHover__.call(liitem); //选项卡的鼠标hover效果
        __LiClick__.call(liitem,options); //选项卡的点击事件
        __CloseItemClick__.call(liitem); // 点击关闭按钮的事件
  	}
  	function __LiClick__(options){  		
  		$(this).click(function(e) {
	        var itemid = this.id.substr(7);
	        var curr = __GetActiveItem__(options);
	        if (curr != null && itemid == curr.id) {
	            return;
	        }
	        var clickitem = __GetItemById__(itemid,options);
	        if (clickitem && clickitem.disabled) {
	            return;
	        }
	        if (curr) {
	            $("#tab_li_" + curr.id).removeClass("x-tab-strip-active");
	            $("#tab_item_" + curr.id).addClass("x-hide-display");
	            curr.isactive = false;
	        }
	        if (clickitem) {
	            $(this).addClass("x-tab-strip-active");
	            $("#tab_item_" + clickitem.id).removeClass("x-hide-display");
	            if (clickitem.url) {
	                frm = document.getElementById("tab_item_frame_" + clickitem.id)
	                var cururl = frm.src;
	                if (cururl == "about:blank") {
	                    frm.src = clickitem.url;
	                    if ($.browser.msie) {
	                        frm.onreadystatechange = function() {
	                            if (frm.readyState == "complete") {
	                                $("#tab_mask_" + clickitem.id).remove();
	                                $("#tab_loadingmsg_" + clickitem.id).remove();
	                                frm.onreadystatechange = null;
	                            }
	                        };
	                    } else {
	                        frm.onload = function() {
	                            $("#tab_mask_" + clickitem.id).remove();
	                            $("#tab_loadingmsg_" + clickitem.id).remove();
	                            frm.onload = null;
	                        };	                    }

	                    var parent = $(frm).parent();
	                    var loadingpanel = $("#tab_loadingmsg_" + clickitem.id);
	                    var pos = { left: parent.width() / 2 - loadingpanel.outerWidth() / 2, top: parent.height() / 2 - loadingpanel.outerHeight() / 2 };
	                    loadingpanel.css(pos);
	                }
	            }
	            else if (clickitem.cuscall && !clickitem.cuscalled) {
	                var panel = $("#tab_item_content_" + clickitem.id);
	                var ret = clickitem.cuscall(this, clickitem, panel);
	                clickitem.cuscalled = true;
	                if (ret) //如果存在返回值，且不为空
	                {
	                    clickitem.content = ret;
	                    panel.html(ret);
	                }
	            }
	            clickitem.isactive = true;
	            if (clickitem.onactive) {
	                clickitem.onactive.call(this, clickitem);
	            }
	        }
	    });
  	}
  	function __LiswapHover__(){
		$(this).hover(function(e) {
            if (!$(this).hasClass("x-tab-strip-disabled")) {
                $(this).addClass("x-tab-strip-over");
            }
        }, function(e) {
            if (!$(this).hasClass("x-tab-strip-disabled")) {
                $(this).removeClass("x-tab-strip-over");
            }
        });
  	}
  	function __CloseItemClick__(){
		if ($(this).hasClass("x-tab-strip-closable")) {
            $(this).find("a.x-tab-strip-close").click(function() {
                __DeleteItemByLiId__($(this).parent().attr("id"));
            });
        }
  	}
  	function __ResetScoller__(options){
  		var innerwidth = options.width -2 ;
		if (options.autoscroll) {
            var edge = ulwrap.find("li.x-tab-edge");
            var eleft = edge.position().left;
            var sleft = stripwrap.scrollLeft(); //.attr("scrollLeft");              
            if (sleft + eleft > innerwidth) {
                header.addClass("x-tab-scrolling");
                scrollerleft.css("visibility", "visible");
                scrollerright.css("visibility", "visible");
                if (sleft > 0) {
                    scrollerleft.removeClass("x-tab-scroller-left-disabled");
                }
                else {
                    scrollerleft.addClass("x-tab-scroller-left-disabled");
                }
                if (eleft > innerwidth) {
                    scrollerright.removeClass("x-tab-scroller-right-disabled");
                }
                else {
                    scrollerright.addClass("x-tab-scroller-right-disabled");
                }
                options.showscrollnow = true;

            }
            else {
                header.removeClass("x-tab-scrolling");
                stripwrap.animate({ "scrollLeft": 0 }, "fast");
                scrollerleft.css("visibility", "hidden");
                scrollerright.css("visibility", "hidden");
                options.showscrollnow = false;
            }
        }
  	}
  	function __ScollerClick__(options){
  		if (options.autoscroll) {
            scrollerleft.click(function(e) { __Scolling__("left",false,options) });
            scrollerright.click(function(e) { __Scolling__("right",false,options) });
         }
  	}
  	function __Scolling__(type,max,options){
		if (!options.autoscroll || !options.showscrollnow) {
            return;
        }
        //debugger;
        //var swidth = stripwrap.attr("scrollWidth");
       	var innerwidth = options.width -2 ;
        var sleft = stripwrap.scrollLeft(); //.attr("scrollLeft");
        var edge = ulwrap.find("li.x-tab-edge");
        var eleft = edge.position().left;
        if (type == "left") {
            if (scrollerleft.hasClass("x-tab-scroller-left-disabled")) {
                return;
            }
            if (sleft - options.scrollwidth - 20 > 0) {
                sleft -= options.scrollwidth;
            }
            else {
                sleft = 0;
                options.scrollerleft.addClass("x-tab-scroller-left-disabled");
            }
            if (options.scrollerright.hasClass("x-tab-scroller-right-disabled")) {
                options.scrollerright.removeClass("x-tab-scroller-right-disabled");
            }
            stripwrap.animate({ "scrollLeft": sleft }, "fast");
        }
        else {
            if (options.scrollerright.hasClass("x-tab-scroller-right-disabled") && !max) {
                return;
            }
            //left + ;
            if (max || (eleft > innerwidth && eleft - dfop.scrollwidth - 20 <= innerwidth)) {
                //debugger;
                sleft = sleft + eleft - (innerwidth - 38);
                options.scrollerright.addClass("x-tab-scroller-right-disabled");
                // sleft = eleft-innerwidth;
            }
            else {
                sleft += dfop.scrollwidth;
            }
            if (sleft > 0) {
                if (options.scrollerleft.hasClass("x-tab-scroller-left-disabled")) {
                    options.scrollerleft.removeClass("x-tab-scroller-left-disabled");
                }
            }
            stripwrap.animate({ "scrollLeft": sleft }, "fast");
        }
  	}
  	function __BuildItemBodyHtml__(item, parray,innerwidth,bodyheight){
  		parray.push("<div class='x-panel x-panel-noborder", item.isactive ? "" : " x-hide-display", "' id='tab_item_", item.id, "' style='width:", innerwidth, "px'>");
        parray.push("<div class='x-panel-bwrap'>");
        parray.push("<div class='x-panel-body x-panel-body-noheader x-panel-body-noborder'  id='tab_item_content_", item.id, "' style='position:relative;  width:", innerwidth, "px; height:", bodyheight, "px; overflow: auto;'>");
        if (item.url) {
            parray.push("<iframe name='tab_item_frame_", item.id, "' width='100%' height='100%'  id='tab_item_frame_", item.id, "' src='about:blank' frameBorder='0' />");
            parray.push("<div id='tab_mask_", item.id, "' class=\"x-el-mask\"/>");
            parray.push("<div id='tab_loadingmsg_", item.id, "' class=\"x-el-mask-msg x-mask-loading\"><div>正在加载", item.text, "...</div></div>");
        }
        else if (item.cuscall) {
            parray.push("<div class='loadingicon'/>");
        }
        else {
            parray.push(item.content);
        }
        parray.push("</div></div></div>");
  	}
  	function __BuildCloseAllBTNHtml__(parray){
		parray.push("<li id='tab_li_closeall' class='x-tab-closeall'>");
        parray.push("<a hideFocus='hideFocus' title='关闭所有' href='javascript:void(0)'>&nbsp;</a>");
        parray.push("</li>");
  	}
  	function __BuildItemLiHtml__(item, parray){
  		parray.push("<li id='tab_li_", item.id, "' class='", item.isactive ? "x-tab-strip-active" : "", item.disabled ? "x-tab-strip-disabled" : "", item.closeable ? " x-tab-strip-closable" : "", item.classes ? " x-tab-with-icon" : "", "'>");
        parray.push("<a class='x-tab-strip-close' onclick='return false;'/>");
        parray.push("<a class='x-tab-right' onclick='return false;' href='javascript:void(0)'>");
        parray.push("<em class='x-tab-left'><span class='x-tab-strip-inner'><span class='x-tab-strip-text ", item.classes || "", "'>", item.text, "</span></span></em>");
        parray.push("</a></li>");
  	}
  	function __GetActiveItem__(options){
  		for (var i = 0, j = options.items.length; i < j; i++) {
            if (options.items[i].isactive) {
                return options.items[i];                
            }
        }
        return null;
  	}
  	function __GetItemById__(id,options){
		for (var i = 0, j = options.items.length; i < j; i++) {
            if (options.items[i].id == id) {
                return options.items[i];                
            }
        }
        return null;
  	}
  	function __GetIndexById__(id,options){
  		for (var i = 0, j = options.items.length; i < j; i++) {
            if (options.items[i].id == id) {
                return i;               
            }
        }
        return -1;
	}
  	function __DeleteItemByLiId__(liid,options){
		var id = liid.substr(7);
        $("#" + liid).remove();
        $("#tab_item_" + id).remove();
        var index = __GetIndexById__(id,options);
        if (index >= 0) {
            var nextcur;
            if (index < options.items.length - 1) {
                nextcur = options.items[index + 1];
            }
            else if (index > 0) {
                nextcur = options.items[index - 1];
            }
            if (nextcur) {
                $("#tab_li_" + nextcur.id).click();
            }
            options.items.splice(index, 1);
            if (options.items.length < options.showcloseall) {
                var clbtn = $("#tab_li_closeall");
                if (clbtn.length > 0) {
                    clbtn.remove();
                }
            }
            __ResetScoller__(options);
            __Scolling__("right", true,options);
        }
  	}

  	window.xjTabPanel = xjTabPanel ;
})(window,undefined,jQuery);