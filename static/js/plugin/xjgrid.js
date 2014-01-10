;(function(window,undefined,$){
	function xjGrid(id,options){
		options = $.extend({
			url:false,
			striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
			mhoverclass:'mhover',
			method: 'POST', // data sending method,数据发送方式		
			usepager: false, //是否分页		
			page: 0, //current page,默认当前页 索引从0 开始
			total: 1, //total pages,总页面数		
			rp: 25, // results per page,每页默认的结果数			
			autoload: true, //自动加载     
			submitcoldef:true, //是否在请求时提交字段定义信息    
			showcheckbox: false, //是否显示checkbox			
			extparams: {},
			gridClass: "xjgrid"//Style
		}, options);
		this.options = options ;
		options.elid= id;
		options.el = $("#"+id);
		__Init__(options);
		if(options.autoload)
		{
			__LoadData__(options);
		}

		__InitEvent__(options);
	}

	function __Init__(options){
		options.el.addClass(options.gridClass);
		if( options.colModel == null || options.colModel.length==0 ){
			alert("请设置列定义[colModel]");
			return ;
		}
		//创建grid的主体
		var html = [];
		html.push("<div class='grid-header'>");
		html.push("<div class='grid-header-inner'>");
		//表格头
		html.push("<table><thead><tr>");
		if(options.showcheckbox)
		{
			html.push("<td  class='checktd'><div style='width:25px;text-align:center'><input type='checkbox' id='",options.elid,"_checkall'/></div></td>");
		}
		for (var i=0, l = options.colModel.length; i <l; i++) {
			var col = options.colModel[i] ;
			var style = [];
			if(col.width){
				style.push("width:",col.width,"px;");
			}
			if(col.align){			
				style.push("text-align:",col.align,";");
			}			
			if(style.length>0){
				style.splice(0,0," style=\"");
				style.push("\"");
			}
			html.push("<td><div",style.join(""),">",col.display,"</div></td>");
		};
		html.push("</tr></thead></table>");
		html.push("</div>");
		html.push("</div>");
		//end 表格头结束
		html.push("<div class='grid-body'>");
		html.push("<div class='grid-body-inner'>");
		html.push("<table id='",options.elid,"_detail","'><tbody>");
		html.push("</tbody></table>");
		html.push("</div>");
		html.push("</div>");
		//
		if(options.usepager){
			//分页的代码
			html.push("<div id='",options.elid,"_pagep' class='grid-pagination'>&nbsp;</div>")
		}
		options.el.html(html.join(""));
		__InitEvent__(options);
	}
	function __InitEvent__(options){
		if(options.showcheckbox){
			$("#"+options.elid+"_checkall").click(function(){
				var check = this.checked;
				options.checkall = check;
				$("#"+options.elid+"_detail td.checktd input[type='checkbox']").each(function(i){
					this.checked = check;
				});
			})
		}
	}

	function __LoadData__(options){
		if (options.loading) 
		{	
			return true;
		}
        if (options.onSubmit) {
            var gh = p.onSubmit();
            if (!gh) 
            {	
            	return false;
            }
        }
        options.loading = true;
        if (!options.url) 
        {
        	return false;
        }
        
        //TODO：显示正在加载的信息 

        //计算分页
        if (!options.newp) 
        {
        	options.newp = 1;
        }
        if (options.page > options.pages) 
        {
        	options.page = options.pages;
        }

        var param = [
			  { name: 'page', value: options.newp }
			, { name: 'rp', value: options.rp }
			, { name: 'sortname', value: options.sortname }
			, { name: 'sortorder', value: options.sortorder }
		];
        if (options.submitcoldef)//如果需要向服务提交列信息
        {
            if (!options.colkey) {
                var cols = [];
                for (var cindex = 0, clength = options.colModel.length; cindex < clength; cindex++) {
                    if (options.colModel[cindex].iskey) {
                        options.colkey = options.colModel[cindex].name;
                    }
                    cols.push(options.colModel[cindex].name);
                }
                options.cols = cols.join(",");
            }
            if (!options.colkey) {
                alert("请设置主键 { display: '说明', name: '字段名',iskey:true },");
                return;
            }
            param.push({ name: "colkey", value: options.colkey });
            param.push({ name: "colsinfo", value: options.cols });
        }
        //param = jQuery.extend(param, p.extParam);             
        if (options.extparams) {
            for (var pi = 0; pi < options.extparams.length; pi++) param[param.length] = options.extparams[pi];
        }
        var purl = options.url + (options.url.indexOf('?') > -1 ? '&' : '?') + '_=' + (new Date()).valueOf();
        $.ajax({
            type: options.method,
            url: purl,
            data: param,
            dataType:"json",
            success: function(data) { 
            	if (data != null && data.error != null) {
	            	if (options.onerror) { 
	            	 	options.onerror(data);
	             	} 
         		}
         		else
         		{ 
         			__ProcessData__(data,options); 
         		} 
         	},
            error: function(data) { 
            	try { 
	            	if(options.onerror) { 
	            		options.onerror(data); 
	            	} 
	            	else { 
	            		alert("获取数据发生异常;") 
	            	}
             	}
             	catch (e) 
             	{ 
             	} 
             }
        });
	}
	function __ProcessData__(data,options){
		options.data = {};
		if (options.preprocess)
		{ 
			data = options.preprocess(data);
		}
		//TODO：去除显示正在加载的信息 
		//$('.pReload', options.pDiv).removeClass('loading');
		options.loading = false;

		var temp = options.total;

		options.total = data.total;

	 	if (options.total < 0) {
            options.total = temp;
        }
        if (options.total == 0) { //没有数据
	        //TODO：清空数据
            options.pages = 1;
            options.page = 1;
            __BuildPageNavition__(options);
            return false;
        }
        options.pages = Math.ceil(options.total / options.rp);
		options.page = data.page;

        var html = [];
        var k = options.colModel.length;
        for (var i=0,l = data.rows.length; i <l; i++) {
        	if(options.striped)
        	{
        		html.push("<tr class='",(i%2)==0?"":"strip","'>");
        	}
        	else
        	{
        		html.push("<tr>");
        	}
        	
        	options.data[data.rows[i].id] = data.rows[i].cell ;
        	if(options.showcheckbox)
			{
				html.push("<td class='checktd'><div style='width:25px;text-align:center'><input type='checkbox' value='",data.rows[i].id,"' ",options.checkall?"checked='checked'":"","/></div></td>");
			}
        	for(var j=0 ; j<k ;j++ )
        	{
        		var col = options.colModel[j];
        		var style = [];
				if(col.width){
					style.push("width:",col.width,"px;");
				}
				if(col.align){			
					style.push("text-align:",col.align,";");
				}			
				if(style.length>0){
					style.splice(0,0," style=\"");
					style.push("\"");
				}
				var text = col.process?col.process(data.rows[i].cell[j],data.rows[i].cell):data.rows[i].cell[j];
        		html.push("<td><div",style.join("") ,">",text,"</div></td>");
        	}
        	html.push("</tr>")
        };
        $("#"+options.elid+"_detail tbody").html(html.join(""));
        if(options.mhoverclass)
        {
	        $("#"+options.elid+"_detail tr").each(function(i){
	        	$(this).hover(function(e){$(this).addClass(options.mhoverclass);},function(e){$(this).removeClass(options.mhoverclass);});
	        });
    	}
        __BuildPageNavition__(options);
        if (options.onsuccess){
        	options.onsuccess();
        }        
        return true;
	}
	
	function __BuildPageNavition__(options){
		if(!options.usepager)
		{
			return ;
		}
		if(options.pages <=10){

		}
		var html = [];
		html.push("<ul>");
		html.push("<li><span>",options.total," 条记录 ",options.page," / ",options.pages," 页 </span></li>");
		if(options.page>1){
			html.push("<li action='first'><a href='javascript:void(0)'>第一页</a></li>");
			html.push("<li action='prev'><a href='javascript:void(0)'>上一页</a></li>");
		}		
		var index = options.page - 2;
		if(options.page + 2 >  options.pages){
			index = index - 2;
		}
		if(index<1){
			index = 1;
		}

		for(var i= 0;i< 5 && (i+index) <=options.pages ;i++){
			var className = "";
			if(i+index == options.page){
				className = "active";
			}
			html.push("<li action='navi'",className!=""?" class='"+className+"'":"","><a href='javascript:void(0)'>",i+index,"</a></li>");
		}
		if(options.page<options.pages){
			html.push("<li action='next'><a href='javascript:void(0)'>下一页</a></li>");
			html.push("<li action='last'><a href='javascript:void(0)'>最后一页</a></li>");
		}
		html.push("</ul>");          
		$("#"+options.elid+"_pagep")[0].innerHTML = html.join("");

		//事件处理
		$("#"+options.elid+"_pagep li").each(function(i){
			$(this).click(function(){
				var action = $(this).attr("action");
				__PageNavi__(action,$(this).text(),options);
			})
		})
	}
	function __PageNavi__(action,page,options){
		switch(action)
		{
			case "first"://第一页
				options.newp=1;
				break;
			case "prev"://上一页
				options.newp= options.page -1 ;
				break;
			case "navi":
				options.newp= parseInt(page);
				if(options.newp<=0 || options.newp==options.page){
					return;
				}
				break;
			case "next":
				options.newp= options.page + 1 ;
				break;
			case "last":
				options.newp= options.pages;
				break;
			default:
				return;				
		}
		__LoadData__(options);
	}
	function __GetCheckedRowIds__(gridid){
		var ids = [];
		$("#"+gridid+"_detail td.checktd input[type='checkbox']").each(function(i){
				this.checked  && ids.push(this.value);
		});
	}
	xjGrid.prototype = {
		Reload :function () {
			// body...
			__LoadData__(this.options)
		},
		SetOptions:function(p) {
			// body...
	        $.extend(this.options, p);
		},
		GetCheckedRowIds:function(){
			return __GetCheckedRowIds__(this.options.elid);
		},
		GetCheckedRowDatas:function(argument) {
			var ids = __GetCheckedRowIds__(this.options.elid);
			var datas = [];
			for(var i=0,l = ids.length - 1; i<l; i++) {
			   this.options.data[ids[i]]	&& datas.push(this.options.data[ids[i]]);
			};
			return datas;
		}

	}

	window.xjGrid = xjGrid ;
})(window,undefined,jQuery);