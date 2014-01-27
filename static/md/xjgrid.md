xjgrid
===
xjdatepicker
====
调用示例
---
```html
  <div id="gridid"></div> 
```

```javascript
 var xjgrid = new xjGrid("gridid",option);
```

gridid 为页面上div的id,option为调用参数，详见参数说明
参数说明
---
### 完整参数示例
```javascript
{
	url:false,
	colModel:[],
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
}
```
### 参数说明
<table class="table">
<thead><tr><th>参数名称</th><th>说明</th><th>备注</th></tr></thead>
<tbody>

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