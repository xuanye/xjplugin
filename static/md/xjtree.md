xjtree
====
调用示例
---
```html
<div id="treeid"></div>
```

```javascript
var tree = new xjTree("treeid",option);
```
其中treeid 为页面上div 的id,option为调用参数，详见参数说明
参数说明
---
### 完整参数示例
```javascript
{
    method: "POST",
    datatype: "json",
    url: false,
    cbiconpath: "/img/icon/",
    icons: ["checkbox_0.gif", "checkbox_1.gif", "checkbox_2.gif"],
    emptyiconpath: "/img/icon/s.gif",
    showcheck: false,   
    oncheckboxclick: false,
    onnodeclick: false,
    parsedata: false,
    cascadecheck: true,
    data: null,
    preloadcomplete: false,      
    theme: "xj-tree-arrows"
}
```
### 参数说明
<table class="table">
<thead><tr><th>参数名称</th><th>说明</th><th>备注</th></tr></thead>
<tbody>
<tr><td>method</td><td>异步请求的方式，默认为`POST`</td><td>没事就不要修改了</td></tr>
<tr><td>datatype</td><td>异步请求的数据格式，默认为`json`</td><td>其他格式暂不支持</td></tr>
<tr><td>url</td><td>异步请求的URL地址，如果需要异步获取数据这个字段必须填写</td><td></td></tr>
<tr><td>cbiconpath</td><td>checkbox图片的相对路径，配合icons 组成tree选中框的三态</td><td>如果相对路径不同则需改此字段</td></tr>
<tr><td>icons</td><td>checkbox三态的图片名称</td><td></td></tr>
<tr><td>emptyiconpath</td><td>一张空白图片的地址</td><td>如果地址不同需要重新配置下</td></tr>
<tr><td>showcheck</td><td>是否需要显示checkbox，默认为`false`</td><td></td></tr>
<tr><td>data</td><td>默认加载的数据源</td><td>详见数据格式</td></tr>
<tr><td>theme</td><td>主题样式，默认为`xj-tree-arrows`</td><td>其他主题可选 `xj-tree-line` `xj-tree-no-lines` `xj-tree-arrows-newico` </td></tr>
<tr><td>cascadecheck</td><td>是否支持级联选中，默认为`true`</td><td></td></tr>
<tr><td>oncheckboxclick</td><td>事件，当checkbox被点击以后触发</td><td>具体参考事件说明</td></tr>
<tr><td>onnodeclick</td><td>事件，当节点被点击时触发</td><td>具体参考事件说明</td></tr>
<tr><td>parsedata</td><td>事件，异步获取数据返回后触发，一般用于重新处理数据格式</td><td>具体参考事件说明</td></tr>
<tr><td>preloadcomplete</td><td>事件，异步请求返回后触发</td><td>具体参考事件说明</td></tr>
</tbody>
</table>

数据格式
---
不管是在初始化中`option`中的`data` 还是异步请求返回的数据,都使用同一种数据格式,这里把假定为`nodedata`.
因为树的数据具有层次性,我们将分两层将其分解

首先顶层 是一个nodedata的数组
```javascript
var treedata =[nodedata]
```
其中`nodedata`，包含以下字段
```javascript
var nodedata ={
    "id":"", //节点ID
    "text":"", //节点文本
    "value":""// 节点的值
    "hasChildren":true, //是否包含子节点，因为ChildNodes的数据可能还没加载是否有下级由此属性控制
    "classes":"", //自定义节点cssClass的名称
    "showcheck":false,//是否显示checkbox,和调用处的showcheck同时设置为true该节点才能显示checkbox
    "complete":false,//子节点是否已经加载完成
    "ChildNodes":[nodedata] //子节点数据
 }
```
**注意：** 节点上还可以附加其他数据字段，不会被处理，并且会在方法中传递。
方法
---
所有方法都通过声明时的实例来调用 `var tree = new xjTree("treeid",option);`

#### 1. GetCheckedItems:function(gethalfchecknode)
> 获取选中的节点数据项集合

**参数：**  

1. gethalfchecknode：boolean  
是否获取半选中状态的节点

**返回值：**  array  

返回 `[nodedata]` 数组

#### 2. GetCheckedValues:function(gethalfchecknode)
> 获取选中的节点的value值集合  

**参数：**  

1. gethalfchecknode：boolean  
是否获取半选中状态的节点

**返回值：** array   

返回 [nodedata.value] 数组

#### 3. GetCurrentItem:function()
> 获取当前节点

**返回值：**  object  
返回当前节点 nodedata 

#### 4. Refresh:function(itemOrItemId)
> 刷新某节点

**参数：**

1. itemOrItemId:string/object 必选！  
需要刷新的节点ID或者nodedata ，其实只要id就够了，

**返回值：** void  
无

#### 5. CheckAll:function()
> 选中全部节点

**返回值：** void  
无

#### 6. UnCheckAll:function()
> 取消全部选中的节点

**返回值：** void  
无
#### 7. SetItemsCheckState:function(itemIds, ischecked, cascadecheck)
> 设置多个节点的选中状态 

**参数：**  
1. itemIds：array()  必选！  
    需要设置节点IDs:[id1,id2]  
2. ischecked：boolean   必选！  
    是否选中true/false  
3. cascadecheck：boolean   必选！  
    是否级联效果true/false

**返回值：** void
无

#### 8. ToggleNode:function(itemId)
> 切换节点收缩/展开状态

**参数：**  
1. itemId : string  必选！  
需要切换的节点ID

**返回值：** void  
无

#### 9. GetTreeData:function()
> 获取树中的元素数据

**返回值：** array()  
返回[nodedata]

#### 10. LocateNode:function(nodeid)
> 定位到某个节点，如果节点已经生成，则从该节点的父节点展开至根节点

**参数：**  
1. nodeid : string 必选！
需要定位的节点ID

**返回值：**  void
无

事件
---
#### 1. oncheckboxclick : function(item,state)
> 当树节点中任意一个checkbox被点击时触发，该事件处理函数的返回值如果为false，则可以阻止check行为

**参数说明：**  

1. item : object
`nodedata` 所在节点数据 

2. state：0/1/2
选中的状态 0 未为选中 1 选中  2 半选

**返回值：** boolean  

必须返回一个结果true/false 

#### 2. onnodeclick:function(item)
> 当树节点被点击时触发的事件

**参数说明：** 

1. item:object `nodedata`所在数据的节点 
> 和初始化的`nodedata` 不同的时 这里的item 有一个`expand` 的方法 可以展开/收缩 节点

**返回值：** void   
无 ，不需要返回值  

**示例：**  
```javascript
onnodeclick: function(node){node.expand();} 
```
#### 3. parsedata:function(data)  
> 异步获取子节点中，数据返回成功后触发，只在有数据的时候触发，可用于重新格式化或过滤数据。

**参数说明：**  

1. data: array() , [nodedata] 子节点数据  

**返回值：**  void  
无

#### 4. preloadcomplete:function()
> 异步获取子节点中,请求返回后触发，此事件在`parsedata` 事件前 ，不管有没有数据，总是触发。一般不用设置，特殊需求时需要。

**返回值：**  void  
无

FAQ
---
1. 如果自定义节点的样式，如图标  
 > 设置节点的 `classes` 属性，如下所示：  

节点数据：  
```javascript
{
    ...
    "classes":"ico-home",
    ...
}
```

新增样式：  
```css
.ico-home .xj-tree-node-icon
{
    background-image: url("/img/icon/home.png");
}
```

扩展
---
xjtree 的页面dom和事件绑定分离，同时数据结构非常易于扩展。