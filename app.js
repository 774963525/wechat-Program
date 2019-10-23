//app.js
App({
  onLaunch: function (options) {
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      }, fail(err) {
        console.log(err);
      }
    })
  },
  getToken(cb){
    wx.getStorage({
      key: 'token',
      success: (res) => {
        cb(res.data)
      },fail(err){
        console.log("token获取失败")
      }
    })
  },
   
    

  
  onLoad(){
    console.log(this.data.token);
  },
  globalData: {
    navHeight: 0,

    api:'http://jizhang-api-dev.it266.com/'
   
  },


})
