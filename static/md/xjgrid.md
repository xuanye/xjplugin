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

待完成