xjtree
====
调用示例
---
``` html
<div id="treeid"></div>
```
``` javascript
var tree = new xjTree("treeid",option);
```
其中treeid 为页面上div 的id,option为调用参数，详见参数说明
参数说明
---
### 完整参数示例
``` javascript
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
<table>
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
```
var treedata =[nodedata]
```
其中`nodedata`，包含以下字段
```
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


事件
---

FAQ
---
扩展
---