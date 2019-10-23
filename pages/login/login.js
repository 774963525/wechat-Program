 
const app = getApp();
Page({
  data: {
    phoneNumber:"",
    password:"",
  },
  back() {
    // wx.navigateTo({ url: '/pages/accountSetting/accountSetting', })

    // 返回上一层
    wx.navigateBack({
      delta: 1
    })
  },
  phoneNumber(e){
    this.data.phoneNumber = e.detail.value.trim();
  },
  password(e) {

    this.data.password = e.detail.value.trim();
  },
  login(){
    // console.log(this.data.phoneNumber);
    // console.log(this.data.password);
    wx.request({
      url: "http://jizhang-api-dev.it266.com/api/user/token/mobile",
      method: "POST",
      data: {
        mobile: this.data.phoneNumber,
        password: this.data.password,
        captcha_code:"",
        captcha_key:"",
      
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.status != false) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
          })
          var token = res.data.data.token;
          // 存放token
          wx.setStorage({
            key: 'token',
            data: token,
          })
          wx.setStorageSync("logged", true)
          
          // 实验获得token
          // wx.getStorage({
          //   key: 'token',
          //   success: function(res) {
          //     console.log(res.data);
          //   },
          // })
          // console.log(app.globalData.token)
          setTimeout(function(){
            wx.navigateTo({
              url: "/pages/index/index",
            })
          },2000)
        } else {
          wx.showModal({
            title: '错误',
            content: '账号或密码错误,请重新尝试',
            success(res) {
              console.log(res);
            }
          })
          return
        }
      },
    })
  }





})
