//依赖 jquery 1.2.6+
(function(window,undefined,$){

    //扩展jquery的方法
    $.fn.swapClass = function(c1, c2) {
        return this.removeClass(c1).addClass(c2);
    };
    $.fn.switchClass = function(c1, c2) {
        if (this.hasClass(c1)) {
            return this.swapClass(c1, c2);
        }
        else {
            return this.swapClass(c2, c1);
        }
    };
	var defaults = {
        method: "POST",
        datatype: "json",
        url: false,
        cbiconpath: "img/icon/",
        icons: ["checkbox_0.gif", "checkbox_1.gif", "checkbox_2.gif"],
        emptyiconpath: "img/icon/s.gif",
        showcheck: false, //是否显示选择            
        oncheckboxclick: false, //当checkstate状态变化时所触发的事件，但是不会触发因级联选择而引起的变化
        onnodeclick: false,
        parsedata: false,
        cascadecheck: true,
        data: null,
        preloadcomplete: false,
        clicktoggle: true, //点击节点展开和收缩子节点
        theme: "xe-tree-arrows" //xe-tree-line
    };
    function xjTree(id,options){
    	var self = this;
     	this.treeid = id;
        this.el = $("#"+id);
        if(this.el.length ==0)
        {
            alert("错误的ID："+id);
            return;
        }
        this.options = $.extend(defaults, options);
        this.treedata = this.options.data;
     
        var html = [];
        __BuildTreeRoot__(this.treeid,this.treedata,html,this.options); //构建HTML
      
        console.info(html.length);
        this.el.addClass('xe-tree').html(html.join(""));
       
     	__BindEvent__(this.treeid,this.el,this.options);
       
    }
    function __BuildTreeRoot__(treeid,data,ht,options){
		ht.push("<div class='xe-tree-bwrap'>"); // Wrap ;
        ht.push("<div class='xe-tree-body'>"); // body ;
        ht.push("<ul class='xe-tree-root ", options.theme, "'>"); //root
        if (data && data.length > 0) {
            var l = data.length;
            for (var i = 0; i < l; i++) {
                __BuildNode__(treeid,data[i], ht, 0, i, i == l - 1,options);
            }
        }
        else {           
            this.__asnyloadc__(null, false, function(data) {
                options.preloadcomplete && options.preloadcomplete();
                if (data && data.length > 0) {
                    options.parsedata && options.parsedata(data);                       
                    options.treedata = data;
                    var l = data.length;
                    for (var i = 0; i < l; i++) {
                        __BuildNode__(treeid,data[i], ht, 0, i, i == l - 1,options);
                    }
                }                
            });
        }
        ht.push("</ul>"); // root and;
        ht.push("</div>"); // body end;
        ht.push("</div>"); // Wrap end;
    }   
   
    function __BuildNode__(treeid,nd, ht, deep, path, isend,options){
            nd.isend = isend;
            var nid = nd.id.replace(/[^\w]/gi, "_");
            ht.push("<li class='xe-tree-node'>");
            ht.push("<div id='", treeid, "_", nid, "' tpath='", path, "' unselectable='on' title='", nd.text, "'");
            var cs = [];
            cs.push("xe-tree-node-el");
            if (nd.hasChildren) {
                cs.push(nd.isexpand ? "xe-tree-node-expanded" : "xe-tree-node-collapsed");
            }
            else {
                cs.push("xe-tree-node-leaf");
            }
            if (nd.classes) { cs.push(nd.classes); }

            ht.push(" class='", cs.join(" "), "'>");
            //span indent
            ht.push("<span class='xe-tree-node-indent'>");
            if (deep == 1) {
                ht.push("<img class='xe-tree-icon' src='", options.emptyiconpath, "'/>");
            }
            else if (deep > 1) {
                ht.push("<img class='xe-tree-icon' src='", options.emptyiconpath, "'/>");
                for (var j = 1; j < deep; j++) {
                    ht.push("<img class='xe-tree-elbow-line' src='", options.emptyiconpath, "'/>");
                }
            }
            ht.push("</span>");
            //img
            cs.length = 0;
            if (nd.hasChildren) {
                if (nd.isexpand) {
                    cs.push(isend ? "xe-tree-elbow-end-minus" : "xe-tree-elbow-minus");
                }
                else {
                    cs.push(isend ? "xe-tree-elbow-end-plus" : "xe-tree-elbow-plus");
                }
            }
            else {
                cs.push(isend ? "xe-tree-elbow-end" : "xe-tree-elbow");
            }
            ht.push("<img class='xe-tree-ec-icon ", cs.join(" "), "' src='", options.emptyiconpath, "'/>");
            ht.push("<img class='xe-tree-node-icon' src='", options.emptyiconpath, "'/>");
            //checkbox
            if (options.showcheck && nd.showcheck) {
                if (nd.checkstate == null || nd.checkstate == undefined) {
                    nd.checkstate = 0;
                }
                ht.push("<img  id='", id, "_", nid, "_cb' class='xe-tree-node-cb' src='", options.cbiconpath, options.icons[nd.checkstate], "'/>");
            }
            //a
            ht.push("<a hideFocus class='xe-tree-node-anchor' tabIndex=1 href='javascript:void(0);'>");
            ht.push("<span unselectable='on'>", nd.text, "</span>");
            ht.push("</a>");
            ht.push("</div>");
            //Child
            if (nd.hasChildren) {
                if (nd.isexpand) {
                    ht.push("<ul  class='xe-tree-node-ct'  style='z-index: 0; position: static; visibility: visible; top: auto; left: auto;'>");
                    if (nd.ChildNodes) {
                        var l = nd.ChildNodes.length;
                        for (var k = 0; k < l; k++) {
                            nd.ChildNodes[k].parent = nd;
                            __BuildNode__(treeid,nd.ChildNodes[k], ht, deep + 1, path + "." + k, k == l - 1,options);
                        }
                    }
                    ht.push("</ul>");
                }
                else {
                    ht.push("<ul style='display:none;'></ul>");
                }
            }
            ht.push("</li>");
            nd.render = true;
    }
    function __BindEvent__(treeid,parent,options)
    {
    	var nodes = $("li.xe-tree-node>div", parent);
        nodes.each(function(i){
            __BuildEvent__.call(this,i,treeid,options);
        });
    }
    function __BuildEvent__(i,treeid,options){
        $(this).hover(function() {
            $(this).addClass("xe-tree-node-over");
        }, function() {
            $(this).removeClass("xe-tree-node-over");
        }).click(function(e){
            __NodeClick__.call(this,e,treeid,options);
        })
         .find("img.xe-tree-ec-icon").each(function(e) {
             if (!$(this).hasClass("xe-tree-elbow")) {
                 $(this).hover(function() {
                     $(this).parent().addClass("xe-tree-ec-over");
                 }, function() {
                     $(this).parent().removeClass("xe-tree-ec-over");
                 });
             }
         });
    }
    function __NodeClick__(e,treeid,options){
        var nodeElement = this;
        var path = $(this).attr("tpath");
        var et = e.target || e.srcElement;
        var item = __GetItem__(path,options);
        if (et.tagName == "IMG") {
            // +号需要展开
            if ($(et).hasClass("xe-tree-elbow-plus") || $(et).hasClass("xe-tree-elbow-end-plus")) {
                var ul = $(nodeElement).next(); //"xe-tree-node-ct"
                if (ul.hasClass("xe-tree-node-ct")) {
                    ul.show();
                }
                else {
                    var deep = path.split(".").length;
                    if (item.complete) {
                        item.ChildNodes != null && __AsnyBuild__(treeid,item.ChildNodes, deep, path, ul, item,options);
                    }
                    else {
                        $(nodeElement).addClass("xe-tree-node-loading");
                        __AsnyLoadc__(item, true, function(data) {
                            options.parsedata && options.parsedata(data);
                            item.complete = true;
                            item.ChildNodes = data;
                            __AsnyBuild__(treeid,data, deep, path, ul, item,options);
                        });
                    }
                }
                if ($(et).hasClass("xe-tree-elbow-plus")) {
                    $(et).swapClass("xe-tree-elbow-plus", "xe-tree-elbow-minus");
                }
                else {
                    $(et).swapClass("xe-tree-elbow-end-plus", "xe-tree-elbow-end-minus");
                }
                $(this).swapClass("xe-tree-node-collapsed", "xe-tree-node-expanded");
            }
            else if ($(et).hasClass("xe-tree-elbow-minus") || $(et).hasClass("xe-tree-elbow-end-minus")) {  //- 号需要收缩                    
                $(this).next().hide();
                if ($(et).hasClass("xe-tree-elbow-minus")) {
                    $(et).swapClass("xe-tree-elbow-minus", "xe-tree-elbow-plus");
                }
                else {
                    $(et).swapClass("xe-tree-elbow-end-minus", "xe-tree-elbow-end-plus");
                }
                $(this).swapClass("xe-tree-node-expanded", "xe-tree-node-collapsed");
            }               
        }
        else {
            if (options.citem) {
                var nid = options.citem.id.replace(/[^\w]/gi, "_");
                $("#" + treeid + "_" + nid).removeClass("xe-tree-selected");
            }
            options.citem = item;
            $(this).addClass("xe-tree-selected");
            if (options.onnodeclick) {
                if (!item.expand) {
                   item.expand = function() { __ExpandNode__.call(item,treeid); };
                }
                options.onnodeclick.call(this, item);
            }
        }   
    }
    function __ExpandNode__(treeid){       
        var item = this;  
        var nid = item.id.replace(/[^\w]/gi, "_");
        var img = $("#" + treeid + "_" + nid + " img.xe-tree-ec-icon");
        if (img.length > 0) {
            img.click();
        }
    }
    function __GetItem__(path,options){
		var ap = path.split(".");
        var t = options.data;
        for (var i = 0; i < ap.length; i++) {
            if (i == 0) {
                t = t[ap[i]];
            }
            else {
                t = t.ChildNodes[ap[i]];
            }
        }
        return t;
    }

    function __AsnyBuild__(treeid,nodes,deep,path,ul,pnode,options){
	    var l = nodes.length;
        if (l > 0) {
            var ht = [];
            for (var i = 0; i < l; i++) {
                nodes[i].parent = pnode;
                __BuildNode__(treeid,nodes[i], ht, deep, path + "." + i, i == l - 1,options);                
            }
            ul.html(ht.join(""));
            ht = null;
            __BindEvent__(ul);
        }           
        ul.addClass("xe-tree-node-ct").css({ "z-index": 0, position: "static", visibility: "visible", top: "auto", left: "auto", display: "" });
        ul.prev().removeClass("xe-tree-node-loading");
    }
    function __AsnyLoadc__(pnode,isAsync,options,callback){
	   if (options.url) {
            var param;
            if (pnode && pnode != null) {
                param =__BuilParam__(pnode);
            }
            else {
                param = [];
            }
            if (options.extParam) {
                for (var pi = 0; pi < options.length; pi++) param[param.length] = options.extParam[pi];
            }
            $.ajax({
                type: options.method,
                url: options.url,
                data: param,
                async: isAsync,
                dataType: options.datatype,
                success: callback,
                error: function(e) {                       
                    alert("error occur:" + e.responseText);
                }
            });
        }
    }
    function __BuilParam__(node){
        var p = [ { name: "id", value: encodeURIComponent(node.id) }
                , { name: "text", value: encodeURIComponent(node.text) }
                , { name: "value", value: encodeURIComponent(node.value) }
                , { name: "checkstate", value: node.checkstate}];
        return p;
    }
    window.xjTree = xjTree;
})(window,undefined,jQuery);
