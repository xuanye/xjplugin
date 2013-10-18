;(function(window,undefined,$){
	Date.prototype.Format = function (format) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "w": "0123456".indexOf(this.getDay()),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
        }
        return format;
    };
    function DateAdd(interval, number, idate) {
        number = parseInt(number);
        var date;
        if (typeof (idate) == "string") {
            date = idate.split(/\D/);
            eval("var date = new Date(" + date.join(",") + ")");
        }

        if (typeof (idate) == "object") {
            date = new Date(idate.toString());
        }
        switch (interval) {
            case "y": date.setFullYear(date.getFullYear() + number); break;
            case "m": date.setMonth(date.getMonth() + number); break;
            case "d": date.setDate(date.getDate() + number); break;
            case "w": date.setDate(date.getDate() + 7 * number); break;
            case "h": date.setHours(date.getHours() + number); break;
            case "n": date.setMinutes(date.getMinutes() + number); break;
            case "s": date.setSeconds(date.getSeconds() + number); break;
            case "l": date.setMilliseconds(date.getMilliseconds() + number); break;
        }
        return date;
    };
	function xjDatepicker(id,options){
		var self = this;
		this.id = id;
		this.el = $("#"+id);
        if(this.el.length ==0)
        {
            alert("错误的ID："+id);
            return;
        }
        options.el = this.el;
        options.elid = id;
        this.options= options = $.extend({
        	weekStart: 0,
            weekName: ["日", "一", "二", "三", "四", "五", "六"], //星期的格式
            monthName: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"], //月份的格式
            monthp: "月",
            Year: new Date().getFullYear(), //定义年的变量的初始值
            Month: new Date().getMonth() + 1, //定义月的变量的初始值
            Day: new Date().getDate(), //定义日的变量的初始值
            today: new Date(),
            btnOk: " 确定 ",
            btnCancel: " 取消 ",
            btnToday: "今天",
            inputDate: null,
            onReturn: false,
            showtime: false,
            applyrule: false, //function(){};return rule={startdate,endate};
            showtarget: null, 
            picker: ""
        },options);
        this.pickerid = id +"_picker";
        var html = [];
        __InitHtml__(this.pickerid,options,html)        
        $(document.body).append(html.join("")); 

        __InitEvents__(this.pickerid,options);

        //init picker       
		this.el.addClass(options.showtime?"xj-dp-input-time":"xj-dp-input");

		if(options.picker !=""){
			var picker = $(options.picker);
			this.el.after(picker);
			picker.click(function(e){
				self.Show.call(self);				
				return false;
			});
		}
	}
	function __InitHtml__(pickerid,options,cpHA){
	    cpHA.push("<div id='",pickerid,"' class='xj-dp' style='width:175px;z-index:999;'>");
        //if ($.browser.msie6) {
            //cpHA.push('<iframe style="position:absolute;z-index:-1;width:100%;height:205px;top:0;left:0;scrolling:no;" frameborder="0" src="about:blank"></iframe>');
        //}
        cpHA.push("<table class='xj-dp-maintable' cellspacing='0' cellpadding='0' style='width:175px;'><tbody><tr><td>");
        //头哟
        cpHA.push("<table class='xj-dp-top' cellspacing='0'><tr><td class='xj-dp-top-left'> <a id='",pickerid,"_leftbtn' href='javascript:void(0);' title='向前一个月'>&nbsp;</a></td><td class='xj-dp-top-center' align='center'><em><button id='",pickerid,"_ymbtn'>九月 2009</button></em></td><td class='xj-dp-top-right'><a id='",pickerid,"_rightbtn' href='javascript:void(0);' title='向后一个月'>&nbsp;</a></td></tr></table>");
        cpHA.push("</td></tr>");
        cpHA.push("<tr><td>");
        //周
        cpHA.push("<table id='",pickerid,"_inner' class='xj-dp-inner' cellspacing='0'><thead><tr>");
        //生成周
        for (var i = options.weekStart, j = 0; j < 7; j++) {
            cpHA.push("<th><span>", options.weekName[i], "</span></th>");
            if (i == 6) { i = 0; } else { i++; }
        }
        cpHA.push("</tr></thead>");
        //生成tBody,需要重新生成的
        cpHA.push("<tbody></tbody></table>");
        //生成tBody结束
        cpHA.push("</td></tr>");
        cpHA.push("<tr><td class='xj-dp-bottom' align='center'>", options.showtime ? "<input type='text' value='00:00:00' maxlength='8' id='"+pickerid+"_time' class='xj-dp-time'/>" : "", "<button id='",pickerid,"_today'>", options.btnToday, "</button></td></tr>");
        cpHA.push("</tbody></table>");
        //输出下来框
        cpHA.push("<div id='",pickerid,"_mp' class='xj-dp-mp'  style='z-index:auto;'><table id='",pickerid,"_t' style='width: 175px; height: 193px' border='0' cellspacing='0'><tbody>");
        cpHA.push("<tr>");
        //1月，7月 按钮两个
        cpHA.push("<td class='xj-dp-mp-month' xmonth='0'><a href='javascript:void(0);'>", options.monthName[0], "</a></td><td class='xj-dp-mp-month xj-dp-mp-sep' xmonth='6'><a href='javascript:void(0);'>", options.monthName[6], "</a></td><td class='xj-dp-mp-ybtn' align='middle'><a id='",pickerid,"_mpprev' class='xj-dp-mp-prev'></a></td><td class='xj-dp-mp-ybtn' align='middle'><a id='",pickerid,"_mpnext' class='xj-dp-mp-next'></a></td>");
        cpHA.push("</tr>");
        cpHA.push("<tr>");
        cpHA.push("<td class='xj-dp-mp-month' xmonth='1'><a href='javascript:void(0);'>", options.monthName[1], "</a></td><td class='xj-dp-mp-month xj-dp-mp-sep' xmonth='7'><a href='javascript:void(0);'>", options.monthName[7], "</a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td>");
        cpHA.push("</tr>");
        cpHA.push("<tr>");
        cpHA.push("<td class='xj-dp-mp-month' xmonth='2'><a href='javascript:void(0);'>", options.monthName[2], "</a></td><td class='xj-dp-mp-month xj-dp-mp-sep' xmonth='8'><a href='javascript:void(0);'>", options.monthName[8], "</a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td>");
        cpHA.push("</tr>");
        cpHA.push("<tr>");
        cpHA.push("<td class='xj-dp-mp-month' xmonth='3'><a href='javascript:void(0);'>", options.monthName[3], "</a></td><td class='xj-dp-mp-month xj-dp-mp-sep' xmonth='9'><a href='javascript:void(0);'>", options.monthName[9], "</a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td>");
        cpHA.push("</tr>");

        cpHA.push("<tr>");
        cpHA.push("<td class='xj-dp-mp-month' xmonth='4'><a href='javascript:void(0);'>", options.monthName[4], "</a></td><td class='xj-dp-mp-month xj-dp-mp-sep' xmonth='10'><a href='javascript:void(0);'>", options.monthName[10], "</a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td>");
        cpHA.push("</tr>");

        cpHA.push("<tr>");
        cpHA.push("<td class='xj-dp-mp-month' xmonth='5'><a href='javascript:void(0);'>", options.monthName[5], "</a></td><td class='xj-dp-mp-month xj-dp-mp-sep' xmonth='11'><a href='javascript:void(0);'>", options.monthName[11], "</a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='xj-dp-mp-year'><a href='javascript:void(0);'></a></td>");
        cpHA.push("</tr>");
        cpHA.push("<tr class='xj-dp-mp-btns'>");
        cpHA.push("<td colspan='4'><button id='",pickerid,"_mpokey' class='xj-dp-mp-ok'>", options.btnOk, "</button><button id='",pickerid,"_mpcancel' class='xj-dp-mp-cancel'>", options.btnCancel, "</button></td>");
        cpHA.push("</tr>");

        cpHA.push("</tbody></table>");
        cpHA.push("</div>");
        cpHA.push("</div>");        
	}

	function __InitEvents__(pickerid,options){
	    $("#"+pickerid+"_today").click(function(e){
	    	__ReturnToday__(pickerid,options);
	    });
	    $("#"+pickerid).click(function(e){return false;});

        $("#"+pickerid+"_inner tbody").click(function(e){
        	return __TBHandler__.call(this,e,pickerid,options);        	
        });

        $("#"+pickerid+"_leftbtn").click(function(e){
        	return __PrevMonth__.call(this,e,pickerid,options);
        });
        $("#"+pickerid+"_rightbtn").click(function(e){
        	return __NextMonth__.call(this,e,pickerid,options);
        });

        $("#"+pickerid+"_ymbtn").click(function(e){
        	return __ShowYM__.call(this,e,pickerid,options);
        });
        $("#"+pickerid+"_mp").click(function(e){
        	return __MPClickHandler__.call(this,e,pickerid,options);

        }).dblclick(function(e){
        	return __MPDbClickHandler__.call(this,e,pickerid,options);

        });
        $("#"+pickerid+"_mpprev").click(function(e){
        	return __MPPrevYear__.call(this,e,pickerid,options);
        });
        $("#"+pickerid+"_mpnext").click(function(e){
        	return __MPNextYear__.call(this,e,pickerid,options)
        });
        $("#"+pickerid+"_mpokey").click(function(e){
        	return __MPOkey__.call(this,e,pickerid,options)
        });
        $("#"+pickerid+"_mpcancel").click(function(e){
        	return __MPCancel__.call(this,e,pickerid,options)
        });
        $("#"+pickerid+"_time").keypress(function(e){
        	return __TimeEnter__.call(this,e,pickerid,options)
        });
	}
	function __TimeEnter__(e,pickerid,options){
		if (e.keyCode == 13) { //ENTER
            var timevalue = $(this).val();
            if (!/\d{2}:\d{2}/.test(timevalue)) {
                timevalue = "00:00";
            }
            var arrtime = timevalue.split(":");
            if (arrtime.length == 2) {
                var d = new Date(options.Year, options.Month - 1,options.Day);              
                d.setHours(arrtime[0], arrtime[1], 0);            
                __ReturnDate__(d,pickerid,options);
            }
        }        
	}
	function __MPOkey__(e,pickerid,options){
		options.Year = options.cy;
        options.Month = options.cm + 1;
        options.Day = 1;
        $("#"+pickerid+"_mp").animate({ top: -193 }, { duration: 200, complete: function () {  $("#"+pickerid+"_mp").hide(); } });
        __WriteDays__(pickerid,options);
        return false;
	}
	function __MPCancel__(e,pickerid,options){
		$("#"+pickerid+"_mp").animate({ top: -193 }, { duration: 200, complete: function () {  $("#"+pickerid+"_mp").hide(); } });
        return false;
	}
	function __MPNextYear__(e,pickerid,options){		
        options.ty = options.ty + 10;
        __ResetYear__(pickerid,options.ty,options);
        return false;
	}
	function __MPPrevYear__(e,pickerid,options){		
        options.ty = options.ty - 10;
        __ResetYear__(pickerid,options.ty,options);
        return false;
	}
	function __MPDbClickHandler__(e,pickerid,options){
		var et = e.target || e.srcElement;
        var td = __GetTD__(et);
        if (td == null) {
            return false;
        }
        if ($(td).hasClass("xj-dp-mp-month") || $(td).hasClass("xj-dp-mp-year")) {
            __MPOkey__(e,pickerid,options);
        }
        return false;
	}
	function __MPClickHandler__(e,pickerid,options){
		var panel = $(this);
        var et = e.target || e.srcElement;
        var td = __GetTD__(et);
        if (td == null) {
            return false;
        }
        if ($(td).hasClass("xj-dp-mp-month")) {
            if (!$(td).hasClass("xj-dp-mp-sel")) {
                var ctd = panel.find("td.xj-dp-mp-month.xj-dp-mp-sel");
                if (ctd.length > 0) {
                    ctd.removeClass("xj-dp-mp-sel");
                }
                $(td).addClass("xj-dp-mp-sel");
                options.cm = parseInt($(td).attr("xmonth"));
            }
        }
        if ($(td).hasClass("xj-dp-mp-year")) {
            if (!$(td).hasClass("xj-dp-mp-sel")) {
                var ctd = panel.find("td.xj-dp-mp-year.xj-dp-mp-sel");
                if (ctd.length > 0) {
                    ctd.removeClass("xj-dp-mp-sel");
                }
                $(td).addClass("xj-dp-mp-sel");
                options.cy = parseInt($(td).attr("xyear"));
            }
        }
        return false;
	}
	function __ShowYM__(e,pickerid,options){
		var mp = $("#"+pickerid+"_mp");
        var y = options.Year;
        options.cy = options.ty = y;
        var m = options.Month - 1;
        options.cm = m;
        var ms = $("td.xj-dp-mp-month",mp);
        for (var i = ms.length - 1; i >= 0; i--) {
            var ch = $(ms[i]).attr("xmonth");
            if (ch == m) {
                $(ms[i]).addClass("xj-dp-mp-sel");
            }
            else {
                $(ms[i]).removeClass("xj-dp-mp-sel");
            }
        }
        __ResetYear__(pickerid,y,options);
        mp.css("top", -193).show().animate({ top: 0 }, { duration: 200 });
	}

	function __ResetYear__(pickerid,y,options) {
        var s = y - 4;
        var ar = [];
        for (var i = 0; i < 5; i++) {
            ar.push(s + i);
            ar.push(s + i + 5);
        }
        $("#"+pickerid+"_mp td.xj-dp-mp-year").each(function (i) {
            if (options.Year == ar[i]) {
                $(this).addClass("xj-dp-mp-sel");
            }
            else {
                $(this).removeClass("xj-dp-mp-sel");
            }
            $(this).html("<a href='javascript:void(0);'>" + ar[i] + "</a>").attr("xyear", ar[i]);
        });
    }

	function __PrevMonth__(e,pickerid,options){
		if (options.Month == 1) {
		    options.Year--;
		    options.Month = 12;
		}
		else {
		    options.Month--
		}
		__WriteDays__(pickerid,options);
		return false;
	}
	function __NextMonth__(e,pickerid,options){
	  	if (options.Month == 12) {
            options.Year++;
            options.Month = 1;
        }
        else {
            options.Month++
        }
       __WriteDays__(pickerid,options);
        return false;
	}
	function __WriteDays__(pickerid,options){
	 	var tb = $("#"+pickerid+"_inner tbody");
        $("#"+pickerid+"_ymbtn").html(options.monthName[options.Month - 1] + options.monthp + " " + options.Year);
        var firstdate = new Date(options.Year, options.Month - 1, 1);

        var diffday = options.weekStart - firstdate.getDay();
        var showmonth = options.Month - 1;
        if (diffday > 0) {
            diffday -= 7;
        }
        var startdate = DateAdd("d", diffday, firstdate);
        var enddate = DateAdd("d", 42, startdate);    
        var bhm = [];
        var ads = options.ads;
		var ade = options.ade;
        var tds = options.today.Format("yyyy-MM-dd");
        var indate = options.indate;
        var ins = indate != null ? indate.Format("yyyy-MM-dd") : "";
        for (var i = 1; i <= 42; i++) {
            if (i % 7 == 1) {
                bhm.push("<tr>");
            }
            var ndate = DateAdd("d", i - 1, startdate);
            var tdc = [];
            var dis = false;
            if (ads && ndate < ads) {
                dis = true;
            }
            if (ade && ndate > ade) {
                dis = true;
            }
            if (ndate.getMonth() < showmonth) {
                tdc.push("xj-dp-prevday");
            }
            else if (ndate.getMonth() > showmonth) {
                tdc.push("xj-dp-nextday");
            }

            if (dis) {
                tdc.push("xj-dp-disabled");
            }
            else {
                tdc.push("xj-dp-active");
            }

            var s = ndate.Format("yyyy-MM-dd");
            if (s == tds) {
                tdc.push("xj-dp-today");
            }
            if (s == ins) {
                tdc.push("xj-dp-selected");
            }

            bhm.push("<td class='", tdc.join(" "), "' title='", ndate.Format("yyyy-MM-dd"), "' xdate='", ndate.Format("yyyy-M-d"), "'><a href='javascript:void(0);'><em><span>", ndate.getDate(), "</span></em></a></td>");
            if (i % 7 == 0) {
                bhm.push("</tr>");
            }
        }
        tb.html(bhm.join(""));
	}
	function __TBHandler__(e,pickerid,options){
		var et = e.target || e.srcElement;
        var td = __GetTD__(et);
        if (td == null) {
            return false;
        }
        var $td = $(td);
        if (!$(td).hasClass("xj-dp-disabled")) {
            var s = $td.attr("xdate");
            var arrs = s.split("-");
            var d = new Date(arrs[0], parseInt(arrs[1], 10) - 1, arrs[2]);
            if (options.showtime) {
                var timevalue = $("#"+pickerid+"_time").val();
                if (!/\d{2}:\d{2}/.test(timevalue)) {
                    timevalue = "00:00";
                }
                var arrtime = timevalue.split(":");
                if (arrtime.length == 2) {
                    d.setHours(arrtime[0], arrtime[1], 0);
                }
            }
            __ReturnDate__(d,pickerid,options);
        }
        return false;
	}
	function __ReturnToday__(pickerid,options){
		var d = new Date();
        if (options.showtime) {
            var timeshow = $("#"+pickerid+"_time").val();
            if (!/\d{2}:\d{2}/.test(timeshow)) {
                timeshow = "00:00";
            }
            var arrtime = timeshow.split(":");
            if (arrtime.length == 2) {
                d.setHours(arrtime[0], arrtime[1], 0);
            }
        }       
        __ReturnDate__(d,pickerid,options);
	}
	function __ReturnDate__(rdate,pickerid,options){	  
        if (options.onReturn && $.isFunction(options.onReturn)) {
            re.call(options.el, rdate);
        }
        else {
            var formart = options.showtime ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd";
            options.el.val(rdate.Format(formart));
        }     
        $("#"+pickerid).css("visibility", "hidden"); 
	}

	function __GetTD__(elm){
		if (elm.tagName.toUpperCase() == "TD") {
		    return elm;
		}
		else if (elm.tagName.toUpperCase() == "BODY") {
		    return null;
		}
		else {
		    var p = $(elm).parent();
		    if (p.length > 0) {
		        if (p[0].tagName.toUpperCase() != "TD") {
		            return __GetTD__(p[0]);
		        }
		        else {
		            return p[0];
		        }
		    }
		}
		return null;
	}
	xjDatepicker.prototype = {
		Show:function(){
			var self = this ;
			var cp = $("#"+this.pickerid);
			if (cp.css("visibility") == "visible") {
                cp.css(" visibility", "hidden");
            }
			var v = this.el.val();
            var dateReg = this.options.showtime ? /^(\d{1,4})(-|\/|.)(\d{1,2})\2(\d{1,2})\040+(\d{1,2}):(\d{1,2})$/ : /^(\d{1,4})(-|\/|.)(\d{1,2})\2(\d{1,2})$/;
            if (v != "") {
                v = v.match(dateReg);
            }

            if (v == null || v == "") {
                var now = new Date();
                this.options.Year = now.getFullYear();
                this.options.Month = now.getMonth() + 1;
                this.options.Day = now.getDate();
                this.options.Hour = now.getHours();
                this.options.Minute = now.getMinutes();
                this.options.Second = now.getSeconds();
                this.options.inputDate = null;
                if (this.options.showtime) {
                    $("#"+this.pickerid+"_time").val("00:00");
                }
            }
            else {
                this.options.Year = parseInt(v[1], 10);
                this.options.Month = parseInt(v[3], 10);
                this.options.Day = parseInt(v[4], 10);
                if (this.options.showtime) {
                    this.options.Hour = parseInt(v[5], 10);
                    this.options.Minute = parseInt(v[6], 10);
                    this.options.Second = 0;
                    this.options.indate = new Date(this.options.Year, this.options.Month - 1, this.options.Day, this.options.Hour, this.options.Minute, this.options.Second);
                    $("#"+this.pickerid+"_time").val(this.options.indate.Format("HH:mm"));

                }
                else {
                    this.options.indate = new Date(this.options.Year, this.options.Month - 1, this.options.Day);
                }

            }
            this.options.ads = this.options.ade = null;

         	if (this.options.applyrule && $.isFunction(this.options.applyrule)) {
                var rule = this.options.applyrule.call(this.el, this.elid);
                if (rule) {
                    if (rule.startdate) {
                        this.options.ads = rule.startdate ;
                    }                   
                    if (rule.enddate) {
                    	this.options.ade = rule.enddate ;                        
                    }                   
                }
            }           
            __WriteDays__(this.pickerid,this.options);

            $("#"+this.pickerid+"_t").height(cp.height());
            var t = this.options.showtarget || this.el;
            var pos = t.offset();


            var height = t.outerHeight();
            var newpos = { left: pos.left, top: pos.top + height };
            var w = cp.width();
            var h = cp.height();
            var bw = document.documentElement.clientWidth;
            var bh = document.documentElement.clientHeight;
            if ((newpos.left + w) >= bw) {
                newpos.left = bw - w - 2;
            }
            if ((newpos.top + h) >= bh) {
                newpos.top = pos.top - h - 2;
            }
            if (newpos.left < 0) {
                newpos.left = 10;
            }
            if (newpos.top < 0) {
                newpos.top = 10;
            }
            $("#"+this.pickerid+"_mp").hide();
            newpos.visibility = "visible";
            cp.css(newpos);

			$(document).one("click",function(){
				self.Hide.call(self);
			});
		},
		Hide:function(){
			$("#"+this.pickerid).css("visibility","hidden");
		}
	};
	window.xjDatepicker = xjDatepicker ;
})(window,undefined,jQuery);