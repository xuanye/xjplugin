xjdatepicker
====
调用示例
---
```html
<input type="text" id="dptext1"/>
```

```javascript
var picker = new xjDatepicker("dptext1",option);
```

dptext1 为页面上input的id,option为调用参数，详见参数说明
参数说明
---
### 完整参数示例
```javascript
{
	weekStart: 0,
	weekName: ["日", "一", "二", "三", "四", "五", "六"],
	monthName: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"], 
	monthp: "月",   
	btnOk: " 确定 ",
	btnCancel: " 取消 ",
	btnToday: "今天", 
	onReturn: false,
	showtime: false,
	applyrule: false,
	showtarget: null, 
	picker: ""
}
```
### 参数说明
<table class="table">
<thead><tr><th>参数名称</th><th>说明</th><th>备注</th></tr></thead>
<tbody>
<tr><td>weekStart</td><td>星期的起始天，0表示 星期日</td><td></td></tr>
<tr><td>weekName</td><td>星期的名称简写，可以通过配置支持多语言</td><td></td></tr>
<tr><td>monthp</td><td>月份的简写，可以通过配置支持多语言</td><td></td></tr>
<tr><td>btnOk</td><td>确定按钮显示的文本，可以配置支持多语言</td><td></td></tr>
<tr><td>btnCancel</td><td>取消按钮显示的文本，可以支配支持多语言</td><td></td></tr>
<tr><td>btnToday</td><td>今天按钮显示的文本，可以配置支持多语言</td><td></td></tr>
<tr><td>onReturn</td><td>事件，当选中时期和时间或返回时触发</td><td>详见事件</td></tr>
<tr><td>showtime</td><td>是否显示时间</td><td></td></tr>
<tr><td>applyrule</td><td>事件，应用规则，弹出选择日期层前触发</td><td>详见事件</td></tr>
<tr><td>showtarget</td><td>显示的元素，</td><td></td></tr>
<tr><td>picker</td><td>日历小图标</td><td>详见demo</td></tr>
</tbody>
</table>

数据格式
---
无

方法
---
所有方法都通过声明时的实例来调用 `var picker = new xjDatepicker("dptext1",option);`

#### 1. Show:function()
> 显示日期选择层

**返回值：**  void  

无

#### 2. Hide:function()
> 隐藏日期选择层


**返回值：**   void  
无


事件
---
#### 1. onReturn : function(idate)
> 当选中时期和时间或返回时触发，用于做联动

**参数说明：**  

1. idate : Date
选中日期和时间

**返回值：** void    
无

#### 2. applyrule:function(id)
> 应用规则，弹出选择日期层前触发，可用于此事件设置日期选择空间的取值范围

**参数说明：** 

1. id:string  datepicker input的id

**返回值：** object    
需要返回指定格式的对象格式如下 ，可只设置某一个属性，两者都不设置 ，则表示不设置范围
```json
{
	startdate:Date, //开始时间
	enddate:Date   //结束时间
}
```
**示例：**  
详见 [demo][1]

FAQ
---


  [1]: /sample/xjdatepicker