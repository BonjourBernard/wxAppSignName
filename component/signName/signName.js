// page/common/signName/signName.js
// canvas内容实例
var ctx, canvasObj
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width:  {
      type: String,
      value: '750'
    },
    height:  {
      type: String,
      value: '600'
    },
    img: String,
    lineColor:  {
      type: String,
      value: '#000'
    },
    backColor:  {
      type: String,
      value: '#fff'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lowVision: false,
    componentReady: false,
    imgPath: '',
    isSign: false
  },

  lifetimes: {
    attached() {
      const version = wx.getSystemInfoSync().SDKVersion
      this.setData({
        lowVision: this.compareVersion(version, '2.9.0') == -1,
        componentReady: true
      })
    },
    ready() {
      if (this.data.lowVision) {
        this.renderLowSignCanvas()
      }
      if (!this.data.lowVision) {
        this.renderSignCanvas()
      }
    },
    detached() {
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    compareVersion(v1, v2) {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)

      while (v1.length < len) {
        v1.push('0')
      }
      while (v2.length < len) {
        v2.push('0')
      }

      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }

      return 0
    },
    renderSignCanvas() {
      const scope = this
      const query = wx.createSelectorQuery().in(this)
      query.select('#signCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          canvasObj = res[0].node
          ctx = canvasObj.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvasObj.width = res[0].width * dpr
          canvasObj.height = res[0].height * dpr
          ctx.fillStyle = scope.data.backColor
          ctx.lineWidth = 3;
          ctx.scale(dpr, dpr)
          ctx.fillRect(0, 0, scope.data.width, scope.data.height)
        })
    },
    renderLowSignCanvas() {
      const scope = this
      ctx = wx.createCanvasContext('signCanvas', scope)
      ctx.setFillStyle(scope.data.backColor)
      ctx.fillRect(0, 0, this.data.width, this.data.height)
      ctx.draw()
      ctx.setLineWidth(3)
      ctx.setLineCap('round');
      ctx.setLineDash('round');
    },
    signStart(e) {
      ctx.beginPath()
      ctx.moveTo(e.touches[0].x, e.touches[0].y)
    },
    signMove(e) {
      this.data.isSign = true
      if (this.data.lowVision) {
        ctx.lineTo(e.touches[0].x, e.touches[0].y)
        ctx.setStrokeStyle(this.data.lineColor)
        ctx.stroke();
        ctx.draw(true)
        ctx.moveTo(e.touches[0].x, e.touches[0].y)
      }
      if (!this.data.lowVision) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineTo(e.touches[0].x, e.touches[0].y)
        ctx.strokeStyle = this.data.lineColor
        ctx.stroke()
      }
    },
    signEnd(e) {
    },
    clean() {
      this.data.isSign = false
      if (this.data.lowVision) {
        ctx.clearRect(0, 0, this.data.width, this.data.height);
        ctx.setFillStyle(this.data.backColor)
        ctx.fillRect(0, 0, this.data.width, this.data.height)
        ctx.stroke();
        ctx.draw()
      }
      if (!this.data.lowVision) {
        ctx.clearRect(0, 0, this.data.width, this.data.height);
        ctx.fillRect(0, 0, this.data.width, this.data.height)
      }
    },
    createImg() {
      let that = this
      if (!that.data.isSign) {
        that.triggerEvent('creatImgBack', {
          code: 'noSign'
        })
        return
      }
      let _params = {
        x: 0,
        y: 0,
        width: that.data.width,
        height: that.data.height,
        destWidth: that.data.width,
        destHeight: that.data.height,
        fileType: 'jpg',
      }
      if (this.data.lowVision) {
        _params.canvasId = 'signCanvas'
      }
      if (!this.data.lowVision) {
        _params.canvas = canvasObj
      }
      wx.canvasToTempFilePath(Object.assign({}, _params, {
        success(res) {
          if (res.tempFilePath) {
            that.triggerEvent('creatImgBack', {
              code: 'success',
              imgPath: res.tempFilePath,
            })
          } else {
            that.triggerEvent('creatImgBack', {
              code: 'fail'
            })
          }
        },
        fail(err) {
          console.error(err)
          that.triggerEvent('creatImgBack', {
            code: 'fail',
            err: err
          })
        }
      }),this)
    }
  }
})
