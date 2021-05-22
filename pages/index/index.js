// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    canvasWidth: '750',
    canvasHeight: '500',
    backColor: '#fff',
    lineColor: '#000',
    signImg: ''
  },
  onLoad() {
  },
  finishSign(){
    let sign = this.selectComponent('#signNameComponent')
    sign.createImg()
  },
  cleanSign(){
    let sign = this.selectComponent('#signNameComponent')
    sign.clean()
  },
  getImg(e){
    if(e.detail.code == 'success'){
      this.setData({
        signImg:e.detail.imgPath
      })
    }
    if(e.detail.code == 'fail'){
      wx.showToast({ title: '生成签名失败', icon: 'none', duration: 1500 })
    }
    if(e.detail.code == 'noSign'){
      wx.showToast({ title: '请签名', icon: 'none', duration: 1500 })
    }
  },
})
