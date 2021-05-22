# wxAppSignName
微信小程序签名组件

组件位于component目录的signName，page/index为页面事例
## 使用方法
配置文件
```
{
  "usingComponents": {
    "sign-name": "/component/signName/signName"
  }
}
```
页面wxml引入组件
```
<sign-name 
  id="signNameComponent" 
  lineColor="{{lineColor}}" 
  backColor="{{backColor}}" 
  width="{{canvasWidth}}" 
  height="{{canvasHeight}}" 
  bindcreatImgBack="getImg">
</sign-name>
```
属性|类型|必填|默认值|说明
--|:--:|:--:|:--:|:--
lineColor|String|否|#000|线条颜色
backColor|String|否|#fff|画板背景颜色
width|String|否|750|画板宽度
height|String|否|600|画板长度
lineColor|String|否|#000|线条颜色
bindcreatImgBack|事件回调|否| |签名图片生成后回调函数e.detail会返回{code,imgPath}。imgPath为生成的图片路径，code='success'表示成功，'fail'表示失败，'noSign'表示用户并未签名。

生成图片 清空画布 需要主动调用组件方法
生成图片（生成图片后会调用绑定在组件上的bindcreatImgBack）
```
let sign = this.selectComponent('#signNameComponent')
sign.createImg()
```
清空画布
```
let sign = this.selectComponent('#signNameComponent')
sign.clean()
```
