;(function(window,undefined,$){

  	function xjTabPanel(id,options){		
	    var headerheight = 29;

	    options = $.extend({
	        items: [], //选项卡数据项 {id,text,classes,disabled,closeable,content,url,cuscall,onactive}
	        width: 500,
	        height: 400,
	        showcloseall: 5, //当item数量大于5个时，显示关闭所有的按钮
	        scrollwidth: 100, //如果存在滚动条，点击按钮次每次滚动的距离
	        autoscroll: true //当选项卡宽度大于容器时自动添加滚动按钮
	        //onfullscreen: false,
	        //onrestorescreen: false
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
        var ulwrap = $("<ul id='"+options.elid+"_ul' class='x-tab-strip x-tab-strip-top'></ul>");
        var stripspacer = $("<div class='x-tab-strip-spacer'/>");
        var litemp = [];
        for (var i = 0, l = options.items.length; i < l; i++) {
            var item = options.items[i];
            __BuildItemLiHtml__(item, litemp,options);
        }
        if (options.items.length >= options.showcloseall) {
            __BuildCloseAllBTNHtml__(litemp,options);
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
        options.bodyheight= bodyheight;
        var bodywrap = $("<div class='x-tab-panel-bwrap'/>");
        var body = $("<div class='x-tab-panel-body x-tab-panel-body-top'/>").css({ width: innerwidth, height: bodyheight });
        var bodytemp = [];
        for (var i = 0, l = options.items.length; i < l; i++) {
            var item = options.items[i];
            __BuildItemBodyHtml__(item, bodytemp,options);
        }

        //var awrap = [];
        //awrap.push("<a href='javascript:void(0)' id='tab_fa_", item.id, "'  class='x-tab-fullscreen-a' title='点击切换全屏状态'><img alt='点击切换全屏状态' src='../static/image/icons/s.gif'/></a>");

        body.html(bodytemp.join("")).appendTo(bodywrap);
        options.el.append(header).append(bodywrap);//.append(awrap.join(""));
        options.ulwrap = ulwrap;
        options.header = header;
        options.body = body;
        options.stripwrap = stripwrap;
        options.scrollerright = scrollerright;
        options.scrollerleft = scrollerleft;
        this.options = options;
        __InitEvents__(ulwrap,options);
  	}

  	function __InitEvents__(ulwrap,options){
		__ResetScoller__(options); //设置默认是否出现滚动掉
		__ScollerClick__(options); //滚动条的点击事件，如果存在的话
		ulwrap.find("li:not(.x-tab-edge)").each(function(i){
			__InitItemEvents__(this,options); //给每个选项卡 添加事件
		});
  	}

  	function __InitItemEvents__(liitem,options){
		if (liitem.id == "tab_li_closeall_"+options.elid) {
           return;
        }
        __LiswapHover__.call(liitem); //选项卡的鼠标hover效果
        __LiClick__.call(liitem,options); //选项卡的点击事件
        __CloseItemClick__.call(liitem,options); // 点击关闭按钮的事件
  	}
  	function __LiClick__(options){  		
  		$(this).click(function(e) {
            var idlength = options.elid.length;
	        var itemid = this.id.substr(8+idlength);
	        var curr = __GetActiveItem__(options);
	        if (curr != null && itemid == curr.id) {
	            return;
	        }
	        var clickitem = __GetItemById__(itemid,options);
	        if (clickitem && clickitem.disabled) {
	            return;
	        }
	        if (curr) {
	            $("#tab_li_" + options.elid + "_"+ curr.id).removeClass("x-tab-strip-active");
	            $("#tab_item_" + options.elid + "_" + curr.id).addClass("x-hide-display");
	            curr.isactive = false;
	        }
	        if (clickitem) {
	            $(this).addClass("x-tab-strip-active");
	            $("#tab_item_" + options.elid + "_" + clickitem.id).removeClass("x-hide-display");
	            if (clickitem.url) {
	                frm = document.getElementById("tab_item_frame_" + options.elid + "_" + clickitem.id)
	                var cururl = frm.src;
	                if (cururl == "about:blank") {
	                    frm.src = clickitem.url;
	                    if ($.browser.msie) {
	                        frm.onreadystatechange = function() {
	                            if (frm.readyState == "complete") {
	                                $("#tab_mask_"  + options.elid + "_"+ clickitem.id).remove();
	                                $("#tab_loadingmsg_"  + options.elid + "_"+ clickitem.id).remove();
	                                frm.onreadystatechange = null;
	                            }
	                        };
	                    } else {
	                        frm.onload = function() {
	                            $("#tab_mask_" + options.elid + "_" + clickitem.id).remove();
	                            $("#tab_loadingmsg_" + options.elid + "_" + clickitem.id).remove();
	                            frm.onload = null;
	                        };	                    }

	                    var parent = $(frm).parent();
	                    var loadingpanel = $("#tab_loadingmsg_" + options.elid + "_" + clickitem.id);
	                    var pos = { left: parent.width() / 2 - loadingpanel.outerWidth() / 2, top: parent.height() / 2 - loadingpanel.outerHeight() / 2 };
	                    loadingpanel.css(pos);
	                }
	            }
	            else if (clickitem.cuscall && !clickitem.cuscalled) {
	                var panel = $("#tab_item_content_"  + options.elid + "_"+ clickitem.id);
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
  	function __CloseItemClick__(options){
		if ($(this).hasClass("x-tab-strip-closable")) {
            $(this).find("a.x-tab-strip-close").click(function() {
                __DeleteItemByLiId__($(this).parent().attr("id"),options);
            });
        }
  	}
  	function __ResetScoller__(options){
  		var innerwidth = options.width -2 ;       
		if (options.autoscroll) {
            var edge = options.ulwrap.find("li.x-tab-edge");
            var eleft = edge.position().left;
            var sleft = options.stripwrap.scrollLeft(); //.attr("scrollLeft");              
            if (sleft + eleft > innerwidth) {
                options.header.addClass("x-tab-scrolling");
                options.scrollerleft.css("visibility", "visible");
                options.scrollerright.css("visibility", "visible");
                if (sleft > 0) {
                    options.scrollerleft.removeClass("x-tab-scroller-left-disabled");
                }
                else {
                    options.scrollerleft.addClass("x-tab-scroller-left-disabled");
                }
                if (eleft > innerwidth) {
                    options.scrollerright.removeClass("x-tab-scroller-right-disabled");
                }
                else {
                    options.scrollerright.addClass("x-tab-scroller-right-disabled");
                }
                options.showscrollnow = true;

            }
            else {
                options.header.removeClass("x-tab-scrolling");
                options.stripwrap.animate({ "scrollLeft": 0 }, "fast");
                options.scrollerleft.css("visibility", "hidden");
                options.scrollerright.css("visibility", "hidden");
                options.showscrollnow = false;
            }
        }
  	}
  	function __ScollerClick__(options){
  		if (options.autoscroll) {
            options.scrollerleft.click(function(e) { __Scolling__("left",false,options) });
            options.scrollerright.click(function(e) { __Scolling__("right",false,options) });
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
  	function __BuildItemBodyHtml__(item, parray,options){
        var innerwidth = options.width -2;
        var bodyheight = options.bodyheight ;
  		parray.push("<div class='x-panel x-panel-noborder", item.isactive ? "" : " x-hide-display", "' id='tab_item_",options.elid,"_", item.id, "' style='width:", innerwidth, "px'>");
        parray.push("<div class='x-panel-bwrap'>");
        parray.push("<div class='x-panel-body x-panel-body-noheader x-panel-body-noborder'  id='tab_item_content_",options.elid,"_", item.id, "' style='position:relative;  width:", innerwidth, "px; height:", bodyheight, "px; overflow: auto;'>");
        if (item.url) {
            parray.push("<iframe name='tab_item_frame_",options.elid,"_", item.id, "' width='100%' height='100%'  id='tab_item_frame_",options.elid,"_", item.id, "' src='about:blank' frameBorder='0' />");
            parray.push("<div id='tab_mask_",options.elid,"_", item.id, "' class=\"x-el-mask\"/>");
            parray.push("<div id='tab_loadingmsg_",options.elid,"_", item.id, "' class=\"x-el-mask-msg x-mask-loading\"><div>正在加载", item.text, "...</div></div>");
        }
        else if (item.cuscall) {
            parray.push("<div class='loadingicon'/>");
        }
        else {
            parray.push(item.content);
        }
        parray.push("</div></div></div>");
  	}
  	function __BuildCloseAllBTNHtml__(parray,options){
		parray.push("<li id='tab_li_closeall_",options.elid,"' class='x-tab-closeall'>");
        parray.push("<a hideFocus='hideFocus' title='关闭所有' href='javascript:void(0)'>&nbsp;</a>");
        parray.push("</li>");
  	}
  	function __BuildItemLiHtml__(item, parray,options){
  		parray.push("<li id='tab_li_",options.elid,"_", item.id, "' class='", item.isactive ? "x-tab-strip-active" : "", item.disabled ? "x-tab-strip-disabled" : "", item.closeable ? " x-tab-strip-closable" : "", item.classes ? " x-tab-with-icon" : "", "'>");
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
        var idlength = options.elid.length;
		var id = liid.substr(8+idlength);
        $("#" + liid).remove();
        $("#tab_item_"+options.elid+"_" + id).remove();
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
                var clbtn = $("#tab_li_closeall_"+options.elid);
                if (clbtn.length > 0) {
                    clbtn.remove();
                }
            }
            __ResetScoller__(options);
            __Scolling__("right", true,options);
        }
  	}
    function __AddTabitem__(item,options) {
        var chkitem = __GetItemById__(item.id,options);
        if (!chkitem) {
            var isactive = item.isactive;
            item.isactive = false;
            var lastitem = options.items[options.items.length - 1];
            options.items.push(item);

            var lastli = $("#tab_li_" + options.elid +"_"+lastitem.id);
            var lastdiv = $("#tab_item_" + options.elid +"_" + lastitem.id);
            var litemp = [];
            var bodytemp = [];
            __BuildItemLiHtml__(item, litemp,options);
            __BuildItemBodyHtml__(item, bodytemp,options);
            var liitem = $(litemp.join(""));
            var bodyitem = $(bodytemp.join(""));
            lastli.after(liitem);
            lastdiv.after(bodyitem);
            //事件
            var li = $("#tab_li_" + options.elid +"_" + item.id);
            __InitItemEvents__(li,options);
            if (isactive) {
                li.click();
            }
            //debugger;

            if (options.items.length >= options.showcloseall) {
                var cabtn = $("#tab_li_closeall_"+ options.elid);
                if (cabtn.length == 0) {
                    var cabtntmp = [];
                    __BuildCloseAllBTNHtml__(cabtntmp,options);
                    li.after(cabtntmp.join(""));
                    $("#tab_li_closeall_"+ options.elid).click(function(){__CloseAllItem__(options)});
                }
            }
            __ResetScoller__(options);
            __Scolling__("right", true,options);
        }
        else {
            alert("指定的tab项已存在!");
        }
    }
    function __OpenItemOrAdd__(item, allowAdd,options) {
        var checkitem = __GetItemById__(item.id,options);
        if (!checkitem && allowAdd) {
            __AddTabitem__(item,options);
        }
        else {
            var li = $("#tab_li_" + options.elid + "_" + item.id);
            scollingToli(li);
            var ifrm = $("#tab_item_frame_" + options.elid + "_" + item.id);
            if (ifrm.length > 0 && ifrm[0].src != item.url) {
                ifrm[0].src = item.url;
            }
        }
    }
    function __CloseAllItem__(options) {
        if (!confirm("你确认要关闭所有选项卡吗？")) {
            return;
        }
        options.ulwrap.find("li").remove(".x-tab-strip-closable"); //移除所有可以关闭的tab项
        var t = [];
        var nid = "";
        for (var i = 0, j = options.items.length; i < j; i++) {
            if (!options.items[i].closeable) {
                t.push(options.items[i]);
                if (!options.items[i].disabled) {
                    nid = options.items[i].id;
                }
            }
        }
        options.items = t;
        if (nid != "") {
            $("#tab_li_"  + options.elid + "_"+ nid).click();
        }
        $("#tab_li_closeall_"+options.elid).remove();
        __ResetScoller__(options);
        __Scolling__("right", true,options);
    }
    function __Resize__(width, height,options) {
        if (width == options.width && height == options.height) {
            return;
        }
        headerheight = options.height - options.bodyheight ;
        if (width) { options.width = width };
        if (height) { options.height = height; }

        innerwidth = width - 2;
        options.bodyheight = bodyheight = options.height -headerheight;

        options.el.css("width", options.width);
        options.header.css("width", innerwidth);
        options.body.css({ width: innerwidth, height: bodyheight });
        for (var i = 0, j = options.items.length; i < j; i++) {
            var item = options.items[i];
            $("#tab_item_" + options.elid +"_" + item.id).css({ width: innerwidth });
            $("#tab_item_content_" + options.elid + "_" + item.id).css({ width: innerwidth, height: bodyheight });
        }
        __ResetScoller__(options);
    }
    function __SetDisableTabItem__(itemId, disabled,options) {
        var chitem = __GetItemById__(itemId,options);
        if (!chitem || chitem.disabled == disabled) {
            return;
        }
        if (disabled) {
            chitem.disabled = true;
            $("#tab_item_"+ options.elid +"_" + item.id).addClass("x-tab-strip-disabled");
        }
        else {
            chitem.disabled = false;
            $("#tab_item_" + options.elid +"_" + item.id).removeClass("x-tab-strip-disabled");
        }
    }
    //公开的函数API
    xjTabPanel.prototype ={
        AddTabItem:function(item){
            __AddTabitem__(item,this.options);
        },
        OpenTabItem:function(item,orAdd){
            __OpenItemOrAdd__(item,orAdd,this.options);
        },
        ResizeTabPanel:function(width,height){
            __Resize__(width,height,this.options);
        },
        SetDisableTabItem:function(itemId, disabled){
            __SetDisableTabItem__(itemId,disabled,this.options);
        }
    };
  	window.xjTabPanel = xjTabPanel ;
})(window,undefined,jQuery);