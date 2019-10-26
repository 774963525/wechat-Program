
var app = getApp();
var api = app.globalData.api;
Page({
  data: {
    // 1.现金 2.银行 3.支付平台 4.其它
    index: 0,
    name: "",
    showLoading: false


  },
  showLoading() {
    this.setData({
      showLoading: true
    })
    wx.showToast({
      title: '加载中',
      mask:true,
      icon: 'loading'
    })
  },
  onLoad() {
    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
    })
  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })

    // 返回上一层
    wx.navigateBack({
      delta: 1
    })
  },

 
  name(e) {
    // console.log(e.detail.value.trim())
    this.setData({
      name: e.detail.value.trim()
    })
  },
 
  addBook() {
    this.showLoading();
    wx.request({
      url: api + 'api/book/create?token=' + this.data.token,
      method: "POST",
      data: {
        name: this.data.name
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.status == true) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(()=>{
            this.back();
          },1000)
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.data,
            success(res) {
              console.log(res);
            }
          })
          return
        }
        this.setData({
          showList: false
        })
      }

    })
  },


})
