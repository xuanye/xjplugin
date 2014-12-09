xjgrid
===
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
	url: false, // ajax加载的服务端URL 必须配置
	width:"100%",  // 表格宽度，默认为充满父容器，也可以通过colModel中的列设置，设置列的宽度，如果所有列都设置宽度，那么这个参数应该设置成auto
	colModel:[],// 列定义 必须配置
	striped: true, //是否显示斑纹效果，默认是奇偶交互的形式
	mhoverclass:'mhover', //鼠标over在行上所添加的样式，默认为亮色
	method: 'POST', // data sending method,数据发送方式，默认为POST，最好不要修改
	usepager: false, //是否分页		
	page: 0, //current page,默认当前页 索引从0 开始
	total: 1, //total pages,总页面数		
	rp: 25, // results per page,每页默认的结果数			
	autoload: true, //自动加载     
	submitcoldef:true, //是否在请求时提交字段定义信息    
	showcheckbox: false, //是否显示checkbox,
	localpage: false,//本地分页，大数据量，单次全部加载到客户端，慎用！
	rowhanlder:false,//行处理事件 ，用于绑定一些特殊的事件，详见事件rowhanlder
	extparams: [], // 想服务器发送的额外参数，也是查询时使用的参数，详见示例
	gridClass: "xjgrid"//Style
}
```

### 其中colModel参数说明
<table class="table">
<thead><tr><th>参数名称</th><th>说明</th><th>备注</th></tr></thead>
<tbody>
<tr><td>display</td><td>显示文本</td><td>字符串，必须</td></tr>
<tr><td>name</td><td>列名称</td><td>字符串，必须</td></tr>
<tr><td>width</td><td>列宽度</td><td>整数型，可选</td></tr>

<tr><td>align</td><td>对其方式</td><td>'left','center','right', 必须</td></tr>
<tr><td>iskey</td><td>是否主键</td><td>true/false,必须存在一列</td></tr>
<tr><td>process</td><td>处理函数</td><td>function，一般用着格式化输出，详见事件rowprocess</td></tr>
</tbody>
</table>

方法
---
所有方法都通过声明时的实例来调用 `var xjgrid = new xjGrid("gridid",option);`  

#### 1.reload:function() 
> 刷新数据

**返回值：**  void  

#### 2.setOptions:function(newOptions) 
> 重新设置参数，一般和reload合并使用  

**参数说明：**  

1. newOptions : Object   
详见完整参数说明  

**返回值：**  void  
无


#### 3.getCheckedRowIds:function() 
> 获取选中列的主键值序列

**返回值：**  Array  

#### 4.getCheckedRowDatas:function() 
> 获取选中列的所有数据序列

**返回值：**  Array  

#### 5.query:function(formIdOrformElement)
> 重新发起ajax查询，并发送指定form中表单项

**参数说明：**  

1. formIdOrformElement : String/DOM Object  
表单的id,格式如'#formid' 注意#号，或者直接是表单对象


**返回值：**  void  
无

#### 6.queryByFields:function(search)
> 重新发起ajax查询，并发送参数中的对象值

**参数说明：**  

1. search :Object Array    
查询过滤对象格式 [{'name':'keywords','value':'帅哥'},..]


**返回值：**  void  
无


事件
---
#### 1. rownhandler : function(cells)
> 当需要给行加上额外的绑定事件时的函数,如右键菜单，不常用！

**参数说明：**  

1. cells : Array  
当前行的数据

**返回值：** void    
无

#### 2. rowprocess : function(id,value,cells)
> 格式化单元格输出

**参数说明：**  

1. id : String  
当前行的主键值

2. value : String  
当前单元格的值

3. cells : Array  
当前行的所有数据值


**返回值：** String    
返回格式化后的内容

**示例代码：**

```javascript
process:fomartMoney


function fomartMoney(id,value){
	return '$'+value;
}
```
FAQ
---
无