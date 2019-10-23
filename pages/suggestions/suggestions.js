var  app = getApp();
// 得到api
var api = app.globalData.api;
Page({
  data: {

  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })

    // 返回上一层
    wx.navigateBack({
      delta: 1
    })
  },
  textareaAInput(e){
    this.setData({
      suggest:e.detail.value
    })
    
  },
  contact(e){
    this.setData({
      contact: e.detail.value
    })
  },
  submit(){
    wx.request({
      url: api+'api/feedback/add?token='+this.data.token,
      method:"POST",
      data: {
        content: this.data.suggest,
        contact: this.data.contact
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:(res) => {
        console.log(res.data)
        if(res.data.status){
          wx.showToast({
            title: '感谢您的反馈',
            icon: 'success',
            duration: 2500,
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2500)
        }
        
       
      }
    })
  },
  onLoad(){
    // 获取token
    app.getToken((token) => {
      console.log(token);
      this.setData({
        token: token,
      })
    })
  }




})
