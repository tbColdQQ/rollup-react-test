## 秦淮数据基础开发平台选人组件

### 属性

```
1、getSelectedList: function  获取已选的人员信息
2、selectedList: array  已有的人员列表
3、orgUrl: string     获取组织机构url
4、userUrl: string    根据组织机构获取人员url
5、selectedArr: array   已有的人员ID数组
```


### 使用

#### `script` 标签引用

`<script src="dist/index.js"></script>`

在 `script` 标签引用前在 `window` 上添加全局属性
```
window.userUrl = ''
window.orgUrl = ''
window.selectedArr = []
window.selectedList = []
window.getSelectedList = function(res) {
  // TODO
}
```
