xjtabpanel
===
xjtabpanel 是一个简单的选项卡控件， 建议用于后台系统首页程序，具体可参考 [demo][1]

调用示例
---
```html
<div id="tab-container"></div>
```

```javascript
var tab = new xjTabPanel("tab-container",option);
```
其中`tab-container`为页面上div 的id,option为调用参数，详见参数说明

参数说明
---
<table class="table">
<thead><tr><th>参数名称</th><th>说明</th><th>备注</th></tr></thead>
<tbody>
<tr><td>items</td><td>数组，选项卡内容数据</td><td>具体请参考数据格式</td></tr>
<tr><td>width</td><td>整形，设置插件的宽度，单位为像素</td><td>默认为`500`</td></tr>
<tr><td>height</td><td>整形，设置插件的高度，单位为像素</td><td>默认为`400`</td></tr>

<tr><td>showcloseall</td><td>数组，当item数量大于此数量时，显示关闭所有的按钮</td><td>默认为`5`</td></tr>
<tr><td>scrollwidth</td><td>整形，如果存在滚动条，点击按钮次每次滚动的距离,单位为像素</td><td>默认为`100`</td></tr>
<tr><td>autoscroll</td><td>布尔，当选项卡宽度大于容器时自动添加滚动按钮</td><td></td></tr>
</tbody>
</table>

数据格式
---
items中的数据格式，本文假定为 `tabitem` .
```json
{ 
    id: "",  //id，必须唯一
    text: "", // 选项卡上显示的文本
    classes: "", // 自定义样式cssClass
    isactive: true,  //是否当前激活， 只应该存在一个激活的选项卡
    disabled:false,// 是否禁用
    url: "", //选项卡内容页iframe的url地址，如果该属性为空，则调用cuscall 获取内容
    cuscall:function(item,parent){}, // 自定义获取选项卡内容的方法，没有配置则调用content
    content: "", // 选项卡内容的默认内容
    closeable:true, //是否有一个单独关闭该选项卡的按钮
    onactive:function(item){} //当选项卡被激活时触发
}
```
可以附加其他属性，该属性会在方法和时间中传递。
其中  

1. cuscall:function(item,parent){}   
> 自定义获取选项卡内容，如通过ajax方法获取服务端的某些数据，该方法只会被触发一次！，其中`item` 为当前选项卡的数据，parent 为内容页父容器。需要填充的内容作为函数返回值即可。

2. onactive:function(item){}  
> 当选项卡被激活时触发的事件，`item` 为当前选项卡的数据。 

方法
---
所有方法都通过声明时的实例来调用 `var tab = new xjTabPanel("tabid",option);`

#### 1.AddTabItem:function(item)
> 添加选项卡

**参数:** 
 
1. item :object ,tabitem 的一个实例

**返回值：** void   
无

#### 2.OpenTabItem:function(item,orAdd)
> 激活某选项卡 ，如果oradd参数为真时，如果item.id 对应的选项卡并不存在 则新增一个新的选项卡 ，并激活。

**参数:**   

1. item : object ,tabitem 的一个实例  

2. orAdd : boolean,当设置成`true` 时 ， 

**返回值：** void   
无

#### 3. ResizeTabPanel:function(width,height)
> 重新设置tabpanel的大小 。width，height 都是整数，单位为像素

#### 4.SetDisableTabItem:function(itemId, disabled)  
> 设置选项卡的状态

**参数：**  
1. itemId :string,选项卡的id  
2. disabled:boolean,是否禁用

**返回值：** void  
无 

FAQ
---
无

  [1]: sample/desktop